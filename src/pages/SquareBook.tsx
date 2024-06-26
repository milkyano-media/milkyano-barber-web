import { useEffect, useState, } from "react";
import { Helmet } from "react-helmet-async";

import LandingLayout from "@/components/landing/LandingLayout";
import BookSection from "@/components/book/book";
import Top from "@/assets/landing/top_line.svg";
import Mid from "@/assets/landing/mid_line.svg";
import Bottom from "@/assets/landing/bottom_line.svg";
import servicesData from "@/assets/database/josh.json";

interface Service {
  [x: string]: string;
  name: string;
  url: string;
  description: string;
  details: string;
  price: string;
}


export default function SquareBook() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    console.log(servicesData.josh);
    return setServices(servicesData.josh);
  }, []);



  return (
    <LandingLayout>
      <Helmet>
        <title>Book Josh Fadelines BEST BARBER IN MELBOURNE</title>
        <meta name="description" content="Josh Fadelines BEST BARBER IN MELBOURNE - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:title" content="Josh Fadelines BEST BARBER IN MELBOURNE" />
        <meta property="og:description" content="Josh Fadelines BEST BARBER IN MELBOURNE - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:image" content="URL to Fadelines' preview image" />
        <meta property="og:url" content="URL to Fadelines' website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="flex flex-col bg-stone-950 text-stone-50 w-full h-full relative overflow-hidden">
        <img src={Top} alt="Vector Top" width={500} height={500} className="absolute top-[60rem] md:top-[30rem] z-10 left-0 w-full h-auto" />
        <img src={Mid} alt="Vector Mid" width={500} height={500} className="absolute bottom-[85rem] z-0 left-0 w-full h-auto" />
        <img src={Bottom} alt="Vector Bottom" width={500} height={500} className="absolute bottom-0 z-0 left-0 w-[40vw] h-auto" />
        <div className="relative z-30 mx-auto w-full md:w-8/12 py-12 ">
          <BookSection bookData={services} title="Josh" instagramHandle="Josh.blendz_" />
        </div>
        <div className="relative z-30 mx-auto w-full md:w-8/12 py-12 ">
          <BookSection bookData={services} title="Josh" instagramHandle="Josh.blendz_" />
        </div>
        <div className="relative z-30 mx-auto w-full md:w-8/12 py-12 ">
          <BookSection bookData={services} title="Josh" instagramHandle="Josh.blendz_" />
        </div>
      </div>
    </LandingLayout>
  );
}
