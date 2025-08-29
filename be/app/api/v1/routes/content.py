from __future__ import annotations

import json
import logging
from typing import List

from openai import OpenAI
from openai import NotFoundError, RateLimitError
from fastapi import APIRouter, HTTPException
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.content import ContentRequest, ContentResponse, ContentSuggestion, ImageGenerationRequest, ImageGenerationResponse, PlaceSearchRequest, PlaceSearchResponse, Place, CustomPromptRequest, CustomPromptResponse

logger = logging.getLogger(__name__)
router = APIRouter()

# Configure OpenAI client
client = OpenAI(api_key=settings.openai_api_key)

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
            'PRICE RULES:\n'
            '- For price_range: Use descriptive terms like "Free", "Budget-friendly", "Moderate", "Premium", "Luxury" or specific ranges like "£5-15", "€20-50"\n'
            '- NEVER use just "$", "$$", "$$$" symbols\n'
            '- If price is unknown, set price_range to null\n'
            '- Be specific about what the price covers (entry fee, meal, activity, etc.)\n\n'
            'OUTPUT (JSON only; no markdown, no extra keys):\n'
            '{\n'
            '  "suggestions": [{\n'
            '    "title": str,                  // concrete + specific\n'
            '    "content": str,                // 35–60 words IG, 60–100 FB, 80–130 Blog\n'
            '    "type": str,                   // content type\n'
            '    "reading_time": str,           // e.g., "45 sec" or "3 min"\n'
            '    "quality": "High" | "Medium",\n'
            '    "tags": [str],\n'
            '    "highlights": [str],           // 3–5 terse bullets; concrete (things to do/eat/see)\n'
            '    "neighborhoods": [str],\n'
            '    "recommended_spots": [str],    // venues/landmarks actually referenced in content\n'
            '    "price_range": str | null,     // descriptive price info or null if unknown\n'
            '    "best_times": str | null,      // only if in inputs or safely inferred\n'
            '    "cautions": str | null         // e.g., crowds, queues, cashless\n'
            '  }]\n'
            '}\n\n'
            'VALIDATION (before output)\n'
            '- The PLACE referenced in content MUST appear in recommended_spots or neighborhoods.\n'
            '- Each highlight must be a tangible action/item (not generic praise).\n'
            '- Remove banned words. If any remain, rewrite once then output.\n'
            '- Price_range must be descriptive, not just symbols.'
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
                
                response = client.chat.completions.create(
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
                    
            except NotFoundError as e:
                logger.warning(f"Model {model} not found: {e}")
                last_error = e
                continue
            except RateLimitError as e:
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

@router.post("/search-places", response_model=PlaceSearchResponse)
async def search_places(payload: PlaceSearchRequest) -> PlaceSearchResponse:
    """Search for places using OpenAI to find relevant locations based on user query."""
    try:
        logger.info(f"Search request received for query: '{payload.query}'")
        
        # Define candidate models to try in order
        candidate_models = [
            settings.openai_model,
            "gpt-4o-mini",
            "gpt-4o",
            "gpt-4-1106-preview"
        ]
        
        system_instructions = (
            'You are a travel expert and geographer. Your task is to find ALL relevant places based on user search queries.\n\n'
            'SEARCH RULES:\n'
            '- Interpret the user query broadly and find ALL relevant places\n'
            '- Include cities, regions, landmarks, neighborhoods, and points of interest\n'
            '- For regions like "Transilvania", include major cities, smaller towns, castles, monasteries, natural attractions, museums, and cultural sites\n'
            '- For specific queries like "Paris cafes", include relevant neighborhoods, districts, and areas\n'
            '- Provide comprehensive geographical coverage\n'
            '- Include both well-known and lesser-known places\n'
            '- For regions, cover different areas and types of attractions\n'
            '- IMPORTANT: Only return places that are DIRECTLY related to the search query\n'
            '- Do NOT return generic or unrelated places\n\n'
            'PRICE RULES:\n'
            '- For price_range: Use descriptive terms like "Free", "Budget-friendly", "Moderate", "Premium", "Luxury" or specific ranges like "£5-15", "€20-50"\n'
            '- NEVER use just "$", "$$", "$$$" symbols\n'
            '- If price is unknown, set price_range to null\n'
            '- Be specific about what the price covers (entry fee, meal, activity, etc.)\n\n'
            'OUTPUT FORMAT (JSON only):\n'
            '{\n'
            '  "places": [\n'
            '    {\n'
            '      "name": "Place Name",\n'
            '      "type": "city|region|landmark|neighborhood|town|village|monastery|castle|museum|park|natural_site",\n'
            '      "country": "Country Name",\n'
            '      "description": "Detailed description (2-3 sentences) with key features, history, and what makes it special",\n'
            '      "highlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4", "Highlight 5"],\n'
            '      "categories": ["category1", "category2", "category3"]\n'
            '    }\n'
            '  ]\n'
            '}\n\n'
            'CATEGORIES: culture, nature, food, history, architecture, entertainment, shopping, outdoor, religious, modern, traditional, adventure, relaxation, education, nightlife\n'
            'HIGHLIGHTS: 5-7 specific attractions, landmarks, activities, or unique features\n'
            'DESCRIPTION: Detailed but concise, mentioning key features, historical significance, and unique characteristics\n'
            'Return 15-25 relevant places based on the search query to provide comprehensive coverage.'
        )

        user_prompt = f"Search query: '{payload.query}'\nLanguage: {payload.language}\n\nFind ONLY places that are DIRECTLY related to '{payload.query}'. Do not return generic or unrelated places. Focus on locations, attractions, and points of interest that are specifically associated with this search term."

        logger.info(f"Using system instructions and user prompt for search")
        
        # Try each model until one works
        last_error = None
        for model in candidate_models:
            try:
                logger.info(f"Attempting search with model: {model}")
                response = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_instructions},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.3,
                    max_tokens=3000
                )
                
                content = response.choices[0].message.content.strip()
                logger.info(f"Received response from model {model}, content length: {len(content)}")
                
                # Try to parse the JSON response
                try:
                    # Remove any markdown formatting if present
                    if content.startswith('```json'):
                        content = content.split('```json')[1]
                    if content.endswith('```'):
                        content = content.rsplit('```', 1)[0]
                    
                    data = json.loads(content.strip())
                    logger.info(f"Successfully parsed JSON response")
                    
                    if 'places' in data and isinstance(data['places'], list):
                        places = []
                        for place_data in data['places']:
                            try:
                                place = Place(
                                    name=place_data.get('name', ''),
                                    type=place_data.get('type', ''),
                                    country=place_data.get('country', ''),
                                    description=place_data.get('description', ''),
                                    highlights=place_data.get('highlights', []),
                                    categories=place_data.get('categories', [])
                                )
                                places.append(place)
                            except Exception as e:
                                logger.warning(f"Failed to parse place data: {e}")
                                continue
                        
                        logger.info(f"Successfully created {len(places)} place objects")
                        return PlaceSearchResponse(
                            places=places,
                            total_results=len(places),
                            search_query=payload.query
                        )
                    
                except json.JSONDecodeError as json_error:
                    logger.warning(f"JSON decode error with model {model}: {json_error}")
                    last_error = json_error
                    continue
                    
            except NotFoundError as e:
                logger.warning(f"Model {model} not found: {e}")
                last_error = e
                continue
            except RateLimitError as e:
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
        raise HTTPException(status_code=500, detail={"message": "Failed to search places"})
        
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail={"message": "Invalid request data"})
    except Exception as e:
        logger.error(f"Unexpected error in place search: {str(e)}")
        raise HTTPException(status_code=500, detail={"message": "Internal server error"})

