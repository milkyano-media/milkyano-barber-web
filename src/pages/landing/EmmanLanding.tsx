import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "@/components/landing/CarouselScaled";
import Srolled from "@/components/landing/Scrolled";
import getAsset from "@/utils/getAssets";
import LandingLayout from "@/components/landing/LandingLayout";

import cardOne from "@/assets/landing/reviews/emman/card1.svg";
import cardTwo from "@/assets/landing/reviews/emman/card2.svg";
import cardThree from "@/assets/landing/reviews/emman/card3.svg";
import cardFour from "@/assets/landing/reviews/emman/card4.svg";

import Top from "@/assets/landing/top_line.svg";
import Mid from "@/assets/landing/mid_line.svg";
import Bottom from "@/assets/landing/bottom_line.svg";

import ParticlesTwo from "@/assets/landing/section_2_particles.svg";
import ParticlesThree from "@/assets/landing/section_3_particles.svg";

import SwipeGif from "@/assets/landing/arrow_animation.gif";
import SwipedtoSee from "@/assets/landing/swipe_to_see.svg";

import HeroTop from "@/assets/landing/hero_top_line.svg";
import HeroBottom from "@/assets/landing/hero_bottom_line.svg";

import highBurstFadeMullet from "@/assets/landing/cuts/emman/high_burst_fade_mullet.png";
import highDropFade1 from "@/assets/landing/cuts/emman/high_drop_fade_1.png";
import highDropFade2 from "@/assets/landing/cuts/emman/high_drop_fade_2.png";
import highDropFade3 from "@/assets/landing/cuts/emman/high_drop_fade_3.png";
import highDropFade from "@/assets/landing/cuts/emman/high_drop_fade.png";
import highFade from "@/assets/landing/cuts/emman/high_fade.png";
import highSkinFade1 from "@/assets/landing/cuts/emman/high_skin_fade_1.png";
import highSkinFade2 from "@/assets/landing/cuts/emman/high_skin_fade_2.png";
import highSkinFade3 from "@/assets/landing/cuts/emman/high_skin_fade_3.png";
import highSkinFade4 from "@/assets/landing/cuts/emman/high_skin_fade_4.png";
import highSkinFade5 from "@/assets/landing/cuts/emman/high_skin_fade_5.png";
import highSkinFade6 from "@/assets/landing/cuts/emman/high_skin_fade_6.png";
import highSkinFade from "@/assets/landing/cuts/emman/high_skin_fade.png";
import lowTaper from "@/assets/landing/cuts/emman/low_taper.png";
import midBurstFade from "@/assets/landing/cuts/emman/mid_burst_fade.png";
import midToHighBurstFade1 from "@/assets/landing/cuts/emman/mid_to_high_burst_fade_1.png";
import midToHighBurstFade from "@/assets/landing/cuts/emman/mid_to_high_burst_fade.png";
import midToHighSkinFade from "@/assets/landing/cuts/emman/mid_to_high_skin_fade.png";
import useUtmTracking from "@/hooks/utmTrackingHook";

const Hero = getAsset("/assets/landing/videos/emman/hero.mp4");

const video1 = getAsset("/assets/landing/videos/emman/tiktok_1.mp4");
const video2 = getAsset("/assets/landing/videos/emman/tiktok_2.mp4");
const video3 = getAsset("/assets/landing/videos/emman/tiktok_3.mp4");
const video4 = getAsset("/assets/landing/videos/emman/tiktok_1.mp4");
const video5 = getAsset("/assets/landing/videos/emman/tiktok_2.mp4");
const video6 = getAsset("/assets/landing/videos/emman/tiktok_3.mp4");

const videos = [video1, video2, video3, video4, video5, video6];

const cutsImages = [
  { src: highBurstFadeMullet, name: "High Burst Fade Mullet" },
  { src: highDropFade1, name: "High Drop Fade 1" },
  { src: highDropFade2, name: "High Drop Fade 2" },
  { src: highDropFade3, name: "High Drop Fade 3" },
  { src: highDropFade, name: "High Drop Fade" },
  { src: highFade, name: "High Fade" },
  { src: highSkinFade1, name: "High Skin Fade 1" },
  { src: highSkinFade2, name: "High Skin Fade 2" },
  { src: highSkinFade3, name: "High Skin Fade 3" },
  { src: highSkinFade4, name: "High Skin Fade 4" },
  { src: highSkinFade5, name: "High Skin Fade 5" },
  { src: highSkinFade6, name: "High Skin Fade 6" },
  { src: highSkinFade, name: "High Skin Fade" },
  { src: lowTaper, name: "Low Taper" },
  { src: midBurstFade, name: "Mid Burst Fade" },
  { src: midToHighBurstFade1, name: "Mid to High Burst Fade 1" },
  { src: midToHighBurstFade, name: "Mid to High Burst Fade" },
  { src: midToHighSkinFade, name: "Mid to High Skin Fade" },
];

