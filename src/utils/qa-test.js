// QA Testing Script - Run this to verify site performance and accessibility

// This script performs automated tests to verify site performance and accessibility
// It should be run in the browser console on the live site

/**
 * Karni Exim Website Quality Assurance Testing Suite
 * Date: June 10, 2025
 */
(function() {
  console.log('Running Karni Exim Website QA Tests...');
  console.log('=====================================');

  // Performance Tests
  const performanceTests = () => {
    console.log('\n📊 PERFORMANCE TESTS');
    console.log('-------------------');
    
    // Measure loading time
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
      const renderTime = timing.domComplete - timing.domLoading;
      
      console.log(`✓ Page Load Time: ${Math.round(pageLoadTime)}ms`);
      console.log(`✓ DOM Ready Time: ${Math.round(domReadyTime)}ms`);
      console.log(`✓ Render Time: ${Math.round(renderTime)}ms`);
      
      // Add performance assessment
      if (pageLoadTime < 2000) {
        console.log('✅ Page load time is excellent (< 2s)');
      } else if (pageLoadTime < 4000) {
        console.log('✓ Page load time is good (< 4s)');
      } else {
        console.log('⚠️ Page load time is above recommended threshold (> 4s)');
      }
    }
    
    // Check lazy-loaded images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    console.log(`✓ Found ${lazyImages.length} lazy-loaded images`);
    
    // Check for render-blocking resources
    const renderBlockingResources = performance.getEntriesByType('resource')
      .filter(resource => {
        return (
          resource.initiatorType === 'script' || 
          resource.initiatorType === 'link'
        ) && resource.responseEnd > window.performance.timing.domContentLoadedEventStart - window.performance.timing.navigationStart;
      });
    
    console.log(`${renderBlockingResources.length > 0 ? '⚠️' : '✅'} Found ${renderBlockingResources.length} render-blocking resources`);
    
    // Measure image optimization
    const images = document.querySelectorAll('img');
    let optimizedImages = 0;
    let unoptimizedImages = 0;
    
    images.forEach(img => {
      if (img.getAttribute('loading') === 'lazy' && 
          img.getAttribute('decoding') === 'async') {
        optimizedImages++;
      } else {
        unoptimizedImages++;
      }
    });
    
    console.log(`✓ Image Optimization: ${optimizedImages} optimized, ${unoptimizedImages} unoptimized`);
    
    // LCP (Largest Contentful Paint) measurement if available
    if (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
      const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0];
      if (lcpEntry) {
        const lcpTime = lcpEntry.startTime;
        console.log(`✓ Largest Contentful Paint: ${Math.round(lcpTime)}ms`);
        
        if (lcpTime < 2500) {
          console.log('✅ LCP is good (< 2.5s)');
        } else {
          console.log('⚠️ LCP needs improvement (> 2.5s)');
        }
      }
    }
  };
  
  // Accessibility Tests
  const accessibilityTests = () => {
    console.log('\n♿ ACCESSIBILITY TESTS');
    console.log('--------------------');
    
    // Check for alt text on images
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
    console.log(`${imagesWithoutAlt.length === 0 ? '✅' : '⚠️'} Images without alt text: ${imagesWithoutAlt.length}/${images.length}`);
    
    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName[1]));
    let headingHierarchyValid = true;
    
    for (let i = 0; i < headingLevels.length - 1; i++) {
      if (headingLevels[i+1] > headingLevels[i] + 1) {
        headingHierarchyValid = false;
        break;
      }
    }
    
    console.log(`${headingHierarchyValid ? '✅' : '⚠️'} Heading hierarchy is ${headingHierarchyValid ? 'valid' : 'not valid'}`);
    
    // Check form elements for labels
    const formElements = document.querySelectorAll('input, select, textarea');
    let formElementsWithoutLabels = 0;
    
    formElements.forEach(el => {
      const hasExplicitLabel = document.querySelector(`label[for="${el.id}"]`);
      const hasAriaLabel = el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');
      
      if (!hasExplicitLabel && !hasAriaLabel && el.type !== 'hidden') {
        formElementsWithoutLabels++;
      }
    });
    
    console.log(`${formElementsWithoutLabels === 0 ? '✅' : '⚠️'} Form elements without labels: ${formElementsWithoutLabels}/${formElements.length}`);
    
    // Check for keyboard accessibility
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    const tabbableElements = Array.from(interactiveElements).filter(el => {
      const tabindex = el.getAttribute('tabindex');
      return tabindex === null || parseInt(tabindex) >= 0;
    });
    
    console.log(`✓ Keyboard navigable elements: ${tabbableElements.length}`);
    
    // Check for ARIA roles on interactive elements
    const elementsWithoutRoles = Array.from(interactiveElements).filter(el => {
      return !el.hasAttribute('role') && !el.tagName.match(/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/i);
    });
    
    console.log(`${elementsWithoutRoles.length === 0 ? '✅' : '⚠️'} Interactive elements without ARIA roles: ${elementsWithoutRoles.length}`);
    
    // Check for color contrast (if utility is loaded)
    if (window.KarniAccessibility && window.KarniAccessibility.generateColorContrastReport) {
      console.log('\n🎨 COLOR CONTRAST REPORT');
      window.KarniAccessibility.generateColorContrastReport();
    }
  };
  
  // UI/UX Tests
  const uiTests = () => {
    console.log('\n🎨 UI/UX TESTS');
    console.log('--------------');
    
    // Check for responsive viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    console.log(`${viewportMeta ? '✅' : '⚠️'} Viewport meta tag: ${viewportMeta ? 'Present' : 'Missing'}`);
    
    // Check for touch targets size (minimum 44x44 pixels)
    const smallTargets = [];
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    
    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        smallTargets.push(el);
      }
    });
    
    console.log(`${smallTargets.length === 0 ? '✅' : '⚠️'} Small touch targets: ${smallTargets.length}/${interactiveElements.length}`);
    
    // Check for proper focus styles
    console.log('ℹ️ Manual check required: Verify focus styles are visible when tabbing through the interface');
    
    // Check for proper color scheme in CSS
    const hasBrandColors = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-saffron').trim() !== '';
    
    console.log(`${hasBrandColors ? '✅' : '⚠️'} Brand color variables: ${hasBrandColors ? 'Defined' : 'Not defined'}`);
  };
  
  // Function to check cross-browser compatibility
  const browserCompatibility = () => {
    console.log('\n🌐 BROWSER COMPATIBILITY');
    console.log('----------------------');
    
    const userAgent = navigator.userAgent;
    console.log(`Current browser: ${userAgent}`);
    
    // Check for CSS Grid support
    const supportsGrid = CSS.supports('display', 'grid');
    console.log(`CSS Grid Support: ${supportsGrid ? 'Yes ✅' : 'No ⚠️'}`);
    
    // Check for Flexbox support
    const supportsFlex = CSS.supports('display', 'flex');
    console.log(`Flexbox Support: ${supportsFlex ? 'Yes ✅' : 'No ⚠️'}`);
    
    // Check for fetch API
    const supportsFetch = 'fetch' in window;
    console.log(`Fetch API Support: ${supportsFetch ? 'Yes ✅' : 'No ⚠️'}`);
    
    console.log('ℹ️ Manual check required: Test in Chrome, Firefox, Safari, and Edge');
  };
  
  // Function to test mobile responsiveness
  const mobileResponsiveness = () => {
    console.log('\n📱 MOBILE RESPONSIVENESS');
    console.log('----------------------');
    
    // Check viewport size
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    console.log(`Current viewport: ${viewportWidth}x${viewportHeight}`);
    
    // Check for horizontal scrolling
    const docWidth = document.documentElement.offsetWidth;
    const windowWidth = window.innerWidth;
    const hasHorizontalScroll = docWidth > windowWidth;
    
    console.log(`${!hasHorizontalScroll ? '✅' : '⚠️'} Horizontal scrolling: ${hasHorizontalScroll ? 'Present (issue)' : 'Not present (good)'}`);
    
    // Check for media queries
    const hasMediaQueries = window.matchMedia('(max-width: 768px)').matches !== undefined;
    console.log(`Media Queries Support: ${hasMediaQueries ? 'Yes ✅' : 'No ⚠️'}`);
    
    console.log('ℹ️ Manual check required: Test on actual mobile devices or using Chrome DevTools device emulation');
  };
  
  // Run all tests
  performanceTests();
  accessibilityTests();
  uiTests();
  browserCompatibility();
  mobileResponsiveness();
  
  console.log('\n✅ QA TESTING COMPLETE');
  console.log('Please review any warnings or issues and address them before final release.');

})();
