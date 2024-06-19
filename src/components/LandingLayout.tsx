import React, { ReactNode } from 'react';
import JoshHeader from './JoshHeader';
import JoshFooter from './JoshFooter';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div style={{ height: "1px" }} className="font-inter h-px">
      {/* <SmoothScrolling> */}
        <h1 className="hidden">Faded Lines Barber Shop</h1>
        <JoshHeader />
        <main>
          {children}
        </main>
        <JoshFooter/>
    </div>
  );
};

export default Layout;