const OPTIONS: EmblaOptionsType = { loop: true, inViewThreshold: 1 };
const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
const imagesReviews = [cardOne, cardTwo, cardThree, cardFour];

export default function EmmanLanding() {
  useUtmTracking();
  const location = useLocation();
  const generateLink = (text: string): JSX.Element => {
    const customize: boolean = true;
    const squareLink: string =
      "https://book.squareup.com/appointments/ud9yhcwfqc1fg0/location/LY7BZ89WAQ2QS/services";
    const bookLink: string = `${location.pathname}/book/services`;

    if (customize) {
      return <Link to={bookLink}>{text}</Link>;
    } else {
      return <a href={squareLink}>{text}</a>;
    }
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes move {
            0% { transform: translateX(100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(-100%); opacity: 0; }
        }`;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const description =
    "Hair is my canvas, and I create masterpieces with every cut. Experience the artistry of precision barbering tailored to your individual style.";

  return (
    <LandingLayout>
      <Helmet>
        <title>emman Fadelines BEST BARBER/HAIRDRESSER IN MELBOURNE</title>
        <meta
          name="description"
          content={`Emman Fadelines BEST BARBER IN MELBOURNE - ${description}`}
        />
        <meta
          property="og:title"
          content="Emman Fadelines BEST BARBER IN MELBOURNE"
        />
        <meta
          property="og:description"
          content={`Emman Fadelines BEST BARBER IN MELBOURNE - ${description}`}
        />
        <meta property="og:image" content="URL to Fadelines' preview image" />
        <meta property="og:url" content="URL to Fadelines' website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="flex flex-col bg-stone-950 w-full h-full relative">
        <img
          src={Top}
          alt="Vector Top"
          width={500}
          height={500}
          className="absolute top-[60rem] md:top-[30rem] z-10 left-0 w-full h-auto"
        />
        <img
          src={Mid}
          alt="Vector Mid"
          width={500}
          height={500}
          className="absolute bottom-[85rem] z-0 left-0 w-full h-auto"
        />
        <img
          src={Bottom}
          alt="Vector Bottom"
          width={500}
          height={500}
          className="absolute bottom-0 z-0 left-0 w-[40vw] h-auto"
        />

        <section className="relative w-full h-[35rem] md:h-[35rem] ">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute z-0 w-full h-[40rem] md:h-[35rem] object-cover"
          >
            <source src={Hero} type="video/mp4" />
          </video>
          <div className="max-w-screen-lg mx-auto w-full">
            <div
              className="relative z-30 backdrop-blur-lg text-white rounded-3xl py-12 px-12 my-12 mb-10 mx-6 md:mx-12 border border-stone-50 md:w-1/2 bg-black/40"
              style={{
                backdropFilter: "blur(16px) contrast(100%)",
                WebkitBackdropFilter: "blur(16px) contrast(100%)",
              }}
            >
              <h2 className="text-4xl md:text-5xl uppercase font-poppins font-extrabold mb-2 text-[#42FF00] tracking-wider">
                Hi, I&apos;m emman
              </h2>
              <h2 className="text-xl font-bold mb-4">
                BEST BARBER/HAIRDRESSER IN MELBOURNE
              </h2>
              <p className="text-lg mb-8">{description}</p>
              <div className="bg-black"></div>
            </div>
            <div className="px-6 md:px-12 text-stone-50 flex flex-col md:flex-row gap-4 uppercase relative z-30">
              <Button
                variant={"ghost"}
                className="relative z-20 backdrop-blur-lg bg-transparent text-xl rounded-full border border-stone-50 px-12 py-6 hover:bg-white/10"
                style={{
                  backdropFilter: "blur(16px) contrast(100%)",
                  WebkitBackdropFilter: "blur(16px) contrast(100%)",
                }}
              >
                {generateLink("BOOK NOW")}
              </Button>
            </div>
          </div>
          <img
            src={HeroTop}
            width={500}
            height={500}
            alt="Hero img"
            className="absolute z-20 w-screen  md:w-auto md:h-full object-fill top-0"
          />
          <img
            src={HeroBottom}
            width={500}
            height={500}
            alt="Hero Bottom"
            className="absolute z-20 w-auto h-full object-fill bottom-[-23rem] md:bottom-[-20rem]"
            fetchPriority="high"
          />
        </section>

        <section className="flex relative flex-col z-20 justify-center items-center  container w-full text-stone-50 uppercase py-32 pt-40 pb-20">
          <div className="hidden xl:flex  absolute bottom-1/3 pb-32 left-32  h-auto">
            <img
              alt="swipe to see "
              src={SwipedtoSee}
              width={500}
              height={500}
              className="w-[15rem] h-auto"
            />
            <img
              alt="swipe to see "
              src={SwipeGif}
              width={500}
              height={500}
              className="w-[15rem] h-auto py-4 flex justify-end absolute bottom-[-0rem] right-0"
            />
          </div>
          <div className="relative z-10 flex flex-col gap-12 justify-center items-center overflow-hidden">
            <Srolled cutsImages={cutsImages} />
          </div>
          <img
            src={ParticlesTwo}
            width={500}
            height={500}
            alt="Your img"
            className="absolute z-0 w-auto h-full object-fill bottom-[0]"
          />
        </section>
        <section className="container relative z-10 text-stone-50 pt-0 py-12 ">
          <div className="relative z-10">
            <h3 className=" text-4xl md:text-6xl  font-poppins font-extrabold text-center py-2 uppercase text-transparent bg-gradient-to-r from-[#19F456] via-[#44D140] to-[#A1FF80] bg-clip-text">
              Our Videos
            </h3>
            <p className="text-center text-lg w-10/12 md:w-full mx-auto">
              well known on TIktok with millions of views
            </p>
            <div className="py-12 md:py-0 w-full md:px-12  ">
              <EmblaCarousel
                slides={SLIDES}
                options={OPTIONS}
                videos={videos}
              />
            </div>
            <div className="flex gap-10 justify-center items-center flex-col w-full ">
              <Button
                variant={"ghost"}
                className="border border-[#00FF1A] rounded-full font-extrabold font-poppins px-12 py-10 uppercase  text-xl md:text-3xl transform hover:scale-110 transition-transform duration-200 ease-in-out hover:bg-[#24FF00] hover:shadow-md hover:text-stone-950 hover:shadow-[#44813a] "
              >
                {generateLink("BOOK NOW")}
              </Button>
            </div>
          </div>
          <img
            src={ParticlesThree}
            width={500}
            height={500}
            alt="Your img"
            className="absolute left-0 z-0 w-auto h-full object-fill bottom-[0]"
          />
        </section>

        <section className="container mx-auto px-6 sm:px-6 lg:px-8 py-12 text-stone-50 rounded-lg relative z-10 flex flex-col justify-center items-center">
          <h4 className="text-4xl md:text-7xl my-6 md:my-12 uppercase   items-center justify-center text-center font-extrabold text-transparent bg-gradient-to-r from-[#19F456] via-[#44D140] to-[#A1FF80] bg-clip-text">
            Reviews
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {imagesReviews.map((review, index) => (
              <img
                key={index}
                src={`${review}`}
                width={5000}
                height={5000}
                alt="reviews barbershops"
              />
            ))}
          </div>
          <Button
            variant={"ghost"}
            className="border border-[#00FF19] px-12 py-8 text-2xl font-bold font-poppins rounded-full my-24 transform hover:scale-110 transition-transform duration-200 ease-in-out hover:bg-[#24FF00] hover:shadow-md hover:text-stone-950 hover:shadow-[#44813a] "
          >
            {generateLink("LIMITED SLOT ONLY!")}
          </Button>
        </section>

        <section className="container relative  z-30 flex justify-center items-center pb-32 px-6 md:px-0 md:pb-0 md:h-[100vh] text-stone-50  ">
          <div
            className=" bg-[#0E0E0E]/20 backdrop-blur-lg px-6 md:px-12 py-10 rounded-[36px] md:rounded-[50px] w-full md:w-9/12 lg:w-7/12 relative flex flex-col justify-center items-center"
            id="gradientBox"
            style={{
              backgroundSize: "cover",
              backdropFilter: "blur(16px) contrast(100%)",
              WebkitBackdropFilter: "blur(16px) contrast(100%)",
            }}
          >
            <h3 className="text-3xl md:text-4xl font-black font-poppins w-10/12 tracking-wider leading-[3rem] md:leading-10  mt-4 mb-12 uppercase">
              Book an Appoinment Now.
              <br className="hidden md:block" />
              <span className="text-[#24FF00]">LIMITED </span>
              SLOT ONLY!
            </h3>
            <div className="flex justify-center items-center text-center flex-col  ">
              <p className="my-12 tracking-wider w-8/12 md:w-full">
                Life is too short to get a bad hair cut.
              </p>
              <div className="flex flex-col md:flex-row gap-2 py-4 uppercase">
                <Button
                  variant={"ghost"}
                  className="border border-stone-400 rounded-full uppercase px-12 py-6 bg-[#1ABC00]/5 transform hover:scale-110 transition-transform duration-200 ease-in-out hover:shadow-lg hover:shadow-stone-800 hover:bg-[#24FF00] hover:text-stone-950"
                >
                  {generateLink("BOOK NOW")}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LandingLayout>
  );
}