@router.post("/generate-image", response_model=ImageGenerationResponse)
async def generate_image(payload: ImageGenerationRequest) -> ImageGenerationResponse:
    """Generate a photorealistic travel image based on content card."""
    try:
        # 1. Determine PLACE (main subject) by priority
        place = None
        if payload.title and any(word.lower() in payload.title.lower() for word in ['market', 'street', 'plaza', 'square', 'park', 'museum', 'cathedral', 'bridge']):
            # Extract place from title
            title_words = payload.title.split()
            for word in title_words:
                if word.lower() in ['market', 'street', 'plaza', 'square', 'park', 'museum', 'cathedral', 'bridge']:
                    place = word
                    break
        elif payload.recommended_spots:
            place = payload.recommended_spots[0]
        elif payload.neighborhoods:
            place = payload.neighborhoods[0]
        else:
            place = payload.destination
        
        # Append destination if not already included
        if payload.destination.lower() not in place.lower():
            place = f"{place} in {payload.destination}"
        
        # 2. Determine time/season
        time_of_day = "daytime"
        if payload.best_times:
            best_times_lower = payload.best_times.lower()
            if any(word in best_times_lower for word in ['morning', 'early', 'dawn', 'sunrise']):
                time_of_day = "morning"
            elif any(word in best_times_lower for word in ['sunset', 'evening', 'golden hour', 'dusk']):
                time_of_day = "sunset"
            elif any(word in best_times_lower for word in ['night', 'evening', 'late']):
                time_of_day = "night"
            elif any(word in best_times_lower for word in ['winter', 'spring', 'summer', 'autumn', 'fall']):
                time_of_day = best_times_lower.split()[0]  # Extract season
        
        # 3. Extract concrete visual elements (up to 4)
        content_words = payload.content.lower().split()
        concrete_elements = []
        visual_keywords = ['market', 'stalls', 'vendor', 'awning', 'bread', 'cheese', 'cobblestone', 'street', 'river', 'harbor', 'canal', 'beach', 'coast', 'cliffs', 'bay', 'bridge', 'park', 'museum', 'cathedral', 'neon', 'food', 'people', 'buildings', 'trees', 'flowers', 'fountain', 'statue']
        
        for word in content_words:
            if word in visual_keywords and len(concrete_elements) < 4:
                concrete_elements.append(word)
        
        if not concrete_elements:
            concrete_elements = ['buildings', 'people', 'street']
        
        # 4. Determine perspective & composition
        if any(word in payload.content.lower() for word in ['market', 'street', 'food', 'neon', 'vendor']):
            perspective = "street-level, 24–35mm wide-angle; people mid-ground, leading lines"
        elif any(word in payload.content.lower() for word in ['river', 'harbor', 'canal', 'beach', 'coast', 'cliffs', 'bay']):
            perspective = "elevated vantage, 35–50mm; foreground anchor, sweeping background"
        else:
            perspective = "eye-level, 35mm; center-weighted subject"
        
        # 5. Determine lighting & palette
        if time_of_day in ['sunset', 'morning']:
            lighting = "warm cinematic side-light, soft shadows; natural colors"
        elif time_of_day == 'night':
            lighting = "ambient city light; natural colors"
        else:
            lighting = "soft daylight; natural balanced colors"
        
        # 6. Build the image prompt
        image_prompt = f"{place}; {time_of_day}; {perspective}; {lighting}; photorealistic, sharp focus, high detail. Must include: {', '.join(concrete_elements[:4])}. AVOID: no text overlays, no watermarks, no logos, no billboards, no heavy HDR, no anime, no illustration, no fisheye, avoid motion blur."
        
        # 7. Generate alt text
        alt_text = f"Photorealistic image of {place} during {time_of_day}, showing {', '.join(concrete_elements[:3])}"
        
        # 8. Call OpenAI Images API
        try:
            response = client.images.generate(
                prompt=image_prompt,
                n=1,
                size="1024x1024",
                model="dall-e-3"
            )
            image_url = response.data[0].url
        except Exception as img_error:
            logger.error(f"Image generation failed: {str(img_error)}")
            return ImageGenerationResponse(
                image_prompt=image_prompt,
                alt_text=alt_text,
                image_url=None,
                error="Image generation failed"
            )
        
        return ImageGenerationResponse(
            image_prompt=image_prompt,
            alt_text=alt_text,
            image_url=image_url
        )
        
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail={"message": "Invalid request data"})
    except Exception as e:
        logger.error(f"Unexpected error in image generation: {str(e)}")
        raise HTTPException(status_code=500, detail={"message": "Internal server error"})

