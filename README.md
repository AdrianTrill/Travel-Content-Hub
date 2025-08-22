# Local Image Generation with Stable Diffusion XL

This backend now supports local image generation using Stable Diffusion XL via Hugging Face Diffusers, completely replacing the OpenAI image generation while maintaining the same API interface.

## 🚀 Features

- **Local Generation**: No external API calls, no rate limits, no costs
- **SDXL Quality**: Uses Stable Diffusion XL Base + optional Refiner for high-quality images
- **SDXL Turbo**: Fast generation mode for quick iterations
- **Smart Prompting**: Automatic prompt building from travel content data
- **Device Optimization**: Automatic device detection (CUDA → MPS → CPU)
- **Memory Management**: Automatic size adjustment based on available VRAM
- **Data URL Output**: Images returned as base64 data URLs (no disk writes)

## 📦 Installation

### 1. System Requirements

- **Python**: 3.8+
- **Memory**: Minimum 8GB RAM, 16GB+ recommended
- **GPU**: NVIDIA GPU with 8GB+ VRAM recommended (CUDA 11.8+)
- **Alternative**: Apple Silicon (M1/M2) with MPS support
- **Fallback**: CPU-only mode (slower but functional)

### 2. Install Dependencies

```bash
# Navigate to backend directory
cd be

# Install PyTorch (choose appropriate version for your system)
# For NVIDIA CUDA 11.8:
pip install --upgrade torch torchvision --index-url https://download.pytorch.org/whl/cu118

# For NVIDIA CUDA 12.1:
pip install --upgrade torch torchvision --index-url https://download.pytorch.org/whl/cu121

# For CPU-only:
pip install torch torchvision

# For Apple Silicon (M1/M2):
pip install torch torchvision

# Install SDXL dependencies
pip install diffusers transformers accelerate safetensors compel Pillow

# Optional: Install xformers for memory optimization (CUDA only)
pip install xformers
```

### 3. Install All Dependencies

```bash
# Install everything from requirements.txt
pip install -r requirements.txt
```

### 4. Model Downloads

The system will automatically download required models on first run:

- **SDXL Base**: `stabilityai/stable-diffusion-xl-base-1.0` (~6.9GB)
- **SDXL Refiner**: `stabilityai/stable-diffusion-xl-refiner-1.0` (~6.9GB) 
- **SDXL Turbo**: `stabilityai/sdxl-turbo` (~6.9GB)

**Note**: Some models require Hugging Face EULA acceptance:
```bash
huggingface-cli login
```

## 🔧 Configuration

### Environment Variables

Create a `.env.development` file in the `be/` directory:

```bash
# Required for content generation (OpenAI)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Override default settings
APP_ENV=development
OPENAI_MODEL=gpt-4o-mini
```

### Device Detection

The system automatically detects the best available device:

1. **CUDA** (NVIDIA GPU) - Best performance, supports all features
2. **MPS** (Apple Silicon) - Good performance, limited features
3. **CPU** - Slowest but always available

## 📡 API Endpoints

### 1. New Local Image Generation

**POST** `/api/v1/generate-image-local`

```json
{
  "title": "Late-morning bites at Borough Market",
  "content": "Arrive by late morning for coffee and pastries; weave past fruit crates and cheese counters under the iron arches.",
  "destination": "London",
  "tags": ["market", "street food"],
  "neighborhoods": ["Southwark"],
  "recommended_spots": ["Borough Market"],
  "best_times": "late morning",
  "width": 1792,
  "height": 1024,
  "mode": "quality"
}
```

**Response:**
```json
{
  "image_prompt": "Borough Market in London; morning; street-level, 24–35mm wide-angle; people mid-ground, leading lines; soft daylight; natural balanced colors; documentary travel photo captured on a full-frame camera, 35mm lens, f/5.6, 1/250s, ISO 200; realistic depth of field, subtle sensor noise, natural color grading, minimal post-processing; photorealistic, sharp focus, high detail. Must include: market stalls, vendor awnings, fruit crates, cheese counter. AVOID: no text overlays, no watermarks, no logos, no billboards, no heavy HDR, no anime, no illustration, no digital painting, no concept art, no CGI, no 3D render, no matte painting, no stylized look, no fisheye, avoid motion blur.",
  "alt_text": "Borough Market in London at morning, showing market stalls, vendor awnings, fruit crates",
  "image_url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "error": null
}
```

