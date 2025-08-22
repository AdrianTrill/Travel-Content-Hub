from __future__ import annotations

import json
import logging
from typing import List

import openai
from fastapi import APIRouter, HTTPException
from pydantic import ValidationError

from app.core.config import settings
from app.core.image_generator import image_generator
from app.schemas.content import (
    ContentRequest, ContentResponse, ContentSuggestion, 
    ImageGenerationRequest, ImageGenerationResponse,
    LocalImageGenerationRequest, LocalImageGenerationResponse
)

logger = logging.getLogger(__name__)
router = APIRouter()

# Configure OpenAI client
openai.api_key = settings.openai_api_key

@router.post("/generate-content", response_model=ContentResponse)
async def generate_content(payload: ContentRequest) -> ContentResponse:
    """Generate AI-powered travel content suggestions."""
    try:
        # Define candidate models to try in order
        candidate_models = [
            settings.openai_model,
            "gpt-4o-mini",
            "gpt-4o",
            "gpt-4-1106-preview"
        ]
        
        system_instructions = (
            'You are a senior travel editor (think Time Out / Eater / FT Weekend). '
            'Write vivid, useful copy grounded ONLY in provided inputs. No fabrication.\n\n'
            'VOICE & STYLE\n'
            '- Lead with a concrete hook (what it is + why now).\n'
            '- Use specific nouns, short sensory details, and service info.\n'
            '- Prefer verbs over adjectives. No hype, no exclamation marks, no rhetorical questions.\n'
            '- Active voice. Mix sentence lengths. British English if destination/language implies it.\n\n'
            'CONTENT RULES (hard)\n'
            '- Facts must come from inputs. If unknown, use tempered phrasing ("often", "typically", "many vendors")—never invent brand names, dates, or schedules.\n'
            '- Anchor each suggestion to ONE clear PLACE/event/venue (from title → recommended_spots → neighborhoods → destination).\n'
            '- Include at least one micro-itinerary action sequence (arrive → do → eat/see → where to stand/sit).\n'
            '- Include 1–2 practical tips (timing, crowd avoidance, payment, seating, nearest area).\n'
            '- Include seasonal/temporal cues ONLY if present or safely inferable (e.g., "late summer" → summer).\n'
            '- Numbers only if present in inputs; otherwise use qualitative ranges (e.g., "£", "moderate").\n'
            '- Ban clichés & filler: hidden gem, bustling, vibrant, picturesque, must-see, must-try, rich tapestry, iconic, enchanting, unforgettable, culinary journey, delectable, mouthwatering, gem.\n\n'
            'OUTPUT (JSON only; no markdown, no extra keys):\n'
            '{\n'
            '  "suggestions": [{\n'
            '    "title": str,                  // concrete + specific\n'
            '    "content": str,                // 35–60 words IG, 60–100 FB, 80–130 Blog\n'
            '    "type": str,\n'
            '    "reading_time": str,           // e.g., "45 sec" or "3 min"\n'
            '    "quality": "High" | "Medium",\n'
            '    "tags": [str],\n'
            '    "highlights": [str],           // 3–5 terse bullets; concrete (things to do/eat/see)\n'
            '    "neighborhoods": [str],\n'
            '    "recommended_spots": [str],    // venues/landmarks actually referenced in content\n'
            '    "price_range": str | null,     // $, ££, etc. or null if unknown\n'
            '    "best_times": str | null,      // only if in inputs or safely inferred (e.g., morning)\n'
            '    "cautions": str | null         // e.g., crowds, queues, cashless\n'
            '  }]\n'
            '}\n\n'
            'VALIDATION (before output)\n'
            '- The PLACE referenced in content MUST appear in recommended_spots or neighborhoods.\n'
            '- Each highlight must be a tangible action/item (not generic praise).\n'
            '- Remove banned words. If any remain, rewrite once then output.'
        )

        user_prompt = (
            f"Destination: {payload.destination}\n"
            f"Dates: {payload.start_date or 'N/A'} to {payload.end_date or 'N/A'}\n"
            f"Preferred content type: {payload.content_type or 'Blog Post'}\n"
            f"Language: {payload.language}\n"
            f"Tone: {payload.tone or 'friendly and informative'}\n\n"
            'TASK\n'
            'Create 3 tailored suggestion(s) as if filed by a reporter on the ground. Choose ONE specific PLACE per suggestion (title → recommended_spots → neighborhoods → destination). Use only input-safe facts; otherwise hedge.\n\n'
            'FOR EACH SUGGESTION\n'
            '- Hook sentence: what it is + why go now (seasonal cue if provided).\n'
            '- 1–2 sentences with concrete, sensory specifics taken from inputs (e.g., named dishes, stall types, river views, arches).\n'
            '- Micro-itinerary: arrive timing (if present/safe), do → eat/see → where to sit/stand (e.g., waterfront tables, shaded arcade).\n'
            '- One practical tip: crowds/payment/seating/weather/transport (generic if not provided, e.g., "arrive early to secure a table").\n'
            '- Keep copy tight; avoid brand/vendor names unless they appear in inputs.\n'
            '- Word count by type: Blog 80–130, Instagram 35–60, Facebook 60–100.\n\n'
            'STRUCTURE\n'
            '- Fill all schema fields.\n'
            '- "quality": set to High if copy includes hook + micro-itinerary + practical tip + concrete nouns; else Medium.\n'
            '- "best_times": only if in inputs or safely inferred (e.g., "late mornings" → "morning", "Saturdays August–September" → "summer weekends").\n'
            '- "price_range": $, ££, etc. if present; else null.\n'
            '- "cautions": crowding/queues/weather if hinted; else null.\n\n'
            'CHECKS\n'
            '- No invented facts, dates, or exact times.\n'
            '- No clichés or banned words.\n'
            '- British vs US spelling must match Language/Destination context.\n'
            '- Output ONLY valid JSON per schema.'
        )

        # Try each model until one works
        last_error = None
        for model in candidate_models:
            try:
                logger.info(f"Attempting to use model: {model}")
                
                response = openai.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_instructions},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.55,
                    presence_penalty=0.2,
                    max_tokens=2000
                )
                
                content = response.choices[0].message.content.strip()
                logger.info(f"Successfully generated content with model: {model}")
                
                # Try to parse JSON response
                try:
                    data = json.loads(content)
                    suggestions = []
                    
                    for suggestion in data.get('suggestions', []):
                        # Ensure all required fields are present
                        suggestion_data = {
                            'title': suggestion.get('title', 'Untitled'),
                            'content': suggestion.get('content', 'No content available'),
                            'type': suggestion.get('type', payload.content_type or 'Blog Post'),
                            'reading_time': suggestion.get('reading_time', '2 min'),
                            'quality': suggestion.get('quality', 'High'),
                            'tags': suggestion.get('tags', []),
                            'highlights': suggestion.get('highlights', []),
                            'neighborhoods': suggestion.get('neighborhoods', []),
                            'recommended_spots': suggestion.get('recommended_spots', []),
                            'price_range': suggestion.get('price_range'),
                            'best_times': suggestion.get('best_times'),
                            'cautions': suggestion.get('cautions')
                        }
                        suggestions.append(ContentSuggestion(**suggestion_data))
                    
                    return ContentResponse(suggestions=suggestions)
                    
                except json.JSONDecodeError as json_error:
                    logger.warning(f"JSON parsing failed for model {model}: {json_error}")
                    # Fallback: try to extract content even if JSON is malformed
                    if 'title' in content.lower() and 'content' in content.lower():
                        # Create a basic fallback suggestion
                        fallback_suggestion = ContentSuggestion(
                            title="Travel Guide to " + payload.destination,
                            content=content[:200] + "..." if len(content) > 200 else content,
                            type=payload.content_type or "Blog Post",
                            reading_time="3 min",
                            quality="Medium",
                            tags=["Travel", "Guide", payload.destination],
                            highlights=["Explore local culture", "Discover hidden spots", "Experience authentic cuisine"],
                            neighborhoods=[],
                            recommended_spots=[],
                            price_range=None,
                            best_times=None,
                            cautions=None
                        )
                        return ContentResponse(suggestions=[fallback_suggestion])
                    
                    last_error = json_error
                    continue
                    
            except openai.NotFoundError as e:
                logger.warning(f"Model {model} not found: {e}")
                last_error = e
                continue
            except openai.RateLimitError as e:
                logger.error(f"Rate limit exceeded: {e}")
                raise HTTPException(
                    status_code=429, 
                    detail={"message": "OpenAI API rate limit exceeded. Please check your billing and quota."}
                )
            except Exception as e:
                logger.error(f"Error with model {model}: {e}")
                last_error = e
                continue
        
        # If we get here, all models failed
        logger.error(f"All models failed. Last error: {last_error}")
        raise HTTPException(
            status_code=500, 
            detail={"message": "Content generation failed. Please try again later."}
        )
        
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail={"message": "Invalid request data"})
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail={"message": "Internal server error"})

