import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-8 text-center bg-gradient-to-b from-sky-50 to-white'>
      <h1 className='md:text-home-heading-large text-home-heading-small font-bold text-gray-800 max-w-3xl mx-auto relative'>
        Step ahead with industry leading courses tailored for
        <span className='text-sky-700'> your career growth.
          <img
            src={assets.sketch}
            alt="sketch"
            className='md:block hidden absolute -bottom-7 right-1/4 transform -translate-x-1/2 w-[190px] md:w-[200px]'/>
        </span>
      </h1>
      <p className='md:block hidden text-gray-600 max-w-2xl mx-auto pt-6'>
        Learn from industry experts, explore interactive content, and grow in a vibrant learning community designed for your success.
      </p>
      <p className='md:hidden text-gray-600 max-w-sm mx-auto pt-6'>
        Whether you're starting fresh or upskilling, our platform empowers you to achieve your personal and professional milestones.
      </p>
      <SearchBar/>
    </div>
  )
}

export default Hero