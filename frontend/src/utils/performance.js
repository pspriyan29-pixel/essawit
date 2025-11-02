/**
 * Performance Utilities
 * Tools for monitoring and optimizing application performance
 */

/**
 * Measure execution time of a function
 */
export const measurePerformance = async (fn, label = 'Function') => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
  }
  
  return { result, duration };
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Lazy load image
 */
export const lazyLoadImage = (img, src) => {
  return new Promise((resolve, reject) => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
          img.onload = () => {
            observer.unobserve(img);
            resolve(img);
          };
          img.onerror = reject;
        }
      });
    });
    
    imageObserver.observe(img);
  });
};

/**
 * Preload resources
 */
export const preloadResource = (href, as = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

/**
 * Monitor Web Vitals
 */
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

/**
 * Check if browser supports features
 */
export const checkBrowserSupport = () => {
  const features = {
    fetch: typeof fetch !== 'undefined',
    localStorage: typeof Storage !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    pushNotifications: 'PushManager' in window,
    geolocation: 'geolocation' in navigator,
  };
  
  return features;
};

/**
 * Optimize images
 */
export const optimizeImage = (src, width, height, quality = 80) => {
  // In production, use image CDN or optimization service
  if (process.env.NODE_ENV === 'production') {
    // Example: Cloudinary, Imgix, etc.
    return `${src}?w=${width}&h=${height}&q=${quality}`;
  }
  return src;
};

/**
 * Performance metrics collector
 */
export const collectMetrics = () => {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  
  const metrics = {
    dns: navigation.dnsEnd - navigation.dnsStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    request: navigation.responseStart - navigation.requestStart,
    response: navigation.responseEnd - navigation.responseStart,
    dom: navigation.domComplete - navigation.domInteractive,
    load: navigation.loadEventEnd - navigation.fetchStart,
    fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
  };

  return metrics;
};

