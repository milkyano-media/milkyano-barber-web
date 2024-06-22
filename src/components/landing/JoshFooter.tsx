import React from 'react';
import backgroundImage from '@/assets/landing/footer_line.svg';

const JoshFooter: React.FC = () => {
  return (
    <footer className="bg-transparent backdrop-blur-lg text-stone-50 py-12 relative z-40 "
      style={{ backgroundImage: `url("${backgroundImage}")`, backgroundSize: 'cover', backgroundRepeat: "center", backdropFilter: 'blur(16px) contrast(100%)', WebkitBackdropFilter: 'blur(16px) contrast(100%)' }}
    >
      <div className='flex justify-center flex-col items-center py-12 md:py-0'>

        <p className="text-center text-sm w-1/2 md:w-full">© 2021 Faded Lines Barber Shop. All rights reserved</p>
      </div>
    </footer>
  );
};

export default JoshFooter;