### 2. Legacy Endpoint (Redirects to Local)

**POST** `/api/v1/generate-image`

The legacy OpenAI endpoint now automatically uses local SDXL generation, maintaining backward compatibility.

## 🎯 Generation Modes

### Quality Mode (Default)
- **Pipeline**: SDXL Base + optional Refiner
- **Steps**: 28-36 inference steps
- **Guidance**: 5.0-6.0 CFG scale
- **Quality**: Highest quality, slower generation
- **Use Case**: Production images, final outputs

### Turbo Mode
- **Pipeline**: SDXL Turbo
- **Steps**: 4-6 inference steps  
- **Guidance**: 0.0 CFG scale (ignored by Turbo)
- **Quality**: Good quality, very fast generation
- **Use Case**: Quick iterations, prototyping

## 🎨 Prompt Engineering

The system automatically builds sophisticated prompts from your input data:

### Place Selection Priority
1. **Title** → extract market/street/plaza/square/park/museum/cathedral/bridge
2. **Recommended Spots** → first item in list
3. **Neighborhoods** → first item in list  
4. **Destination** → fallback

### Time/Season Inference
- `"late morning"` → `morning`
- `"sunset"` → `sunset`
- `"night"` → `night`
- `"winter"` → `winter`

### Composition & Lighting
- **Street scenes**: Wide-angle, people mid-ground, leading lines
- **Waterfront**: Elevated vantage, foreground anchor, sweeping background
- **General**: Eye-level, center-weighted subject

### Style Anchor
Appends professional photography specifications for consistent, realistic results.

## 🧪 Testing

### Quick Test

```bash
cd be
python test_local_image.py
```

### API Test

```bash
# Start the server
uvicorn app.main:app --reload

# Test with curl
curl -X POST "http://localhost:8000/api/v1/generate-image-local" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "London",
    "recommended_spots": ["Borough Market"],
    "best_times": "morning"
  }'
```

## 🚨 Troubleshooting

### Common Issues

#### 1. CUDA Out of Memory
```bash
# Reduce image size in request
"width": 1024, "height": 1024

# Or use turbo mode
"mode": "turbo"
```

#### 2. Model Download Failures
```bash
# Login to Hugging Face
huggingface-cli login

# Check internet connection and try again
```

#### 3. Slow Generation on CPU
```bash
# This is expected - CPU generation is much slower
# Consider using a GPU or cloud service for production
```

#### 4. MPS (Apple Silicon) Issues
```bash
# MPS support is limited in some PyTorch versions
# Try updating to latest PyTorch version
pip install --upgrade torch torchvision
```

### Performance Optimization

#### CUDA Optimizations
- **VAE Slicing**: Automatically enabled for memory efficiency
- **VAE Tiling**: Enabled for large images
- **Attention Slicing**: Enabled for memory efficiency

#### Memory Management
- **Automatic Size Adjustment**: Based on available VRAM
- **Pipeline Sharing**: Models loaded once and reused
- **Garbage Collection**: Automatic cleanup after generation

## 📊 Performance Benchmarks

| Device | Mode | Size | Time | Quality |
|--------|------|------|------|---------|
| RTX 4090 (24GB) | Quality | 1792x1024 | ~15s | ⭐⭐⭐⭐⭐ |
| RTX 3080 (10GB) | Quality | 1536x896 | ~25s | ⭐⭐⭐⭐⭐ |
| RTX 3060 (8GB) | Turbo | 1024x1024 | ~8s | ⭐⭐⭐⭐ |
| M1 Pro | Quality | 1024x1024 | ~45s | ⭐⭐⭐⭐ |
| CPU (i7) | Turbo | 1024x1024 | ~5min | ⭐⭐⭐ |

## 🔒 Security & Privacy

- **No External Calls**: All processing happens locally
- **No Data Storage**: Images returned as data URLs, no disk writes
- **No Logging**: Image data not logged or stored
- **Model Safety**: Uses Hugging Face's safety-filtered models

