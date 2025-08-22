from typing import List, Optional
from pydantic import BaseModel, Field


class ContentRequest(BaseModel):
    destination: str = Field(..., description='City or place to generate travel content about')
    start_date: Optional[str] = Field(default=None, description='Trip start date (free text or ISO)')
    end_date: Optional[str] = Field(default=None, description='Trip end date (free text or ISO)')
    content_type: Optional[str] = Field(default='Blog Post', description='Type of content: Blog Post, Instagram Post, Facebook Post, etc.')
    language: str = Field(default='en', description='Language code for the output')
    tone: Optional[str] = Field(default='friendly and informative', description='Optional writing tone')


class ContentSuggestion(BaseModel):
    title: str
    content: str
    type: str
    reading_time: str
    quality: str
    tags: List[str] = Field(default_factory=list, description='Relevant tags for the content')
    highlights: List[str] = Field(default_factory=list, description='Key highlights or quick tips')
    neighborhoods: List[str] = Field(default_factory=list, description='Referenced areas or neighborhoods')
    recommended_spots: List[str] = Field(default_factory=list, description='Named spots (museums, parks, markets)')
    price_range: Optional[str] = Field(default=None, description='Typical price guidance, if applicable')
    best_times: Optional[str] = Field(default=None, description='Best times or seasonal guidance')
    cautions: Optional[str] = Field(default=None, description='Brief caution notes if relevant')


class ContentResponse(BaseModel):
    suggestions: List[ContentSuggestion]


class ImageGenerationRequest(BaseModel):
    title: str
    content: str
    destination: str
    tags: List[str]
    neighborhoods: List[str]
    recommended_spots: List[str]
    best_times: Optional[str] = None


class ImageGenerationResponse(BaseModel):
    image_prompt: str
    image_model: str = "gpt-image-1"
    image_size: str = "1024x1024"
    alt_text: str
    image_url: Optional[str] = None
    error: Optional[str] = None


class LocalImageGenerationRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    destination: str = Field(..., description='City or place for the image')
    tags: Optional[List[str]] = None
    neighborhoods: Optional[List[str]] = None
    recommended_spots: Optional[List[str]] = None
    best_times: Optional[str] = None
    width: Optional[int] = Field(default=1792, description='Image width in pixels')
    height: Optional[int] = Field(default=1024, description='Image height in pixels')
    mode: Optional[str] = Field(default="quality", description='Generation mode: "quality" or "turbo"')


class LocalImageGenerationResponse(BaseModel):
    image_prompt: str
    alt_text: str
    image_url: Optional[str] = None
    error: Optional[str] = None


