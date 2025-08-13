# Travel Content Hub

A modern dashboard application built with Next.js (App Router), TypeScript, and Tailwind CSS for managing travel content and destinations.

## Features

- **Dashboard Overview**: Key performance metrics and statistics
- **Destination Weather**: Real-time weather information for popular travel destinations
- **Featured Events**: Upcoming cultural, music, and culinary events
- **Historical Landmarks**: Information about famous landmarks with ratings
- **Responsive Design**: Mobile-friendly interface with modern UI/UX

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Font**: Inter (Google Fonts)

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx      # Top navigation bar
│   │   ├── Sidebar.tsx     # Left sidebar with navigation
│   │   ├── MetricCard.tsx  # KPI metric cards
│   │   ├── WeatherCard.tsx # Weather information
│   │   ├── EventsCard.tsx  # Featured events
│   │   └── LandmarksCard.tsx # Historical landmarks
│   ├── data/               # Mock data and constants
│   │   └── mockData.ts     # Dashboard data
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Interface definitions
│   ├── globals.css         # Global styles and Tailwind imports
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Main dashboard page
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── postcss.config.js       # PostCSS configuration
```

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Travel-Content-Hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize Tailwind CSS**
   ```bash
   npx tailwindcss init -p
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
