from __future__ import annotations

import json
from typing import Any

from fastapi import APIRouter, HTTPException
from openai import OpenAI, NotFoundError
from openai import RateLimitError
import re
import logging

from app.core.config import settings
from app.schemas.content import ContentRequest, ContentResponse, ContentSuggestion


router = APIRouter()


@router.post('/generate-content', response_model=ContentResponse)
def generate_content(payload: ContentRequest) -> Any:
    """Generate travel content suggestions using OpenAI."""

    client = OpenAI(api_key=settings.openai_api_key)

    system_instructions = (
        'You are an expert travel content creator for a travel media brand. '
        'Produce concise, engaging, and accurate copy. '
        'Return ONLY valid JSON that matches this schema: '
        '{"suggestions": [{"title": str, "content": str, "type": str, "reading_time": str, "quality": str, "tags": [str]}]}. '
        'Do not include markdown, code fences, or any commentary.'
    )

    user_prompt = (
        f"Destination: {payload.destination}\n"
        f"Dates: {payload.start_date or 'N/A'} to {payload.end_date or 'N/A'}\n"
        f"Preferred content type: {payload.content_type or 'Blog Post'}\n"
        f"Language: {payload.language}\n"
        f"Tone: {payload.tone or 'friendly and informative'}\n\n"
        'Create 3 tailored suggestions that intelligently consider the specific travel dates and seasonal factors. '
        'If dates are provided, incorporate: '
        '- Weather patterns and seasonal conditions for the destination '
        '- Seasonal events, festivals, or cultural celebrations during those dates '
        '- Peak vs. off-peak season considerations and pricing implications '
        '- Date-specific recommendations (best times to visit attractions, seasonal activities) '
        '- Seasonal cuisine, local produce, or time-specific experiences\n\n'
        'Ensure each suggestion has: title (compelling and date-aware), content (2-4 sentences with seasonal context), '
        'type (echo requested type), reading_time (e.g., "3 min" or "45 sec"), quality (High/Medium), and tags (3-5 relevant hashtag-style tags without # symbol, e.g., ["Local Culture", "Photography", "Hidden Gems", "Seasonal Events"]).'
    )

    try:
        # Try the requested/default model first, then fall back to commonly available ones
        candidate_models = [
            settings.openai_model,
            'gpt-4o-mini',
            'gpt-4o',
            'gpt-4-1106-preview',
        ]

        last_exc: Exception | None = None
        completion = None
        for model_name in candidate_models:
            if not model_name:
                continue
            try:
                completion = client.chat.completions.create(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": system_instructions},
                        {"role": "user", "content": user_prompt},
                    ],
                    temperature=0.7,
                )
                # Successful call
                break
            except NotFoundError as not_found_err:  # wrong/inaccessible model; try next
                logging.warning("model_not_found_try_next: %s", model_name)
                last_exc = not_found_err
                continue
            except Exception as other_err:
                last_exc = other_err
                break

        if completion is None:
            raise last_exc or RuntimeError('No completion and no error captured')

        raw = completion.choices[0].message.content or ''

        def try_parse_json(text: str):
            # Remove markdown fences if present
            text = re.sub(r"^```(json)?|```$", "", text.strip(), flags=re.MULTILINE)
            try:
                return json.loads(text)
            except Exception:
                # Best-effort: extract the first JSON object substring
                start = text.find('{')
                end = text.rfind('}')
                if start != -1 and end != -1 and end > start:
                    snippet = text[start : end + 1]
                    try:
                        return json.loads(snippet)
                    except Exception:
                        return None
                return None

        data = try_parse_json(raw) or {}
        suggestions_raw = data.get('suggestions')

        if not suggestions_raw:
            # Fallback: create a single suggestion using the raw content
            approx_words = len(raw.split())
            minutes = max(1, round(approx_words / 200))
            suggestions_raw = [{
                'title': f"{payload.destination}: {payload.content_type or 'Content'}",
                'content': raw.strip()[:1200],
                'type': payload.content_type or 'Blog Post',
                'reading_time': f"{minutes} min" if (payload.content_type or '').lower().endswith('post') else '45 sec',
                'quality': 'High',
                'tags': [payload.destination, 'Travel', 'Adventure'],
            }]

        suggestions: list[ContentSuggestion] = [ContentSuggestion(**item) for item in suggestions_raw]
        return ContentResponse(suggestions=suggestions)
    except RateLimitError as exc:
        logging.exception("rate_limit_or_quota")
        detail = {
            'message': 'OpenAI quota/rate limit exceeded. Check plan and billing or try later.',
            'error': str(exc),
            'model': settings.openai_model,
        }
        raise HTTPException(status_code=429, detail=detail)
    except Exception as exc:  # noqa: BLE001
        logging.exception("generation_failed")
        try:
            error_text = str(exc)
        except Exception:
            error_text = 'unknown error'
        raise HTTPException(status_code=500, detail={
            'message': 'Generation failed',
            'error': error_text,
            'model': settings.openai_model,
        })


