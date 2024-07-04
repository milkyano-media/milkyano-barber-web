/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import GradientTop from "@/assets/landing/book_circle_top.svg"
import GradientBottom from "@/assets/landing/book_circle_bottom.svg"
import Logo from "@/components/react-svg/logo"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarberResponse, ServicesResponse } from '@/interfaces/BookingInterface';
import { getBarbers, getServices } from '@/utils/squareApi';

const BookList = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const [services, setServices] = useState<ServicesResponse>();
  const [title, setTitle] = useState<string>()

  useEffect(() => {
    const fetchBarbers = async () => {
      const routeArray = location.pathname.split('/').filter(segment => segment !== '');
      if (routeArray[0] === 'meta') {
        const fetchedBarbers = await getBarbers();
        const teamData = findFirstMatchingProfile(fetchedBarbers, routeArray[1])
        setTitle(teamData?.display_name)
      }
      else {
        const fetchedBarbers = await getBarbers();
        const teamData = findFirstMatchingProfile(fetchedBarbers, routeArray[0])
        setTitle(teamData?.display_name)
      }
    };

    const fetchServices = async () => {
      const routeArray = location.pathname.split('/').filter(segment => segment !== '');
      let fetchedServices: ServicesResponse;
      if (routeArray[0] === 'meta') {
        fetchedServices = await getServices(routeArray[1], 'M');
      }
      else {
        fetchedServices = await getServices(routeArray[0], 'O');
      }
      setServices(fetchedServices)
    };

    fetchBarbers()
    fetchServices();
  }, [location.pathname]);

  const findFirstMatchingProfile = (profiles: BarberResponse, substring: string) => {
    const regex = new RegExp(substring, 'i');
    return profiles.team_member_booking_profiles.find(profile => regex.test(profile.display_name));
  };

  const handleBookNowClick = async (item: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      localStorage.removeItem('bookedItems');
      const updatedBookings = [item];
      localStorage.setItem('bookedItems', JSON.stringify(updatedBookings));

      navigate(`${location.pathname}/appointment`);
    } catch (error) {
      console.error('Error booking the item:', error);
    }
  };

  return (
    <section className="relative bg-[#010401] flex flex-col p-4 py-12 items-center md:items-start justify-center z-30 md:px-40 min-h-screen gap-0"  >
      <div className='flex flex-col justify-center items-center absolute left-6 top-6'>
        <Link to={"/"}  >
          <Logo className='w-48 md:w-[12rem] h-auto opacity-90 ' />
        </Link>
      </div>
      <img src={GradientTop} alt="gradient top" className='absolute top-0 right-0 w-5/12 ' />
      <img src={GradientBottom} alt="gradient top" className='absolute bottom-0 left-0 w-8/12 ' />

      <div className='flex flex-col gap-2 pb-4 text-stone-200'>
        <div className='flex flex-col gap-1 text-center md:w-full w-10/12 mx-auto md:mx-0'>
          <h3 className=' text-base font-bold'>{title} on Instagram (Available Now)</h3>
        </div>
        <div className='relative h-8 w-full'>
          <hr className='absolute top-0 left-0 w-[25rem] h-[2px] bg-[#42FF00] transform  z-10' />
          <hr className='absolute top-1 left-0 w-full h-px bg-[#248B00] z-0' />
        </div>
      </div>
      <section className=" flex flex-col relative z-40 text-center w-10/12 md:w-full md:text-start gap-4 text-stone-300">
        {services && services.items ? (
          <div>
            {services.items.map((item) => (
              <React.Fragment key={item.id}>
                <div className='flex flex-col md:grid md:grid-cols-2 justify-between items-center'>
                  <div className='flex flex-col gap-1 pb-2'>
                    <h4 className='text-sm m-0 font-medium'>
                      {item.item_data.name}
                    </h4>
                    <p className='text-xs font-extralight text-stone-400'>
                      {item.item_data.variations[0].item_variation_data.price_description}
                    </p>
                    <hr className='w-full h-[2px] bg-[#b56a6a] opacity-5 my-2' />
                  </div>
                  <div className='self-center justify-self-end'>
                    <Button className='bg-[#155601] text-[#3CE800] hover:text-[#155601] hover:bg-[#42FF00] rounded-md text-base  px-6 py-2 h-fit '
                      onClick={() => handleBookNowClick(item)}>
                      Book Now
                    </Button>
                  </div>
                </div>

              </React.Fragment>
            ))}
          </div>
        ) : (
          <p>Loading services...</p>
        )}
      </section>
    </section>
  )
}

export default BookList