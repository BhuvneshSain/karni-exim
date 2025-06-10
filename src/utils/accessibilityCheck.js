/**
 * Karni Exim Accessibility Utilities
 * 
 * This file contains helper functions for ensuring accessibility across the site.
 */

/**
 * Checks if a color combination meets WCAG contrast requirements.
 * @param {string} foreground - Foreground color in hex format (#RRGGBB)
 * @param {string} background - Background color in hex format (#RRGGBB)
 * @param {string} level - WCAG level ('AA' or 'AAA')
 * @param {string} fontSize - Font size category ('normal' or 'large')
 * @returns {boolean} Whether the contrast meets the requirements
 */
export const checkColorContrast = (foreground, background, level = 'AA', fontSize = 'normal') => {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate luminance
  const luminance = (rgb) => {
    const { r, g, b } = rgb;
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  // Calculate contrast ratio
  const calculateContrast = (lum1, lum2) => {
    const lightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (lightest + 0.05) / (darkest + 0.05);
  };

  // Get luminance values
  const fgLuminance = luminance(hexToRgb(foreground));
  const bgLuminance = luminance(hexToRgb(background));
  
  // Calculate contrast ratio
  const contrastRatio = calculateContrast(fgLuminance, bgLuminance);
  
  // Check against WCAG requirements
  if (level === 'AAA') {
    return fontSize === 'large' ? contrastRatio >= 4.5 : contrastRatio >= 7;
  } else { // AA
    return fontSize === 'large' ? contrastRatio >= 3 : contrastRatio >= 4.5;
  }
};

/**
 * Show accessibility report for main brand colors
 */
export const generateColorContrastReport = () => {
  const brandColors = {
    saffron: '#EBB924',
    charcoalDark: '#344C5D',
    charcoalLight: '#3A5161',
    beige: '#FEFBE3',
    cornsilk: '#FFFCE4',
    gray: '#798789',
    white: '#FFFFFF',
    black: '#000000'
  };

  const contrastPairs = [
    { fg: 'white', bg: 'charcoalDark', context: 'White text on Charcoal Dark (nav/footer)' },
    { fg: 'white', bg: 'charcoalLight', context: 'White text on Charcoal Light' },
    { fg: 'saffron', bg: 'charcoalDark', context: 'Saffron on Charcoal Dark' },
    { fg: 'charcoalDark', bg: 'beige', context: 'Charcoal text on Beige background' },
    { fg: 'charcoalDark', bg: 'cornsilk', context: 'Charcoal text on Cornsilk background' },
    { fg: 'charcoalDark', bg: 'saffron', context: 'Charcoal text on Saffron (buttons)' },
    { fg: 'charcoalDark', bg: 'white', context: 'Charcoal text on White (cards)' },
    { fg: 'gray', bg: 'white', context: 'Gray text on White (secondary text)' },
    { fg: 'gray', bg: 'beige', context: 'Gray text on Beige' }
  ];
  
  console.log('KARNI EXIM - ACCESSIBILITY COLOR CONTRAST REPORT');
  console.log('================================================');
  
  contrastPairs.forEach(pair => {
    const ratio = calculateContrast(brandColors[pair.fg], brandColors[pair.bg]);
    const aaSmall = ratio >= 4.5 ? 'PASS' : 'FAIL';
    const aaLarge = ratio >= 3 ? 'PASS' : 'FAIL';
    const aaaSmall = ratio >= 7 ? 'PASS' : 'FAIL';
    const aaaLarge = ratio >= 4.5 ? 'PASS' : 'FAIL';
    
    console.log(`${pair.context}:`);
    console.log(`  Contrast ratio: ${ratio.toFixed(2)}:1`);
    console.log(`  WCAG AA:  Small text: ${aaSmall}, Large text: ${aaLarge}`);
    console.log(`  WCAG AAA: Small text: ${aaaSmall}, Large text: ${aaaLarge}`);
    console.log('------------------------------------------------');
  });
  
  function calculateContrast(color1, color2) {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const lightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (lightest + 0.05) / (darkest + 0.05);
  }
  
  function getLuminance(hexColor) {
    const rgb = hexToRgb(hexColor);
    const a = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
  
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }
};

/**
 * Check if elements have proper ARIA attributes
 * @param {HTMLElement} element - DOM element to check
 * @returns {Object} - Object containing identified issues
 */
export const checkAriaAttributes = (element) => {
  const issues = [];
  
  // Check for interactive elements without aria roles
  const interactiveElements = element.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach(el => {
    if (!el.hasAttribute('role') && !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      if (el.textContent.trim() === '') {
        issues.push({
          element: el,
          issue: 'Interactive element without accessible name',
          recommendation: 'Add aria-label or aria-labelledby attribute'
        });
      }
    }
  });
  
  // Check for images without alt text
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        element: img,
        issue: 'Image without alt text',
        recommendation: 'Add descriptive alt attribute'
      });
    }
  });
  
  // Check for form elements without labels
  const formElements = element.querySelectorAll('input, select, textarea');
  formElements.forEach(formEl => {
    let hasLabel = false;
    
    // Check for explicit label
    if (formEl.id) {
      const labels = element.querySelectorAll(`label[for="${formEl.id}"]`);
      if (labels.length > 0) {
        hasLabel = true;
      }
    }
    
    // Check for aria-label or aria-labelledby
    if (formEl.hasAttribute('aria-label') || formEl.hasAttribute('aria-labelledby')) {
      hasLabel = true;
    }
    
    if (!hasLabel) {
      issues.push({
        element: formEl,
        issue: 'Form element without associated label',
        recommendation: 'Add a label element with matching "for" attribute or aria-label'
      });
    }
  });
  
  return { issues, count: issues.length };
};

/**
 * Add these accessibility checkers to the window object when in development
 */
if (import.meta.env.DEV) {
  window.KarniAccessibility = {
    checkColorContrast,
    generateColorContrastReport,
    checkAriaAttributes,
  };
  
  console.log('Karni Exim Accessibility tools are available in development mode.');
  console.log('Try running: window.KarniAccessibility.generateColorContrastReport()');
}
