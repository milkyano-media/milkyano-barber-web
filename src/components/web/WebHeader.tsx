import React, { useEffect, useRef, useState } from "react";
import Logo from "@/components/react-svg/logo";
import { Link, useLocation } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

// import { Squash as Hamburger } from 'hamburger-react'
import Hamburger from "@/components/hamburger";

import { Button } from "../ui/button";
import { generateLink } from "@/pages/web/Home";

interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label }) => {
  const location = useLocation();

  return (
    <li className="my-4">
      <Link
        to={to}
        className={`text-2xl font-light hover:text-white ${
          location.pathname === to ? "text-white" : ""
        }`}
      >
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
    if (parts[1] === "meta") {
      return `/meta${route}`;
    } else {
      return route;
    }
  };

  const [height, setHeight] = useState(0);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeight(headerRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (headerRef.current) {
        setHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      ref={headerRef}
      className="text-white shadow-lg shadow-[#33FF00]/10 border-b-[0.5px] border-[#33FF00] rounded-b-lg z-[999999999999999] py-4 sticky top-0"
      style={{
        marginBottom: `-${height}px`,
        background:
          "linear-gradient(180deg, rgba(3, 18, 13, 0.75) 14.29%, rgba(3, 18, 13, 0.6) 100%)",
      }}
    >
      <div className="container mx-auto flex justify-between items-center relative z-10 border-none px-2 md:px-4">
        <h1 className="text-2xl font-bold text-transparent hidden ">
          Barber Shop
        </h1>
        <div className="flex flex-col justify-center items-center">
          <Link to={generateRoute("/home")}>
            <Logo className="w-48 md:w-36 h-auto opacity-90 " />
          </Link>
        </div>
        <nav className="hidden lg:block sticky top-0">
          <ul className="flex text-white/80">
            <li>
              <Link
                to={generateRoute("/home")}
                className={`text-md uppercase font-bold px-4 hover:text-white ${
                  location.pathname === "/" ? "text-white" : ""
                }`}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to={generateRoute("/barbers")}
                className={`text-md uppercase font-bold px-4 hover:text-white ${
                  location.pathname === "/barbers" ? "text-white" : ""
                }`}
              >
                BARBERS
              </Link>
            </li>
            <li>
              <Link
                to={generateRoute("/gallery")}
                className={`text-md uppercase font-bold px-4 hover:text-white ${
                  location.pathname === "/gallery" ? "text-white" : ""
                }`}
              >
                GALLERY
              </Link>
            </li>
            <li>
              <Link
                to={generateRoute("/about-us")}
                className={`text-md uppercase font-bold px-4 hover:text-white ${
                  location.pathname === "/about-us" ? "text-white" : ""
                }`}
              >
                ABOUT US
              </Link>
            </li>
            <li>
              <Link
                to={generateRoute("/careers")}
                className={`text-md uppercase font-bold px-4 hover:text-white ${
                  location.pathname === "/careers" ? "text-white" : ""
                }`}
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                to={generateRoute("/contact")}
                className={`text-md uppercase font-bold   px-4 hover:text-white ${
                  location.pathname === "/contact" ? "text-white" : ""
                }`}
              >
                CONTACT
              </Link>
            </li>
          </ul>
        </nav>
        <nav className="hidden xl:block">
          <Button className="px-8 py-5">{generateLink("BOOK NOW")}</Button>
        </nav>
        <nav className="xl:hidden flex flex-col justify-center">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger aria-label="open menu" />
            <Hamburger
              label="close icons"
              toggled={isMenuOpen}
              toggle={setIsMenuOpen}
              size={24}
            />
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
