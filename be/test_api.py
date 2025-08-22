#!/usr/bin/env python3
"""
API Test Script for Local Image Generation
Tests both the new local endpoint and legacy endpoint.
"""

import asyncio
import json
import requests
import time
from typing import Dict, Any


def test_local_image_endpoint() -> Dict[str, Any]:
    """Test the new local image generation endpoint."""
    print("🧪 Testing /api/v1/generate-image-local endpoint...")
    
    url = "http://localhost:8000/api/v1/generate-image-local"
    
    payload = {
        "title": "Late-morning bites at Borough Market",
        "content": "Arrive by late morning for coffee and pastries; weave past fruit crates and cheese counters under the iron arches.",
        "destination": "London",
        "tags": ["market", "street food"],
        "neighborhoods": ["Southwark"],
        "recommended_spots": ["Borough Market"],
        "best_times": "late morning",
        "width": 1024,  # Smaller size for testing
        "height": 1024,
        "mode": "turbo"  # Faster for testing
    }
    
    try:
        print(f"   📤 Sending request to {url}")
        print(f"   📝 Payload: {json.dumps(payload, indent=2)}")
        
        start_time = time.time()
        response = requests.post(url, json=payload, timeout=300)  # 5 minute timeout
        end_time = time.time()
        
        print(f"   ⏱️  Response time: {end_time - start_time:.2f} seconds")
        print(f"   📊 Status code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("   ✅ Request successful!")
            print(f"   🎨 Image prompt: {result.get('image_prompt', 'N/A')[:100]}...")
            print(f"   🏷️  Alt text: {result.get('alt_text', 'N/A')}")
            
            if result.get('image_url'):
                print(f"   🖼️  Image URL: {result['image_url'][:50]}...")
                print(f"   📏 URL length: {len(result['image_url'])} characters")
            else:
                print("   ❌ No image URL in response")
            
            if result.get('error'):
                print(f"   ⚠️  Error in response: {result['error']}")
            
            return result
        else:
            print(f"   ❌ Request failed with status {response.status_code}")
            print(f"   📝 Response: {response.text}")
            return {"error": f"HTTP {response.status_code}"}
            
    except requests.exceptions.Timeout:
        print("   ⏰ Request timed out (5 minutes)")
        return {"error": "Timeout"}
    except requests.exceptions.ConnectionError:
        print("   🔌 Connection error - is the server running?")
        return {"error": "Connection failed"}
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return {"error": str(e)}


def test_legacy_endpoint() -> Dict[str, Any]:
    """Test the legacy endpoint that now redirects to local generation."""
    print("\n🧪 Testing /api/v1/generate-image endpoint (legacy)...")
    
    url = "http://localhost:8000/api/v1/generate-image"
    
    payload = {
        "title": "Sunset at the Golden Gate Bridge",
        "content": "Visit during golden hour for the most dramatic views of this iconic landmark.",
        "destination": "San Francisco",
        "tags": ["landmark", "sunset", "bridge"],
        "neighborhoods": ["Marina District"],
        "recommended_spots": ["Golden Gate Bridge"],
        "best_times": "sunset"
    }
    
    try:
        print(f"   📤 Sending request to {url}")
        print(f"   📝 Payload: {json.dumps(payload, indent=2)}")
        
        start_time = time.time()
        response = requests.post(url, json=payload, timeout=300)
        end_time = time.time()
        
        print(f"   ⏱️  Response time: {end_time - start_time:.2f} seconds")
        print(f"   📊 Status code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("   ✅ Request successful!")
            print(f"   🎨 Image prompt: {result.get('image_prompt', 'N/A')[:100]}...")
            print(f"   🏷️  Alt text: {result.get('alt_text', 'N/A')}")
            print(f"   🤖 Model: {result.get('image_model', 'N/A')}")
            print(f"   📐 Size: {result.get('image_size', 'N/A')}")
            
            if result.get('image_url'):
                print(f"   🖼️  Image URL: {result['image_url'][:50]}...")
                print(f"   📏 URL length: {len(result['image_url'])} characters")
            else:
                print("   ❌ No image URL in response")
            
            if result.get('error'):
                print(f"   ⚠️  Error in response: {result['error']}")
            
            return result
        else:
            print(f"   ❌ Request failed with status {response.status_code}")
            print(f"   📝 Response: {response.text}")
            return {"error": f"HTTP {response.status_code}"}
            
    except requests.exceptions.Timeout:
        print("   ⏰ Request timed out (5 minutes)")
        return {"error": "Timeout"}
    except requests.exceptions.ConnectionError:
        print("   🔌 Connection error - is the server running?")
        return {"error": "Connection failed"}
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return {"error": str(e)}


def test_content_generation() -> Dict[str, Any]:
    """Test the content generation endpoint (still uses OpenAI)."""
    print("\n🧪 Testing /api/v1/generate-content endpoint...")
    
    url = "http://localhost:8000/api/v1/generate-content"
    
    payload = {
        "destination": "Paris",
        "content_type": "Instagram Post",
        "language": "en",
        "tone": "elegant and informative"
    }
    
    try:
        print(f"   📤 Sending request to {url}")
        print(f"   📝 Payload: {json.dumps(payload, indent=2)}")
        
        start_time = time.time()
        response = requests.post(url, json=payload, timeout=60)
        end_time = time.time()
        
        print(f"   ⏱️  Response time: {end_time - start_time:.2f} seconds")
        print(f"   📊 Status code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("   ✅ Request successful!")
            print(f"   📝 Generated {len(result.get('suggestions', []))} suggestions")
            
            for i, suggestion in enumerate(result.get('suggestions', [])[:1]):  # Show first one
                print(f"   📋 Suggestion {i+1}:")
                print(f"      Title: {suggestion.get('title', 'N/A')}")
                print(f"      Content: {suggestion.get('content', 'N/A')[:100]}...")
                print(f"      Type: {suggestion.get('type', 'N/A')}")
                print(f"      Quality: {suggestion.get('quality', 'N/A')}")
            
            return result
        else:
            print(f"   ❌ Request failed with status {response.status_code}")
            print(f"   📝 Response: {response.text}")
            return {"error": f"HTTP {response.status_code}"}
            
    except requests.exceptions.Timeout:
        print("   ⏰ Request timed out (1 minute)")
        return {"error": "Timeout"}
    except requests.exceptions.ConnectionError:
        print("   🔌 Connection error - is the server running?")
        return {"error": "Connection failed"}
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return {"error": str(e)}


def main():
    """Run all API tests."""
    print("🚀 API Test Suite for Local Image Generation")
    print("=" * 60)
    print()
    print("⚠️  Make sure the server is running with: uvicorn app.main:app --reload")
    print()
    
    # Test content generation first (faster)
    content_result = test_content_generation()
    
    # Test local image generation
    local_result = test_local_image_endpoint()
    
    # Test legacy endpoint
    legacy_result = test_legacy_endpoint()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    
    tests = [
        ("Content Generation", content_result),
        ("Local Image Generation", local_result),
        ("Legacy Image Endpoint", legacy_result)
    ]
    
    for test_name, result in tests:
        if result.get('error'):
            print(f"❌ {test_name}: FAILED - {result['error']}")
        else:
            print(f"✅ {test_name}: PASSED")
    
    print()
    print("🎉 Testing complete!")
    
    if any(result.get('error') for _, result in tests):
        print("⚠️  Some tests failed. Check the output above for details.")
    else:
        print("✅ All tests passed successfully!")


if __name__ == "__main__":
    main()
