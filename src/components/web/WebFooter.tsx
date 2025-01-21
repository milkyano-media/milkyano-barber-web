import React from 'react';
import { Link } from 'react-router-dom';

import Logo from "@/assets/web/icons/logo.svg"
import Facebook from "@/assets/web/icons/Facebook.svg"
import Instagram from "@/assets/web/icons/Instagram.svg"
import Youtube from "@/assets/web/icons/Youtube.svg"
import Tiktok from "@/assets/web/icons/Tiktok.svg"


const WebFooter: React.FC = () => {
  return (
    <footer className=" bg-gradient-to-r from-[#051706] via-[#041606] to-[#020302]  text-stone-50 relative z-10 "

    >
      <div id='GradientBorder' className='flex justify-center items-center py-8 bg-gradient-to-r from-[#030B02] to-[#0F330A] px-4 md:px-0 text-center '>
        <h3 className='text-xl md:text-3xl font-extrabold w-full'>GET YOUR <span className='text-transparent bg-gradient-to-r from-[#42FF00]  to-[#79FF86] bg-clip-text'>FRESH CUT NOW</span></h3>
      </div>
      <div className="container mx-auto py-12 flex flex-col md:flex-row  justify-between relative z-0">
        <div className='flex flex-col pb-12 md:py-0 justify-center items-center'>
          <img src={Logo} alt="barber shop faded lines" className='w-[20rem] h-auto' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 w-full md:w-2/3 gap-4 md:gap-0 text-sm'>
          <div>
            <h4 className=' mb-4 font-poppins font-medium'>Working Hours</h4>
            <ul className="flex flex-col font-light gap-2 text-stone-400 text-xs">
              <li>
                <Link to="https://g.co/kgs/sdqFwMj" target="_blank" className="hover:text-stone-50">Monday 12 AM - 9 PM</Link>
              </li>
              <li>
                <Link to="https://g.co/kgs/sdqFwMj" target="_blank" className="hover:text-stone-50">Tuesday 12 AM - 9 PM</Link>
              </li>
              <li>
                <Link to="https://g.co/kgs/sdqFwMj" target="_blank" className="hover:text-stone-50">Wednesday 12 AM - 9 PM</Link>
              </li>
              <li>
                <Link to="https://g.co/kgs/sdqFwMj" target="_blank" className="hover:text-stone-50">Thursday 10 AM - 9 PM</Link>
              </li>
              <li>
                <Link to="https://g.co/kgs/sdqFwMj" target="_blank" className="hover:text-stone-50">Friday 10 AM - 8 PM</Link>
              </li>
              <li>
                <Link to="https://g.co/kgs/sdqFwMj" target="_blank" className="hover:text-stone-50">Saturday 9 AM - 8 PM</Link>
              </li>
              <li>
                <Link to="https://g.co/kgs/sdqFwMj" target="_blank" className="hover:text-stone-50">Sunday 10 AM - 8 PM</Link>
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-4 relative z-40'>
            <h4 className='text-sm font-poppins font-medium'>Navigate</h4>
            <ul className="flex flex-col font-light gap-2 text-xs text-stone-400">
              <li><Link to="/barbers" className="hover:text-stone-50" >Barbers</Link></li>
              <li><Link to="/gallery" className="hover:text-stone-50">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-stone-50">About Us</Link></li>
              <li><a href=" https://book.squareup.com/appointments/ud9yhcwfqc1fg0/location/LY7BZ89WAQ2QS/services" className="hover:text-stone-50">Book an Appointment</a></li>

            </ul>
          </div>
          <div className='flex flex-col gap-4 relative z-[99999999]'>
            <h4 className='text-sm font-poppins font-medium'>Follow Us On</h4>
            <ul className="flex gap-4 font-light text-xs relative z-40">
              <li>
                <a href="https://www.instagram.com/fadedlinesbarbershop" className="text-md uppercase font-black hover:text-stone-50 opacity-40 hover:opacity-100 relative z-50">
                  <img alt='instagram' src={Instagram} className='w-8 h-auto' />
                </a>
              </li>

              <li>
                <a href="https://www.facebook.com/p/Faded-Lines-Barbershop-100066737611092/" className="text-md uppercase font-black hover:text-stone-50 opacity-40 hover:opacity-100 ">
                  <img alt='Facebook' src={Facebook} className='w-8 h-auto' />
                </a>
              </li>

              <li>
                <a href="https://www.tiktok.com/@faded_lines" className="text-md uppercase font-black hover:text-stone-50 opacity-40 hover:opacity-100 ">
                  <img alt='Tiktok' src={Tiktok} className='w-8 h-auto' />
                </a>
              </li>

              <li>
                <a href="https://www.youtube.com/@Faded_Lines" className="text-md uppercase font-black hover:text-stone-50 opacity-40 hover:opacity-100 ">
                  <img alt='Youtube' src={Youtube} className='w-8 h-auto' />
                </a>
              </li>
            </ul>
          </div>


        </div>
      </div>
      <div className='container mx-auto  flex justify-center flex-col items-center pb-12'>
        {/* add social Media icons here  */}

        <hr className='bg-[#75FF72] w-full flex justify-center items-center my-2 mt-5 h-[1px] border-[#75FF72]' />

        <p className="text-start text-xs md:text-sm w-full text-transparent bg-gradient-to-r from-[#52FF00] via-slate-50  to-[#ffffff] bg-clip-text">Copyright © 2025 fadedlinesbarbershop.com - All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default WebFooter;