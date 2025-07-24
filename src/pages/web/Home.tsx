import Layout from "@/components/web/WebLayout";
import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import BgHero2 from "@/assets/web/home/hero.svg";
import haircut from "@/assets/web/home/haircut.png";
import beard from "@/assets/web/home/beard.png";

import instagramPhotosDesktop1 from "/src/assets/follow-us/desktop/instagram_photo_1.png";
import instagramPhotosDesktop2 from "/src/assets/follow-us/desktop/instagram_photo_2.png";
import instagramPhotosDesktop3 from "/src/assets/follow-us/desktop/instagram_photo_3.png";
import instagramPhotosDesktop4 from "/src/assets/follow-us/desktop/instagram_photo_4.png";
import instagramPhotosDesktop5 from "/src/assets/follow-us/desktop/instagram_photo_5.png";

import instagramPhotosMobile1 from "/src/assets/follow-us/mobile/instagram_photo_1.png";
import instagramPhotosMobile2 from "/src/assets/follow-us/mobile/instagram_photo_2.png";
import instagramPhotosMobile3 from "/src/assets/follow-us/mobile/instagram_photo_3.png";
import instagramPhotosMobile4 from "/src/assets/follow-us/mobile/instagram_photo_4.png";
import instagramPhotosMobile5 from "/src/assets/follow-us/mobile/instagram_photo_5.png";

import InstagramSection from "@/components/web/InstagramSection";
import { Link, useLocation } from "react-router-dom";

export const generateLink = (content: string | JSX.Element): JSX.Element => {
  const customize: boolean = true;
  const squareLink: string =
    "https://book.squareup.com/appointments/ud9yhcwfqc1fg0/location/LY7BZ89WAQ2QS/services";

  let bookLink: string;
  const parts = location.pathname.split("/");
  if (parts[1] === "meta") {
    bookLink = `/meta/book/services`;
  } else {
    bookLink = "/book/services";
  }

  if (customize) {
    return <Link to={bookLink} className="flex items-center justify-center w-full h-full">{content}</Link>;
  } else {
    return <a href={squareLink} className="flex items-center justify-center w-full h-full">{content}</a>;
  }
};

