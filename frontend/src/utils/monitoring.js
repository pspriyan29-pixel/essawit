/**
 * Application Monitoring
 * Monitor errors, performance, and user interactions
 */

import { trackError, trackPerformance } from './analytics';

/**
 * Error monitoring
 */
export const setupErrorMonitoring = () => {
  // Global error handler
  window.addEventListener('error', (event) => {
    trackError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    trackError(event.reason, {
      type: 'unhandledPromiseRejection',
    });
  });
};

/**
 * Performance monitoring
 */
export const setupPerformanceMonitoring = () => {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }

  // Monitor performance after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      
      if (perfData) {
        const metrics = {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          request: perfData.responseStart - perfData.requestStart,
          response: perfData.responseEnd - perfData.responseStart,
          dom: perfData.domComplete - perfData.domInteractive,
          load: perfData.loadEventEnd - perfData.fetchStart,
        };

        // Track each metric
        Object.keys(metrics).forEach((key) => {
          trackPerformance(key, metrics[key]);
        });
      }

      // Track Web Vitals if available
      if (window.performance.getEntriesByType) {
        const paintEntries = window.performance.getEntriesByType('paint');
        paintEntries.forEach((entry) => {
          trackPerformance(entry.name, entry.startTime);
        });
      }
    }, 0);
  });
};

/**
 * API call monitoring
 */
export const monitorAPICall = async (apiCall, endpoint) => {
  const startTime = performance.now();
  
  try {
    const response = await apiCall();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackPerformance(`api_${endpoint}`, duration);
    
    return response;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    trackPerformance(`api_${endpoint}_error`, duration);
    trackError(error, { endpoint, duration });
    
    throw error;
  }
};

/**
 * Initialize monitoring
 */
export const initializeMonitoring = () => {
  setupErrorMonitoring();
  setupPerformanceMonitoring();
};

