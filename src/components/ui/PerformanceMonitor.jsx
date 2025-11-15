import { useEffect, useState } from 'react';

const PerformanceMonitor = ({ enabled = process.env.NODE_ENV === 'development' }) => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fps: 0
  });

  useEffect(() => {
    if (!enabled) return;

    // Monitor page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    
    // Monitor render time
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const renderEntry = entries.find(entry => entry.name === 'render');
      if (renderEntry) {
        setMetrics(prev => ({ ...prev, renderTime: renderEntry.duration }));
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });

    // Monitor FPS
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const currentFPS = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps: currentFPS }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);

    // Monitor memory usage
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memoryInfo = performance.memory;
        const memoryUsage = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    setMetrics(prev => ({ ...prev, loadTime: Math.round(loadTime) }));
    updateMemoryUsage();
    
    const memoryInterval = setInterval(updateMemoryUsage, 5000);

    return () => {
      observer.disconnect();
      clearInterval(memoryInterval);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-[9999] backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-2 min-w-[200px]">
        <div>Load Time:</div>
        <div>{metrics.loadTime}ms</div>
        
        <div>FPS:</div>
        <div className={metrics.fps < 30 ? 'text-red-400' : metrics.fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
          {metrics.fps}
        </div>
        
        <div>Memory:</div>
        <div className={metrics.memoryUsage > 100 ? 'text-red-400' : metrics.memoryUsage > 50 ? 'text-yellow-400' : 'text-green-400'}>
          {metrics.memoryUsage}MB
        </div>
        
        <div>Render:</div>
        <div>{metrics.renderTime.toFixed(2)}ms</div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;