export default function Home() {
  localStorage.removeItem("booking_source");

  const location = useLocation();

  const getQueryParams = (search: string) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);
  const fbclid = queryParams.get("fbclid");
  const ttclid = queryParams.get("ttclid");
  const gclid = queryParams.get("gclid");

  const trackingData = {
    utm_source: queryParams.get("utm_source"),
    utm_medium: queryParams.get("utm_medium"),
    utm_campaign: queryParams.get("utm_campaign"),
    utm_content: queryParams.get("utm_content"),
    fbclid: queryParams.get("fbclid"),
  };

  localStorage.setItem("booking_source", JSON.stringify(trackingData));

  if (trackingData.fbclid && trackingData.utm_source) {
    localStorage.setItem("customer_source", JSON.stringify(trackingData));
  }

  localStorage.setItem("utm_source", queryParams.get("utm_source") || "None");
  localStorage.setItem("utm_medium", queryParams.get("utm_medium") || "None");
  localStorage.setItem(
    "utm_campaign",
    queryParams.get("utm_campaign") || "None",
  );
  localStorage.setItem("utm_content", queryParams.get("utm_content") || "None");

  if (fbclid) {
    localStorage.setItem("booking_origin", "facebook");
  } else if (ttclid) {
    localStorage.setItem("booking_origin", "tiktok");
  } else if (gclid) {
    localStorage.setItem("booking_origin", "google");
  } else {
    localStorage.setItem("booking_origin", "organic");
  }

  // const generateRoute = (route: string): string => {
  //   const parts = location.pathname.split("/");
  //   if (parts[1] === "meta") {
  //     return `/meta${route}`;
  //   } else {
  //     return route;
  //   }
  // };

  // const ref = useRef(null);
  // const { scrollYProgress } = useScroll({
  //   target: ref,
  // });
  // const scaleY = useTransform(scrollYProgress, [0, 1], [1, 0]);
  // const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  // const [headerHeight, setHeaderHeight] = useState(0);

  const instagram_images_desktop = [
    { image: instagramPhotosDesktop1, name: "Mid Burst Fade" },
    { image: instagramPhotosDesktop2, name: "Mid Drop Fade" },
    { image: instagramPhotosDesktop3, name: "Mid Taper" },
    { image: instagramPhotosDesktop4, name: "V Low Drop Fade" },
    { image: instagramPhotosDesktop5, name: "" },
  ];

  const instagram_images_mobile = [
    instagramPhotosMobile1,
    instagramPhotosMobile2,
    instagramPhotosMobile3,
    instagramPhotosMobile4,
    instagramPhotosMobile5,
  ];

  // useEffect(() => {
  //   const style = document.createElement("style");

  //   style.innerHTML = `
  //       @keyframes move {
  //           0% { transform: translateX(100%); opacity: 0; }
  //           50% { opacity: 1; }
  //           100% { transform: translateX(-100%); opacity: 0; }
  //       }`;

  //   document.head.appendChild(style);

  //   const handleResize = () => {
  //     setScreenHeight(window.innerHeight);
  //     const header = document.querySelector("header");
  //     if (header) {
  //       // setHeaderHeight(header.clientHeight);
  //     }
  //   };

  //   handleResize();

  //   window.addEventListener("resize", handleResize);
  //   console.log("screenHeight", screenHeight);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     document.head.removeChild(style);
  //   };
  // }, [screenHeight]);

  // const availableHeight = screenHeight - headerHeight - 1;

  return (
    <Layout>
      <Helmet>
        <title>Home - Fadelines Barber Shop</title>
        <meta
          name="description"
          content="Fadelines - A premier barber shop offering top-notch haircuts and styles."
        />
        <meta property="og:title" content="Fadelines Barber Shop" />
        <meta
          property="og:description"
          content="Fadelines - A premier barber shop offering top-notch haircuts and styles."
        />
        <meta property="og:image" content="URL to Fadelines' preview image" />
        <meta property="og:url" content="URL to Fadelines' website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="flex flex-col justify-center items-center relative pt-60 md:pt-40">
        <img
          alt="hero image"
          width={500}
          height={500}
          src={BgHero2}
          className="top-0 absolute w-full h-full object-cover -z-10"
        />
        <div className="top-0 absolute w-full h-full object-cover z-0 bg-gradient-to-b from-black/80 to-black" />
        <div className="flex flex-col justify-center items-center text-center gap-6 z-10">
          <div className="flex flex-col mb-12">
            <h1 className="text-[#33FF00]">THE BEST</h1>
            <h2>FOR YOUR HAIR</h2>
          </div>
          {generateLink(
            <span className="inline-flex items-center justify-center bg-[#454545] border-[0.5px] border-white text-2xl text-[#33FF00] font-bold px-16 py-4 self-center hover:bg-[#454545]/80 rounded-md transition-colors">
              BOOK NOW
            </span>
          )}

          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <p>
              We served over <span className="text-[#33FF00]">5000+</span>
            </p>
            <p className="flex gap-2">
              Happy Customers+{" "}
              <svg
                className="w-6"
                viewBox="0 0 31 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5 0.375C12.6075 0.375 9.77986 1.23274 7.37479 2.83976C4.96972 4.44677 3.0952 6.73089 1.98827 9.40325C0.881337 12.0756 0.591713 15.0162 1.15602 17.8532C1.72033 20.6902 3.11323 23.2961 5.15857 25.3414C7.20391 27.3868 9.80984 28.7797 12.6468 29.344C15.4838 29.9083 18.4244 29.6187 21.0968 28.5117C23.7691 27.4048 26.0532 25.5303 27.6602 23.1252C29.2673 20.7201 30.125 17.8926 30.125 15C30.1209 11.1225 28.5788 7.40492 25.8369 4.66309C23.0951 1.92125 19.3775 0.379095 15.5 0.375ZM15.5 27.375C13.0525 27.375 10.6599 26.6492 8.62482 25.2894C6.58977 23.9297 5.00363 21.9969 4.067 19.7357C3.13036 17.4745 2.8853 14.9863 3.36279 12.5858C3.84028 10.1852 5.01889 7.98023 6.74956 6.24955C8.48024 4.51888 10.6852 3.34027 13.0858 2.86278C15.4863 2.38529 17.9745 2.63036 20.2357 3.56699C22.497 4.50363 24.4297 6.08976 25.7894 8.12482C27.1492 10.1599 27.875 12.5525 27.875 15C27.8713 18.2809 26.5663 21.4264 24.2463 23.7463C21.9264 26.0663 18.7809 27.3713 15.5 27.375ZM8.75001 12.1875C8.75001 11.8537 8.84898 11.5275 9.0344 11.25C9.21983 10.9725 9.48338 10.7562 9.79173 10.6285C10.1001 10.5007 10.4394 10.4673 10.7667 10.5324C11.0941 10.5975 11.3947 10.7583 11.6307 10.9943C11.8668 11.2303 12.0275 11.5309 12.0926 11.8583C12.1577 12.1856 12.1243 12.5249 11.9966 12.8333C11.8688 13.1416 11.6525 13.4052 11.375 13.5906C11.0975 13.776 10.7713 13.875 10.4375 13.875C9.98995 13.875 9.56073 13.6972 9.24426 13.3807C8.9278 13.0643 8.75001 12.6351 8.75001 12.1875ZM22.25 12.1875C22.25 12.5213 22.151 12.8475 21.9656 13.125C21.7802 13.4025 21.5166 13.6188 21.2083 13.7465C20.8999 13.8743 20.5606 13.9077 20.2333 13.8426C19.9059 13.7775 19.6053 13.6167 19.3693 13.3807C19.1333 13.1447 18.9725 12.8441 18.9074 12.5167C18.8423 12.1894 18.8757 11.8501 19.0035 11.5417C19.1312 11.2334 19.3475 10.9698 19.625 10.7844C19.9025 10.599 20.2288 10.5 20.5625 10.5C21.0101 10.5 21.4393 10.6778 21.7557 10.9943C22.0722 11.3107 22.25 11.7399 22.25 12.1875ZM22.0995 18.9375C20.6525 21.4392 18.2464 22.875 15.5 22.875C12.7536 22.875 10.3489 21.4406 8.90188 18.9375C8.82048 18.8095 8.76583 18.6663 8.7412 18.5166C8.71658 18.3668 8.72249 18.2137 8.75859 18.0663C8.79469 17.9189 8.86022 17.7804 8.95125 17.659C9.04228 17.5376 9.15693 17.4359 9.28829 17.36C9.41965 17.284 9.56501 17.2355 9.71563 17.2172C9.86625 17.1989 10.019 17.2112 10.1647 17.2535C10.3105 17.2958 10.4461 17.3671 10.5636 17.4632C10.681 17.5592 10.7778 17.6781 10.8481 17.8125C11.8986 19.628 13.5495 20.625 15.5 20.625C17.4505 20.625 19.1014 19.6266 20.1505 17.8125C20.2997 17.554 20.5454 17.3654 20.8337 17.2882C21.1219 17.2109 21.429 17.2513 21.6875 17.4005C21.946 17.5497 22.1346 17.7954 22.2119 18.0836C22.2891 18.3719 22.2487 18.679 22.0995 18.9375Z"
                  fill="#33FF00"
                />
              </svg>
            </p>
          </div>
          <p>Elevate your look, define your presence</p>
          <sub>55 PORTMAN ST; OAKLEIGH VIC 3166; AUSTRALIA</sub>
          <svg
            className="w-7 mt-20"
            viewBox="0 0 55 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50.582 0.216618L54.9987 4.63745L30.9279 28.7166C30.5422 29.1048 30.0835 29.4128 29.5783 29.623C29.0731 29.8332 28.5313 29.9414 27.9841 29.9414C27.4369 29.9414 26.8951 29.8332 26.3899 29.623C25.8847 29.4128 25.4261 29.1048 25.0404 28.7166L0.957032 4.63745L5.3737 0.220782L27.9779 22.8208L50.582 0.216618Z"
              fill="#33FF00"
            />
          </svg>
        </div>
      </section>

      <section className="flex flex-col justify-center items-center">
        <h2 className="text-[#33FF00]">OUR SERVICES</h2>
        <p>Simple and Effective Pricing for that Fresh Looks</p>

        <div className="flex gap-8 mt-20 px-6 md:w-max w-full overflow-x-auto">
          <div className="flex flex-col justify-between bg-[#262626] rounded-xl w-[250px] p-2">
            <div className="flex flex-col">
              <img
                className="mb-4"
                src={haircut}
                width={500}
                height={500}
                alt="haircut"
              />
              <h3>Haircut</h3>
              <p>
                Men's haircut start from $50 depending on which barber you would
                like.
              </p>
            </div>

            <div className="flex gap-8 justify-between mt-6">
              <h2 className="text-[#33FF00]">$50</h2>
              {generateLink(
                <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#33FF00] font-bold hover:bg-[#33FF00]/80 text-black h-9 px-4 py-2">
                  PRICING PLANS
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col bg-[#262626] rounded-xl w-[250px] p-2">
            <img
              className="mb-4"
              src={beard}
              width={500}
              height={500}
              alt="haircut"
            />
            <h3>Haircut & Beard</h3>
            <p>
              Men's haircut and beard trims starts from $75 depending on which
              barber you would like.
            </p>

            <div className="flex gap-8 justify-between mt-6">
              <h2 className="text-[#33FF00]">$75</h2>
              {generateLink(
                <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#33FF00] font-bold hover:bg-[#33FF00]/80 text-black h-9 px-4 py-2">
                  PRICING PLANS
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center items-center">
        <h2 className="text-[#33FF00]">GALLERY</h2>
        <p>Our Results</p>

        <InstagramSection
          instagram_images_desktop={instagram_images_desktop}
          instagram_images_mobile={instagram_images_mobile}
        />
      </section>

      <section className="flex flex-col justify-center items-center md:pb-40">
        <h2 className="text-[#33FF00] text-center">
          FREQUENTLY ASKED <br />
          QUESTIONS
        </h2>
        <div className="py-4 px-4 my-12 relative z-20 w-full md:w-2/3 mx-auto">
          <Accordion
            type="single"
            collapsible
            className="flex border pb-12 border-[#05FF00] rounded-[36px] p-12 pt-6 flex-col gap-8 bg-[#101010] shadow-[0px_4px_39px_31px_rgba(0,244,24,0.1)] font-light"
          >
            <AccordionItem
              value="item-1"
              className="py-2 px-4 border-b border-white/30 font-light group ease-in-out duration-300"
            >
              <AccordionTrigger className="relative z-10 ">
                <div className="font-bold text-lg group-hover:translate-x-2 ease-in-out duration-300">
                  What services do you offer?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-stone-300 group-hover:translate-x-2 ease-in-out duration-300">
                We specialize in all types of hair textures and offer men's haircuts starting from $50, and haircut & beard trims starting from $75 (depending on your chosen barber). We provide traditional styled & dapper haircuts, smooth razor shaves, and close fades in a clean & safe environment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-2"
              className="py-2 px-4 border-b border-white/30 font-light group ease-in-out duration-300"
            >
              <AccordionTrigger className="relative z-10 ">
                <div className="font-bold text-lg group-hover:translate-x-2 ease-in-out duration-300">
                  Where are you located and how can I contact you?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-stone-300 group-hover:translate-x-2 ease-in-out duration-300">
                We're located at 55 Portman St, Oakleigh VIC 3166, Australia. You can contact us via phone at +6135 249 543, email us at dejan@fadedlinesbarbershop.com, or follow us on Instagram @fadedlinesbarbershop for updates and our latest work.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-3"
              className="py-2 px-4 border-b border-white/30 font-light group ease-in-out duration-300"
            >
              <AccordionTrigger className="relative z-10 ">
                <div className="font-bold text-lg group-hover:translate-x-2 ease-in-out duration-300">
                  Do you accept walk-ins or appointments only?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-stone-300 group-hover:translate-x-2 ease-in-out duration-300">
                Faded Lines Barbershop offers both appointments and walk-ins to bring convenience back into people's lives. We recommend booking an appointment for guaranteed service times, but we also welcome walk-ins based on availability. Our pricing is determined by demand and the experience level of your chosen barber.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-4"
              className="py-2 px-4 border-b border-white/30 font-light group ease-in-out duration-300"
            >
              <AccordionTrigger className="relative z-10 ">
                <div className="font-bold text-lg group-hover:translate-x-2 ease-in-out duration-300">
                  What makes Faded Lines Barbershop special?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-stone-300 group-hover:translate-x-2 ease-in-out duration-300">
                We're an award-winning barbershop that provides great services at a professional standard. Our team is committed to making clients feel welcome in a clean & safe environment. We've served over 5000+ happy customers and are well-known on TikTok for our quality work. Our goal is to ensure you leave feeling confident with every visit.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </Layout>
  );
}
