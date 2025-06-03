# 🏞️ Tri-Cities Market Research Report

**An ultra-modern, interactive digital transformation of the Enhanced Market Research Report for the Tri-Cities Region (Johnson City, Kingsport, Bristol, Tennessee)**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://yourusername.github.io/tri-cities-market-report)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-green?style=for-the-badge)](https://pages.github.com/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

### 🚀 **Ultra-Modern UX/UI**
- **Glass-morphism design** with ETSU navy & Boone Lake teal theming
- **Framer Motion animations** with smooth page transitions
- **Responsive design** optimized for all devices (320px+)
- **Dark/Light mode** toggle with system preference detection

### 📊 **Interactive Data Visualization**
- **Recharts integration** for responsive, beautiful charts
- **Animated counters** in hero section with real-time count-ups
- **Interactive SWOT analysis** with hover-reveal details
- **Population & economic trend** visualizations

### 🔍 **Advanced Search & Navigation**
- **Fuzzy search** powered by Fuse.js across all content
- **Sticky scroll-spy navigation** with smooth anchor links
- **Citation system** with clickable references
- **Keyboard accessibility** throughout

### 📱 **Mobile-First Design**
- **Collapsible navigation** on mobile devices
- **Touch-optimized interactions** and gestures
- **Progressive enhancement** for all screen sizes

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | React 18 + TypeScript | Component architecture & type safety |
| **Build Tool** | Vite | Lightning-fast development & builds |
| **Styling** | Tailwind CSS | Utility-first styling with JIT compilation |
| **Charts** | Recharts | React-native responsive charts |
| **Animation** | Framer Motion | Smooth animations & page transitions |
| **Search** | Fuse.js | Fuzzy search functionality |
| **Icons** | Lucide React | Beautiful, consistent iconography |
| **Deployment** | GitHub Pages | Static hosting with automated deployment |

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tri-cities-market-report.git
cd tri-cities-market-report

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser to http://localhost:5173
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy

# Run linting
npm run lint
```

## 📁 Project Structure

```
tri-cities-market-report/
├── 📁 public/
│   └── favicon.svg               # Custom Tri-Cities favicon
├── 📁 src/
│   ├── 📁 components/           # React components
│   │   ├── HeroSection.tsx      # Animated hero with key metrics
│   │   ├── Navigation.tsx       # Sticky scroll-spy navigation
│   │   ├── SectionCard.tsx      # Content cards with TL;DR pills
│   │   ├── ChartBlock.tsx       # Interactive chart components
│   │   ├── SWOTQuadrant.tsx     # SWOT analysis visualization
│   │   ├── GlossaryDrawer.tsx   # Citations & references drawer
│   │   └── SearchModal.tsx      # Fuzzy search modal
│   ├── 📁 data/
│   │   └── report.json          # Structured report data
│   ├── 📁 types/
│   │   └── report.ts            # TypeScript interfaces
│   ├── 📁 utils/
│   │   └── cn.ts                # Class name utility
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles & Tailwind imports
├── package.json                 # Dependencies & scripts
├── tailwind.config.js           # Tailwind configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## 🎨 Design System

### Color Palette
- **ETSU Navy**: `#1e1b4b` → `#4f46e5` (Primary brand colors)
- **Boone Lake Teal**: `#042f2e` → `#14b8a6` (Accent colors)
- **Glass Morphism**: Semi-transparent overlays with backdrop blur

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, gradient text effects
- **Body**: Optimized for readability across devices

### Animations
- **Hero Counters**: 2-second count-up animations
- **Page Transitions**: Smooth fade & slide effects
- **Scroll Animations**: Progressive disclosure as user scrolls

## 📊 Data Structure

The report data is structured in `src/data/report.json`:

```typescript
interface ReportData {
  metadata: {
    title: string;
    subtitle: string;
    date: string;
    author: string;
  };
  keyMetrics: {
    populationGrowth: number;
    medianHomePrice: number;
    // ... other metrics
  };
  sections: Section[];
  citations: Citation[];
}
```

### Updating Report Data

1. **Edit the JSON**: Modify `src/data/report.json`
2. **Add Charts**: Include chart data in section objects
3. **Update Citations**: Add new references to citations array
4. **Rebuild**: Run `npm run build` to update the static site

## 🚀 Deployment

### Automated GitHub Pages Deployment

1. **Update package.json**: Set your GitHub username/repo name
```json
{
  "homepage": "https://yourusername.github.io/tri-cities-market-report"
}
```

2. **Deploy with one command**:
```bash
npm run deploy
```

This will:
- Build the production bundle
- Create/update the `gh-pages` branch
- Deploy to GitHub Pages automatically

### Manual Deployment

1. **Build the project**:
```bash
npm run build
```

2. **Deploy the `dist` folder** to any static hosting service (Netlify, Vercel, etc.)

## 🎯 Performance Optimizations

- **Code Splitting**: Vendor, charts, and animation libraries are split into separate chunks
- **Lazy Loading**: Heavy components load only when needed
- **Tree Shaking**: Unused code is eliminated from the final bundle
- **Image Optimization**: SVG icons and optimized assets
- **Minification**: Terser minification for production builds

## ♿ Accessibility Features

- **WCAG AA Compliance**: High contrast ratios and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and landmarks
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **Focus Management**: Clear focus indicators throughout

## 🔧 Customization

### Adding New Sections
1. Add section data to `src/data/report.json`
2. The app will automatically render new sections
3. Add charts by including `charts` array in section data

### Styling Changes
1. **Colors**: Update `tailwind.config.js` color palette
2. **Fonts**: Modify font imports in `src/index.css`
3. **Animations**: Customize Framer Motion variants in components

### Chart Types
Support for:
- **Bar Charts**: Population, employment data
- **Line Charts**: Trend analysis over time
- **Pie Charts**: Demographic breakdowns
- **Custom Components**: SWOT analysis quadrants

## 📈 Lighthouse Scores

Target performance metrics:
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Data Source**: Enhanced Market Research Report for the Tri-Cities Region
- **Author**: Grok 4 Private Beta, xAI Personal Assistant
- **Design Inspiration**: Modern data visualization and glass-morphism trends
- **Regional Focus**: Johnson City, Kingsport, Bristol, Tennessee

---

**Built with ❤️ for the Tri-Cities region** | [Live Demo](https://yourusername.github.io/tri-cities-market-report) | [Report Issues](https://github.com/yourusername/tri-cities-market-report/issues) 