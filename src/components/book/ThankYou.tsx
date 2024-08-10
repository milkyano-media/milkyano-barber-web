
import { Button } from '@/components/ui/button';
import GradientTop from "@/assets/landing/book_circle_top.svg"
import GradientBottom from "@/assets/landing/book_circle_bottom.svg"
import { ClockHistory, ChevronRight, ReplyFill, XCircleFill } from "react-bootstrap-icons"
import Logo from "@/components/react-svg/logo"
import { Link, useLocation } from 'react-router-dom';
import CancelationBar from "@/assets/book/cancelation_bar.svg"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from 'react';
import { useGtm } from '../hooks/UseGtm';
import { BarberDetailResponse } from '@/interfaces/BookingInterface';
import { getBarberDetail } from '@/utils/squareApi';


const ThankYouPage = () => {
  const location = useLocation();
  const { sendEvent } = useGtm();
  const [barberName, setBarberName] = useState<string>('')
  const [thankYouTime, setThankYouTime] = useState<string>('')

  useEffect(() => {
    if (location.pathname.includes("thank-you")) {
      const purchaseValue = localStorage.getItem('purchaseValue');
      const value = purchaseValue ? JSON.parse(purchaseValue) : null;
      const customerValue = localStorage.getItem('newCustomer');
      const new_customer = customerValue ? JSON.parse(customerValue) : null;
      const booking_id = localStorage.getItem('bookingId') || undefined;
      const sended_booking_id = localStorage.getItem('sendedBookingId') || undefined;
      const booking_origin = localStorage.getItem('utm_source') || undefined;

      const utm_source = localStorage.getItem('utm_source') || undefined;
      const utm_medium = localStorage.getItem('utm_medium') || undefined;
      const utm_campaign = localStorage.getItem('utm_campaign') || undefined;
      const utm_content = localStorage.getItem('utm_content') || undefined;

      if (sended_booking_id !== booking_id) {
        sendEvent({
          booking_id: booking_id,
          origin: booking_origin,
          source: utm_source,
          medium: utm_medium,
          campaign: utm_campaign,
          content: utm_content,
          event: 'purchase_event',
          value: value,
          new_customer: new_customer,
          Currency: 'AUD'
        });
        localStorage.setItem('sendedBookingId', booking_id || '')
      }
    }
  }, [location.pathname, sendEvent]);

  useEffect(() => {
    const fetchBarberDetail = async () => {
      const appointmentSegmentString = localStorage.getItem('appointmentSegment');

      const timeData = localStorage.getItem('thankYouTime')
      if (timeData) {
        setThankYouTime(timeData)
      }
      if (appointmentSegmentString) {
        const appointmentSegment = JSON.parse(appointmentSegmentString);
        const barberDetail: BarberDetailResponse = await getBarberDetail(appointmentSegment[0].team_member_id);
        setBarberName(`${barberDetail.team_member.given_name} ${barberDetail.team_member.family_name}`)
      }
    };

    fetchBarberDetail();
  }, [])

  interface ContactInfo {
    monthName?: string;
    day?: number;
    dayName?: string;
    month?: number;
  }
  const [dialog, setDialog] = useState(false);
  let bookedItems = [];
  let formattedDate = '';
  let dateObject: ContactInfo = {};


  try {
    const bookedItemsString = localStorage.getItem('bookedItems');
    if (bookedItemsString) {
      bookedItems = JSON.parse(bookedItemsString);
    }
  } catch (error) {
    console.error('Error parsing bookedItems from local storage:', error);
  }

  try {
    formattedDate = localStorage.getItem('formattedDate') || '';
  } catch (error) {
    console.error('Error retrieving formattedDate from local storage:', error);
  }

  try {
    const dateObjectString = localStorage.getItem('dateObject');
    if (dateObjectString) {
      dateObject = JSON.parse(dateObjectString);
    } else {
      dateObject = {};
    }
  } catch (error) {
    console.error('Error retrieving dateObject from local storage:', error);
    dateObject = {};
  }

  const selectedAppointmentString = localStorage.getItem('selectedAppointment');

  let CancelTime;


  if (selectedAppointmentString) {
    const [time, modifier] = selectedAppointmentString.split(' ');
    // eslint-disable-next-line prefer-const
    let [startHour, startMinute] = time.split(':').map(Number);

    if (modifier === 'pm' && startHour !== 12) {
      startHour += 12;
    } else if (modifier === 'am' && startHour === 12) {
      startHour = 0;
    }

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const startPeriod = startHour >= 12 ? 'PM' : 'AM';


    let cancelHour = startDate.getHours() - 2;
    let cancelPeriod = startPeriod;

    if (cancelHour < 0) {
      cancelHour += 24;
    }

    if (cancelHour >= 12) {
      cancelPeriod = 'PM';
    } else {
      cancelPeriod = 'AM';
    }

    const formattedCancelHour = cancelHour % 12 || 12;
    const formattedCancelTime = `${formattedCancelHour}:${startMinute.toString().padStart(2, '0')}`;
    CancelTime = `${formattedCancelTime} ${cancelPeriod}`;
  }

  return (
    <section className="relative bg-[#010401] flex flex-col p-4 py-32 items-center md:items-start justify-center z-30 md:px-40 min-h-screen gap-0"  >
      <div className='flex flex-col justify-center items-center absolute left-6 top-6'>
        <Link to={"/"}  >
          <Logo className='w-48 md:w-[12rem] h-auto opacity-90 ' />
        </Link>
      </div>
      <img src={GradientTop} alt="gradient top" className='absolute top-0 right-0 w-5/12 ' />
      <img src={GradientBottom} alt="gradient top" className='absolute bottom-0 left-0 w-8/12 ' />
      <AlertDialog open={dialog} onOpenChange={setDialog} >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-center'>
              Check Email
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className='w-8/12 h-full flex justify-center items-center text-lg py-4 text-center mx-auto'>
                <h4> Please check your email for cancelation and resechedule</h4>

              </div>            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex sm:justify-center sm:items-center  w-full'>
            <AlertDialogCancel>Continue</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className='relative z-40 w-full'>
        <section className='flex flex-col gap-2 pb-4 text-stone-200 relative w-full'>
          <div className='text-start w-full text-stone-200 text-sm py-2'>
            <h3 className='text-lg lg:text-xl font-medium '>Thanks For Booking</h3>
            <p className='font-extralight'>Your Appointment is Coming Up</p>
          </div>
          <div className='relative  h-8 w-full px-4'>
            <hr className='absolute top-0 left-0  w-[15rem] h-[3px] bg-[#42FF00] transform  z-10' />
            <hr className='absolute top-[1px] left-0 w-full h-[2px] bg-[#038101] z-0 opacity-50' />
          </div>
        </section>
        <section className='flex flex-col gap-12 mx-auto w-full md:w-8/12'>
          <div>
            <div className='border border-stone-400 rounded-t-xl p-6 px-12 flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <h3 className='text-lg'>
                  {formattedDate}
                </h3>
                <p className='text-xs font-light text-stone-400 pl-4'>
                  {thankYouTime}
                </p>
              </div>
              <div className='flex flex-col gap-2'>
                <h3 className='text-lg'>
                  {bookedItems[0].item_data.name}
                </h3>
                <p className='text-xs font-light text-stone-400 pl-4'>With {barberName}</p>
              </div>
            </div>
            <div className='rounded-b-xl px-4 pt-10 pb-4 border border-stone-400'>
              <Button className=" w-full text-xl bg-[#036901] text-stone-50 h-fit py-4 rounded-xl font-light" >
                Add to Calendar
              </Button>
              <div className='grid grid-cols-3 py-2 gap-x-4 pt-4'>
                <div className='text-center flex flex-col text-xs gap-3 items-center justify-center'>
                  <Button
                    onClick={() => setDialog(true)}
                    className=" w-full bg-[#036901] text-stone-50 h-fit py-4 rounded-xl font-light" >
                    <ClockHistory className='text-stone-50 w-6 h-auto' />
                  </Button>
                  Reschedule
                </div>
                <div className='text-center flex flex-col text-xs gap-3 items-center justify-center'>
                  <Button
                    onClick={() => setDialog(true)}
                    className=" w-full bg-[#036901] text-stone-50 h-fit py-4 rounded-xl font-light" >
                    <XCircleFill className='text-stone-50 w-6 h-auto' />
                  </Button>
                  Cancel
                </div>
                <div className='text-center flex flex-col text-xs gap-3 items-center justify-center'>
                  <Link to={"/barbers"} className='w-full h-full'>
                    <Button className=" w-full bg-[#036901] text-stone-50 h-fit py-4 rounded-xl font-light" >
                      <ReplyFill className='text-stone-50 w-6 h-auto' />
                    </Button>
                  </Link>
                  Rebook
                </div>
              </div>
            </div>
          </div>
          <div className='border border-stone-400 rounded-xl p-4 px-6 pt-6 flex flex-col gap-4'>
            <h3 className='text-lg md:text-xl font-medium px-8'>
              Location
            </h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44520.783413964426!2d145.06891445638522!3d-37.904472621963905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad66bc0e74de7c9%3A0x58d6bfb2ed811b32!2sFaded%20Lines%20Barbershop%20Oakleigh!5e0!3m2!1sen!2sid!4v1720231134790!5m2!1sen!2sid"

              className='w-full rounded-xl'
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen={true}
              aria-hidden={false}
              tabIndex={0}
            />
            <div className=' p-4 px-8 flex justify-between gap-4'>
              <div className='flex flex-col gap-2'>
                <h3 className='text-sm md:text-xl'>
                  Fadedlines Barbershop
                </h3>
                <p className='text-xs font-light text-stone-400'>55 Portman Street, Oakleigh, VIC 3166</p>
              </div>
              <Button className='rounded bg-stone-700 '>
                <a href='https://www.google.com/maps/place/55+Portman+St,+Oakleigh+VIC+3166,+Australia/@-37.900189,145.0890531,17z/data=!3m1!4b1!4m6!3m5!1s0x6ad66a58f1383555:0x436afa9ac943981!8m2!3d-37.900189!4d145.091628!16s%2Fg%2F11bw42v9sv?entry=ttu' target='_blank' className='w-full h-full'><ChevronRight className='fill-white' /></a>
              </Button>
            </div>
          </div>
          <div className='border border-stone-400 rounded-xl py-8 px-12 flex flex-col gap-2'>

            <h3 className='text-lg font-medium'>
              Payment
            </h3>
            <p className='text-base font-light text-stone-400'>payment is due at your appointment</p>
          </div>
          <div className='border border-stone-400 rounded-xl p-8 md:py-6 md:px-12 flex flex-col gap-4'>
            <div className='flex flex-col gap-8 text-sm'>
              <div>
                <h3 className='font-medium text-xl pb-6 md:pb-0 md:text-base lg:text-xl'>
                  Cancellation Policy
                </h3>
                <div className='flex flex-col gap-4 relative'>
                  <h4 className='text-xs md:text-md relative right-[-55%] lg:right-[-60%] font-light text-stone-950 bg-[#04C600] rounded-full w-fit px-4 py-1 opacity-90 flex gap-1'>
                    Cancel Before
                    <span>{dateObject.dayName}, {dateObject.monthName} {dateObject.day}</span>
                  </h4>
                  <img src={CancelationBar} alt="cancel before" />
                </div>
              </div>
              <p className='text-xs md:text-base font-extralight opacity-80'>Please cancel or reschedule before {CancelTime} on <span>{dateObject.dayName}, {dateObject.monthName} {dateObject.day}</span>. After that, you may be charged a cancellation fee. <a className='text-[#04C600] underline'>See full policy</a></p>
            </div>
          </div>
        </section>

      </div>
    </section>
  )
}

export default ThankYouPage