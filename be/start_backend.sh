#!/bin/bash

# Backend Startup Script with Local Image Generation
# This script starts the FastAPI backend with proper environment setup

set -e  # Exit on any error

echo "🚀 Starting Travel Content Hub Backend..."
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: Please run this script from the 'be' directory"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate
echo "✅ Virtual environment activated"

# Check if dependencies are installed
echo "📋 Checking dependencies..."
if ! python -c "import torch, diffusers, transformers, accelerate" 2>/dev/null; then
    echo "❌ Dependencies not installed. Please run: ./install_local_image.sh"
    exit 1
fi
echo "✅ Dependencies verified"

# Check if .env file exists
if [ ! -f ".env.development" ]; then
    echo "⚠️  Warning: .env.development file not found"
    echo "   Please create it with your OpenAI API key for content generation"
    echo "   Example:"
    echo "   OPENAI_API_KEY=your_key_here"
    echo "   APP_ENV=development"
    echo ""
fi

# Check if Hugging Face is logged in (optional but recommended)
if ! huggingface-cli whoami &>/dev/null; then
    echo "⚠️  Warning: Not logged into Hugging Face"
    echo "   Some models may require login: huggingface-cli login"
    echo ""
fi

# Display system info
echo "💻 System Information:"
echo "   Python: $(python --version)"
echo "   PyTorch: $(python -c "import torch; print(torch.__version__)")"
echo "   CUDA Available: $(python -c "import torch; print(torch.cuda.is_available())")"

if python -c "import torch; print(torch.cuda.is_available())" 2>/dev/null | grep -q "True"; then
    echo "   GPU: $(python -c "import torch; print(torch.cuda.get_device_name(0))")"
    echo "   VRAM: $(python -c "import torch; print(f'{torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB')")"
fi

echo ""

# Start the server
echo "🌐 Starting FastAPI server..."
echo "   Server will be available at: http://localhost:8000"
echo "   API docs: http://localhost:8000/docs"
echo "   Press Ctrl+C to stop"
echo ""

# Start uvicorn with reload
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