@router.post("/generate-custom-content", response_model=CustomPromptResponse)
async def generate_custom_content(payload: CustomPromptRequest) -> CustomPromptResponse:
    """Generate AI-powered travel content based on a custom user prompt."""
    try:
        logger.info(f"Custom prompt request received for destination: '{payload.destination}'")
        
        # Define candidate models to try in order
        candidate_models = [
            settings.openai_model,
            "gpt-4o-mini",
            "gpt-4o",
            "gpt-4-1106-preview"
        ]
        
        system_instructions = (
            'You are a senior travel editor and content creator. Your task is to generate high-quality travel content based on the user\'s custom prompt.\n\n'
            'CONTENT RULES:\n'
            '- Follow the user\'s custom prompt EXACTLY as specified\n'
            '- Generate content that matches the requested content type and style\n'
            '- Ensure all content is accurate and relevant to the destination\n'
            '- Include practical information, tips, and recommendations\n'
            '- Make the content engaging, informative, and useful for travelers\n'
            '- If existing content is provided, improve or modify it according to the prompt\n\n'
            'PRICE RULES:\n'
            '- For price_range: Use descriptive terms like "Free", "Budget-friendly", "Moderate", "Premium", "Luxury" or specific ranges like "£5-15", "€20-50"\n'
            '- NEVER use just "$", "$$", "$$$" symbols\n'
            '- If price is unknown, set price_range to null\n'
            '- Be specific about what the price covers (entry fee, meal, activity, etc.)\n\n'
            'OUTPUT FORMAT (JSON only):\n'
            '{\n'
            '  "title": "Engaging title based on the prompt",\n'
            '  "content": "Content generated according to the custom prompt",\n'
            '  "type": "Content type (Blog Post, Instagram Post, etc.)",\n'
            '  "reading_time": "Estimated reading time (e.g., 3 min)",\n'
            '  "quality": "High",\n'
            '  "tags": ["relevant", "tags", "for", "content"],\n'
            '  "highlights": ["Key highlight 1", "Key highlight 2", "Key highlight 3"],\n'
            '  "neighborhoods": ["Relevant neighborhoods or areas"],\n'
            '  "recommended_spots": ["Specific places, venues, or attractions"],\n'
            '  "price_range": "Descriptive price info or null",\n'
            '  "best_times": "Best times to visit if relevant",\n'
            '  "cautions": "Important notes or warnings if relevant"\n'
            '}\n\n'
            'IMPORTANT: The content must directly address and fulfill the user\'s custom prompt requirements. Price_range must be descriptive, not just symbols.'
        )

        user_prompt = f"""Custom Prompt: {payload.prompt}

Destination: {payload.destination}
Content Type: {payload.content_type}
Language: {payload.language}
{f"Existing Content to Improve: {payload.existing_content}" if payload.existing_content else ""}

Please generate content that specifically addresses the custom prompt above. The content should be tailored to the destination and content type requested."""

        logger.info(f"Using custom prompt for content generation")
        
        # Try each model until one works
        last_error = None
        for model in candidate_models:
            try:
                logger.info(f"Attempting custom content generation with model: {model}")
                response = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_instructions},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2000
                )
                
                content = response.choices[0].message.content.strip()
                logger.info(f"Received custom content response from model {model}, content length: {len(content)}")
                
                # Try to parse the JSON response
                try:
                    # Remove any markdown formatting if present
                    if content.startswith('```json'):
                        content = content.split('```json')[1]
                    if content.endswith('```'):
                        content = content.rsplit('```', 1)[0]
                    
                    data = json.loads(content.strip())
                    logger.info(f"Successfully parsed custom content JSON response")
                    
                    # Create the response object
                    custom_response = CustomPromptResponse(
                        title=data.get('title', 'Custom Generated Title'),
                        content=data.get('content', 'Custom generated content'),
                        type=data.get('type', payload.content_type),
                        reading_time=data.get('reading_time', '3 min'),
                        quality=data.get('quality', 'High'),
                        tags=data.get('tags', []),
                        highlights=data.get('highlights', []),
                        neighborhoods=data.get('neighborhoods', []),
                        recommended_spots=data.get('recommended_spots', []),
                        price_range=data.get('price_range'),
                        best_times=data.get('best_times'),
                        cautions=data.get('cautions'),
                        generated_from_prompt=payload.prompt
                    )
                    
                    logger.info(f"Successfully created custom content response")
                    return custom_response
                    
                except json.JSONDecodeError as json_error:
                    logger.warning(f"JSON decode error with model {model}: {json_error}")
                    last_error = json_error
                    continue
                    
            except NotFoundError as e:
                logger.warning(f"Model {model} not found: {e}")
                last_error = e
                continue
            except RateLimitError as e:
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
        logger.error(f"All models failed for custom content generation. Last error: {last_error}")
        raise HTTPException(status_code=500, detail={"message": "Failed to generate custom content"})
        
    except ValidationError as e:
        logger.error(f"Validation error in custom content generation: {str(e)}")
        raise HTTPException(status_code=400, detail={"message": "Invalid request data"})
    except Exception as e:
        logger.error(f"Unexpected error in custom content generation: {str(e)}")
        raise HTTPException(status_code=500, detail={"message": "Internal server error"})


