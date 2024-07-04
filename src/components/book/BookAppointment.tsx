/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useId, useState } from 'react'
import { Button } from '@/components/ui/button';
import GradientTop from "@/assets/landing/book_circle_top.svg"
import GradientBottom from "@/assets/landing/book_circle_bottom.svg"
import { Calendar } from "@/components/ui/calendar"
import Logo from "@/components/react-svg/logo"
import { Link } from 'react-router-dom';
import { format, isValid, parse } from "date-fns";
import moment from 'moment-timezone';
import { useNavigate } from "react-router-dom";
import { getAvailability } from '@/utils/squareApi';
import { Availability, AvailabilityResponse, ServicesItem } from '@/interfaces/BookingInterface';

interface appointmentData {
  start_at: string;
  readable_time: string;
}

interface TimeOfDay {
  title: string,
  appointments: appointmentData[]
}

const BookAppointment = () => {
  const inputId = useId();
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableDates, setAvailableDates] = useState<AvailabilityResponse>();
  const [availabilitybyDate, setAvailabilitybyDate] = useState<Availability[] | undefined>([]);
  const [inputValue, setInputValue] = useState("");
  const [bookedItems, setBookedItems] = useState<ServicesItem[]>([]);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const startAt = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
  const endAt = new Date(startAt.getTime());
  endAt.setDate(startAt.getDate() + 31);


  useEffect(() => {
    const items = localStorage.getItem('bookedItems');
    if (items) {
      setBookedItems(JSON.parse(items));
    }
  }, []);

  useEffect(() => {
    if (bookedItems.length > 0) {
      const requestBody = {
        "service_variation_id": bookedItems[0].item_data.variations[0].id,
        "start_at": startAt.toISOString(),
        "end_at": endAt.toISOString()
      };


      const fetchAvailableDates = async () => {
        const response = await getAvailability(requestBody);

        const data = response
        const availableDates = data;
        setAvailableDates(availableDates);
        const appointmentSegment = availableDates.availabilities[0].appointment_segments;
        const locationId = availableDates.availabilities[0].location_id;

        localStorage.setItem('appointmentSegment', JSON.stringify(appointmentSegment));
        localStorage.setItem('locationId', JSON.stringify(locationId));
        return availableDates.availabilities;
      };
      fetchAvailableDates();
    }

  }, [bookedItems]);


  function findAvailabilityByDate(date: string | number | Date) {
    let inputDate = new Date(date).toISOString();
    inputDate = moment.tz(date, "Australia/Sydney").format();
    inputDate = inputDate.split('T')[0];

    const results = availableDates?.availabilities.filter((item: { start_at: string; }) => item.start_at.split('T')[0] === inputDate);

    setAvailabilitybyDate(results);
    return results ? results : "This date is not available";
  }

  const handleDayPickerSelect = async (date: Date | undefined) => {
    if (!date) {
      setInputValue("");
      setSelectedDate(undefined);
    } else {
      setSelectedDate(date);
      setMonth(date);
      setInputValue(format(date, "MM/dd/yyyy"));
      const formattedDate = date.toLocaleDateString('en-AU', { weekday: 'long', month: 'short', day: 'numeric' }).replace(/(\w+), (\w+) (\d+)/, '$1, $2 $3');

      const day = date.getDate();
      const dayName = date.toLocaleDateString('en-AU', { weekday: 'long' });
      const monthName = date.toLocaleDateString('en-AU', { month: 'short' });
      const month = date.getMonth() + 1;
      const year = date.getFullYear();


      const dateObject = {
        dayName: dayName,
        monthName: monthName,
        day: day,
        month: month,
        year: year
      };

      localStorage.setItem('dateObject', JSON.stringify(dateObject));
      localStorage.setItem('formattedDate', formattedDate);

      findAvailabilityByDate(date)
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    const parsedDate = parse(e.target.value, "MM/dd/yyyy", new Date());

    if (isValid(parsedDate)) {
      setSelectedDate(parsedDate);
      setMonth(parsedDate);
    } else {
      setSelectedDate(undefined);
    }
  };
  const updateTimesOfDayWithAppointments = () => {
    const timesOfDay: TimeOfDay[] = [
      { title: "Morning", appointments: [] },
      { title: "Afternoon", appointments: [] },
      { title: "Evening", appointments: [] }
    ];

    availabilitybyDate?.forEach(appointment => {
      const startAt = new Date(appointment.start_at);
      const hour = startAt.toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', hour12: false });

      let timeOfDayIndex;
      if (parseInt(hour) < 12) timeOfDayIndex = 0;
      else if (parseInt(hour) >= 12 && parseInt(hour) < 17) timeOfDayIndex = 1;
      else timeOfDayIndex = 2;

      const readableTime = startAt.toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour: 'numeric', minute: 'numeric', hour12: true });
      timesOfDay[timeOfDayIndex].appointments.push(
        {
          start_at: appointment.start_at,
          readable_time: readableTime
        }
      );
    });

    return timesOfDay;
  };
  const timesOfDayWithAppointments = updateTimesOfDayWithAppointments();

  return (
    <section className="relative bg-[#010401] flex flex-col p-4 py-12 items-center md:items-start justify-center z-30 md:px-40 min-h-screen gap-0"  >
      <div className='flex flex-col justify-center items-center absolute left-6 top-6'>
        <Link to={"/"}  >
          <Logo className='w-48 md:w-[12rem] h-auto opacity-90 ' />
        </Link>
      </div>
      <img src={GradientTop} alt="gradient top" className='absolute top-0 right-0 w-5/12 ' />
      <img src={GradientBottom} alt="gradient top" className='absolute bottom-0 left-0 w-8/12 ' />
      <section className='grid grid-cols-1 md:grid-cols-3 gap-4 relative z-40 w-full pt-12 md:pt-0'>
        <div className='absolute top-24 md:top-12 h-8 w-full px-4'>
          <hr className='absolute top-0 left-0 w-[10rem] h-[3px] bg-[#42FF00] transform  z-10' />
          <hr className='absolute top-[1px] left-0 w-full h-[2px] bg-[#038101] z-0 opacity-50' />
        </div>
        <div className='col-span-2'>
          <Calendar
            mode="single"
            className="rounded-md border-none p-0 py-3 mr-4"
            selected={selectedDate}
            onSelect={handleDayPickerSelect}
            month={month}
            onMonthChange={setMonth}
          />
        </div>
        <div className='flex flex-col rounded-3xl p-4 '>
          <h3>Appointment Summary</h3>
          <div className='flex flex-col gap-2 border-[1px]  border-t border-stone-400 p-3 rounded-xl text-sm mt-12'>
            {bookedItems.length > 0 ? (
              bookedItems.map((item) => (
                <div key={item.id}>
                  <h4 className='font-medium'>{item.item_data.name}</h4>
                  <div className='flex gap-2 text-xs font-light'>
                    <p>{item.item_data.variations[0].item_variation_data.price_description} Mins</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading services...</p>
            )}
          </div>

        </div>
      </section>
      <section className=" flex flex-col relative z-40 px-4 w-full text-start gap-2 md:gap-4 text-stone-300 text-xs mt-8 ">
        <div>
          <label htmlFor={inputId} className=''>
            <strong>Today, </strong>
          </label>
          <input
            className='bg-transparent text-white'
            style={{ fontSize: "inherit" }}
            id={inputId}
            type="text"
            value={inputValue}
            placeholder="MM/dd/yyyy"
            onChange={handleInputChange}
          />
        </div>
        <section className='flex flex-col gap-8 pt-4 md:pl-4'>
          {timesOfDayWithAppointments.map(timeOfDay => (
            <div key={timeOfDay.title} className='flex flex-col gap-2'>
              <h3>{timeOfDay.title}</h3>
              <ul className='flex flex-row-reverse justify-end gap-4 w-full flex-wrap'>
                {timeOfDay.appointments.map((appointment, index) => (
                  <Button
                    key={index}
                    className='w-fit text-xs h-fit py-1 rounded'
                    onClick={() => {
                      localStorage.setItem('appointmentStartAt', appointment.start_at);
                      localStorage.setItem('selectedAppointment', appointment.readable_time);
                      navigate("/josh/book/contact-info");
                    }}
                  >
                    {appointment.readable_time}
                  </Button>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </section>
    </section>
  )
}

export default BookAppointment