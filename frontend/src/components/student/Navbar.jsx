import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
  // Get navigation and educator status from context
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext)

  // Check if current page is the course list page
  const isCourseListPage = location.pathname.includes('/course-list');

  // Clerk authentication hooks
  const { openSignIn } = useClerk()
  const { user } = useUser()

  const becomeEducator = async () => {
    try {
      if(isEducator){
        navigate('/educator')
        return
      }

      const token = await getToken()
      const {data} = await axios.get(backendUrl + '/api/educator/update-role', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if(data.success){
        setIsEducator(true)
        toast.success(data.message)

      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }


  return (
    // Main navbar container - background color changes based on course list page
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-300 py-4 ${isCourseListPage ? 'bg-white' : 'bg-sky-50'}`}>
      {/* Logo and home navigation */}
      <img onClick={() => navigate('/')} src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' />

      {/* Desktop navigation menu */}
      <div className='hidden md:flex items-center gap-5 text-gray-700'>
        <div className='flex items-center gap-5'>
          { user && 
          <> 
            <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button> |
            <Link to='/my-enrollments'>My Enrollments</Link>
          </>
          }
        </div>
        { user ? <UserButton /> : 
          <button onClick={() => openSignIn()} className='bg-blue-700 hover:bg-blue-800 transition text-white px-5 py-2 rounded-full'>Create Account</button>}
      </div>

      {/* Mobile navigation menu */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          { user && 
            <> 
              <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button> |
              <Link to='/my-enrollments'>My Enrollments</Link>
            </>
          }
        </div>
        {
          user ? <UserButton/> :
          <button onClick={() => openSignIn()}><img src={assets.user_icon} alt="" /></button>
        }
      </div>
    </div>
  )
}

export default Navbar
