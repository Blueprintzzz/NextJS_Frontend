'use client';

import { useEffect, useState } from 'react';

export function ScrollIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-2 top-1/2 -translate-y-1/2 w-1 h-32 bg-gray-200 rounded-full overflow-hidden z-40 hidden md:block">
      <div
        className="w-full bg-teal-600 rounded-full transition-all duration-150"
        style={{ height: `${progress}%` }}
      />
    </div>
  );
}