import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGtm } from '../hooks/UseGtm';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingHeader from './LandingHeader';

const LandingLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { sendEvent } = useGtm();

  useEffect(() => {
    sendEvent({
      event: 'route_event',
      path: location.pathname
    });

    window.scrollTo(0, 0);
  }, [location.pathname, sendEvent]);

  return (
    <div className="font-inter" style={{ minHeight: '100vh' }}>
      <h1 className="hidden">Faded Lines Barber Shop</h1>
      <LandingHeader />
      <main>
        {children}
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingLayout;
