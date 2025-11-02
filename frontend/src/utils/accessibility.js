/**
 * Accessibility Utilities
 */

/**
 * Handle keyboard navigation
 * @param {function} callback - Callback function
 * @param {string[]} keys - Keys to trigger callback (default: ['Enter', ' '])
 */
export const handleKeyboard = (callback, keys = ['Enter', ' ']) => {
  return (e) => {
    if (keys.includes(e.key)) {
      e.preventDefault();
      callback();
    }
  };
};

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Priority level ('polite' | 'assertive')
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  
  document.body.appendChild(announcer);
  
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
};

/**
 * Focus trap for modal/dialog
 * @param {HTMLElement} container - Container element
 * @param {HTMLElement} initialFocus - Element to focus initially
 */
export const createFocusTrap = (container, initialFocus) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (initialFocus) {
    initialFocus.focus();
  } else if (firstElement) {
    firstElement.focus();
  }

  const handleTab = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTab);

  return () => {
    container.removeEventListener('keydown', handleTab);
  };
};

/**
 * Skip to main content link
 */
export const addSkipToContentLink = () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary-600 focus:text-white focus:rounded-lg';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);
};

