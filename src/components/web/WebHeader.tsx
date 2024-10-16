import React, { useState } from 'react';
import Logo from "@/components/react-svg/logo"
import { Link, useLocation } from 'react-router-dom';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"

// import { Squash as Hamburger } from 'hamburger-react'
import Hamburger from '@/components/hamburger'

import Facebook from "@/assets/web/icons/Facebook.svg"
import Instagram from "@/assets/web/icons/Instagram.svg"
import Tiktok from "@/assets/web/icons/Tiktok.svg"
import Youtube from "@/assets/web/icons/Youtube.svg"

interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label }) => {

  const location = useLocation()

  return (
    <li className='my-4'>
      <Link to={to} className={`text-2xl font-light hover:text-stone-50 ${location.pathname === to ? 'text-stone-50' : ''}`}>
        {label}
      </Link>
    </li>
  );
};

const links = [
  { to: "/", label: "Home" },
  { to: "/barbers", label: "Barbers" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about-us", label: "About Us" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const generateRoute = (route: string): string => {
    const parts = location.pathname.split("/");
    if (parts[1] === 'meta') {
      return `/meta${route}`;
    }
    else {
      return route;
    }
  }

  return (
    <header className="bg-black text-white  shadow-lg shadow-black border-none z-[999999999999999] py-4 sticky top-0 ">
      <div className="container mx-auto flex justify-between items-center relative z-10 border-none px-2 md:px-4">
        <h1 className="text-2xl font-bold text-transparent hidden ">Barber Shop</h1>
        <div className='flex flex-col justify-center items-center'>
          <Link to={generateRoute("/home")}  >
            <Logo className='w-48 md:w-[12rem] h-auto opacity-90 ' />
          </Link>
        </div>
        <nav className='hidden lg:block sticky top-0'>
          <ul className="flex text-stone-600 ">
            <li>
              <Link to={generateRoute("/home")} className={`text-md uppercase font-bold border-r border-stone-50 px-4 hover:text-stone-50 ${location.pathname === '/' ? 'text-stone-50' : ''}`}>HOME</Link>
            </li>
            <li>
              <Link to={generateRoute("/barbers")} className={`text-md uppercase font-bold border-r border-stone-50 px-4 hover:text-stone-50 ${location.pathname === '/barbers' ? 'text-stone-50' : ''}`}>BARBERS/HAIRDRESSERS</Link>
            </li>
            <li>
              <Link to={generateRoute("/gallery")} className={`text-md uppercase font-bold border-r border-stone-50 px-4 hover:text-stone-50 ${location.pathname === '/gallery' ? 'text-stone-50' : ''}`}>GALLERY</Link>
            </li>
            <li>
              <Link to={generateRoute("/about-us")} className={`text-md uppercase font-bold border-r border-stone-50 px-4 hover:text-stone-50 ${location.pathname === '/about-us' ? 'text-stone-50' : ''}`}>ABOUT US</Link>
            </li>
            <li>
              <Link to={generateRoute("/careers")} className={`text-md uppercase font-bold   px-4 border-r border-stone-50 hover:text-stone-50 ${location.pathname === '/careers' ? 'text-stone-50' : ''}`}>Careers</Link>
            </li>
            <li>
              <Link to={generateRoute("/contact")} className={`text-md uppercase font-bold   px-4 hover:text-stone-50 ${location.pathname === '/contact' ? 'text-stone-50' : ''}`}>CONTACT</Link>
            </li>
          </ul>
        </nav>
        <nav className='hidden xl:block'>
          <ul className="flex gap-7 ">
            <li>
              <a href="https://www.instagram.com/fadedlinesbarbershop/" className="text-md uppercase font-bold hover:text-stone-50 opacity-40 hover:opacity-100 ">
                <img alt='instagram' src={Instagram} className='w-10 h-auto' />
              </a>
            </li>

            <li>
              <a href="https://www.facebook.com/p/Faded-Lines-Barbershop-100066737611092/" className="text-md uppercase font-bold hover:text-stone-50 opacity-40 hover:opacity-100 ">
                <img width={500} height={500} alt='Facebook' src={Facebook} className='w-10 h-auto' />
              </a>
            </li>

            <li>

              <a href="https://www.tiktok.com/@faded_lines" className="text-md uppercase font-bold hover:text-stone-50 opacity-40 hover:opacity-100 ">
                <img width={500} height={500} alt='Tiktok' src={Tiktok} className='w-10 h-auto' />
              </a>
            </li>

            <li>
              <a href="https://www.youtube.com/@Faded_Lines" className="text-md uppercase font-bold hover:text-stone-50 opacity-40 hover:opacity-100 ">
                <img width={500} height={500} alt='Youtube' src={Youtube} className='w-10 h-auto' />
              </a>
            </li>

          </ul>
        </nav>
        <nav className='xl:hidden flex flex-col justify-center'>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger aria-label='open menu' />
            <Hamburger label='close icons' toggled={isMenuOpen} toggle={setIsMenuOpen} size={24} />
            <SheetContent side={"top"}>
              <SheetHeader>
                <SheetDescription>
                  <ul className="flex flex-col text-stone-600 ">
                    {links.map((link) => (
                      <NavLink key={link.to} to={link.to} label={link.label} />
                    ))}
                  </ul>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default Header;