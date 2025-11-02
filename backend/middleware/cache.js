/**
 * Response Caching Middleware
 * Cache responses for GET requests to improve performance
 */

import NodeCache from 'node-cache';

// Create cache instance with 10 minutes TTL
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

/**
 * Cache middleware
 * @param {number} duration - Cache duration in seconds (default: 10 minutes)
 */
export const cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedData = cache.get(key);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to cache response
    res.json = function(data) {
      cache.set(key, data, duration);
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clear cache for specific key
 */
export const clearCache = (key) => {
  cache.del(key);
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  cache.flushAll();
};

/**
 * Get cache stats
 */
export const getCacheStats = () => {
  return cache.getStats();
};

export default cache;

