import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import {UserButton, useUser} from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

// Navbar component for educator dashboard
const Navbar = () => {
  
  // Context to access educator data
  const educatorData = dummyEducatorData
  const {user} = useUser();

  // Render the navbar component
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      {/* Logo link */}
      <Link to='/'>
        <img src={assets.logo} alt="logo" className='w-28 lg:w-32'/>
      </Link>
      {/* User information */}
      <div className='flex items-center gap-5 text-gray-500 relative'>
        {/* Welcome message */}
        <p>Hi! {user? user.firstName : 'Developers'}</p>
        {/* User button or profile image */}
        {user ? <UserButton/> : <img className='max-w-8' src={assets.profile_img}/>}
      </div>
    </div>
  )
}

export default Navbar