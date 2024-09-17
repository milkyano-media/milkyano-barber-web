import { Button } from '@/components/ui/button';
import GradientTop from "@/assets/landing/book_circle_top.svg"
import GradientBottom from '@/assets/landing/book_circle_bottom.svg'
import Logo from "@/components/react-svg/logo"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from '@/components/ui/phone-input';
import CancelationBar from "@/assets/book/cancelation_bar.svg"
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Check, X } from 'react-bootstrap-icons';
import Spinner from '@/components/web/Spinner';
import { checkUserStatus, createBooking, createCustomer } from '@/utils/squareApi';
import { BookingRequest, BookingResponse, CustomerRequest, CustomerResponse } from '@/interfaces/BookingInterface';
import { isValidPhoneNumber } from "react-phone-number-input";
import { UserStatus } from '@/interfaces/UserInterface';

const BookContactInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('loading');
  const [isChecked, setIsChecked] = useState(false);
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);

  const booking_origin = localStorage.getItem('booking_origin') || undefined;

  const generateRoute = (route: string): string => {
    const parts = location.pathname.split("/");
    if (parts[1] === 'meta') {
      if (parts[2] === 'book')
        return `/meta/${route}`;
      else return `/meta/${parts[2]}/${route}`;
    }
    else {
      if (parts[1] === 'book')
        return `/${route}`;
      else return `/${parts[1]}/${route}`;
    }
  }


  const handleAddClick = () => {
    setShowForm(!showForm);
  };

  interface ContactInfo {
    monthName?: string;
    day?: number;
    dayName?: string;
    month?: number;
    time?: string;
  }

  const navigate = useNavigate();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const formSchema = z.object({
    given_name: z.string().min(1, { message: 'Given name is required' }),
    family_name: z.string().min(1, { message: 'Family name is required' }),
    email_address: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Email is required' }),
    phone_number: z
      .string()
      .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    appointment_note: z.string().optional(),
  });

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
  let appointmentEndTime = '';
  let cancelTime = '';
  let startPeriod = '';
  let selectedTime = '';

  if (selectedAppointmentString) {
    const [time, modifier] = selectedAppointmentString.split(' ');
    // eslint-disable-next-line prefer-const
    let [startHour, startMinute] = time.split(':').map(Number);
    startPeriod = modifier.toUpperCase();
    selectedTime = time;

    if (modifier === 'pm' && startHour !== 12) {
      startHour += 12;
    } else if (modifier === 'am' && startHour === 12) {
      startHour = 0;
    }

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const serviceDuration = bookedItems[0].item_data.variations[0].item_variation_data.service_duration;
    const endDate = new Date(startDate.getTime() + serviceDuration);

    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();

    const formattedStartHour = startHour % 12 || 12;
    const formattedEndHour = endHour % 12 || 12;
    const endPeriod = endHour >= 12 ? 'PM' : 'AM';

    const formattedStartTime = `${formattedStartHour}:${startMinute.toString().padStart(2, '0')}`;
    const formattedEndTime = `${formattedEndHour}:${endMinute.toString().padStart(2, '0')}`;


    appointmentEndTime = `${formattedStartTime} ${startPeriod} – ${formattedEndTime} ${endPeriod} GMT+10`;

    localStorage.setItem('thankYouTime', appointmentEndTime)

    const tempCancelTime = `${formattedStartTime} ${startPeriod}`;

    const adjustTime = (timeString: string, hoursToSubtract: number): string => {
      const [time, modifier] = timeString.split(' ');
      // eslint-disable-next-line prefer-const
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours !== 12) {
        hours += 12;
      } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }
      hours -= hoursToSubtract;
      if (hours < 0) {
        hours = 24 + hours;
      }
      const newModifier = hours >= 12 ? 'PM' : 'AM';
      if (hours > 12) {
        hours -= 12;
      } else if (hours === 0) {
        hours = 12;
      }
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${hours}:${formattedMinutes} ${newModifier}`;
    };


    cancelTime = adjustTime(tempCancelTime, 2)
  }

  const amount = bookedItems[0].item_data.variations[0].item_variation_data.price_money.amount;
  const formattedAmount = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount / 100);
  const amountInDollars = amount / 100;
  const twoPercent = amountInDollars * 0.02;
  const total = amountInDollars + twoPercent;

  const submitContactForm = async (values: z.infer<typeof formSchema>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { appointment_note, ...restValues } = values;


    const valuesWithIdempotencyKey: CustomerRequest = {
      ...restValues,
      idempotency_key: uuidv4(),
    };
    setIsLoading(true);
    setStatus('loading');
    try {
      const customerResponse: CustomerResponse = await createCustomer(valuesWithIdempotencyKey);
      const userResponse: UserStatus = await checkUserStatus(valuesWithIdempotencyKey);
      const customerId = customerResponse.customer.id;

      if (!customerId) {
        throw new Error('Customer ID is missing from the response.');
      }

      localStorage.setItem('customerId', customerId);
      let appointment_segments;
      let location_id;
      let start_at;

      try {
        appointment_segments = JSON.parse(localStorage.getItem('appointmentSegment') || '[]');
      } catch (error) {
        console.error('Error parsing appointmentSegment from local storage:', error);
      }
      try {
        location_id = JSON.parse(localStorage.getItem('locationId') || "");
      } catch (error) {
        console.error('Error parsing locationId from local storage:', error);
      }
      try {
        start_at = localStorage.getItem('appointmentStartAt');
      } catch (error) {
        console.error('Error parsing appointmentStartAt from local storage:', error);
      }

      const handlePurchase = (data: UserStatus) => {
        const new_customer: boolean = data.new_customer
        localStorage.setItem('purchaseValue', total.toString())
        localStorage.setItem('newCustomer', new_customer.toString())
        localStorage.setItem('bookingId', booking.booking.id)
      }

      const bookingPayload: BookingRequest = {
        booking: {
          start_at: start_at,
          location_id: location_id,
          appointment_segments: appointment_segments,
          customer_id: customerId,
          customer_note: values.appointment_note?.toString() || "",
        }
      };

      const booking: BookingResponse = await createBooking(bookingPayload, booking_origin || 'Organic');
      handlePurchase(userResponse);

      setStatus('succeeded');
      setTimeout(() => {
        setIsLoading(false);
        const thankYouPath = generateRoute('book/thank-you');
        navigate(thankYouPath);
      }, 1500);
    } catch (error) {
      setStatus('failed');
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      console.error('Error:', error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      given_name: "",
      family_name: "",
      email_address: "",
      phone_number: "",
      appointment_note: "",
    },
  });

  return (
    <section className="relative bg-[#010401] flex flex-col p-4 py-12 items-center md:items-start justify-center z-30 md:px-40 min-h-screen gap-0"  >
      <div className='flex flex-col justify-center items-center absolute left-6 top-6'>
        <Link to={"/home"}  >
          <Logo className='w-48 md:w-[12rem] h-auto opacity-90 ' />
        </Link>
      </div>
      <img src={GradientTop} alt="gradient top" className='absolute top-0 right-0 w-5/12 ' />
      <img src={GradientBottom} alt="gradient top" className='absolute bottom-0 left-0 w-8/12 ' />

      <AlertDialog open={isLoading} onOpenChange={setIsLoading} >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-center'>
              Creating Booking
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

      <section className='flex flex-col  relative z-40 w-full pt-12 md:pt-0'>

        <div className='flex flex-col'>
          <div className='text-center w-full text-stone-200 text-sm py-2'>
            <h3 className='text-lg font-medium '>Checkout</h3>
            <p className='font-extralight'>Appointment held for {selectedTime} {startPeriod}</p>
          </div>
          <div className='relative  h-8 w-full px-4'>
            <hr className='absolute top-0 left-1/2 -translate-x-1/2 w-[15rem] h-[3px] bg-[#42FF00] transform  z-10' />
            <hr className='absolute top-[1px] left-0 w-full h-[2px] bg-[#038101] z-0 opacity-50' />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitContactForm)} className='grid  grid-cols-1 md:grid-cols-3 pt-4 gap-y-12 md:gap-0' >
            <div className='flex flex-col gap-4 col-span-2 mr-4'>
              <div className='flex justify-between'>
                <h3 className='text-sm font-medium'>Contact Info</h3>
                <h3 className='text-sm font-medium'>Sign In</h3>
              </div>

              <div className='col-span-2'>
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PhoneInput
                          countryCallingCodeEditable={false}
                          placeholder='+610000'
                          countrySelectProps={{ unicodeFlags: true }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <hr className='h-[2px] opacity-50 bg-[#048301] w-full my-6' />
                <div className="grid grid-cols-2 gap-4 w-full justify-between z-50">
                  <FormField
                    control={form.control}
                    name="given_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className='bg-transparent w-full border border-stone-500 rounded-lg' placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="family_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className='bg-transparent w-full border border-stone-500 rounded-lg' placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 w-full justify-between z-50 pt-4">
                  <FormField
                    control={form.control}
                    name="email_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className='bg-transparent w-full border border-stone-500 rounded-md' placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>
                <hr className='h-[2px] opacity-50 bg-[#048301] w-full my-6' />


                <div className='flex justify-between'>
                  <h3>Appointment Note</h3>
                  <h3 onClick={handleAddClick} className='cursor-pointer'>Add</h3>
                </div>
                <div>
                  {showForm && (
                    <div className='mt-4'>
                      <FormField
                        control={form.control}
                        name="appointment_note"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input className='bg-transparent w-full border border-stone-500 rounded-md' placeholder="Enter appointment note" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>


                <hr className='h-[2px] opacity-50 bg-[#048301] w-full my-6' />
                <div className='flex flex-col gap-8 text-sm'>
                  <div>
                    <h3 className='font-medium text-base'>
                      Cancellation Policy
                    </h3>
                    <div className='flex flex-col gap-4 relative'>
                      <h4 className='text-xs relative right-[-10rem] md:right-[-28rem] font-light text-stone-950 bg-[#04C600] rounded-full w-fit px-4 py-1 opacity-90'>Cancel Before {dateObject.day} {dateObject.monthName}</h4>
                      <img src={CancelationBar} alt="cancel before" />
                    </div>
                  </div>
                  <p className='text-sm font-extralight opacity-80'>Please cancel or reschedule before {cancelTime} on {dateObject.time}. After that, you may be charged a cancellation fee. <a className='text-[#04C600] underline'>See full policy</a></p>
                  <div className="flex items-center space-x-2">
                    <input className='peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground' type="checkbox" id="terms" onChange={handleCheckboxChange} />
                    <label
                      htmlFor="terms"
                      className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I have read and agreed to the cancellation policy of Fadedlines barbershop.
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col px-4 '>
              <h3 className='text-sm font-medium'>Appointment Summary</h3>
              <div className='flex flex-col gap-2 border-[1px] border-b-0 border-t border-stone-400 p-4 pl-8 pr-6 rounded-t-xl text-sm mt-4 '>
                <h4 className=' text-lg pb-2'>{formattedDate}</h4>
                <div className='flex flex-col  gap-2 text-xs font-light'>
                  <p>
                    {appointmentEndTime}
                  </p>
                  <p>Est. due at appointment: A${total}</p>
                </div>
              </div>
              <div className='grid grid-cols-3 justify-between border border-stone-400 p-4 pl-8 pr-6   text-sm items-center'>
                <h4 className='col-span-2 text-lg'>
                  {bookedItems[0].item_data.name}
                </h4>
                <p className='text-xs justify-self-end font-light'>A{formattedAmount}</p>
              </div>
              <div className='flex flex-col gap-4 border border-stone-400 p-4 pl-8 pr-6  text-sm'>
                <div className='w-full grid grid-cols-3'>
                  <p className='text-xs col-span-2  font-light'>Subtotal</p>
                  <p className='text-xs justify-self-end font-light'>A{formattedAmount}</p>
                </div>
                <div className='w-full grid grid-cols-3'>
                  <p className='text-xs col-span-2 font-light'>Taxes</p>
                  <p className='text-xs justify-self-end font-light'>A${twoPercent}</p>
                </div>
                <div className='w-full grid grid-cols-3'>
                  <p className='text-xs col-span-2 font-light'>Total</p>
                  <p className='text-xs justify-self-end font-light'>A${total}</p>
                </div>
              </div>
              <div className='flex flex-col gap-4 justify-between border border-stone-400 p-4 pl-8 pr-6 rounded-b-xl text-sm'>
                <div className='w-full grid grid-cols-3'>
                  <p className='text-xs col-span-2 font-light'>Due Today</p>
                  <p className='text-xs justify-self-end font-light'>A$0.00</p>
                </div>
                <div className='w-full grid grid-cols-3'>
                  <p className='text-xs col-span-2 font-light'>Due at Appointement </p>
                  <p className='text-xs justify-self-end font-light'>A${total}</p>
                </div>

              </div>
              <Button
                onClick={
                  () => { localStorage.setItem('purchaseValue', total.toString()) }
                }
                variant={"ghost"} type="submit" disabled={!isChecked} className=" w-full bg-[#036901] mt-10 h-fit py-4 rounded-xl font-light"  >
                Book an Appointement
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </section>
  )
}

export default BookContactInfo