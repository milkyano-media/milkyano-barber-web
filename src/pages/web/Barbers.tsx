
import Layout from "@/components/web/WebLayout";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import EmeraldFooter from "@/assets/web/emerald_footer_mobile.svg";
import EmeraldFooterRight from "@/assets/web/emerald_footer_right.svg";
import EmeraldFooterLeft from "@/assets/web/emerald_footer_left.svg";

import Rayhan from '@/assets/web/barbers/rayhan.svg';
import Anthony from '@/assets/web/barbers/anthony.svg';
import Jay from '@/assets/web/barbers/jay.svg';
import Wyatt from '@/assets/web/barbers/wyatt.svg';
import Emman from '@/assets/web/barbers/emman.svg';
import Dejan from '@/assets/web/barbers/dejan.svg';
import Christos from '@/assets/web/barbers/christos.svg';
import Josh from '@/assets/web/barbers/josh.svg';
import Niko from '@/assets/web/barbers/niko.svg';
import Aaron from '@/assets/web/barbers/aaron.png';
import { Link, useLocation } from "react-router-dom";



export default function Barbers() {
  const location = useLocation()

  const getQueryParams = (search: string) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);
  const fbclid = queryParams.get('fbclid')
  const ttclid = queryParams.get('ttclid')
  const gclid = queryParams.get('gclid')

  localStorage.setItem('utm_source', queryParams.get('utm_source') || 'None')
  localStorage.setItem('utm_medium', queryParams.get('utm_medium') || 'None')
  localStorage.setItem('utm_campaign', queryParams.get('utm_campaign') || 'None')
  localStorage.setItem('utm_content', queryParams.get('utm_content') || 'None')

  if (fbclid) { localStorage.setItem('booking_origin', 'Facebook Ads') }
  else if (ttclid) { localStorage.setItem('booking_origin', 'Tiktok Ads') }
  else if (gclid) { localStorage.setItem('booking_origin', 'Google Ads') }
  else { localStorage.setItem('booking_origin', 'Organic') }

  const generateRoute = (route: string): string => {
    const parts = location.pathname.split("/");
    if (parts[1] === 'meta') {
      return `/meta${route}`;
    }
    else {
      return route;
    }
  }

  const generateLink = () => {
    const squareLink: string = 'https://book.squareup.com/appointments/ud9yhcwfqc1fg0/location/LY7BZ89WAQ2QS/services';

    let bookLink: string
    const parts = location.pathname.split("/");
    if (parts[1] === 'meta') { bookLink = `/meta/book/services`; }
    else { bookLink = '/book/services' }

    const customize: boolean = true;
    if (customize) {
      return bookLink
    } else {
      return squareLink
    }
  }

  const barberSvgs = [
    {
      svg: Rayhan,
      link: generateRoute('/rayhan'),
      landing: true
    },
    {
      svg: Anthony,
      link: generateRoute('/anthony'),
      landing: true
    },
    {
      svg: Josh,
      link: generateRoute('/josh'),
      landing: true
    },
    {
      svg: Aaron,
      link: generateRoute('/aaron'),
      landing: true
    },
    {
      svg: Jay,
      link: generateRoute('/jay'),
      landing: true
    },
    {
      svg: Wyatt,
      link: generateRoute('/wyatt'),
      landing: true
    },
    {
      svg: Emman,
      link: generateRoute('/emman'),
      landing: true
    },
    {
      svg: Christos,
      link: generateRoute('/christos'),
      landing: true
    },
    {
      svg: Niko,
      link: generateRoute('/niko'),
      landing: true
    },
    {
      svg: Dejan,
      link: generateRoute('/dejan'),
      landing: false
    },
  ];

  useEffect(() => {
    // Create a new style element
    const style = document.createElement('style');

    // Define the animation
    style.innerHTML = `
        @keyframes move {
            0% { transform: translateX(100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(-100%); opacity: 0; }
        }`;

    // Append the style element to the document head
    document.head.appendChild(style);

    // Clean up function
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Barbers - Fadelines Barber Shop</title>
        <meta name="description" content="Fadelines - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:title" content="Fadelines Barber Shop" />
        <meta property="og:description" content="Fadelines - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:img" content="URL to Fadelines' preview img" />
        <meta property="og:url" content="URL to Fadelines' website" />
        <meta name="twitter:card" content="summary_large_img" />
      </Helmet>
      <div className="flex flex-col text-stone-50 bg-stone-950 md:bg-black w-full relative">
        <img src={EmeraldFooter} alt="EmeraldFooter.svg" className="md:hidden block absolute bottom-[-10rem] md:bottom-[-26rem] z-0 left-0" />
        <img src={EmeraldFooterRight} alt="EmeraldFooter.svg" className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 right-0" />
        <img src={EmeraldFooterLeft} alt="EmeraldFooter.svg" className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 left-0" />
        <section className=" w-full relative flex flex-col items-center text-center py-12 md:pb-0">
          <div className="w-full px-4 md:px-0 py-12 md:pb-0 flex flex-col gap-4 justify-center items-center leading-loose">
            <h3 className="text-3xl md:text-4xl font-extrabold w-full md:w-1/4 mx-auto tracking-wider">PRICING FOR EACH <span className="text-transparent bg-gradient-to-r from-[#42FF00]  to-[#79FF86] bg-clip-text">BARBER</span></h3>
            <p className="text-xs w-10/12 md:w-full md:text-lg font-light">Offering quality haircuts, our barbers are ready to make your day.</p>
          </div>
        </section>

        <section className="w-full min-h-screen flex  justify-center md:max-w-screen-xl   mx-auto md:py-24 pb-[12rem] md:pb-[4rem] mb-12 relative">
          <div className="w-full flex flex-wrap mx-auto justify-center items-center gap-y-24 px-4 md:px-0">
            {barberSvgs.map((barber, index) => (

              <Link to={barber.landing ? barber.link : generateLink()} key={index} className="w-6/12 md:w-[20rem] py-6 flex flex-col justify-center items-center relative " >
                <img src={barber.svg} alt={`Svg ${index}`} className="transition-transform duration-500 ease-in-out hover:scale-110 z-30 px-4 md:px-0 " />
                <div
                  className="mt-12 relative bottom-[-0rem] md:bottom-[-0.2rem] w-[110%] "
                  style={{
                    height: '4px ',
                    background: 'linear-gradient(90deg, rgba(36,255,0,0) 0%, rgba(36,255,0,1) 50%, rgba(36,255,0,0.0) 100%)',
                  }} />
                <Button variant={"ghost"} className="border absolute  md:relative bottom-[.5rem] md:bottom-[1rem] rounded-xl border-[#14FF00] bg-transparent  backdrop-blur-md z-30 transform hover:scale-110 transition-transform duration-400 ease-in-out hover:shadow-md hover:bg-[#14FF00] hover:shadow-[#14FF00] text-xs md:text-base hover:text-stone-950"
                  style={{ backdropFilter: 'blur(16px) contrast(100%)', WebkitBackdropFilter: 'blur(16px) contrast(100%)' }}
                >
                  LEARN MORE
                </Button>
              </Link>

            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
