import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarberResponse, BarberServices, ServicesResponse } from '@/interfaces/BookingInterface';
import { getAllBarber, getAllService } from '@/utils/barberApi';
import Spinner from '../web/Spinner';
import Logo from "@/components/react-svg/logo";
import { ChevronDown, ChevronUp } from 'lucide-react';

import Rayhan from '@/assets/web/barbers/rayhan.svg';
import Anthony from '@/assets/web/barbers/anthony.svg';
import Jay from '@/assets/web/barbers/jay.svg';
import Wyatt from '@/assets/web/barbers/wyatt.svg';
import Emman from '@/assets/web/barbers/emman.svg';
import Christos from '@/assets/web/barbers/christos.svg';
import Josh from '@/assets/web/barbers/josh.svg';
import Niko from '@/assets/web/barbers/niko.svg';
import Noah from '@/assets/web/barbers/noah.svg';

const barberImages: { [key: string]: string } = {
  'RAYHAN': Rayhan,
  'ANTHONY': Anthony,
  'JAY': Jay,
  'WYATT': Wyatt,
  'EMMAN': Emman,
  'CHRISTOS': Christos,
  'JOSH': Josh,
  'NIKO': Niko,
  'NOAH': Noah,
};

const BookList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [barberServices, setBarberServices] = useState<BarberServices>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedBarber, setExpandedBarber] = useState<string | null>(null);

  useEffect(() => {
    const joinBarbersAndServices = (barbers: BarberResponse | undefined, services: ServicesResponse | undefined) => {
      const barberServices: BarberServices = { data: [] };
      const sortOrder = ['Jay', 'Emman', 'Niko', 'Noah', 'Rayhan', 'Anthony', 'Josh', 'Christos', 'Wyatt'];

      const sortedProfiles = barbers?.team_member_booking_profiles
        .filter(profile => sortOrder.some(name => profile.display_name.includes(name.toUpperCase())))
        .sort((a, b) => {
          const aName = sortOrder.findIndex(name => a.display_name.toUpperCase().includes(name.toUpperCase()));
          const bName = sortOrder.findIndex(name => b.display_name.toUpperCase().includes(name.toUpperCase()));
          return aName - bName;
        });

      if (sortedProfiles && services) {
        for (let i = 0; i < sortedProfiles.length; i++) {
          const servicesForBarber = services.objects.filter(service =>
            service.item_data.variations.some(variation =>
              variation.item_variation_data.team_member_ids?.includes(sortedProfiles[i].team_member_id)
            )
          );

          barberServices.data.push({
            barber: sortedProfiles[i],
            services: servicesForBarber
          });
        }
      }

      setBarberServices(barberServices);
    };

    const fetchData = async () => {
      setIsLoading(true);
      let barber: string;
      let query: string;
      let type: string;
      const parts = location.pathname.split("/");
      parts[1] === 'meta' ? barber = parts[2] : barber = parts[1];
      parts[1] === 'meta' ? type = 'M' : type = 'O';
      
      if (parts.length > 3) {
        barber === 'dejan' || barber === 'anthony' || barber === 'christos' || 
        barber === 'wyatt' || barber === "noah" || barber === 'book' 
          ? query = 'all' 
          : query = barber;
      } else {
        query = '';
      }

      const fetchedBarbers = await getAllBarber();
      const fetchedServices = await getAllService(query, type);
      joinBarbersAndServices(fetchedBarbers, fetchedServices);
      setIsLoading(false);
    };

    fetchData();
  }, [location.pathname]);

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

  const toggleBarberServices = (barberId: string) => {
    setExpandedBarber(expandedBarber === barberId ? null : barberId);
  };

  const getBarberImage = (displayName: string) => {
    const upperName = displayName.toUpperCase();
    for (const [key, value] of Object.entries(barberImages)) {
      if (upperName.includes(key)) {
        return value;
      }
    }
    return null;
  };

  return (
    <section className="relative bg-[#010401] min-h-screen">
      <div className="fixed top-6 left-6 z-50">
        <Link to="/home">
          <Logo className="w-48 md:w-[12rem] h-auto opacity-90" />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-6">
            <h3 className="text-xl font-bold text-white">Loading data...</h3>
            <Spinner />
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            {barberServices?.data.map((item) => (
              <div key={item.barber.team_member_id} className="relative">
                <div className="flex flex-col md:grid md:grid-cols-[300px,1fr] gap-6 md:gap-12">
                  {/* Barber Image Section */}
                  <div className="relative">
                    <div className="w-full md:w-[300px] h-[250px] md:h-[300px] rounded-lg overflow-hidden">
                      <img 
                        src={getBarberImage(item.barber.display_name) ?? undefined}
                        alt={item.barber.display_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Vertical Line - Hidden on mobile */}
                  <div className="hidden md:block absolute left-[300px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-green-500 to-transparent ml-6" />

                  {/* Content Section */}
                  <div className="flex flex-col">
                    <h2 className="text-3xl md:text-4xl font-bold text-white uppercase mb-2">
                      {item.barber.display_name.split(' ')[0]}
                    </h2>
                    <p className="text-sm text-white mb-4">
                      {(item.barber.display_name.match(/IG.*?(?=\))|$/)?.[0] + ')' || '')}
                    </p>

                    {/* Green Line */}
                    <div className="relative h-px w-full bg-green-500 mb-6">
                      <div className="absolute top-1 left-0 right-0 h-px bg-green-900" />
                    </div>

                    {/* Services Section */}
                    <div className="w-full">
                      <Button
                        onClick={() => toggleBarberServices(item.barber.team_member_id)}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white justify-between h-12 md:h-14 text-base md:text-lg rounded-lg"
                      >
                        View Services
                        {expandedBarber === item.barber.team_member_id ? (
                          <ChevronUp className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                        ) : (
                          <ChevronDown className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                        )}
                      </Button>

                      {expandedBarber === item.barber.team_member_id && (
                        <div className="mt-4 space-y-4">
                          {item.services.map((service) => (
                            <div 
                              key={service.id}
                              className="bg-zinc-900/30 rounded-lg p-4 md:p-6"
                            >
                              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0">
                                <div>
                                  <h3 className="text-white text-base md:text-lg font-medium">
                                    {service.item_data.name}
                                  </h3>
                                  <p className="text-zinc-400 text-sm mt-1">
                                    {service.item_data.variations[0].item_variation_data.price_description}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => handleBookNowClick(service)}
                                  className="bg-[#155601] text-[#3CE800] hover:text-[#155601] hover:bg-[#42FF00] w-full md:w-auto min-w-[120px] h-12"
                                >
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookList;