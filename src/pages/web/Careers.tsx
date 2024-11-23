
import Layout from "@/components/web/WebLayout";
import { Helmet } from "react-helmet-async";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import emailjs from '@emailjs/browser'

import EmeraldFooter from "@/assets/web/emerald_footer_mobile.svg";
import EmeraldFooterRight from "@/assets/web/emerald_footer_right.svg";
import EmeraldFooterLeft from "@/assets/web/emerald_footer_left.svg";

import TiktokUpBefore from "@/assets/web/careers/tiktok_before.svg";
import TiktokUpAfter from "@/assets/web/careers/tiktok_after.svg";
import ArrowTiktokTrans from "@/assets/web/careers/arrow_tiktok_trans.svg";
import Clipper from "@/assets/web/careers/clipper.svg"
import Spinner from "@/components/web/Spinner";
import { Check, X } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";

export default function Careers() {
  const ref = useRef(null)
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('loading');

  localStorage.removeItem('booking_source');

  const location = useLocation()

  const getQueryParams = (search: string) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);
  const fbclid = queryParams.get('fbclid')
  const ttclid = queryParams.get('ttclid')
  const gclid = queryParams.get('gclid')

  const trackingData = {
    utm_source: queryParams.get("utm_source"),
    utm_medium: queryParams.get("utm_medium"),
    utm_campaign: queryParams.get("utm_campaign"),
    utm_content: queryParams.get("utm_content"),
    fbclid: queryParams.get("fbclid"),
  };

  localStorage.setItem('booking_source', JSON.stringify(trackingData))

  if (trackingData.fbclid && trackingData.utm_source) {
    localStorage.setItem('customer_source', JSON.stringify(trackingData))
  }

  localStorage.setItem('utm_source', queryParams.get('utm_source') || 'None')
  localStorage.setItem('utm_medium', queryParams.get('utm_medium') || 'None')
  localStorage.setItem('utm_campaign', queryParams.get('utm_campaign') || 'None')
  localStorage.setItem('utm_content', queryParams.get('utm_content') || 'None')

  if (fbclid) { localStorage.setItem('booking_origin', 'facebook') }
  else if (ttclid) { localStorage.setItem('booking_origin', 'tiktok') }
  else if (gclid) { localStorage.setItem('booking_origin', 'google') }
  else { localStorage.setItem('booking_origin', 'organic') }

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const formSchema = z.object({
    fullName: z.string().min(2).max(50),
    email: z.string().email(),
    phoneNumber: z.string().min(10).max(15),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const sendEmail = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setStatus('loading');

    emailjs
      .send(
        'service_8g1wzub',
        'template_oqnkkb8',
        values,
        'dVQ8-b1hMOSkncafw'
      )
      .then(() => {
        setStatus('succeeded');

        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      })
      .catch(() => {
        setStatus('failed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });
  };

  return (
    <Layout>
      <Helmet>
        <title>Careers -  Fadelines Barber Shop</title>
        <meta name="description" content="Fadelines - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:title" content="Fadelines Barber Shop" />
        <meta property="og:description" content="Fadelines - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:image" content="URL to Fadelines' preview image" />
        <meta property="og:url" content="URL to Fadelines' website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="flex flex-col text-stone-50 bg-black w-full relative tracking-wider">

        <img src={EmeraldFooter} alt="EmeraldFooter.svg" className="md:hidden block absolute bottom-[-10rem] md:bottom-[-26rem] z-0 left-0" />

        <img src={EmeraldFooterRight} alt="EmeraldFooter.svg" className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 right-0" />
        <img src={EmeraldFooterLeft} alt="EmeraldFooter.svg" className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 left-0" />

        <AlertDialog open={isLoading} onOpenChange={setIsLoading} >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-center'>
                Sending Email
              </AlertDialogTitle>
              <AlertDialogDescription>
                {status === 'loading' ? <Spinner /> :
                  status === 'succeeded' ?
                    <div className="flex justify-center items-center p-4  md:p-12 animate-scaleIn">
                      <div className='p-1  rounded-full border border-[#24FF00]'>
                        <Check className="h-24 w-auto md:h-24 md:w-24 text-[#24FF00] " />
                      </div>
                    </div>
                    :
                    status === 'failed' ? <div className="flex justify-center items-center p-4  md:p-12 animate-scaleIn">
                      <div className='p-1  rounded-full border border-red-600'>
                        <X className="h-24 w-auto md:h-24 md:w-24 text-red-600 " />
                      </div>
                    </div> : null}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>

        <section className="flex gap-4 md:gap-32 flex-col md:flex-row relative z-30 container justify-center md:pt-12  items-center ">
          <section className="md:w-6/12">
            <section className="pb-12 md:pb-14 ">
              <section className=" w-full relative flex flex-col items-center text-center md:text-start md:items-start pt-12  md:pt-0 ">
                <div className="w-full  md:px-0 pt-12 flex flex-col gap-4 ">
                  <h3 className="text-3xl md:text-7xl tracking-wider font-extrabold flex flex-col leading-10 w-full font-inter">
                    <span className=""> JOIN THE BEST </span>

                    <span className="text-transparent bg-gradient-to-r from-[#42FF00]  to-[#79FF86] bg-clip-text leading-tight">BARBERSHOP <br /> IN MELBOURE</span>
                  </h3>
                  <p className="text-sm font-light">Are you qualified to be in our team?</p>
                </div>
              </section>
            </section>
            <section className="">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(sendEmail)} className="grid grid-cols-1  gap-4 pb-12 ">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col justify-center items-center">
                        <FormLabel className="w-full flex justify-center md:justify-start uppercase ">
                          <span className="text-stone-50 font-extrabold text-lg text-center md:text-start w-full pb-4">NAME</span>
                        </FormLabel>
                        <FormControl>
                          <Input className="shadow-none bg-stone-950 rounded-md" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col justify-center items-center">
                        <FormLabel className="w-full flex justify-center  uppercase ">
                          <span className="text-stone-50 font-extrabold text-lg text-center w-full pb-4 md:text-start">EMAIL</span>
                        </FormLabel>
                        <FormControl>
                          <Input className="shadow-none bg-stone-950 rounded-md" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col justify-center items-center">
                        <FormLabel className="w-full flex justify-center  uppercase ">
                          <span className="text-stone-50 font-extrabold text-lg text-center w-full pb-4 md:text-start">PHONE NUMBER</span>
                        </FormLabel>
                        <FormControl>
                          <Input className="shadow-none bg-stone-950 rounded-md" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="bg-stone-950 text-stone-50 border border-stone-50 hover:bg-stone-50 hover:text-stone-950 rounded-full w-fit px-8 mt-12 md:mt-6 font-extrabold justify-self-center lg:justify-self-start hover:bg-clip-border transform hover:scale-110  transition-transform duration-500 delay-75 ease-in-out hover:shadow-sm " type="submit">CONTINUE</Button>
                </form>
              </Form>

            </section>
          </section>
          <section className="w-7/12 md:w-3/12 pt-12 pb-24 md:pb-0 md:pt-0">
            <img src={Clipper} alt="clipper" className="w-full" />
          </section>
        </section>
        <section ref={ref}>
          <div className=" w-full flex justify-center  relative" >
            <div className="h-[10rem] w-[1px] bg-[#086600] z-0" />
            <motion.div className="absolute h-[10rem] w-[2px] bg-gradient-to-b from-[#096601] to-[#15ff00] shadow-[0px_0px_70px_2px_#15ff00] origin-top z-10" style={{ scaleY }} />
          </div>
        </section>
        <section className="w-1/2 flex flex-col md:flex-row self-center justify-center items-center relative z-30 py-32 pb-[20rem] gap-8 font-bold text-center">
          <div className="flex flex-col gap-4 items-center">
            <h3 className="text-3xl rotate-90 md:rotate-0">👉</h3>
            <h4><span className="text-transparent bg-gradient-to-r from-[#AE0000]  to-[#FF7979] bg-clip-text">Before</span> working with us </h4>
            <img src={TiktokUpBefore} alt="TiktokUp" className="w-full hover:scale-105 transform transition-transform ease-out duration-500 cursor-pointer delay-75" />
          </div>
          <img src={ArrowTiktokTrans} alt="TiktokUp" className="w-fit rotate-90 md:rotate-0" />
          <div className="flex flex-col gap-4 items-center">
            <h3 className="text-3xl">👑</h3>
            <h4><span className="text-transparent bg-gradient-to-r from-[#00FF29]  to-[#B2FFBF] bg-clip-text">After</span> working with us </h4>
            <img src={TiktokUpAfter} alt="TiktokUp" className="w-full hover:scale-105 transform transition-transform ease-out duration-500 cursor-pointer delay-75" />
          </div>
        </section>
      </div>
    </Layout>
  );
}
