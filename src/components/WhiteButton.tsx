import React from 'react';

interface GreenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const WhiteButton: React.FC<GreenButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className=" h-[40px] w-[150px] backdrop-blur-lg bg-transparent text-white border border-white  rounded-3xl hover:text-black hover:bg-white hover:drop-shadow-[0_3px_3px_white] hover:scale-110 transition delay-100"
      {...props}
    >
      {children}
    </button>
  );
};

export default WhiteButton;
