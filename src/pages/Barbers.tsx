
import Layout from "@/components/WebLayout";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import EmeraldFooter from "@/assets/svg/EmeraldFooter.svg";
import EmeraldFooterRight from "@/assets/svg/EmeraldFooterRight.svg";
import EmeraldFooterLeft from "@/assets/svg/EmeraldFooterleft.svg";

import RAYHAN from '@/assets/images/barbers/RAYHAN.svg';
import ANTHONY from '@/assets/images/barbers/ANTHONY.svg';
import JAY from '@/assets/images/barbers/JAY.svg';
import WYAATTSWICK from '@/assets/images/barbers/WYAATT SWICK.svg';
import EMMAN from '@/assets/images/barbers/EMMAN.svg';
import DEJANTOMIC from '@/assets/images/barbers/DEJAN TOMIC.svg';
import CHRISTOS from '@/assets/images/barbers/CHRISTOS.svg';
import JOSH from '@/assets/images/barbers/JOSH.svg';
import NIKO from '@/assets/images/barbers/NIKO.svg';

const barberSvgs = [
    { svg: RAYHAN, link: '/rayhan' },
    { svg: ANTHONY, link: '/anthony' },
    { svg: JOSH, link: '/josh' },
    { svg: JAY, link: '/jay' },
    { svg: WYAATTSWICK, link: '/wyaattswick' },
    { svg: EMMAN, link: '/emman' },
    { svg: CHRISTOS, link: '/christos' },
    { svg: NIKO, link: '/niko' },
    { svg: DEJANTOMIC, link: '/dejantomic' },
];

export default function Barbers() {

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

                <img src={EmeraldFooterRight} alt="EmeraldFooter.svg" className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 right-0"/>
                <img src={EmeraldFooterLeft} alt="EmeraldFooter.svg" className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 left-0"/>
                <section className=" w-full relative flex flex-col items-center text-center py-12 md:pb-0">
                   <div className="w-full px-4 md:px-0 py-12 md:pb-0 flex flex-col gap-4 justify-center items-center leading-loose">
                        <h3 className="text-3xl md:text-4xl font-extrabold w-full md:w-1/4 mx-auto tracking-wider">PRICING FOR EACH <span className="text-transparent bg-gradient-to-r from-[#42FF00]  to-[#79FF86] bg-clip-text">BARBER</span></h3>
                        <p className="text-xs w-10/12 md:w-full md:text-lg font-light">Offering quality haircuts, our barbers are ready to make your day.</p>
                   </div>
                </section>

                <section className="w-full min-h-screen flex  justify-center md:max-w-screen-xl   mx-auto md:py-24 pb-[12rem] md:pb-[4rem] mb-12 relative">
                  
                    <div className="w-full flex flex-wrap mx-auto justify-center items-center gap-y-24 px-4 md:px-0">   
                        {barberSvgs.map((barber, index) => (
                            <Link to={barber.link} key={index} className="w-6/12 md:w-[20rem] py-6 flex flex-col justify-center items-center relative " >
                                <img src={barber.svg} alt={`Svg ${index}`} className="transition-transform duration-500 ease-in-out hover:scale-110 z-30 px-4 md:px-0 " />
                                {/* <div className="" id="GradientBorder"></div> */}
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
