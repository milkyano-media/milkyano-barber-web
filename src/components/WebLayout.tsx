import React, { ReactNode } from 'react';
import WebHeader from './WebHeader';
import WebFooter from './WebFooter';

const WebLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
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