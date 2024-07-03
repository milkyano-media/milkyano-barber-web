
import Layout from "@/components/web/WebLayout";
import { Button } from "@/components/ui/button";
import { EmblaOptionsType } from 'embla-carousel'
import { Helmet } from "react-helmet-async";
import CarauselGallery from "@/components/web/OurWorks";
import CardStack from "@/components/web/CardStack";
import { motion, useScroll, useTransform } from "framer-motion";

import EmeraldFooter from "@/assets/web/emerald_footer_mobile.svg";
import EmeraldFooterRight from "@/assets/web/emerald_footer_right.svg";
import EmeraldFooterLeft from "@/assets/web/emerald_footer_left.svg";

const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
const OPTIONS: EmblaOptionsType = { loop: true, inViewThreshold: 1 }

export default function GalleriesPage() {

  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);


  return (
    <Layout>
      <Helmet>
        <title>Gallery - Fadelines Barber Shop</title>
        <meta name="description" content="Fadelines - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:title" content="Fadelines Barber Shop" />
        <meta property="og:description" content="Fadelines - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:img" content="URL to Fadelines' preview img" />
        <meta property="og:url" content="URL to Fadelines' website" />
        <meta name="twitter:card" content="summary_large_img" />
      </Helmet>

      <div className="flex flex-col text-stone-50 bg-black w-full relative ">
        <img src={EmeraldFooter} alt="EmeraldFooter.svg" className="md:hidden block absolute bottom-[-10rem] md:bottom-[-26rem] z-0 left-0" />

        <img src={EmeraldFooterRight} alt="EmeraldFooter.svg" className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 right-0" />
        <img src={EmeraldFooterLeft} alt="EmeraldFooter.svg" className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 left-0" />

        <section className="py-12 pt-32 px-0 container pr-0  md:pr-4 relative z-30 flex gap-12 justify-center items-center flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-10/12 flex flex-col justify-end md:pb-24 h-full">
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-wider flex flex-col  md:gap-2 text-center md:text-right">
              <span>
                BE OUR  NEXT
              </span>
              <span className="text-transparent bg-gradient-to-r from-[#42FF00]  to-[#79FF86] bg-clip-text">
                MASTERPIECE
              </span>
            </h3>
            <div className="flex flex-col gap-2 pt-4 w-full md:w-9/12 justify-end md:items-end self-end items-center justify-self-end ">
              <Button className="bg-gradient-to-r from-[#14FF00]  to-[#999999] rounded-full px-6 text-stone-50 font-bold uppercase md:py-1 md:h-auto md:text-lg text-md transform transition-all duration-500 hover:scale-110 hover:from-[#999999] hover:to-[#14FF00] py-0 w-5/12 ">
                <a href=" https://book.squareup.com/appointments/ud9yhcwfqc1fg0/location/LY7BZ89WAQ2QS/services">
                  BOOK NOW
                </a>
              </Button>
            </div>
          </div>
          <div className="relative w-full min-h-[25rem] md:min-h-[40rem]">
            <div className="absolute inset-0 overflow-hidden">
              <div className="w-full h-full flex justify-end md:justify-center items-center rotate-[10deg] md:rotate-[12deg]">
                <CardStack />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50 pointer-events-none"></div>
          </div>
        </section>

        <div className=" w-full flex justify-center py-12 relative">
          <div className="h-40 w-[1px] bg-[#086600] z-0" />
          <motion.div className="absolute h-[18rem] w-[2px] bg-gradient-to-b from-[#096601] to-[#15ff00] shadow-[0px_0px_70px_2px_#15ff00] origin-top z-10" style={{ scaleY }} />
        </div>

        <section className="relative z-[99999999] pb-[10rem] md:pb-[30rem] pt-12">
          <section className=" w-full relative flex flex-col items-center text-center  container">
            <div className="w-full px-4 md:px-0 flex flex-col gap-4 ">
              <h3 className="text-2xl md:text-3xl tracking-wider font-extrabold w-full md:w-1/3 mx-auto font-inter">
                <span className="text-transparent bg-gradient-to-r from-[#42FF00]  to-[#79FF86] bg-clip-text">GALLERY</span>
                <br />
                OF OUR WORK
              </h3>

            </div>
          </section>

          <section className="relative z-[99999] flex flex-col gap-2  py-4 container mx-0 max-w-none px-0">
            <CarauselGallery slides={SLIDES} options={OPTIONS} />
            <p className="text-center py-4 tracking-wider font-light">
              Our cuts don&apos;t disappoint.
            </p>
          </section>
        </section>
      </div>
    </Layout>
  );
}
