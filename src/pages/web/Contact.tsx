import { useState } from 'react';
import Layout from "@/components/web/WebLayout";
import { Button } from "@/components/ui/button";
import { Instagram, X } from "react-bootstrap-icons"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Check } from 'react-bootstrap-icons'; // Import a checkmark icon
import { Helmet } from 'react-helmet-async';
import emailjs from '@emailjs/browser'
import Spinner from '@/components/web/Spinner';

import EmeraldFooter from "@/assets/web/emerald_footer_mobile.svg";
import EmeraldFooterRight from "@/assets/web/emerald_footer_right.svg";
import EmeraldFooterLeft from "@/assets/web/emerald_footer_left.svg";

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Email is required' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

export default function Contacts() {

  // Define your states
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('loading');

  // 2. Define a submit handler.
  const sendEmail = (values: z.infer<typeof formSchema>) => {
    // Set loading state to true
    setIsLoading(true);
    // Set status to 'loading'
    setStatus('loading');


    emailjs
      .send(
        'service_17yipta',
        'template_7ntlsoq',
        values,
        'PU6n8YWPBebpTnMYU'
      )
      .then(() => {
        // alert('Message successfully sent!');
        // Set status to 'succeeded'
        setStatus('succeeded');

        // Wait for 2 seconds before setting isLoading to false
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      })
      .catch(() => {
        // Set status to 'failed'
        setStatus('failed');

        // Wait for 2 seconds before setting isLoading to false
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        // alert('Failed to send the message, please try again!');
      });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  return (
    <Layout>
      <Helmet>
        <title>Contact - Fadelines Barber Shop</title>
        <meta name="description" content="Fadelines - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:title" content="Fadelines Barber Shop" />
        <meta property="og:description" content="Fadelines - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:image" content="URL to Fadelines' preview image" />
        <meta property="og:url" content="URL to Fadelines' website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="flex flex-col md:flex-row  text-stone-50 bg-stone-950 md:bg-black w-full relative">
        <img src={EmeraldFooter} alt="EmeraldFooter.svg" className="md:hidden block absolute bottom-[-10rem] md:bottom-[-26rem] z-0 left-0" />
        <img src={EmeraldFooterRight} alt="EmeraldFooter.svg" className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 right-0" />
        <img src={EmeraldFooterLeft} alt="EmeraldFooter.svg" className="absolute hidden md:block bottom-[-10rem] md:bottom-[-26rem] z-0 left-0" />

        {/* {isLoading && <Spinner />} */}
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

        <div className="container md:min-h-[80vh] pb-12 md:py-32 md:my-0  flex flex-col md:flex-row md:justify-between md:items-center md:flex ">
          <section className=" w-full md:w-5/12  relative flex flex-col items-center text-center pt-12 pb-0 md:py-0 md:text-start md:justify-start md:items-start">
            <div className="w-full px-4 md:px-0 py-8 md:pb-10 md:pt-0  flex flex-col gap-4 justify-center items-center md:text-start md:justify-start md:items-start">
              <h3 className="text-5xl md:text-3xl font-extrabold w-full  mx-auto md:m-0 text-transparent bg-gradient-to-r from-[#42FF00]  to-[#79FF86] bg-clip-text md:pb-2 tracking-wider">Contact Us</h3>
              <div className="text-2xl md:text-4xl py-2 font-extrabold tracking-wider">
                <p className="">Have Questions?</p>
                <p className="">Want to Join Us?</p>
              </div>
              <p className="text-xs w-8/12 md:text-base text-center md:text-start font-light">We offer a plethora of ways you can get in touch with us. Feel free to fulfill the form on the right and send us a message.</p>
            </div>
            <section className="relative hidden md:block z-30">
              <h4 className="text-xl pb-12 md:pb-0 text-[#00FF19] font-extrabold text-center md:text-start md:tracking-wider ">
                Or get in touch directly through
              </h4>
              <div className="flex flex-col w-full px-4 md:px-0 font-medium py-4 gap-4 pb-24 md:pb-0 text-xs md:text-base">
                <a href='https://mail.google.com/mail/u/0/?fs=1&to=dejan@fadelinesbarbeshop.com&su=Hello,+I+Want+to+Collaborate&body&bcc=%22&tf=cm' style={{
                  backdropFilter: 'blur(16px) contrast(100%)', WebkitBackdropFilter: 'blur(16px) contrast(100%)'
                }} className="group grid grid-cols-5 md:flex md gap-4 justify-start items-center p-4 pr-10 backdrop-blur-lg bg-stone-950/60 shadow-xl shadow-black/80 rounded-xl hover:bg-stone-50 cursor-pointer hover:text-stone-950 text-stone-50 transition-all   md:w-[30rem]">
                  <div className="group-hover:bg-stone-900 bg-stone-100 rounded-2xl p-2 w-fit flex justify-center items-center shadow-lg shadow-black/30 transition-all duration-100 ">
                    <Mail className="w-6 h-auto text-[#00FF19]" />
                  </div>
                  <div className="flex flex-col col-span-3 gap-0  break-all opacity-100 group-hover:opacity-0 transition-all duration-100 ">
                    <p className="text-xs font-light">Email:</p>
                    <h5 className="font-medium">dejan@fadelinesbarbershop.com</h5>
                  </div>
                  <div className="flex absolute left-20 flex-col col-span-3 gap-0  break-all opacity-0 group-hover:opacity-100 transition-all  duration-100 ">
                    <h5 className="font-medium">Send Email</h5>
                  </div>
                </a>
                <a href='tel:0390021055' className="grid grid-cols-5 md:flex  gap-4 md:justify-start justify-center items-center p-4 backdrop-blur-lg bg-stone-950/60 shadow-xl shadow-black/80  rounded-xl hover:bg-stone-50 cursor-pointer hover:text-stone-950 text-stone-50 transition-all  group" style={{
                  backdropFilter: 'blur(16px) contrast(100%)', WebkitBackdropFilter: 'blur(16px) contrast(100%)'
                }} >
                  <div className="group-hover:bg-stone-900 bg-stone-100 rounded-2xl p-2 w-fit flex justify-center items-center shadow-lg shadow-black/30 transition-all duration-500 ">
                    <Phone className="w-6 h-auto text-[#00FF19]" />
                  </div>

                  <div className="flex flex-col col-span-3 gap-0  break-all opacity-100 group-hover:opacity-0 transition-all duration-100 ">
                    <p className="text-xs font-light">Phone:</p>
                    <h5 className="font-medium">(03) 9002 1055</h5>
                  </div>
                  <div className="flex absolute left-20 flex-col col-span-3 gap-0  break-all opacity-0 group-hover:opacity-100 transition-all  duration-100 ">
                    <h5 className="font-medium">Call Us</h5>
                  </div>
                </a>
                <a href='https://www.instagram.com/fadedlinesbarbershop' target='_blank' className="grid grid-cols-5 md:flex gap-4 justify-center md:justify-start items-center p-4 backdrop-blur-lg bg-stone-950/60 shadow-xl shadow-black/80 rounded-xl  hover:bg-stone-50 cursor-pointer hover:text-stone-950 text-stone-50 transition-all group" style={{
                  backdropFilter: 'blur(16px) contrast(100%)', WebkitBackdropFilter: 'blur(16px) contrast(100%)'
                }} >
                  <div className="group-hover:bg-stone-900 bg-stone-100 rounded-2xl p-2 w-fit flex justify-center items-center shadow-lg shadow-black/30 transition-all duration-500 ">
                    <Instagram className="w-6 h-auto text-[#00FF19]" />
                  </div>
                  <div className="flex flex-col col-span-3 gap-0  break-all opacity-100 group-hover:opacity-0 transition-all duration-100 ">
                    <p className="text-xs font-light">Instagram Page:</p>
                    <h5 className="font-medium">@fadedlinesbarbershop</h5>
                  </div>
                  <div className="flex absolute left-20 flex-col col-span-3 gap-0  break-all opacity-0 group-hover:opacity-100 transition-all  duration-100 ">
                    <h5 className="font-medium">Follow Us</h5>
                  </div>
                </a>
              </div>
            </section>
          </section>

          <section className="pb-24 md:pb-0 flex flex-col relative z-30  md:min-h-[65%] md:w-1/2 justify-center ">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(sendEmail)} className="flex p-12 gap-8 md:gap-12 flex-col  bg-stone-950/50 backdrop-blur-lg shadow-lg  md:px-16 md:py-12 md:pb-24 rounded-xl text-stone-950 h-full w-full relative " id='gradientBoxContactUs' style={{ backdropFilter: 'blur(16px) contrast(100%)', WebkitBackdropFilter: 'blur(16px) contrast(100%)' }} >
                <div className="flex gap-4 w-full justify-between z-50">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-4 w-full justify-between z-50">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="mail@fade.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+12555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='z-50'>
                  <FormField

                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave us a message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Type Here..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button variant={"ghost"} type="submit" className=" w-fit rounded-full text-stone-50 bg-stone-950 uppercase font-bold hover:bg-stone-50 hover:text-stone-950  hover:bg-clip-border transform hover:scale-110 transition-transform duration-500 ease-in-out hover:shadow-sm    md:text-2xl md:px-7 md:py-6 md:rounded-2xl border border-stone-50" >Send Message</Button>
              </form>
            </Form>
          </section>

          <section className="relative block md:hidden z-30">
            <h4 className="text-xl pb-12 md:pb-0 text-[#00FF19] font-extrabold text-center md:text-start md:tracking-wider ">
              Or get in touch directly through
            </h4>
            <div className="flex flex-col w-full px-4 md:px-0 font-medium py-4 gap-4 pb-24 md:pb-0 text-xs md:text-base">
              <a href='https://mail.google.com/mail/u/0/?fs=1&to=dejan@fadelinesbarbeshop.com&su=Hello,+I+Want+to+Collaborate&body&bcc=%22&tf=cm' style={{
                backdropFilter: 'blur(16px) contrast(100%)', WebkitBackdropFilter: 'blur(16px) contrast(100%)'
              }} className="group grid grid-cols-5 md:flex md gap-4 justify-start items-center p-4 pr-10 backdrop-blur-lg bg-stone-950/60 shadow-xl shadow-black/80 rounded-xl hover:bg-stone-50 cursor-pointer hover:text-stone-950 text-stone-50 transition-all   md:w-[30rem]">
                <div className="group-hover:bg-stone-900 bg-stone-100 rounded-2xl p-2 w-fit flex justify-center items-center shadow-lg shadow-black/30 transition-all duration-100 ">
                  <Mail className="w-6 h-auto text-[#00FF19]" />
                </div>
                <div className="flex flex-col col-span-3 gap-0  break-all opacity-100 group-hover:opacity-0 transition-all duration-100 ">
                  <p className="text-xs font-light">Email:</p>
                  <h5 className="font-medium">dejan@fadelinesbarbershop.com</h5>
                </div>
                <div className="flex absolute left-20 flex-col col-span-3 gap-0  break-all opacity-0 group-hover:opacity-100 transition-all  duration-100 ">
                  <h5 className="font-medium">Send Email</h5>
                </div>
              </a>
              <a href='tel:0390021055' className="grid grid-cols-5 md:flex  gap-4 md:justify-start justify-center items-center p-4 backdrop-blur-lg bg-stone-950/60 shadow-xl shadow-black/80  rounded-xl hover:bg-stone-50 cursor-pointer hover:text-stone-950 text-stone-50 transition-all  group" style={{
                backdropFilter: 'blur(16px) contrast(100%)', WebkitBackdropFilter: 'blur(16px) contrast(100%)'
              }} >
                <div className="group-hover:bg-stone-900 bg-stone-100 rounded-2xl p-2 w-fit flex justify-center items-center shadow-lg shadow-black/30 transition-all duration-500 ">
                  <Phone className="w-6 h-auto text-[#00FF19]" />
                </div>

                <div className="flex flex-col col-span-3 gap-0  break-all opacity-100 group-hover:opacity-0 transition-all duration-100 ">
                  <p className="text-xs font-light">Phone:</p>
                  <h5 className="font-medium">(03) 9002 1055</h5>
                </div>
                <div className="flex absolute left-20 flex-col col-span-3 gap-0  break-all opacity-0 group-hover:opacity-100 transition-all  duration-100 ">
                  <h5 className="font-medium">Call Us</h5>
                </div>
              </a>
              <a href='https://www.instagram.com/fadedlinesbarbershop' target='_blank' className="grid grid-cols-5 md:flex gap-4 justify-center md:justify-start items-center p-4 backdrop-blur-lg bg-stone-950/60 shadow-xl shadow-black/80 rounded-xl  hover:bg-stone-50 cursor-pointer hover:text-stone-950 text-stone-50 transition-all group" style={{
                backdropFilter: 'blur(16px) contrast(100%)', WebkitBackdropFilter: 'blur(16px) contrast(100%)'
              }} >
                <div className="group-hover:bg-stone-900 bg-stone-100 rounded-2xl p-2 w-fit flex justify-center items-center shadow-lg shadow-black/30 transition-all duration-500 ">
                  <Instagram className="w-6 h-auto text-[#00FF19]" />
                </div>
                <div className="flex flex-col col-span-3 gap-0  break-all opacity-100 group-hover:opacity-0 transition-all duration-100 ">
                  <p className="text-xs font-light">Instagram Page:</p>
                  <h5 className="font-medium">@fadedlinesbarbershop</h5>
                </div>
                <div className="flex absolute left-20 flex-col col-span-3 gap-0  break-all opacity-0 group-hover:opacity-100 transition-all  duration-100 ">
                  <h5 className="font-medium">Follow Us</h5>
                </div>
              </a>
            </div>
          </section>
        </div>


      </div>
    </Layout>
  );
}
