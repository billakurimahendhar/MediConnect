import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-lg px-6 sm:px-8 md:px-10 lg:px-14 my-8 md:mx-10 overflow-hidden min-h-[180px] md:min-h-[220px] lg:min-h-[250px]">
      
      {/* Left Text Section */}
      <div className="flex-1 py-2 sm:py-4 md:py-6 lg:py-8">
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
          <p>Book Appointment</p>
          <p className="mt-2">With 100+ Trusted Doctors</p>
        </div>
        <button
          onClick={() => { navigate('/login'); scrollTo(0, 0) }}
          className="bg-white text-sm sm:text-base text-[#595959] px-6 py-2 rounded-full mt-3 hover:scale-105 transition-all"
        >
          Create account
        </button>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:flex md:w-1/2 justify-center relative">
        <img
          className="w-full max-w-[200px] md:max-w-[250px] lg:max-w-[300px]"
          src={assets.appointment_img}
          alt="appointment"
        />
      </div>
    </div>
  )
}

export default Banner;
