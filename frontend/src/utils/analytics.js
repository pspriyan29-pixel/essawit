/**
 * Analytics Utilities
 * Track user behavior and application performance
 */

/**
 * Track page view
 */
export const trackPageView = (path, title = '') => {
  if (process.env.NODE_ENV === 'production') {
    // Integrate with analytics service (Google Analytics, Mixpanel, etc.)
    if (window.gtag) {
      window.gtag('config', process.env.VITE_GA_ID, {
        page_path: path,
        page_title: title,
      });
    }
  } else {
    console.log(`[Analytics] Page View: ${path}`, { title });
  }
};

/**
 * Track event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (process.env.NODE_ENV === 'production') {
    if (window.gtag) {
      window.gtag('event', eventName, eventParams);
    }
  } else {
    console.log(`[Analytics] Event: ${eventName}`, eventParams);
  }
};

/**
 * Track error
 */
export const trackError = (error, errorInfo = {}) => {
  if (process.env.NODE_ENV === 'production') {
    trackEvent('exception', {
      description: error.message || error.toString(),
      fatal: false,
      ...errorInfo,
    });
  } else {
    console.error(`[Analytics] Error:`, error, errorInfo);
  }
};

/**
 * Track user action
 */
export const trackUserAction = (action, details = {}) => {
  trackEvent('user_action', {
    action,
    ...details,
  });
};

/**
 * Track performance metric
 */
export const trackPerformance = (metricName, value, unit = 'ms') => {
  trackEvent('performance', {
    metric_name: metricName,
    value,
    unit,
  });
};

