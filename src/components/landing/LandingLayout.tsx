import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGtm } from '../hooks/UseGtm';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingHeader from './LandingHeader';

const LandingLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { sendEvent } = useGtm();

  useEffect(() => {
    if (location.pathname == "/thank-you") {
      sendEvent({
        event: 'purchase_event',
        value: localStorage.getItem('purchaseValue'),
        Currency: 'AUD'
      });
    }
    sendEvent({
      event: 'route_event',
      path: location.pathname
    });
  }, [location.pathname, sendEvent]);

  return (
    <div style={{ height: "1px" }} className="font-inter h-px">
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
