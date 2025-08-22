#!/bin/bash

# Local Image Generation Installation Script
# This script installs all dependencies needed for local SDXL image generation

set -e  # Exit on any error

echo "🚀 Installing Local Image Generation Dependencies..."
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: Please run this script from the 'be' directory"
    exit 1
fi

# Check Python version
python_version=$(python3 --version 2>&1 | grep -oE '[0-9]+\.[0-9]+' | head -1)
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Error: Python 3.8+ required, found Python $python_version"
    exit 1
fi

echo "✅ Python version: $python_version"
echo ""

# Detect system and GPU
echo "🔍 Detecting system configuration..."

if command -v nvidia-smi &> /dev/null; then
    echo "✅ NVIDIA GPU detected"
    gpu_type="nvidia"
    
    # Get CUDA version
    cuda_version=$(nvidia-smi --query-gpu=compute_cap --format=csv,noheader,nounits | head -1)
    echo "   CUDA Compute Capability: $cuda_version"
    
    # Get VRAM
    vram=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -1)
    echo "   VRAM: $vram MB"
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    if [[ $(uname -m) == "arm64" ]]; then
        echo "✅ Apple Silicon (M1/M2) detected"
        gpu_type="apple"
    else
        echo "✅ macOS Intel detected"
        gpu_type="macos"
    fi
else
    echo "ℹ️  No GPU detected, will use CPU (slower but functional)"
    gpu_type="cpu"
fi

echo ""

# Install PyTorch based on system
echo "📦 Installing PyTorch..."

case $gpu_type in
    "nvidia")
        echo "   Installing PyTorch with CUDA support..."
        
        # Try CUDA 12.1 first, fallback to 11.8
        if pip install --upgrade torch torchvision --index-url https://download.pytorch.org/whl/cu121 --quiet; then
            echo "   ✅ PyTorch with CUDA 12.1 installed"
        elif pip install --upgrade torch torchvision --index-url https://download.pytorch.org/whl/cu118 --quiet; then
            echo "   ✅ PyTorch with CUDA 11.8 installed"
        else
            echo "   ❌ Failed to install PyTorch with CUDA"
            exit 1
        fi
        ;;
    "apple")
        echo "   Installing PyTorch for Apple Silicon..."
        pip install --upgrade torch torchvision --quiet
        echo "   ✅ PyTorch for Apple Silicon installed"
        ;;
    *)
        echo "   Installing PyTorch for CPU..."
        pip install --upgrade torch torchvision --quiet
        echo "   ✅ PyTorch for CPU installed"
        ;;
esac

echo ""

# Install SDXL dependencies
echo "📦 Installing SDXL dependencies..."

echo "   Installing diffusers, transformers, accelerate..."
pip install diffusers transformers accelerate --quiet

echo "   Installing safetensors, compel, Pillow..."
pip install safetensors compel Pillow --quiet

# Install xformers for NVIDIA GPUs (optional but recommended)
if [ "$gpu_type" = "nvidia" ]; then
    echo "   Installing xformers for memory optimization..."
    if pip install xformers --quiet; then
        echo "   ✅ xformers installed"
    else
        echo "   ⚠️  xformers installation failed (optional, continuing...)"
    fi
fi

echo ""

# Install all requirements
echo "📦 Installing all project dependencies..."
pip install -r requirements.txt --quiet
echo "✅ All dependencies installed"
echo ""

# Check if Hugging Face CLI is available
if command -v huggingface-cli &> /dev/null; then
    echo "✅ Hugging Face CLI available"
else
    echo "📦 Installing Hugging Face CLI..."
    pip install huggingface_hub --quiet
    echo "✅ Hugging Face CLI installed"
fi

echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env.development" ]; then
    echo "📝 Creating .env.development file..."
    cat > .env.development << EOF
# Local Image Generation Configuration
# Add your OpenAI API key for content generation
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Override default settings
APP_ENV=development
OPENAI_MODEL=gpt-4o-mini
EOF
    echo "✅ .env.development file created"
    echo "   ⚠️  Please add your OpenAI API key to .env.development"
else
    echo "✅ .env.development file already exists"
fi

echo ""

# Final instructions
echo "🎉 Installation Complete!"
echo "========================"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to .env.development"
echo "2. Login to Hugging Face (if needed):"
echo "   huggingface-cli login"
echo "3. Test the installation:"
echo "   python test_local_image.py"
echo "4. Start the server:"
echo "   uvicorn app.main:app --reload"
echo ""
echo "📚 For detailed documentation, see README_LOCAL_IMAGE.md"
echo ""

# Test if we can import the modules
echo "🧪 Testing imports..."
if python3 -c "
import torch
import diffusers
import transformers
import accelerate
import safetensors
import compel
from PIL import Image
print('✅ All modules imported successfully')
" 2>/dev/null; then
    echo "✅ Import test passed"
else
    echo "❌ Import test failed - check installation"
    exit 1
fi

echo ""
echo "🚀 Ready to generate images locally with Stable Diffusion XL!"
