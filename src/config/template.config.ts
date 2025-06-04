/**
 * Template Configuration
 * 
 * This file contains all the configurable settings for the market report template.
 * Modify these values to customize the template for different markets and use cases.
 */

export const TEMPLATE_CONFIG = {
  // Brand Configuration
  brand: {
    name: 'BOOTH',
    tagline: 'Comprehensive Market Research & Strategic Analysis',
    logo: '/booth-logo.svg',
    favicon: '/favicon.svg',
    colors: {
      primary: '#0f766e', // Teal-700
      secondary: '#14b8a6', // Teal-500
      accent: '#2dd4bf', // Teal-400
    }
  },

  // Report Configuration
  report: {
    title: 'Comprehensive Market Research Report',
    subtitle: 'Tri-Cities Residential Real Estate Market Analysis',
    author: 'BOOTH Research Team',
    version: '2.1.1',
    
    // Navigation sections
    sections: [
      { id: 'executive-summary', label: 'Executive Summary' },
      { id: 'demographics', label: 'Regional Demographics' },
      { id: 'economic-overview', label: 'Economic Landscape' },
      { id: 'housing-market', label: 'Residential Real Estate' },
    ]
  },

  // Fact-checking Configuration
  factCheck: {
    enabled: true,
    confidenceThresholds: {
      high: 80,
      medium: 60,
      low: 40
    },
    statusColors: {
      verified: 'green',
      'partially-verified': 'yellow',
      'needs-verification': 'orange',
      'needs-context': 'orange',
      'needs-clarification': 'orange',
      'needs-correction': 'red',
      inaccurate: 'red',
      unverified: 'gray'
    }
  },

  // UI Configuration
  ui: {
    // Animation settings
    animations: {
      enabled: true,
      duration: 0.6,
      stagger: 0.1
    },
    
    // Theme settings
    theme: {
      defaultMode: 'light', // 'light' | 'dark' | 'system'
      allowToggle: true
    },
    
    // Layout settings
    layout: {
      maxWidth: '1200px',
      padding: '1rem',
      cardSpacing: '2rem'
    }
  },

  // Features Configuration
  features: {
    search: {
      enabled: true,
      placeholder: 'Search report content...',
      minQueryLength: 2
    },
    
    glossary: {
      enabled: true,
      autoHighlight: true
    },
    
    charts: {
      enabled: true,
      defaultColors: ['#0f766e', '#14b8a6', '#2dd4bf', '#99f6e4'],
      animations: true
    },
    
    swotAnalysis: {
      enabled: true,
      icons: {
        strengths: '✓',
        weaknesses: '!',
        opportunities: '+',
        threats: '⚠'
      }
    }
  },

  // SEO Configuration
  seo: {
    title: 'BOOTH | Tri-Cities Market Research',
    description: 'Interactive market research report for the Tri-Cities region featuring comprehensive analysis of demographics, economics, and real estate trends.',
    keywords: 'Tri-Cities, Tennessee, market research, Johnson City, Kingsport, Bristol, real estate, demographics, economic analysis',
    author: 'BOOTH Research Team',
    ogImage: '/booth-logo.png'
  },

  // Analytics Configuration
  analytics: {
    enabled: false, // Set to true and add your tracking IDs
    googleAnalytics: '',
    mixpanel: '',
    hotjar: ''
  }
};

// Type definitions for better TypeScript support
export type TemplateConfig = typeof TEMPLATE_CONFIG;
export type BrandConfig = typeof TEMPLATE_CONFIG.brand;
export type ReportConfig = typeof TEMPLATE_CONFIG.report;
export type FactCheckConfig = typeof TEMPLATE_CONFIG.factCheck;
export type UIConfig = typeof TEMPLATE_CONFIG.ui;
export type FeaturesConfig = typeof TEMPLATE_CONFIG.features; 