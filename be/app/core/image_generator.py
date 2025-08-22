"""
Local Image Generation using Stable Diffusion XL via Hugging Face Diffusers.

This module provides a production-grade implementation for generating photorealistic
travel images locally without requiring external API calls.
"""

import base64
import io
import logging
import os
from typing import Optional, Tuple, List
import warnings

import torch
from diffusers import (
    AutoPipelineForText2Image,
    DPMSolverMultistepScheduler,
    StableDiffusionXLPipeline,
    StableDiffusionXLImg2ImgPipeline
)
from transformers import CLIPTextModel, T5EncoderModel
from compel import Compel
from PIL import Image

logger = logging.getLogger(__name__)

# Suppress warnings for cleaner logs
warnings.filterwarnings("ignore", category=UserWarning, module="diffusers")
warnings.filterwarnings("ignore", category=FutureWarning, module="diffusers")


class LocalImageGenerator:
    """Local image generator using Stable Diffusion XL."""
    
    def __init__(self):
        self.device = self._get_device()
        self.dtype = torch.float16 if self.device in ['cuda', 'mps'] else torch.float32
        self.pipelines = {}
        self.compel = None
        self._load_pipelines()
    
    def _get_device(self) -> str:
        """Determine the best available device for inference."""
        if torch.cuda.is_available():
            device = "cuda"
            logger.info(f"Using CUDA device: {torch.cuda.get_device_name()}")
            logger.info(f"CUDA memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
        elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
            device = "mps"
            logger.info("Using MPS (Apple Silicon)")
        else:
            device = "cpu"
            logger.info("Using CPU (fallback)")
        return device
    
    def _load_pipelines(self):
        """Load SDXL pipelines based on available models and device."""
        try:
            # Load Turbo pipeline for speed mode
            logger.info("Loading SDXL Turbo pipeline...")
            self.pipelines['turbo'] = AutoPipelineForText2Image.from_pretrained(
                "stabilityai/sdxl-turbo",
                torch_dtype=self.dtype,
                use_safetensors=True,
                variant="fp16" if self.dtype == torch.float16 else None
            )
            self.pipelines['turbo'].to(self.device)
            
            # Enable optimizations
            if self.device == 'cuda':
                self.pipelines['turbo'].enable_vae_slicing()
                self.pipelines['turbo'].enable_attention_slicing()
            elif self.device == 'mps':
                self.pipelines['turbo'].enable_attention_slicing()
            
            logger.info("SDXL Turbo pipeline loaded successfully")
            
        except Exception as e:
            logger.warning(f"Failed to load SDXL Turbo pipeline: {e}")
            self.pipelines['turbo'] = None
        
        try:
            # Load Quality pipeline (SDXL base)
            logger.info("Loading SDXL Base pipeline...")
            self.pipelines['quality'] = StableDiffusionXLPipeline.from_pretrained(
                "stabilityai/stable-diffusion-xl-base-1.0",
                torch_dtype=self.dtype,
                use_safetensors=True,
                variant="fp16" if self.dtype == torch.float16 else None
            )
            
            # Set scheduler for quality mode
            self.pipelines['quality'].scheduler = DPMSolverMultistepScheduler.from_config(
                self.pipelines['quality'].scheduler.config,
                use_karras=True
            )
            
            self.pipelines['quality'].to(self.device)
            
            # Enable optimizations
            if self.device == 'cuda':
                self.pipelines['quality'].enable_vae_slicing()
                self.pipelines['quality'].enable_vae_tiling()
                self.pipelines['quality'].enable_attention_slicing()
            elif self.device == 'mps':
                self.pipelines['quality'].enable_attention_slicing()
            
            logger.info("SDXL Base pipeline loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load SDXL Base pipeline: {e}")
            self.pipelines['quality'] = None
        
        try:
            # Try to load SDXL refiner (optional)
            logger.info("Loading SDXL Refiner pipeline...")
            self.pipelines['refiner'] = StableDiffusionXLImg2ImgPipeline.from_pretrained(
                "stabilityai/stable-diffusion-xl-refiner-1.0",
                torch_dtype=self.dtype,
                use_safetensors=True,
                variant="fp16" if self.dtype == torch.float16 else None
            )
            self.pipelines['refiner'].to(self.device)
            
            # Enable optimizations
            if self.device == 'cuda':
                self.pipelines['refiner'].enable_vae_slicing()
                self.pipelines['refiner'].enable_attention_slicing()
            elif self.device == 'mps':
                self.pipelines['refiner'].enable_attention_slicing()
            
            logger.info("SDXL Refiner pipeline loaded successfully")
            
        except Exception as e:
            logger.warning(f"Failed to load SDXL Refiner pipeline: {e}")
            self.pipelines['refiner'] = None
        
        # Initialize Compel for better prompt handling (optional)
        try:
            if self.pipelines.get('quality'):
                text_encoder = self.pipelines['quality'].text_encoder
                tokenizer = self.pipelines['quality'].tokenizer
                self.compel = Compel(tokenizer=tokenizer, text_encoder=text_encoder)
                logger.info("Compel initialized successfully")
        except Exception as e:
            logger.warning(f"Failed to initialize Compel: {e}")
            self.compel = None
        
        # Log pipeline status
        available_pipelines = [k for k, v in self.pipelines.items() if v is not None]
        logger.info(f"Available pipelines: {available_pipelines}")
    
    def _build_prompt(self, request) -> Tuple[str, str]:
        """Build the image generation prompt from the request data."""
        # 1. Determine PLACE (main subject) by priority
        place = None
        if request.title and any(word.lower() in request.title.lower() for word in 
                               ['market', 'street', 'plaza', 'square', 'park', 'museum', 'cathedral', 'bridge', 'palace', 'fort']):
            # Extract place from title
            title_words = request.title.split()
            for word in title_words:
                if word.lower() in ['market', 'street', 'plaza', 'square', 'park', 'museum', 'cathedral', 'bridge', 'palace', 'fort']:
                    place = word
                    break
        elif request.recommended_spots:
            place = request.recommended_spots[0]
        elif request.neighborhoods:
            place = request.neighborhoods[0]
        else:
            place = request.destination
        
        # Append destination if not already included
        if request.destination.lower() not in place.lower():
            place = f"{place} in {request.destination}"
        
        # 2. Determine time/season
        time_of_day = "daytime"
        if request.best_times:
            best_times_lower = request.best_times.lower()
            if any(word in best_times_lower for word in ['morning', 'early', 'dawn', 'sunrise', 'late']):
                time_of_day = "morning"
            elif any(word in best_times_lower for word in ['sunset', 'evening', 'golden hour', 'dusk']):
                time_of_day = "sunset"
            elif any(word in best_times_lower for word in ['night', 'evening', 'late', 'after dark']):
                time_of_day = "night"
            elif any(word in best_times_lower for word in ['winter', 'spring', 'summer', 'autumn', 'fall']):
                time_of_day = best_times_lower.split()[0]  # Extract season
        
        # 3. Extract concrete visual elements (up to 4)
        content_words = (request.content or "").lower().split()
        concrete_elements = []
        visual_keywords = [
            'market', 'stalls', 'vendor', 'awning', 'bread', 'cheese', 'cobblestone', 
            'street', 'river', 'harbor', 'canal', 'beach', 'coast', 'cliffs', 'bay', 
            'bridge', 'park', 'museum', 'cathedral', 'neon', 'food', 'people', 'buildings', 
            'trees', 'flowers', 'fountain', 'statue', 'arches', 'stone', 'walls', 'battlements'
        ]
        
        for word in content_words:
            if word in visual_keywords and len(concrete_elements) < 4:
                concrete_elements.append(word)
        
        if not concrete_elements:
            concrete_elements = ['buildings', 'people', 'street']
        
        # 4. Determine perspective & composition
        if any(word in (request.content or "").lower() for word in ['market', 'street', 'food', 'neon', 'vendor']):
            perspective = "street-level, 24–35mm wide-angle; people mid-ground, leading lines"
        elif any(word in (request.content or "").lower() for word in ['river', 'harbor', 'canal', 'beach', 'coast', 'cliffs', 'bay']):
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
        
        # 6. Style anchor and negatives
        style_anchor = (
            "documentary travel photo captured on a full-frame camera, 35mm lens, f/5.6, 1/250s, ISO 200; "
            "realistic depth of field, subtle sensor noise, natural color grading, minimal post-processing"
        )
        
        negatives = (
            "AVOID: no text overlays, no watermarks, no logos, no billboards, no heavy HDR, no anime, "
            "no illustration, no digital painting, no concept art, no CGI, no 3D render, no matte painting, "
            "no stylized look, no fisheye, avoid motion blur"
        )
        
        # Add architecture-specific negatives
        if any(word in place.lower() for word in ['tower', 'castle', 'palace', 'cathedral', 'fort', 'citadel']):
            negatives += ", no fantasy architecture, accurate real-world materials and proportions"
        
        # 7. Build the final prompt
        image_prompt = (
            f"{place}; {time_of_day}; {perspective}; {lighting}; {style_anchor}; "
            f"photorealistic, sharp focus, high detail. Must include: {', '.join(concrete_elements[:4])}. {negatives}."
        )
        
        # 8. Generate alt text
        alt_text = f"{place} at {time_of_day}, showing {', '.join(concrete_elements[:3])}"
        
        return image_prompt, alt_text
    
    def _get_optimal_size(self, width: int, height: int) -> Tuple[int, int]:
        """Get optimal image size based on device capabilities."""
        if self.device == 'cuda':
            # Check VRAM and adjust size accordingly
            try:
                vram_gb = torch.cuda.get_device_properties(0).total_memory / 1e9
                if vram_gb < 8:
                    # Low VRAM: use smaller size
                    if width > 1536 or height > 896:
                        return 1536, 896
                elif vram_gb < 12:
                    # Medium VRAM: use medium size
                    if width > 1792 or height > 1024:
                        return 1792, 1024
                # High VRAM: use requested size
            except:
                pass
        elif self.device in ['mps', 'cpu']:
            # MPS/CPU: use smaller size for performance
            if width > 1024 or height > 1024:
                return 1024, 1024
        
        return width, height
    
    def generate_image(self, request) -> dict:
        """Generate an image using the specified pipeline and mode."""
        try:
            # Build prompt
            image_prompt, alt_text = self._build_prompt(request)
            
            # Get optimal size
            width, height = self._get_optimal_size(request.width or 1792, request.height or 1024)
            
            # Determine mode
            mode = request.mode or "quality"
            if mode not in self.pipelines or self.pipelines[mode] is None:
                # Fallback to available pipeline
                if self.pipelines.get('turbo'):
                    mode = 'turbo'
                elif self.pipelines.get('quality'):
                    mode = 'quality'
                else:
                    return {
                        'image_prompt': image_prompt,
                        'alt_text': alt_text,
                        'image_url': None,
                        'error': 'No image generation pipelines available'
                    }
            
            logger.info(f"Generating image with {mode} pipeline, size: {width}x{height}")
            
            # Generate image based on mode
            if mode == 'turbo':
                image = self._generate_turbo(image_prompt, width, height)
            else:
                image = self._generate_quality(image_prompt, width, height)
            
            if image is None:
                return {
                    'image_prompt': image_prompt,
                    'alt_text': alt_text,
                    'image_url': None,
                    'error': 'Image generation failed'
                }
            
            # Convert to data URL
            image_url = self._pil_to_data_url(image)
            
            return {
                'image_prompt': image_prompt,
                'alt_text': alt_text,
                'image_url': image_url,
                'error': None
            }
            
        except Exception as e:
            logger.error(f"Error in image generation: {e}")
            return {
                'image_prompt': image_prompt if 'image_prompt' in locals() else "Error occurred",
                'alt_text': alt_text if 'alt_text' in locals() else "Error occurred",
                'image_url': None,
                'error': str(e)
            }
    
    def _generate_turbo(self, prompt: str, width: int, height: int) -> Optional[Image.Image]:
        """Generate image using SDXL Turbo pipeline."""
        try:
            with torch.inference_mode():
                result = self.pipelines['turbo'](
                    prompt=prompt,
                    width=width,
                    height=height,
                    num_inference_steps=4,
                    guidance_scale=0.0,  # Turbo ignores CFG
                    num_images_per_prompt=1
                )
                return result.images[0]
        except Exception as e:
            logger.error(f"Turbo generation failed: {e}")
            return None
    
    def _generate_quality(self, prompt: str, width: int, height: int) -> Optional[Image.Image]:
        """Generate image using SDXL Base + optional Refiner pipeline."""
        try:
            with torch.inference_mode():
                # Generate with base pipeline
                result = self.pipelines['quality'](
                    prompt=prompt,
                    width=width,
                    height=height,
                    num_inference_steps=32,
                    guidance_scale=6.0,
                    num_images_per_prompt=1
                )
                
                image = result.images[0]
                
                # Apply refiner if available
                if self.pipelines.get('refiner') is not None:
                    try:
                        logger.info("Applying SDXL refiner...")
                        refined_result = self.pipelines['refiner'](
                            prompt=prompt,
                            image=image,
                            num_inference_steps=30,
                            guidance_scale=5.5,
                            denoising_start=0.8
                        )
                        image = refined_result.images[0]
                    except Exception as refiner_error:
                        logger.warning(f"Refiner failed, using base result: {refiner_error}")
                
                return image
                
        except Exception as e:
            logger.error(f"Quality generation failed: {e}")
            return None
    
    def _pil_to_data_url(self, image: Image.Image) -> str:
        """Convert PIL image to data URL (base64 PNG)."""
        buffer = io.BytesIO()
        image.save(buffer, format='PNG')
        buffer.seek(0)
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return f"data:image/png;base64,{img_str}"


# Global instance
image_generator = LocalImageGenerator()
