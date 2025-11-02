import { useEffect } from 'react';
import { setPageTitle, setPageDescription, setOpenGraph, setCanonicalUrl } from '../utils/seo';

/**
 * Custom hook for SEO management
 * @param {object} seoData - SEO data
 */
const useSEO = (seoData) => {
  const {
    title,
    description,
    image,
    url,
    noindex = false,
  } = seoData || {};

  useEffect(() => {
    // Set page title
    if (title) {
      setPageTitle(title);
    }

    // Set meta description
    if (description) {
      setPageDescription(description);
    }

    // Set Open Graph tags
    if (title || description || image || url) {
      setOpenGraph({
        title,
        description,
        image,
        url,
      });
    }

    // Set canonical URL
    if (url) {
      setCanonicalUrl(url);
    }

    // Set robots meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else if (robotsMeta) {
      robotsMeta.setAttribute('content', 'index, follow');
    }

    // Cleanup
    return () => {
      // Reset title on unmount
      setPageTitle('');
    };
  }, [title, description, image, url, noindex]);
};

export default useSEO;

