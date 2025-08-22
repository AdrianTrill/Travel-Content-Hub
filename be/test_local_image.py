#!/usr/bin/env python3
"""
Simple test script for local image generation.
Run this to verify the SDXL pipeline is working correctly.
"""

import asyncio
import json
import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app.core.image_generator import LocalImageGenerator
from app.schemas.content import LocalImageGenerationRequest


async def test_local_image_generation():
    """Test the local image generation with a sample request."""
    
    # Test payload matching the specification
    test_payload = LocalImageGenerationRequest(
        title="Late-morning bites at Borough Market",
        content="Arrive by late morning for coffee and pastries; weave past fruit crates and cheese counters under the iron arches.",
        destination="London",
        tags=["market", "street food"],
        neighborhoods=["Southwark"],
        recommended_spots=["Borough Market"],
        best_times="late morning",
        width=1792,
        height=1024,
        mode="quality"
    )
    
    print("🚀 Testing Local Image Generation...")
    print(f"📍 Destination: {test_payload.destination}")
    print(f"🎯 Mode: {test_payload.mode}")
    print(f"📐 Size: {test_payload.width}x{test_payload.height}")
    print()
    
    try:
        # Initialize the image generator
        print("📦 Initializing SDXL pipelines...")
        generator = LocalImageGenerator()
        
        # Check available pipelines
        available_pipelines = [k for k, v in generator.pipelines.items() if v is not None]
        print(f"✅ Available pipelines: {available_pipelines}")
        
        if not available_pipelines:
            print("❌ No pipelines available. Check model downloads and dependencies.")
            return
        
        print()
        print("🎨 Generating image...")
        
        # Generate the image
        result = generator.generate_image(test_payload)
        
        if result.get('error'):
            print(f"❌ Image generation failed: {result['error']}")
            return
        
        print("✅ Image generation successful!")
        print()
        print("📝 Generated Prompt:")
        print(f"   {result['image_prompt']}")
        print()
        print("🏷️  Alt Text:")
        print(f"   {result['alt_text']}")
        print()
        print("🖼️  Image URL:")
        if result['image_url']:
            print(f"   ✅ Data URL generated (length: {len(result['image_url'])} chars)")
            print(f"   📊 Starts with: {result['image_url'][:50]}...")
        else:
            print("   ❌ No image URL generated")
        
        print()
        print("🎉 Test completed successfully!")
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    print("🧪 Local Image Generation Test")
    print("=" * 50)
    print()
    
    # Run the test
    asyncio.run(test_local_image_generation())
