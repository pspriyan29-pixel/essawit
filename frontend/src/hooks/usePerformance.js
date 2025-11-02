/**
 * usePerformance Hook
 * Custom hook for performance monitoring
 */

import { useEffect, useRef, useState } from 'react';
import { collectMetrics, measurePerformance } from '../utils/performance';

export const usePerformance = () => {
  const [metrics, setMetrics] = useState(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      
      // Collect initial metrics
      if (typeof window !== 'undefined') {
        const initialMetrics = collectMetrics();
        setMetrics(initialMetrics);
        
        // Log metrics in development
        if (process.env.NODE_ENV === 'development' && initialMetrics) {
          console.log('[Performance Metrics]', initialMetrics);
        }
      }
    }
  }, []);

  const measure = async (fn, label) => {
    return await measurePerformance(fn, label);
  };

  return { metrics, measure };
};

/**
 * useLazyLoad Hook
 * Lazy load images and components
 */
export const useLazyLoad = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isIntersecting];
};

