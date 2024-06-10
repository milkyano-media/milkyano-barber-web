import React from 'react';
// import SmoothScrolling from '../../../components/SmoothScrolling';
import { Helmet } from 'react-helmet-async';
import GreenButton from '@/components/GreenButton';
import WhiteButton from '@/components/WhiteButton';

// type Transformation = {
//   name: string,
//   url : string,
// }

const JoshLanding: React.FC = () => {
  // const transformationData : Transformation[] = [
  //   { 
  //     name : "Blow Out Taper Fade 1",
  //     url : "/src/assets/images/cuts/Blow Out Taper Fade.png"
  //   },
  //   { 
  //     name : "Blow Out Taper Fade 2",
  //     url : "/src/assets/images/cuts/Blow Out Taper Fade.png"
  //   },
  //   { 
  //     name : "Burst Fade 1",
  //     url : "/src/assets/images/cuts/Burst Fade.png"
  //   },
  //   { 
  //     name : "Burst Fade 2",
  //     url : "/src/assets/images/cuts/Burst Fade-1.png"
  //   },
  //   { 
  //     name : "Burst Fade 3",
  //     url : "/src/assets/images/cuts/Burst Fade 2.png"
  //   },
  //   { 
  //     name : "Drop Fade",
  //     url : "/src/assets/images/cuts/Drop Fade.png"
  //   },
  //   { 
  //     name : "Drop V Burst Fade",
  //     url : "/src/assets/images/cuts/Drop V Burst Fade.png"
  //   },
  //   { 
  //     name : "High Skin 1",
  //     url : "/src/assets/images/cuts/High Skin Fade.png"
  //   },
  //   { 
  //     name : "High Skin 2",
  //     url : "/src/assets/images/cuts/High Skin Fade-1.png"
  //   },
  //   { 
  //     name : "High V Drop Fade",
  //     url : "/src/assets/images/cuts/High V Drop Fade.png"
  //   },
  //   { 
  //     name : "Mid Burst Fade",
  //     url : "/src/assets/images/cuts/Mid Burst Fade.png"
  //   },
  //   { 
  //     name : "Mid to High Burst Fade",
  //     url : "/src/assets/images/cuts/Mid to High Burst Fade.png"
  //   },
  //   { 
  //     name : "Taper Fade",
  //     url : "/src/assets/images/cuts/Taper Fade.png"
  //   },
  //   { 
  //     name : "Textured Burst Fade 1",
  //     url : "/src/assets/images/cuts/Textured Burst Fade.png"
  //   },
  //   { 
  //     name : "Textured Burst Fade 2",
  //     url : "/src/assets/images/cuts/Textured Burst Fade-1.png"
  //   },
  //   { 
  //     name : "Textured Crop Skin Fade",
  //     url : "/src/assets/images/cuts/Textured Crop Skin Fade.png"
  //   },
  //   { 
  //     name : "V Mid Drop Fade",
  //     url : "/src/assets/images/cuts/V Mid Drop Fade.png"
  //   },
  // ]

  // const tiktokVideos : string[] = [
  //   "/src/assets/videos/josh/tiktok_1.mp4",
  //   "/src/assets/videos/josh/tiktok_2.mp4",
  //   "/src/assets/videos/josh/tiktok_3.mp4",
  // ]

  // const reviewImages : string[] = [
  //   "/src/assets/images/josh/review_1.png",
  //   "/src/assets/images/josh/review_2.png",
  //   "/src/assets/images/josh/review_3.png",
  //   "/src/assets/images/josh/review_4.png"
  // ]

  

  return (
    <>
      <Helmet>
        <title>Josh Fadelines BEST BARBER IN MELBOURNE</title>
        <meta name="description" content="Josh Fadelines BEST BARBER IN MELBOURNE - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:title" content="Josh Fadelines BEST BARBER IN MELBOURNE" />
        <meta property="og:description" content="Josh Fadelines BEST BARBER IN MELBOURNE - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:image" content="URL to Fadelines' preview image" />
        <meta property="og:url" content="URL to Fadelines' website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* HEADER */}
      <header>
        <div className='flex flex-row justify-center items-center'>
          <div className='w-[50%]'>
            <img className='h-[80px] 3xl:pl-[150px] p-[10px] ml-auto' src="/src/assets/images/josh/logo.png" alt="logo" />
          </div>
          <div className='w-[50%]'>
            <GreenButton>BOOK NOW</GreenButton>
          </div> 
        </div>
      </header>

      {/* HERO SECTION */}
      <section>
        <img className='w-full h-[1.5px] lg:h-[3px] object-cover object-top drop-shadow-[0_3px_3px_#24FF00]' src="/src/assets/svg/greenLines.svg" alt="top-lines" />
        <video className='absolute h-[600px] w-full object-cover' autoPlay muted loop src="/src/assets/videos/josh/hero.mp4"/>
        <div className='h-[550px] relative z-10 flex justify-center items-center lg:w-[35%] lg:ml-[15%]'>
          <div className='w-full flex flex-col'>
            <div className='flex flex-col text-left border border-white rounded-3xl m-[20px] px-[30px] py-[40px] backdrop-blur-lg'>
              <h1 className='font-extrabold lg:text-6xl text-3xl text-[#42FF00]'>HI, I&apos;M JOSH</h1> 
              <h3 className='font-bold text-lg' >BEST BARBER IN MELBOURNE</h3>
              <h5 className='max-w-[500px] text-sm mt-4'>I am specializing in design and it only takes one click to change everything including your look.</h5>
            </div>
            <div className='flex gap-10 mx-[20px] my-[10px]'>
              <WhiteButton >HAIR</WhiteButton>
              <WhiteButton>HAIR & BEARD</WhiteButton>
            </div>
          </div>
        </div>
        <img className='relative z-10 h-[200px] w-full object-cover' src="/src/assets/svg/heroBottom.svg" alt="bottom-lines" />
      </section>

      {/* TRANSFORMATION SECTION */}
      <section>
        <div className='relative z-[-10] lg:top-[-40vh]'>
          <img className='absolute w-full ' src="/src/assets/svg/topLineBg.svg" alt="top-background" />
        </div>
        <div className='h-[1000px]'>
          <h1 className='font-extrabold text-4xl text-transparent bg-gradient-to-r from-[#19F456] via-[#44D140] to-[#A1FF80] bg-clip-text'>TRANSFORMATION</h1>
          CONTENT
        </div>
      </section>


      {/* OUR VIDEOS SECTION */}
      <section>
        <div className='relative z-20 top-[-20vh]'>
          <img className='absolute w-full' src="/src/assets/svg/secondLineBg.svg" alt="top-background" />
        </div>
        <div className='h-[1000px]'>
          <h1 className='font-extrabold text-4xl text-transparent bg-gradient-to-r from-[#19F456] via-[#44D140] to-[#A1FF80] bg-clip-text'>OUR VIDEOS</h1>
          <h3>Well known on TIktok with millions of views</h3>
          CONTENT
        </div>
      </section>


      {/* REVIEWS SECTION */}
      <section>
        <div className='relative z-20 top-[10vh]'>
          <img className='absolute w-[300px] lg:w-[450px]' src="/src/assets/svg/thirdLineBg.svg" alt="top-background" />
        </div>
        <div className='h-[1000px]'>
          <h1 className='font-extrabold text-4xl text-transparent bg-gradient-to-r from-[#19F456] via-[#44D140] to-[#A1FF80] bg-clip-text'>REVIEWS</h1>
          <div className='my-[20px]'>
            
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <section>
        <div className=''>
          CONTENT
        </div>
      </section>
    </>
  );
}

export default JoshLanding;
