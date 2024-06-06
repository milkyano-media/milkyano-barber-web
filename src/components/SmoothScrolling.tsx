import React, { useEffect } from 'react';

const SmoothScrolling: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      event.preventDefault();
      window.scrollBy({
        top: event.deltaY < 0 ? -50 : 50,
        behavior: 'smooth',
      });
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => window.removeEventListener('wheel', handleScroll);
  }, []);

  return <>{children}</>;
};

export default SmoothScrolling;
