import { useContext, useState } from "react"
import { AppContext } from "../../context/AppContext"
import { Line } from 'rc-progress'
import Footer from "../../components/student/Footer"
import axios from "axios"
import { toast } from "react-toastify"  
import { useEffect } from "react"

// Component for displaying student's enrolled courses
const MyEnrollments = () => {
  // Context to access enrolled courses and navigation
  const { enrolledCourses, calculateCourseDuration, navigate, userData, fetchUserEnrolledCourses, backendUrl, getToken, calculateNoofLectures } = useContext(AppContext)

  // State to store progress array
  const [progressArray, setProgressArray] = useState([])

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const {data} = await axios.post(backendUrl + '/api/user/get-course-progress',{
            courseId: course._id
          },{
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          let totalLectures = course.courseContent.reduce((acc, section) => 
            acc + section.subSection.length, 0
          )
          const lecturesCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0
          return {lecturesCompleted, totalLectures}
        })
      )
      setProgressArray(tempProgressArray)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if(userData){
      fetchUserEnrolledCourses()
    }
  }, [userData])

  useEffect(() => {
    if(enrolledCourses.length > 0){
      getCourseProgress()
    }
  }, [enrolledCourses])
  
  

  // Render the MyEnrollments component
  return (
    <>
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Enrollments</h1>
          <p className="mt-2 text-sm text-gray-600">View all your enrolled courses here</p>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Duration
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Completed
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              {/* Table body with divider lines */}
              <tbody className="bg-white divide-y divide-gray-200">
                {enrolledCourses.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200"> 
                    {/* Course thumbnail and title */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <img
                          src={course.courseThumbnail || "/placeholder.svg"}
                          alt={course.courseTitle}
                          className="h-12 w-16 sm:h-16 sm:w-24 object-cover rounded-lg"
                        />
                        {/* Course title and progress */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{course.courseTitle}</p>
                          {/* Progress bar */}
                          <Line strokeWidth={2} percent={progressArray [index] ? (progressArray[index].lecturesCompleted *100) / progressArray[index].lecturesTotal : 0} className="bg-gray-300 rounded-full"/>
                          {/* Course duration */}
                          <p className="text-xs text-gray-500 sm:hidden">{calculateCourseDuration(course)}</p>
                        </div>
                      </div>
                    </td>
                    {/* Course duration */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="text-sm text-gray-700">{calculateCourseDuration(course)}</span>
                    </td>
                    {/* Lectures completed and total */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{progressArray[index] && `${progressArray[index].lecturesCompleted} / ${progressArray[index].lecturesTotal}`}</span>
                        <span className="text-xs text-gray-500">Lectures</span>
                      </div>
                    </td>
                    {/* Course status button */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button onClick={() => navigate('/player/' +  course._id)} className={`px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-lg transition-all duration-200 ${
                        progressArray[index] && progressArray[index].lecturesCompleted / progressArray[index].lecturesTotal === 1 
                        ? "bg-green-100 text-green-800 hover:bg-green-200" 
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}>
                        {progressArray[index] && progressArray[index].lecturesCompleted / progressArray[index].lecturesTotal === 1 ? "Completed" : "On Going"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default MyEnrollments