@router.post("/generate-image-local", response_model=LocalImageGenerationResponse)
async def generate_image_local(payload: LocalImageGenerationRequest) -> LocalImageGenerationResponse:
    """Generate a photorealistic travel image using local Stable Diffusion XL."""
    try:
        logger.info(f"Local image generation request: {payload.destination}, mode: {payload.mode}")
        
        # Generate image using local SDXL pipeline
        result = image_generator.generate_image(payload)
        
        if result.get('error'):
            logger.error(f"Local image generation failed: {result['error']}")
            return LocalImageGenerationResponse(
                image_prompt=result.get('image_prompt', ''),
                alt_text=result.get('alt_text', ''),
                image_url=None,
                error=result['error']
            )
        
        logger.info("Local image generation completed successfully")
        return LocalImageGenerationResponse(
            image_prompt=result['image_prompt'],
            alt_text=result['alt_text'],
            image_url=result['image_url'],
            error=None
        )
        
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail={"message": "Invalid request data"})
    except Exception as e:
        logger.error(f"Unexpected error in local image generation: {str(e)}")
        raise HTTPException(status_code=500, detail={"message": "Internal server error"})

# Legacy endpoint - now redirects to local generation
@router.post("/generate-image", response_model=ImageGenerationResponse)
async def generate_image(payload: ImageGenerationRequest) -> ImageGenerationResponse:
    """Legacy endpoint - now uses local SDXL generation instead of OpenAI."""
    try:
        logger.info("Legacy OpenAI image endpoint called - redirecting to local generation")
        
        # Convert legacy request to local format
        local_payload = LocalImageGenerationRequest(
            title=payload.title,
            content=payload.content,
            destination=payload.destination,
            tags=payload.tags,
            neighborhoods=payload.neighborhoods,
            recommended_spots=payload.recommended_spots,
            best_times=payload.best_times,
            width=1024,  # Legacy default
            height=1024,  # Legacy default
            mode="quality"  # Default to quality mode
        )
        
        # Generate image using local SDXL pipeline
        result = image_generator.generate_image(local_payload)
        
        if result.get('error'):
            logger.error(f"Local image generation failed: {result['error']}")
            return ImageGenerationResponse(
                image_prompt=result.get('image_prompt', ''),
                image_model="sdxl-local",
                image_size="1024x1024",
                alt_text=result.get('alt_text', ''),
                image_url=None,
                error=result['error']
            )
        
        logger.info("Local image generation completed successfully (via legacy endpoint)")
        return ImageGenerationResponse(
            image_prompt=result['image_prompt'],
            image_model="sdxl-local",
            image_size="1024x1024",
            alt_text=result['alt_text'],
            image_url=result['image_url'],
            error=None
        )
        
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail={"message": "Invalid request data"})
    except Exception as e:
        logger.error(f"Unexpected error in legacy image generation: {str(e)}")
        raise HTTPException(status_code=500, detail={"message": "Internal server error"})


