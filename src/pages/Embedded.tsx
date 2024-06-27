import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import backgroundImage from '@/assets/landing/footer_line.svg';
import Logo from "@/assets/landing/logo.png"
import Top from "@/assets/landing/top_line.svg";
import Mid from "@/assets/landing/mid_line.svg";
import Bottom from "@/assets/landing/bottom_line.svg";
import HeaderParticles from "@/assets/landing/header_particles.svg"

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function EmbeddedPage() {

  const [selectedUrl, setSelectedUrl] = useState('');
  const query = useQuery();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const urlParam = query.get('url');
    if (urlParam) setSelectedUrl(urlParam);
  }, [query]);



  return (

    <div className='relative flex justify-center items-center flex-col h-screen text-center max-h-screen overflow-hidden'>
      <Helmet>
        <title>Book Josh Fadelines BEST BARBER IN MELBOURNE</title>
        <meta name="description" content="Josh Fadelines BEST BARBER IN MELBOURNE - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:title" content="Josh Fadelines BEST BARBER IN MELBOURNE" />
        <meta property="og:description" content="Josh Fadelines BEST BARBER IN MELBOURNE - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:image" content="URL to Fadelines' preview image" />
        <meta property="og:url" content="URL to Fadelines' website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <header className="bg-stone-950 text-white py-2  relative w-full flex justify-center items-center">
        <div className="container mx-auto flex justify-center  items-center relative z-10">

          <div className='flex flex-col justify-center items-center'>
            <img src={Logo} alt="barber shop faded lines" className='w-48 md:w-[10rem] h-auto' />
          </div>

        </div>
        <img src={HeaderParticles} width={500} height={500} alt="Your Image" className="absolute z-0 w-full h-full object-fill bottom-[0]" />
      </header>

      <div className="flex flex-col bg-stone-950 text-stone-50 w-full h-full relative overflow-hidden">
        <img src={Top} alt="Vector Top" width={500} height={500} className="absolute top-[60rem] md:top-[30rem] z-10 left-0 w-full h-auto" />
        <img src={Mid} alt="Vector Mid" width={500} height={500} className="absolute bottom-[85rem] z-0 left-0 w-full h-auto" />
        <img src={Bottom} alt="Vector Bottom" width={500} height={500} className="absolute bottom-0 z-0 left-0 w-[40vw] h-auto" />
        <section className="relative z-50 flex justify-center items-center h-full w-full overflow-hidden ">
          <iframe ref={iframeRef} id="iframe" src={selectedUrl} referrerPolicy="same-origin" className="w-[100%] h-full overflow-hidden"></iframe>
        </section>
      </div>
      <footer className="bg-transparent backdrop-blur-lg text-stone-50 py-6 relative z-40 w-full"
        style={{ backgroundImage: `url("${backgroundImage}")`, backgroundSize: 'cover', backgroundRepeat: "center", backdropFilter: 'blur(16px) contrast(100%)', WebkitBackdropFilter: 'blur(16px) contrast(100%)' }}
      >
        <div className='flex justify-center flex-col items-center  md:py-0'>
          <p className="text-center text-sm w-1/2 md:w-full">© 2021 Faded Lines Barber Shop. All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}