import React, { ReactNode } from 'react';
import JoshHeader from '@/components/landing/JoshHeader';
import JoshFooter from '@/components/landing/JoshFooter';

const LandingLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div style={{ height: "1px" }} className="font-inter h-px">
      {/* <SmoothScrolling> */}
      <h1 className="hidden">Faded Lines Barber Shop</h1>
      <JoshHeader />
      <main>
        {children}
      </main>
      <JoshFooter />
    </div>
  );
};

export default LandingLayout;
