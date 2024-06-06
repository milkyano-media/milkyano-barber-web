import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import SmoothScrolling from './SmoothScrolling';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div style={{ height: "1px" }} className="font-inter h-px">
      <SmoothScrolling>
        <h1 className="hidden">Faded Lines Barber Shop</h1>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </SmoothScrolling>
    </div>
  );
};

export default Layout;
