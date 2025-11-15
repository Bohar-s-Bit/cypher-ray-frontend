// Performance monitoring utilities
export const measurePerformance = (name, fn) => {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  };
};

// Debounce function for expensive operations
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll/resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// IntersectionObserver for lazy loading components
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Memory usage monitoring (development only)
export const logMemoryUsage = () => {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = performance.memory;
    console.log(`[Memory] Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
    console.log(`[Memory] Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`);
    console.log(`[Memory] Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`);
  }
};

// Animation frame helper for smooth animations
export const createAnimationLoop = (callback) => {
  let rafId;
  let isRunning = false;
  
  const loop = (timestamp) => {
    if (isRunning) {
      callback(timestamp);
      rafId = requestAnimationFrame(loop);
    }
  };
  
  return {
    start: () => {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(loop);
      }
    },
    stop: () => {
      isRunning = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    isRunning: () => isRunning
  };
};