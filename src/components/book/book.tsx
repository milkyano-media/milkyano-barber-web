// import React from 'react';
import { Button } from '@/components/ui/button';
import LogoIconSvg from "@/assets/svg/Fadedlines.svg"
import GradientTop from "@/assets/landing/book_circle_top.svg"
import GradientBottom from "@/assets/landing/book_circle_bottom.svg"
import React from 'react';
import { Link } from 'react-router-dom';

interface Book {
  [x: string]: string;
  name: string;
  url: string;
  description: string;
  details: string;
  price: string;
}

interface BookSectionProps {
  bookData: Book[];
  title: string;
  instagramHandle: string;
}

const BookSection: React.FC<BookSectionProps> = ({ bookData, title, instagramHandle }) => {
  console.log(bookData, "bookData")
  return (
    <section className="relative bg-[#010401] flex flex-col gap-4 p-4 py-12 items-center justify-center z-30 md:px-24 rounded-[3rem] mx-4" id='gradientBoxContactUs' >
      {/* <LogoIcon className='w-1/2'/> */}

      <img src={GradientTop} alt="gradient top" className='absolute top-0 right-0 w-[20rem] rounded-[3rem]' />
      <img src={GradientBottom} alt="gradient top" className='absolute bottom-0 left-0 w-[20rem] rounded-[3rem]' />

      <img src={LogoIconSvg} alt="logo icons svg" className='w-16 h-auto self-center' />
      <div className='flex flex-col gap-1 text-center pt-2'>
        <h3 className='font-bold text-2xl'>{title.toUpperCase()} - AVAILABLE NOW</h3>
        <p className='font-extralight opacity-50 text-sm'>@{instagramHandle} on Instagram</p>
      </div>
      <div className='relative h-12 w-full'>
        <hr className='absolute top-0 left-1/2 w-1/2 h-1 bg-[#42FF00] transform -translate-x-1/2 z-10' />
        <hr className='absolute top-1 left-0 w-full h-px bg-[#248B00] z-0' />
      </div>
      <section className=" flex flex-col relative z-40 text-center w-10/12 md:w-full md:text-start gap-4">
        {bookData.map((item) => (
          <React.Fragment key={item.id}>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <div className='flex flex-col gap-1 pb-2'>
                <h4 className='text-sm m-0 font-medium'>
                  {item.details}
                </h4>
                <p className='text-xs text-[#42FF00] font-light'>
                  {item.price} ・ {item.duration}
                </p>
              </div>
              <div>
                <Button className='bg-[#155601] text-[#3CE800] hover:text-[#155601] hover:bg-[#42FF00] rounded-md text-sm md:text-xs px-6 py-2 h-fit '>
                  <Link to={`/josh/book/list?url=${item.url}`}>
                    Book Now
                  </Link>
                </Button>
              </div>
            </div>
            <hr className='w-full h-[2px] bg-[#42FF00] opacity-60 my-2' />
          </React.Fragment>
        ))}
      </section>
    </section>
  );
};

export default BookSection;