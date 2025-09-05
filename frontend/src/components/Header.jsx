import React from 'react';
import { assets } from '../assets/assets';

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-500 rounded-2xl px-6 md:px-12 lg:px-20 shadow-lg">
      
      {/* Left Content */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 m-auto md:py-[8vw] md:mb-[-30px]">
        
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-snug">
          Book Appointment <br /> With Trusted Doctors
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 text-white text-base font-light">
          <img className="w-28 drop-shadow-md" src={assets.group_profiles} alt="profiles" />
          <p className="opacity-90">
            Simply browse through our extensive list of trusted doctors,
            <br className="hidden sm:block" />
            and schedule your appointment free.
          </p>
        </div>

        <a
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-indigo-700 font-medium shadow-md hover:bg-indigo-50 hover:scale-105 transition-all duration-300"
          href="#speciality"
        >
          Book Appointment
          <img src={assets.arrow_icon} alt="arrow" />
        </a>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2 flex justify-center">
        <img
          className="w-[90%] max-w-lg drop-shadow-xl"
          src={assets.header_img}
          alt="header"
        />
      </div>
    </div>
  );
};

export default Header;
