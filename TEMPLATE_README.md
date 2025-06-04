# Market Research Report Template

A comprehensive, interactive market research report template built with React, TypeScript, and Tailwind CSS. Features real-time fact-checking, responsive design, and beautiful data visualizations.

## 🚀 Features

- **Interactive Fact-Checking**: Real-time verification of claims with confidence scores and sources
- **Responsive Design**: Beautiful UI that works on all devices
- **Data Visualizations**: Charts and graphs powered by Recharts
- **SWOT Analysis**: Interactive quadrant analysis with animations
- **Search Functionality**: Full-text search across report content
- **Dark/Light Mode**: Automatic theme switching
- **SEO Optimized**: Meta tags and structured data
- **Performance Optimized**: Code splitting and lazy loading

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── FactCheckButton.tsx    # Fact-checking functionality
│   ├── SectionCard.tsx        # Main content sections
│   ├── ChartBlock.tsx         # Data visualizations
│   ├── Navigation.tsx         # Header navigation
│   ├── SearchModal.tsx        # Search functionality
│   └── ...
├── data/               # Report data and fact-checks
│   ├── report.json           # Main report content
│   └── factCheckDatabase.json # Fact-check data
├── config/             # Configuration files
│   └── template.config.ts    # Template settings
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # CSS and styling
```

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd market-report-template

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Customize for Your Market

#### Update Configuration
Edit `src/config/template.config.ts`:

```typescript
export const TEMPLATE_CONFIG = {
  brand: {
    name: 'YOUR_BRAND',
    tagline: 'Your tagline here',
    // ... other brand settings
  },
  report: {
    title: 'Your Market Report Title',
    subtitle: 'Your Market Analysis',
    // ... other report settings
  }
};
```

#### Update Report Data
Edit `src/data/report.json`:

```json
{
  "metadata": {
    "title": "Your Market Report",
    "subtitle": "Your Market Analysis",
    "date": "2025-01-01",
    "author": "Your Team"
  },
  "sections": [
    {
      "id": "executive-summary",
      "title": "Executive Summary",
      "tldr": "Your TL;DR summary",
      "content": ["Your content paragraphs..."]
    }
  ]
}
```

#### Update Fact-Check Data
Edit `src/data/factCheckDatabase.json`:

```json
{
  "factChecks": {
    "your-claim-id": {
      "claim": "Your factual claim",
      "status": "verified",
      "confidence": 95,
      "explanation": "Your explanation",
      "sources": [...]
    }
  }
}
```

### 3. Deploy

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📊 Adding Fact-Checks

### 1. Add Fact-Check Data

Add entries to `src/data/factCheckDatabase.json`:

```json
{
  "factChecks": {
    "population-growth": {
      "claim": "Population grew by 5% in 2024",
      "status": "verified",
      "confidence": 90,
      "explanation": "Official census data confirms 5% population growth.",
      "sources": [
        {
          "title": "Census Bureau Report 2024",
          "url": "https://census.gov/...",
          "excerpt": "Population increased by 5% year-over-year"
        }
      ]
    }
  }
}
```

### 2. Update Fact-Check Mapping

Add keywords to `src/components/FactCheckButton.tsx`:

```typescript
const CONTENT_FACT_CHECK_MAP = [
  {
    keywords: ['5% population growth', 'population grew by 5%'],
    factCheckId: 'population-growth',
    priority: 8
  }
];
```

### Fact-Check Status Types

- `verified`: Claim is accurate and well-sourced
- `partially-verified`: Claim is mostly accurate with minor issues
- `needs-verification`: Claim requires additional verification
- `needs-context`: Claim needs additional context
- `needs-clarification`: Claim is unclear or ambiguous
- `needs-correction`: Claim has significant inaccuracies
- `inaccurate`: Claim is demonstrably false
- `unverified`: No fact-check data available

## 🎨 Customizing Styles

### Brand Colors
Update colors in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          500: '#14b8a6',
          900: '#134e4a',
        }
      }
    }
  }
}
```

### Custom CSS
Add custom styles to `src/index.css`:

```css
.booth-card {
  @apply bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6;
}

.booth-button {
  @apply bg-primary-600 text-white px-4 py-2 rounded-lg;
}
```

## 📈 Adding Charts

### 1. Add Chart Data to Report

```json
{
  "charts": [
    {
      "type": "bar",
      "title": "Market Growth",
      "data": [
        { "year": "2023", "value": 100 },
        { "year": "2024", "value": 120 }
      ]
    }
  ]
}
```

### 2. Supported Chart Types

- `bar`: Bar charts
- `line`: Line charts
- `pie`: Pie charts
- `area`: Area charts

## 🔍 Search Configuration

The search functionality automatically indexes:
- Section titles and content
- Chart titles and data
- SWOT analysis items
- Fact-check claims

Configure search in `template.config.ts`:

```typescript
features: {
  search: {
    enabled: true,
    placeholder: 'Search report content...',
    minQueryLength: 2
  }
}
```

## 🌐 SEO Optimization

### Meta Tags
Update SEO settings in `template.config.ts`:

```typescript
seo: {
  title: 'Your Report Title',
  description: 'Your report description',
  keywords: 'your, keywords, here',
  author: 'Your Name',
  ogImage: '/your-og-image.png'
}
```

### Structured Data
The template automatically generates structured data for:
- Report metadata
- Author information
- Publication date
- Organization details

## 📱 Responsive Design

The template is fully responsive with breakpoints:
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up

## 🚀 Performance Optimization

### Built-in Optimizations
- Code splitting with React.lazy()
- Image optimization
- CSS purging with Tailwind
- Bundle analysis with Vite

### Performance Tips
1. Optimize images before adding to `public/`
2. Use WebP format for better compression
3. Minimize fact-check database size
4. Use pagination for large datasets

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run deploy       # Deploy to GitHub Pages
```

### Environment Variables

Create `.env.local` for local development:

```env
VITE_ANALYTICS_ID=your-analytics-id
VITE_API_URL=your-api-url
```

## 📦 Deployment Options

### GitHub Pages (Recommended)
```bash
npm run deploy
```

### Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel
1. Import your repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This template is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For questions and support:
- Create an issue in the repository
- Check the documentation
- Review example implementations

## 🔄 Version History

- **v2.1.1**: Current version with fact-checking
- **v2.0.0**: Major refactor with TypeScript
- **v1.0.0**: Initial template release

---

**Happy reporting! 📊✨** 