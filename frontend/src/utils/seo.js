/**
 * SEO Utilities
 */

/**
 * Set page title
 * @param {string} title - Page title
 */
export const setPageTitle = (title) => {
  const baseTitle = 'NusaPalma';
  document.title = title ? `${title} - ${baseTitle}` : baseTitle;
};

/**
 * Set page meta description
 * @param {string} description - Meta description
 */
export const setPageDescription = (description) => {
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', description);
};

/**
 * Set Open Graph meta tags
 * @param {object} data - Open Graph data
 */
export const setOpenGraph = (data) => {
  const { title, description, image, url } = data;
  
  const ogTags = {
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url || window.location.href,
    'og:type': 'website',
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    if (!content) return;
    
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });
};

/**
 * Set canonical URL
 * @param {string} url - Canonical URL
 */
export const setCanonicalUrl = (url) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url || window.location.href);
};

