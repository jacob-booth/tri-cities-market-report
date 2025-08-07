// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string): void {
    this.metrics.set(`${name}_start`, performance.now());
  }

  endTimer(name: string): number {
    const startTime = this.metrics.get(`${name}_start`);
    if (!startTime) {
      console.warn(`Timer '${name}' was not started`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    this.metrics.set(name, duration);
    this.metrics.delete(`${name}_start`);
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      if (!key.endsWith('_start')) {
        result[key] = value;
      }
    });
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Web Vitals monitoring
export class WebVitalsMonitor {
  private static instance: WebVitalsMonitor;

  static getInstance(): WebVitalsMonitor {
    if (!WebVitalsMonitor.instance) {
      WebVitalsMonitor.instance = new WebVitalsMonitor();
    }
    return WebVitalsMonitor.instance;
  }

  measureLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 LCP:', lastEntry.startTime);
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  measureFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('⚡ FID:', entry.processingStart - entry.startTime);
          }
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  measureCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('📏 CLS:', clsValue);
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }
}

// Bundle size monitoring
export const getBundleSize = (): void => {
  if (process.env.NODE_ENV === 'development') {
    // This would typically be done at build time
    console.log('📦 Bundle size monitoring enabled');
  }
};

// Memory usage monitoring
export const getMemoryUsage = (): void => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    if (process.env.NODE_ENV === 'development') {
      console.log('🧠 Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`,
      });
    }
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = (): void => {
  const webVitals = WebVitalsMonitor.getInstance();
  webVitals.measureLCP();
  webVitals.measureFID();
  webVitals.measureCLS();
  
  // Monitor memory usage periodically
  setInterval(getMemoryUsage, 30000); // Every 30 seconds
};
