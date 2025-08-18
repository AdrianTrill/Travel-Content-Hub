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


