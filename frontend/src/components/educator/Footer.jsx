import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='mt-auto flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 py-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm'>
      <div className='flex items-center gap-6'>
        <img src={assets.logo} alt="logo" className='hidden md:block w-24 hover:opacity-80 transition-opacity' />
        <div className='hidden md:block h-8 w-px bg-gray-300'></div>
        <p className='py-4 text-center text-xs md:text-sm text-gray-600 font-medium'>Copyright 2025 © EduMERN, All Rights Reserved</p>
      </div>
      <div className='flex items-center gap-5 max-md:mt-4'>
        <a href="#" className='hover:opacity-80 transition-opacity'>
          <img src={assets.facebook_icon} alt="facebook_icon" className='w-6 h-6' />
        </a>
        <a href="#" className='hover:opacity-80 transition-opacity'>
          <img src={assets.twitter_icon} alt="twitter_icon" className='w-6 h-6' />
        </a>
        <a href="#" className='hover:opacity-80 transition-opacity'>
          <img src={assets.instagram_icon} alt="instagram_icon" className='w-6 h-6' />
        </a>
      </div>
    </footer>
  )
}

export default Footer