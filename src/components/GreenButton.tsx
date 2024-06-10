import React from 'react';

interface GreenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GreenButton: React.FC<GreenButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className=" h-[40px] w-[150px] bg-transparent font-bold text-white border border-[#24FF00]  rounded-3xl hover:text-black hover:bg-[#24FF00] hover:drop-shadow-[0_3px_3px_#24FF00] hover:scale-110 transition delay-100"
      {...props}
    >
      {children}
    </button>
  );
};

export default GreenButton;
