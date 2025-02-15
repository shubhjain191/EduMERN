import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import Loading from '../../components/student/Loading'

const Player = () => {

  const {enrolledCourses, calculateChapterTime, backendUrl, getToken, userData, fetchUserEnrolledCourses} = useContext(AppContext)
  const {courseId} = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [initialRating, setInitialRating] = useState(0)


  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course)
        course.courseRatings.map((rating) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating) 
          }
        })
      }

    })
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => (
      {...prev, 
        [index]: !prev[index]
      }
    ));
  }


  useEffect(() => {
    if(enrolledCourses.length > 0){
      getCourseData()
    }
  }, [enrolledCourses])

  const markLectureAsComplete = async () => {
    try {
      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/user/update-course-progress', 
        {courseId,lectureId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(data.success){
        toast.success(data.message)
        getCourseProgress()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/user/get-course-progress', {courseId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })  
      if(data.success){
        setProgressData(data.progressData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRate = async () => {
    try {
      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/user/add-rating', {courseId, rating}, { 
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(data.success){
        toast.success(data.message)
        fetchUserEnrolledCourses()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
      getCourseProgress()
  }, [])
    

  return courseData ? (
    <>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Course Structure</h2>
            <div className='space-y-4 sm:space-y-5'>
              {courseData && courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border-2 border-gray-200 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300'>
                  <button 
                    className='w-full flex items-center justify-between px-8 py-5 hover:bg-gray-50 transition-colors duration-200'
                    onClick={() => toggleSection(index)}
                  >
                    <div className='flex items-center gap-4'>
                      <img 
                        className={`w-6 h-6 transform transition-transform duration-300 ease-in-out ${openSections[index] ? 'rotate-180' : ''}`}      
                        src={assets.down_arrow_icon} 
                        alt="arrow icon" 
                      />
                      <h3 className='font-semibold text-lg text-gray-900'>{chapter.chapterTitle}</h3>
                    </div>
                    <span className='text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-full'>
                      {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                    </span>
                  </button>

                  <div className={`transition-all duration-300 ease-in-out ${openSections[index] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <ul className='divide-y divide-gray-100'>
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className='px-8 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200'>
                          <div className='flex items-center gap-4'>
                            <img src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="play icon" className='w-5 h-5'/>
                            <span className='text-gray-700 font-medium'>{lecture.lectureTitle}</span>
                          </div>
                          <div className='flex items-center gap-6'>
                            {lecture.lectureUrl && (
                              <span 
                                onClick={() => setPlayerData({
                                  ...lecture, chapter: index + 1, lecture: i + 1
                                })} 
                                className='text-blue-600 text-sm font-semibold hover:text-blue-700 cursor-pointer transition-colors duration-200 hover:underline'>
                                Watch
                              </span>
                            )}
                            <span className='text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full'>
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, {units: ["h", "m"]})}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <h1 className="text-2xl font-bold text-gray-900">Rate this course</h1>
              <Rating initialRating={initialRating} onRate={handleRate}/>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {
                playerData ? (
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <YouTube videoId={playerData.lectureUrl.split('/').pop()}  iframeClassName='w-full aspect-video rounded-xl'/>
                    <div className="mt-4 space-y-3">
                      <p className="text-lg font-semibold text-gray-900">{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                      <button onClick={() => markLectureAsComplete(playerData.lectureId)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200">
                        {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed' : 'Mark as complete'}
                      </button>
                    </div>
                  </div>
                )
                : 
                <img 
                  src={courseData ? courseData.courseThumbnail : ''} 
                  alt="Course thumbnail" 
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  ) : <Loading/>
}
export default Player