# 🚀 Local Image Generation Setup Guide

This guide will help you set up local image generation using Stable Diffusion XL, completely replacing OpenAI image generation while keeping content generation intact.

## 📋 What's Been Implemented

✅ **Local Image Generator Module** (`be/app/core/image_generator.py`)
- SDXL Base + Refiner pipeline for quality mode
- SDXL Turbo pipeline for speed mode
- Automatic device detection (CUDA → MPS → CPU)
- Smart prompt building from travel content
- Memory optimization and error handling

✅ **New API Endpoints**
- `POST /api/v1/generate-image-local` - New local generation endpoint
- `POST /api/v1/generate-image` - Legacy endpoint now uses local generation
- `POST /api/v1/generate-content` - Still uses OpenAI (unchanged)

✅ **Updated Schemas** (`be/app/schemas/content.py`)
- New request/response models for local image generation
- Backward compatibility maintained

✅ **Installation & Testing Scripts**
- `be/install_local_image.sh` - Automated dependency installation
- `be/test_local_image.py` - Local module testing
- `be/test_api.py` - API endpoint testing
- `be/start_backend.sh` - Backend startup script

## 🛠️ Installation Commands

### 1. Navigate to Backend Directory
```bash
cd be
```

### 2. Run Automated Installation Script
```bash
./install_local_image.sh
```

**What this script does:**
- Detects your system (NVIDIA GPU, Apple Silicon, or CPU)
- Installs appropriate PyTorch version
- Installs all SDXL dependencies
- Creates virtual environment
- Sets up configuration files

### 3. Manual Installation (Alternative)

If you prefer manual installation:

#### For NVIDIA GPU (CUDA):
```bash
# Install PyTorch with CUDA support
pip install --upgrade torch torchvision --index-url https://download.pytorch.org/whl/cu121

# Install SDXL dependencies
pip install diffusers transformers accelerate safetensors compel Pillow

# Optional: Install xformers for memory optimization
pip install xformers
```

#### For Apple Silicon (M1/M2):
```bash
# Install PyTorch for Apple Silicon
pip install torch torchvision

# Install SDXL dependencies
pip install diffusers transformers accelerate safetensors compel Pillow
```

#### For CPU-only:
```bash
# Install PyTorch for CPU
pip install torch torchvision

# Install SDXL dependencies
pip install diffusers transformers accelerate safetensors compel Pillow
```

### 4. Install All Project Dependencies
```bash
pip install -r requirements.txt
```

### 5. Hugging Face Login (Optional but Recommended)
```bash
huggingface-cli login
```

## 🧪 Testing Commands

### 1. Test Local Module (No Server Required)
```bash
cd be
python test_local_image.py
```

**Expected Output:**
```
🧪 Local Image Generation Test
==================================================

🚀 Testing Local Image Generation...
📍 Destination: London
🎯 Mode: quality
📐 Size: 1792x1024

📦 Initializing SDXL pipelines...
✅ Available pipelines: ['turbo', 'quality', 'refiner']

🎨 Generating image...
✅ Image generation successful!

📝 Generated Prompt:
   Borough Market in London; morning; street-level, 24–35mm wide-angle...

🏷️  Alt Text:
   Borough Market in London at morning, showing market stalls, vendor awnings, fruit crates

🖼️  Image URL:
   ✅ Data URL generated (length: 1234567 chars)
   📊 Starts with: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...

🎉 Test completed successfully!
```

### 2. Start Backend Server
```bash
cd be
./start_backend.sh
```

**Expected Output:**
```
🚀 Starting Travel Content Hub Backend...
========================================

🔧 Activating virtual environment...
✅ Virtual environment activated

📋 Checking dependencies...
✅ Dependencies verified

💻 System Information:
   Python: Python 3.9.18
   PyTorch: 2.1.0+cu121
   CUDA Available: True
   GPU: NVIDIA GeForce RTX 4090
   VRAM: 24.0 GB

🌐 Starting FastAPI server...
   Server will be available at: http://localhost:8000
   API docs: http://localhost:8000/docs
   Press Ctrl+C to stop
```

### 3. Test API Endpoints (In New Terminal)
```bash
cd be
python test_api.py
```

**Expected Output:**
```
🚀 API Test Suite for Local Image Generation
============================================================

⚠️  Make sure the server is running with: uvicorn app.main:app --reload

🧪 Testing /api/v1/generate-content endpoint...
   📤 Sending request to http://localhost:8000/api/v1/generate-content
   ✅ Request successful!
   📝 Generated 3 suggestions

🧪 Testing /api/v1/generate-image-local endpoint...
   📤 Sending request to http://localhost:8000/api/v1/generate-image-local
   ✅ Request successful!
   🎨 Image prompt: Borough Market in London; morning; street-level...
   🖼️  Image URL: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...

🧪 Testing /api/v1/generate-image endpoint (legacy)...
   📤 Sending request to http://localhost:8000/api/v1/generate-image
   ✅ Request successful!
   🤖 Model: sdxl-local
   🖼️  Image URL: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...

============================================================
📊 Test Summary
============================================================
✅ Content Generation: PASSED
✅ Local Image Generation: PASSED
✅ Legacy Image Endpoint: PASSED

🎉 Testing complete!
✅ All tests passed successfully!
```

