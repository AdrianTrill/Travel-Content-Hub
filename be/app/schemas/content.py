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


class ContentResponse(BaseModel):
    suggestions: List[ContentSuggestion]


