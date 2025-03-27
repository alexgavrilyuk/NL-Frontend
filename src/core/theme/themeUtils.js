// src/core/theme/themeUtils.js

/**
 * Theme Utilities
 *
 * Utility functions for applying theme values to CSS variables,
 * converting between color formats, and other theme-related helpers.
 */

/**
 * Applies theme values to CSS variables on the document root
 * @param {Object} theme - The theme object containing all theme values
 */
export const applyThemeToDocument = (theme) => {
  if (!theme || !theme.colors) return;

  const root = document.documentElement;

  // Helper to flatten nested objects with dot notation
  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const pre = prefix.length ? `${prefix}-` : '';
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
      } else {
        acc[`${pre}${key}`] = obj[key];
      }
      return acc;
    }, {});
  };

  // Apply colors as CSS variables
  const flattenedColors = flattenObject(theme.colors);
  Object.entries(flattenedColors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Apply spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Apply border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });

  // Apply shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });

  // Apply transitions
  Object.entries(theme.transitions).forEach(([key, value]) => {
    root.style.setProperty(`--transition-${key}`, value);
  });

  // Apply z-index values
  Object.entries(theme.zIndex).forEach(([key, value]) => {
    root.style.setProperty(`--z-${key}`, value);
  });

  // Apply typography
  Object.entries(theme.typography.fontSizes).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });

  Object.entries(theme.typography.fontWeights).forEach(([key, value]) => {
    root.style.setProperty(`--font-weight-${key}`, value);
  });

  Object.entries(theme.typography.lineHeights).forEach(([key, value]) => {
    root.style.setProperty(`--line-height-${key}`, value);
  });

  root.style.setProperty('--font-family', theme.typography.fontFamily);
};

/**
 * Gets a theme value from CSS variables
 * @param {string} property - The CSS variable name without the -- prefix
 * @returns {string} The value of the CSS variable
 */
export const getThemeValue = (property) => {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${property}`);
};

/**
 * Converts a hex color to RGBA
 * @param {string} hex - The hex color code
 * @param {number} alpha - The alpha value (0-1)
 * @returns {string} The RGBA color string
 */
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return '';

  // Remove # if present
  hex = hex.replace('#', '');

  // Convert short hex to full form
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default {
  applyThemeToDocument,
  getThemeValue,
  hexToRgba,
};