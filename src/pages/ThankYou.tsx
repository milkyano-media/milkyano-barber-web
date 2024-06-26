
import { Button } from '@/components/ui/button'
import GradientTop from "@/assets/web/gradient_top_thank_you.svg"
import GradientBottom from "@/assets/web/gradient_bottom_thank_you.svg"
import EmeraldBottomThankYou from "@/assets/web/emerald_bottom_thank_you.svg"
import Logo from "@/components/react-svg/logo"
import { Link } from 'react-router-dom'

const ThankYou = () => {
  return (
    <>
      <main className='relative flex justify-center items-center flex-col h-screen text-center gap-12 max-h-screen overflow-hidden'>
        <img src={GradientTop} alt="gradient top" className='absolute top-0 right-0 z-10 ' />
        <img src={GradientBottom} alt="gradient top" className='absolute bottom-0 left-0 z-10 ' />
        <img src={EmeraldBottomThankYou} alt="Emerald Bottom Thank You" className='bottom-0 right-0 absolute -z-10' />
        <Logo className='w-48 md:w-[16rem] h-auto opacity-90 z-10 absolute top-20' />
        <div className='flex flex-col gap-2 w-full  justify-center items-center'>
          <h1 className='text-7xl font-bold'>THANK YOU <br />
            <span className='bg-gradient-to-br from-[#33FF00] to-[#7AFF6E] text-transparent bg-clip-text'>FOR BOOKING</span></h1>
          <p className='text-stone-300 opacity-90 text-xl font-extralight w-3/12'>Access appointment cancellation and re-schedule through the email.</p>
        </div>

        <Link to={"/"} className='relative z-20 cursor-pointer '>
          <Button className='bg-[#155601] text-[#3CE800] hover:text-[#155601] hover:bg-[#42FF00] rounded-md text-xl px-6 py-2 h-fit '>
            Return To Menu
          </Button>
        </Link>
      </main>
    </>
  )
}

export default ThankYou