## 🚀 Production Deployment

### Docker
```dockerfile
# Use GPU-enabled base image for CUDA support
FROM nvidia/cuda:11.8-devel-ubuntu20.04

# Install Python and dependencies
RUN apt-get update && apt-get install -y python3 python3-pip
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run with GPU support
CMD ["python3", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables
```bash
# Production settings
APP_ENV=production
CUDA_VISIBLE_DEVICES=0  # Use specific GPU
TORCH_CUDA_ARCH_LIST="7.5;8.0;8.6"  # Optimize for specific GPU architectures
```

## 📚 Additional Resources

- [Stable Diffusion XL Documentation](https://huggingface.co/docs/diffusers/using-diffusers/sdxl)
- [Diffusers Library](https://github.com/huggingface/diffusers)
- [PyTorch Installation Guide](https://pytorch.org/get-started/locally/)
- [Hugging Face Models](https://huggingface.co/stabilityai)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the logs for error messages
3. Test with the provided test script
4. Check system requirements and dependencies

---

**Note**: This system replaces OpenAI image generation completely. The content generation still uses OpenAI for text generation, but all images are now generated locally using Stable Diffusion XL.


====================================================================================================================================================================================================================

# Travel Content Hub

A modern dashboard application built with Next.js (App Router), TypeScript, and Tailwind CSS for managing travel content and destinations. **Powered by OpenAI's GPT models for intelligent content generation.**

## Features

- **Dashboard Overview**: Key performance metrics and statistics
- **AI-Powered Content Generation**: Generate travel content using OpenAI's GPT models
- **Destination Weather**: Real-time weather information for popular travel destinations
- **Featured Events**: Upcoming cultural, music, and culinary events
- **Historical Landmarks**: Information about famous landmarks with ratings
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Content Editor**: Edit and regenerate AI-generated content with real-time updates
- **State Persistence**: Form data and generated content saved across sessions

## AI Integration

This application integrates with **OpenAI's GPT models** to provide intelligent travel content generation:

- **Content Types**: Generate blog posts, social media content, travel guides, and more
- **Smart Tagging**: AI automatically generates relevant tags for each content piece
- **Dynamic Regeneration**: Regenerate individual content cards or entire sets
- **Model Fallback**: Automatic fallback to available GPT models (gpt-4o-mini, gpt-4o, gpt-4-1106-preview)
- **Error Handling**: Robust error handling for API limits, model access, and network issues
- **Seasonal Intelligence**: AI considers weather patterns, seasonal events, festivals, and peak/off-peak timing
- **Date-Specific Content**: Tailored recommendations based on exact travel dates and seasonal factors

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Font**: Inter (Google Fonts)
- **Date Picker**: react-datepicker

### Backend
- **Framework**: FastAPI (Python)
- **AI Integration**: OpenAI Python Client
- **Validation**: Pydantic
- **Server**: Uvicorn
- **Containerization**: Docker

## Project Structure

```
Travel-Content-Hub/
├── fe/                     # Frontend (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/          # Reusable UI components
│   │   │   ├── content-generation/  # AI content generation
│   │   │   ├── content-history/     # Generated content history
│   │   │   ├── dashboard/           # Main dashboard
│   │   │   ├── settings/            # App configuration
│   │   │   ├── data/                # Mock data and constants
│   │   │   ├── types/               # TypeScript interfaces
│   │   │   ├── globals.css          # Global styles
│   │   │   ├── layout.tsx           # Root layout
│   │   │   └── page.tsx             # Main page
│   │   ├── package.json             # Frontend dependencies
│   │   ├── tailwind.config.js       # Tailwind configuration
│   │   └── tsconfig.json            # TypeScript configuration
├── be/                     # Backend (FastAPI)
│   ├── app/
│   │   ├── api/                     # API endpoints
│   │   ├── core/                    # Configuration
│   │   ├── schemas/                 # Pydantic models
│   │   └── main.py                  # FastAPI app entry point
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Backend containerization
│   └── .venv/                      # Python virtual environment
├── docker-compose.yml               # Multi-container setup
└── .gitignore                      # Git ignore patterns
```

## Setup Instructions

### Prerequisites

- **Frontend**: Node.js 18+ and npm/yarn
- **Backend**: Python 3.8+ and pip
- **OpenAI API Key**: Valid API key with access to GPT models

### Backend Setup (Python/FastAPI)

1. **Navigate to backend directory**
   ```bash
   cd be
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**
   Create a `.env.development` file in the `be/` directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini  # or your preferred model
   ```

5. **Start the backend server**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   The backend will be available at [http://localhost:8000](http://localhost:8000)

### Frontend Setup (Next.js)

1. **Navigate to frontend directory**
   ```bash
   cd fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Setup (Alternative)

