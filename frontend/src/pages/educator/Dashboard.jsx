import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets, dummyDashboardData } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'


// Component to display educator's dashboard with various metrics and latest enrollments
const Dashboard = () => {

  const {backendUrl, getToken, isEducator} = useContext(AppContext)

  // Context to access currency
  const { currency } = useContext(AppContext)

  // State to store dashboard data
  const [dashboardData, setDashboardData] = useState(null)

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const {data} = await axios.get(backendUrl + '/api/educator/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(data.success){
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  // Effect hook to fetch dashboard data when component mounts
  useEffect(() => {
    if(isEducator){
      fetchDashboardData()
    }
  }, [isEducator])
  
  // Render component with dashboard data
  return dashboardData ? (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='space-y-5'>
        <div className='flex flex-wrap gap-5 items-center'>
          {/* Total Enrollments Card */}
          <div className='flex items-center gap-4 bg-white p-6 rounded-xl border border-blue-500 shadow-sm hover:shadow-md transition-shadow'>
            <div className='bg-blue-50 p-3 rounded-full'>
              <img src={assets.patients_icon} alt="patients_icon" className="w-8 h-8 md:w-10 md:h-10"/>
            </div>
            <div>
              <p className='text-2xl md:text-3xl font-semibold text-gray-800'>{dashboardData.enrolledStudentsData.length}</p>
              <p className='text-xs md:text-sm text-gray-500'>Total Enrollments</p>
            </div>
          </div>

          {/* Total Courses Card */}
          <div className='flex items-center gap-4 bg-white p-6 rounded-xl border border-blue-500 shadow-sm hover:shadow-md transition-shadow'>
            <div className='bg-blue-50 p-3 rounded-full'>
              <img src={assets.appointments_icon} alt="" className="w-8 h-8 md:w-10 md:h-10"/>
            </div>
            <div>
              <p className='text-2xl md:text-3xl font-semibold text-gray-800'>{dashboardData.totalCourses}</p>
              <p className='text-xs md:text-sm text-gray-500'>Total Courses</p>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className='flex items-center gap-4 bg-white p-6 rounded-xl border border-blue-500 shadow-sm hover:shadow-md transition-shadow'>
            <div className='bg-blue-50 p-3 rounded-full'>
              <img src={assets.earning_icon} alt="" className="w-8 h-8 md:w-10 md:h-10"/>
            </div>
            <div>
              <p className='text-2xl md:text-3xl font-semibold text-gray-800'>{currency}{dashboardData.totalEarnings}</p>
              <p className='text-xs md:text-sm text-gray-500'>Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Latest Enrollments Table */}
        <div className='bg-white rounded-xl shadow-sm p-6'>
          <h2 className='text-xl md:text-2xl font-semibold text-gray-800 mb-6'>Latest Enrollments</h2>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[600px]'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-4 px-4 text-sm font-medium text-gray-600'>#</th>
                  <th className='text-left py-4 px-4 text-sm font-medium text-gray-600'>Student Name</th>
                  <th className='text-left py-4 px-4 text-sm font-medium text-gray-600'>Course Title</th>
                </tr>
              </thead>
              {/* Table body with divider lines */}
              <tbody className="text-sm text-gray-500">
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className='border-b hover:bg-gray-50'>
                    <td className='py-4 px-4'>{index + 1}</td>
                    <td className='py-4 px-4'>
                      <div className='flex items-center gap-3'>
                        <img src={item.student.imageUrl} alt="" className='w-8 h-8 rounded-full object-cover'/>
                        <span>{item.student.name}</span>
                      </div>
                    </td>
                    <td className='py-4 px-4'>{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading/>
  )
}

export default Dashboard