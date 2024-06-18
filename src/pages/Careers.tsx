
import Layout from "@/components/WebLayout";
import EmeraldFooter from "@/assets/svg/EmeraldFooter.svg";
import EmeraldFooterRight from "@/assets/svg/EmeraldFooterRight.svg";
import EmeraldFooterLeft from "@/assets/svg/EmeraldFooterleft.svg";
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
import Clipper from "@/assets/svg/clipper.svg"
import { Button } from "@/components/ui/button";
import TiktokUpBefore from "@/assets/svg/TiktokUpBefore.svg";
import TiktokUpAfter from "@/assets/svg/TiktokUpAfter.svg";
import ArrowTiktokTrans from "@/assets/svg/ArrowTiktokTrans.svg";
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react";

export default function Careers() {
      const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [1, 0]);

    // Define your form schema.
    const formSchema = z.object({
        fullName: z.string().min(2).max(50),
        email: z.string().email(),
        phoneNumber: z.string().min(10).max(15),
    });

    // Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        // Define the base URL of your Typeform.
        const typeformUrl = "https://muhzulzidan.typeform.com/to/JbH9TjLn";

        // Define the parameters for pre-filling the Typeform.
        // Replace 'name', 'email', and 'phone' with the actual field IDs from your Typeform.
        const params = new URLSearchParams({
            'email': values.email,
            'name': values.fullName,
            'phone': values.phoneNumber,
        });

        // https://muhzulzidan.typeform.com/to/JbH9TjLn#email=xxxxx&name=xxxxx&phone=xxxxx

        // Redirect to the Typeform with the fields pre-filled.
        window.location.href = `${typeformUrl}#${params.toString()}`;
    }
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
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1  gap-4 pb-12 ">
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
                        <h3>Before working with us 👉</h3>
                        <img src={TiktokUpBefore} alt="TiktokUp" className="w-full hover:scale-105 transform transition-transform ease-out duration-500 cursor-pointer delay-75" />
                    </div>
                    <img src={ArrowTiktokTrans} alt="TiktokUp" className="w-fit rotate-90 md:rotate-0" />
                    <div className="flex flex-col gap-4 items-center">
                        <h3>After working with us 👑</h3>
                        <img src={TiktokUpAfter} alt="TiktokUp" className="w-full hover:scale-105 transform transition-transform ease-out duration-500 cursor-pointer delay-75" />
                    </div>
                </section>
            </div>
        </Layout>
    );
}
