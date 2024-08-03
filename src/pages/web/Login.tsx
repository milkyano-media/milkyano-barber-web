
import GradientTop from "@/assets/landing/book_circle_top.svg"
import GradientBottom from "@/assets/landing/book_circle_bottom.svg"
import Logo from "@/components/react-svg/logo"
import { Link } from 'react-router-dom';


const Login = () => {

  return (
    <section className="relative bg-[#010401] flex flex-col p-4 py-32 items-center md:items-start justify-center z-30 md:px-40 min-h-screen gap-0"  >
      <div className='flex flex-col justify-center items-center absolute left-6 top-6'>
        <Link to={"/"}  >
          <Logo className='w-48 md:w-[12rem] h-auto opacity-90 ' />
        </Link>
      </div>
      <img src={GradientTop} alt="gradient top" className='absolute top-0 right-0 w-5/12 ' />
      <img src={GradientBottom} alt="gradient top" className='absolute bottom-0 left-0 w-8/12 ' />
    </section>
  )
}

export default Login