## 🌐 Manual API Testing

### 1. Test Local Image Generation
```bash
curl -X POST "http://localhost:8000/api/v1/generate-image-local" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "London",
    "recommended_spots": ["Borough Market"],
    "best_times": "morning",
    "mode": "turbo"
  }'
```

### 2. Test Legacy Endpoint (Redirects to Local)
```bash
curl -X POST "http://localhost:8000/api/v1/generate-image" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Market Morning",
    "content": "Early morning at the market",
    "destination": "London",
    "tags": ["market"],
    "neighborhoods": ["Southwark"],
    "recommended_spots": ["Borough Market"],
    "best_times": "morning"
  }'
```

### 3. Test Content Generation (Still OpenAI)
```bash
curl -X POST "http://localhost:8000/api/v1/generate-content" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris",
    "content_type": "Instagram Post",
    "language": "en"
  }'
```

## 🔧 Configuration

### Environment Variables
Create `be/.env.development`:
```bash
# Required for content generation (OpenAI)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Override default settings
APP_ENV=development
OPENAI_MODEL=gpt-4o-mini
```

### Model Downloads
Models are automatically downloaded on first run:
- **SDXL Base**: ~6.9GB
- **SDXL Refiner**: ~6.9GB  
- **SDXL Turbo**: ~6.9GB

**Total**: ~20.7GB for all models

## 📊 Performance Expectations

| Device | Mode | Size | Time | Quality |
|--------|------|------|------|---------|
| RTX 4090 (24GB) | Quality | 1792x1024 | ~15s | ⭐⭐⭐⭐⭐ |
| RTX 3080 (10GB) | Quality | 1536x896 | ~25s | ⭐⭐⭐⭐⭐ |
| RTX 3060 (8GB) | Turbo | 1024x1024 | ~8s | ⭐⭐⭐⭐ |
| M1 Pro | Quality | 1024x1024 | ~45s | ⭐⭐⭐⭐ |
| CPU (i7) | Turbo | 1024x1024 | ~5min | ⭐⭐⭐ |

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. CUDA Out of Memory
```bash
# Reduce image size
"width": 1024, "height": 1024

# Use turbo mode
"mode": "turbo"
```

#### 2. Model Download Failures
```bash
# Login to Hugging Face
huggingface-cli login

# Check internet connection
# Try again
```

#### 3. Slow Generation on CPU
```bash
# This is expected - CPU generation is much slower
# Consider using a GPU or cloud service for production
```

#### 4. Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Check Python version (3.8+ required)
python --version
```

### Debug Mode
```bash
# Start with debug logging
LOG_LEVEL=DEBUG uvicorn app.main:app --reload

# Check logs for detailed error information
```

## 🎯 What's Working Now

✅ **Content Generation**: Still uses OpenAI (unchanged)
✅ **Local Image Generation**: New SDXL-based system
✅ **Legacy Compatibility**: Old endpoints redirect to local generation
✅ **Device Optimization**: Automatic GPU/CPU detection
✅ **Memory Management**: Smart size adjustment
✅ **Error Handling**: Graceful fallbacks and retries

## 🚫 What's Been Removed

❌ **OpenAI Image Generation**: Completely replaced
❌ **External API Calls**: No more rate limits or costs
❌ **Image Storage**: No disk writes, only data URLs

## 🔄 Migration Path

1. **Frontend**: No changes needed - same API endpoints
2. **Existing Code**: Legacy endpoints automatically use local generation
3. **New Features**: Use `/api/v1/generate-image-local` for advanced options

## 📚 Documentation

- **Detailed Guide**: `be/README_LOCAL_IMAGE.md`
- **API Docs**: `http://localhost:8000/docs` (when server running)
- **Test Scripts**: Multiple test files for validation

## 🎉 Success Criteria

You'll know everything is working when:

1. ✅ `./install_local_image.sh` runs without errors
2. ✅ `python test_local_image.py` generates an image successfully
3. ✅ `./start_backend.sh` starts the server
4. ✅ `python test_api.py` passes all tests
5. ✅ API endpoints return base64 data URLs for images

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review logs for error messages
3. Verify system requirements
4. Check dependencies are installed correctly
5. Ensure sufficient disk space for model downloads

---

**🎯 Goal**: Complete replacement of OpenAI image generation with local SDXL, maintaining all existing functionality while adding new capabilities.
