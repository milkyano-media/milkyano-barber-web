/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import GradientTop from "@/assets/landing/book_circle_top.svg"
import GradientBottom from "@/assets/landing/book_circle_bottom.svg"
import Logo from "@/components/react-svg/logo"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarberProfile, BarberResponse, BarberServices, BarberServicesData, ServicesResponse } from '@/interfaces/BookingInterface';
import { getBarbers, getServices } from '@/utils/squareApi';
import Spinner from '../web/Spinner';

const BookList = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const [barberServices, SetBarberServices] = useState<BarberServices>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const barberOrder: string[] = ['Josh', 'Jay', 'Niko', 'Rayhan', 'Emman', 'Anthony', 'Christos', 'Wyatt']

  useEffect(() => {
    interface BarberServices {
      data: BarberServicesData[];
    }

    const joinBarbersAndServices = (barbers: BarberResponse | undefined, services: ServicesResponse | undefined) => {
      const barberServices: BarberServices = { data: [] };
      const sortOrder = ['Josh', 'Jay', 'Niko', 'Rayhan', 'Emman', 'Anthony', 'Christos', 'Wyatt'];

      const sortedProfiles: BarberProfile[] | undefined = barbers?.team_member_booking_profiles
        .filter(profile => sortOrder.some(name => profile.display_name.includes(name.toUpperCase())))
        .sort((a, b) => {
          const aName = sortOrder.findIndex(name => a.display_name.toUpperCase().includes(name.toUpperCase()));
          const bName = sortOrder.findIndex(name => b.display_name.toUpperCase().includes(name.toUpperCase()));
          return aName - bName;
        });


      if (sortedProfiles && services) {
        for (let i = 0; i < sortedProfiles.length; i++) {
          const servicesForBarber = services.items.filter(service =>
            service.item_data.variations.some(variation =>
              variation.item_variation_data.team_member_ids.includes(sortedProfiles[i].team_member_id)
            )
          );

          barberServices.data.push({
            barber: sortedProfiles[i],
            services: servicesForBarber
          });
        }
      }

      SetBarberServices(barberServices)
    };

    const fetchData = async () => {
      setIsLoading(true);
      let barber: string
      let query: string
      let type: string
      const parts = location.pathname.split("/");
      parts[1] === 'meta' ? barber = parts[2] : barber = parts[1];
      parts[1] === 'meta' ? type = 'M' : type = 'O'
      if (parts.length > 3)
        barber === 'dejan' ? query = '' : query = barber;
      else
        query = ''
      const fetchedBarbers = await getBarbers();
      const fetchedServices = await getServices(query, type);
      joinBarbersAndServices(fetchedBarbers, fetchedServices)
      setIsLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleBookNowClick = async (item: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      localStorage.removeItem('bookedItems');
      const updatedBookings = [item];
      localStorage.setItem('bookedItems', JSON.stringify(updatedBookings));
      const parts = location.pathname.split('/');
      const newPath = '/' + parts.slice(1, parts.length - 1).join('/');
      navigate(`${newPath}/appointment`);
    } catch (error) {
      console.error('Error booking the item:', error);
    }
  };


  return (
    <section className="relative bg-[#010401] flex flex-col p-4 py-12 items-center md:items-start justify-center z-30 md:px-40 min-h-screen gap-0"  >
      <div className='flex flex-col justify-center items-center absolute left-6 top-6 mb-30'>
        <Link to={"/"}  >
          <Logo className='w-48 md:w-[12rem] h-auto opacity-90' />
        </Link>
      </div>
      <img src={GradientTop} alt="gradient top" className='absolute top-0 right-0 w-5/12 ' />
      <img src={GradientBottom} alt="gradient top" className='absolute bottom-0 left-0 w-8/12 ' />
      {
        !isLoading && barberServices ? (
          barberServices?.data.map((item, index) => (
            <div className='w-full flex flex-col p-4 items-center md:items-start justify-center'>
              <React.Fragment key={index}>
                {item.services.length > 0 ?
                  (
                    <div className='flex flex-col gap-2 pb-4 text-stone-200 mt-20'>
                      <div className='flex flex-col gap-1 text-center md:w-full w-10/12 mx-auto md:mx-0'>
                        <h3 className='text-base font-bold'>{item.barber.display_name}</h3>
                      </div>
                      <div className='relative h-8 w-full'>
                        <hr className='absolute top-0 left-0 w-[25rem] h-[2px] bg-[#42FF00] transform z-10' />
                        <hr className='absolute top-1 left-0 w-full h-px bg-[#248B00] z-0' />
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )
                }

                <section className="flex flex-col relative z-40 text-center w-10/12 md:w-full md:text-start gap-4 text-stone-300">
                  <div>
                    {item.services.map((service, index) => (
                      <React.Fragment key={index}>
                        <div className='flex flex-col md:grid md:grid-cols-2 justify-between items-center'>
                          <div className='flex flex-col gap-1 pb-2'>
                            <h4 className='text-sm m-0 font-medium'>
                              {service.item_data.name}
                            </h4>
                            <p className='text-xs font-extralight text-stone-400'>
                              {service.item_data.variations[0].item_variation_data.price_description}
                            </p>
                            <hr className='w-full h-[2px] bg-[#b56a6a] opacity-5 my-2' />
                          </div>
                          <div className='self-center justify-self-end'>
                            <Button className='bg-[#155601] text-[#3CE800] hover:text-[#155601] hover:bg-[#42FF00] rounded-md text-base px-6 py-2 h-fit'
                              onClick={() => handleBookNowClick(service)}>
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </section>
              </React.Fragment>
            </div>
          ))
        ) : (
          <div className='w-full flex flex-col gap-6 justify-center items-center'>
            <h3 className='text-xl font-bold'>Loading data...</h3>
            <Spinner />
          </div>
        )
      }
    </section>
  )
}

export default BookList