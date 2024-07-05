import React, { ReactNode, useEffect } from 'react';
import WebHeader from '@/components/web/WebHeader';
import WebFooter from '@/components/web/WebFooter';
import { useGtm } from '../hooks/UseGtm';
import { useLocation } from 'react-router-dom';


const WebLayout: React.FC<{ children: ReactNode }> = ({ children }) => {

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
    <div className={` font-inter h-px`}>
      <h1 className="hidden">Faded Lines Barber Shop</h1>
      <WebHeader />
      <main className="">
        {children}
      </main>
      <WebFooter />
    </div>
  );
};

export default WebLayout;