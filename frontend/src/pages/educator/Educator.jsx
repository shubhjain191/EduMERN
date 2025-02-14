import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'

// Educator page component
const Educator = () => {
  return (
    <div className='text-default min-h-screen bg-white'>
      {/* Navbar component */}
        <Navbar/>
      {/* Main content container */}
      <div className='flex'>
        {/* Sidebar component */}
        <Sidebar/>
        {/* Outlet component to render nested routes */}
        <div className='flex-1'>
          {<Outlet/>}
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Educator