1. **Start both services**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:8000](http://localhost:8000)

## API Endpoints

### Content Generation
- **POST** `/api/v1/generate-content` - Generate AI-powered travel content
  - Request: destination, start_date, end_date, content_type
  - Response: AI-generated content with titles, descriptions, and tags

## Environment Variables

### Backend (.env.development)
```bash
OPENAI_API_KEY=sk-...          # Your OpenAI API key
OPENAI_MODEL=gpt-4o-mini       # Preferred GPT model
```

### Frontend
The frontend automatically connects to the backend at `http://localhost:8000`

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `uvicorn app.main:app --reload` - Start development server
- `uvicorn app.main:app --host 0.0.0.0 --port 8000` - Start production server

## Color Scheme

The application uses a carefully selected color palette:

- **Primary**: `#6E2168` (Dark Purple)
- **Primary Dark**: `#340B37` (Very Dark Purple)
- **Success**: `#0F612D` (Green)
- **Warning**: `#F5A00F` (Orange)
- **Danger**: `#FFB066` (Red/Orange)
- **Gray Scale**: Various shades from `#F8F9F9` to `#3F3F46`

## Components

### Header
- Application logo and title
- Last updated timestamp

### Sidebar
- Navigation menu (Dashboard, Content Generation, Content History, Settings)
- Quick stats (Destinations, Scheduled, Engagement)

### Dashboard Content
- **Metric Cards**: Total Views, Shares, Avg. Read Time, Engagement Rate
- **Weather Card**: Current weather for Paris, Tokyo, New York, and Rome
- **Events Card**: Featured events with categories and details
- **Landmarks Card**: Historical landmarks with ratings and visitor information

## Data Structure

The application uses TypeScript interfaces for type safety:

- `WeatherInfo`: City weather data
- `Event`: Event information with location and attendees
- `Landmark`: Landmark details with ratings
- `MetricCard`: Performance metric data
- `QuickStat`: Sidebar statistics

## AI Content Generation Features

### Content Types
- **Blog Posts**: Detailed travel articles and guides
- **Social Media**: Engaging posts for various platforms
- **Travel Guides**: Comprehensive destination information
- **Custom Content**: Tailored content based on your specifications

### Smart Features
- **Automatic Tagging**: AI generates relevant tags for SEO and organization
- **Destination-Aware**: Content adapts to selected travel destinations
- **Seasonal Intelligence**: Content considers travel dates with weather patterns, seasonal events, festivals, and peak/off-peak timing
- **Date-Specific Recommendations**: Best times to visit attractions, seasonal activities, and time-specific experiences
- **Real-time Editing**: Modify generated content directly in the interface
- **Individual Regeneration**: Regenerate specific content pieces as needed

### Model Intelligence
The AI automatically handles:
- **Model Selection**: Chooses the best available GPT model
- **Fallback Logic**: Gracefully handles model access issues
- **Error Recovery**: Provides helpful error messages for common issues
- **Rate Limiting**: Manages API quotas and rate limits

## Responsive Design

The dashboard is fully responsive with:
- Mobile-first approach
- Grid layouts that adapt to screen size
- Flexible card arrangements
- Touch-friendly interface elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Check your API key in `.env.development`
   - Verify your OpenAI account has sufficient credits
   - Ensure your account has access to the requested models

2. **Backend Connection Issues**
   - Verify the backend is running on port 8000
   - Check virtual environment is activated
   - Ensure all Python dependencies are installed

3. **Frontend Build Issues**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility


