import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'

// Component to display list of courses created by the educator
const MyCourses = () => {

  // Context to access currency and all courses data
  const {currency, allCourses} = useContext(AppContext)

  // State to store courses data
  const [courses, setCourses] = useState(null)

  // Function to fetch courses created by the educator
  const fetchEducatorCourses = async () => {
    setCourses(allCourses)
  }

  // Effect hook to fetch courses when component mounts
  useEffect(() => {
    fetchEducatorCourses()
  }, [])


  // Render component with courses data
  return courses ? (
    <div className='min-h-[calc(100vh-80px)] flex flex-col md:p-12 p-6'>
      <div className='w-full max-w-7xl mx-auto space-y-8'>
        <h2 className='text-4xl font-bold text-gray-900'>My Courses</h2>
        <div className='w-full overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm'>
          {/* Table component to display courses data */}
          <table className='w-full'>
            {/* Table header with bold text and gray background */}
            <thead className='bg-gray-50/80 text-gray-700 border-b'>
              <tr>
                <th className='px-8 py-5 font-semibold text-sm tracking-wider text-left'>All Courses</th>
                <th className='px-8 py-5 font-semibold text-sm tracking-wider text-left'>Earnings</th>
                <th className='px-8 py-5 font-semibold text-sm tracking-wider text-left'>Students</th>
                <th className='px-8 py-5 font-semibold text-sm tracking-wider text-left'>Published On</th>
              </tr>
            </thead>
            {/* Table body with divider lines */}
            <tbody className='divide-y divide-gray-100'>
              {courses.map((course) => (
                <tr key={course._id} className='hover:bg-slate-50/50 transition-colors duration-150'>
                  {/* Course thumbnail and title */}
                  <td className='px-8 py-6'>
                    <div className='flex items-center gap-6'>
                      <img 
                        src={course.courseThumbnail} 
                        alt="Course Image" 
                        className='w-20 h-14 object-cover rounded-lg shadow-sm'
                      />
                      <span className='font-medium text-gray-900 text-lg line-clamp-2'>{course.courseTitle}</span>
                    </div>
                  </td>
                  {/* Earnings cell */}
                  <td className='px-8 py-6'>
                    <span className='font-semibold text-emerald-600 text-lg'>
                      {currency}{Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}
                    </span>
                  </td>
                  {/* Students cell */}
                  <td className='px-8 py-6'>
                    <span className='inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700'>
                      {course.enrolledStudents.length}
                    </span>
                  </td>
                  {/* Published date cell */}
                  <td className='px-8 py-6 text-gray-600'>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading/>
  )
}

export default MyCourses