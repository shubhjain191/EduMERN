import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import {assets} from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
import Youtube from 'react-youtube'

const CourseDetails = () => {

  const  {id} = useParams()

  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)

  const {allCourses, calculateRating, calculateCourseDuration, calculateNoOfLectures, calculateChapterTime, currency} = useContext(AppContext)

  const fetchCourseData = async () => {
    const findCourse = allCourses.find(course => course._id === id)
    setCourseData(findCourse)
  }

  useEffect(() => {
    fetchCourseData()
  }, [allCourses])

  const toggleSection = (index) => {
    setOpenSections((prev) => (
      {...prev, 
        [index]: !prev[index]
      }
    ));
  }



  return courseData ? (
    <>
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to bg-white">
      {/* Hero Section with Gradient */}
      <div className='relative w-full py-8 sm:py-12 md:py-16'>
        <div className='flex md:flex-row flex-col gap-6 md:gap-12 items-start justify-between max-w-7xl mx-auto px-3 sm:px-6 lg:px-8'>
          
          {/* Left Column */}
          <div className='flex-1 w-full max-w-2xl px-3 sm:px-4 md:px-6'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight'>
              {courseData.courseTitle}
            </h1>
            
            <div className='mt-3 sm:mt-4 md:mt-6 prose prose-blue max-w-none text-gray-600 leading-relaxed text-sm sm:text-base'
              dangerouslySetInnerHTML={{__html:courseData.courseDescription.slice(0, 200)}}>
            </div>

            {/* Rating Card */}
            <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap items-center gap-3 sm:gap-6 p-3 sm:p-4 md:p-6 bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">{calculateRating(courseData)}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                      alt=""
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    />
                  ))}
                </div>
              </div>
              
              <div className="hidden sm:block h-8 w-px bg-gray-200"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base text-blue-600 font-semibold">
                  {courseData.courseRatings.length}
                  {courseData.courseRatings.length > 1 ? ' ratings' : ' rating'}
                </span>
              </div>

              <div className="hidden sm:block h-8 w-px bg-gray-200"></div>

              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-semibold text-gray-700">
                  {courseData.enrolledStudents.length}
                  {courseData.enrolledStudents.length > 1 ? ' students' : ' student'}
                </span>
              </div>
            </div>

            {/* Course Structure */}
            <div className='mt-6 sm:mt-8 md:mt-12'>
              <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-6'>Course Structure</h2>
              
              <div className='space-y-3 sm:space-y-4'>
                {courseData.courseContent.map((chapter, index) => (
                  <div key={index} className='border-2 border-gray-100 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300'>
                    <button 
                      className='w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50'
                      onClick={() => toggleSection(index)}
                    >
                      <div className='flex items-center gap-3'>
                        <img 
                          className={`w-5 h-5 transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`}      
                          src={assets.down_arrow_icon} 
                          alt="arrow icon" 
                        />
                        <h3 className='font-semibold text-gray-900'>{chapter.chapterTitle}</h3>
                      </div>
                      <span className='text-sm text-gray-600'>
                        {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                      </span>
                    </button>

                    <div className={`transition-all duration-300 ${openSections[index] ? 'max-h-[1000px]' : 'max-h-0'}`}>
                      <ul className='divide-y divide-gray-100'>
                        {chapter.chapterContent.map((lecture, i) => (
                          <li key={i} className='px-6 py-3 flex items-center justify-between hover:bg-gray-50'>
                            <div className='flex items-center gap-3'>
                              <img src={assets.play_icon} alt="play icon" className='w-4 h-4'/>
                              <span className='text-gray-700'>{lecture.lectureTitle}</span>
                            </div>
                            <div className='flex items-center gap-4'>
                              {lecture.isPreviewFree && (
                                <span onClick={() => setPlayerData({
                                  videoId: lecture.lectureUrl.split('/').pop()
                                })} 
                                  className='text-blue-600 text-sm font-medium hover:text-blue-700 cursor-pointer'>
                                  Preview
                                </span>
                              )}
                              <span className='text-sm text-gray-600'>
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
            </div>

            {/* Course Description */}
            <div className='py-12 sm:py-16 md:py-24'>
              <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6'>Course Description</h3>
              <div className='pt-4 rich-text leading-relaxed text-sm sm:text-base'
                dangerouslySetInnerHTML={{__html:courseData.courseDescription}}>
              </div>
            </div>
          </div>

          {/* Right Column - Course Card */}
          <div className='max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
          {
                  playerData ? 
                  <Youtube videoId={playerData.videoId} opts={{playerVars: {
                    autoplay: 1,}}} iframeClassName='w-full aspect-video'/>
                  :
                  <img 
              src={courseData.courseThumbnail} 
              alt="course thumbnail"
              className="w-full h-[200px] sm:h-[225px] object-cover"
            />
                }
            
            
            <div className='p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8'>
              {/* Price Section */}
              <div className='space-y-3'>
                <div className='flex items-center gap-2 text-red-500 bg-red-50 p-2 sm:p-3 rounded-xl text-sm sm:text-base'>
                  <img src={assets.time_left_clock_icon} alt="time left clock icon" className='w-4 h-4'/>
                  <p className='font-medium'>5 Days Left at this price!</p>
                </div>
                
                <div className='flex items-center gap-3'>
                  <span className='text-4xl font-bold text-gray-900'>{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</span>
                  <div className='space-y-1'>
                    <span className='line-through text-gray-400'>{currency}{courseData.coursePrice}</span>
                    <span className='ml-2 text-green-600 font-medium'>{courseData.discount}% off</span>
                  </div>
                </div>
              </div>

              {/* Course Stats */}
              <div className='flex flex-wrap items-center justify-between p-3 sm:p-5 bg-gray-50 rounded-2xl text-xs sm:text-sm gap-2'>
                <div className='flex items-center gap-2'>
                  <img src={assets.star} alt="star icon" className='w-5 h-5'/>
                  <span className='font-medium'>{calculateRating(courseData)} rating</span>
                </div> | 

                <div className='flex items-center gap-2'>
                  <img src={assets.time_clock_icon} alt="time clock icon" className='w-5 h-5'/>
                  <span className='font-medium'>{calculateCourseDuration(courseData)}</span>
                </div> | 

                <div className='flex items-center gap-2'>
                  <img src={assets.lesson_icon} alt="lesson icon" className='w-5 h-5'/>
                  <span className='font-medium'>{calculateNoOfLectures(courseData)} lessons</span>
                </div>
              </div>

              {/* CTA Button */}
              <button className='w-full py-3 sm:py-4 px-4 sm:px-6 bg-blue-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-xl text-sm sm:text-base'>
                {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
              </button>

              <div>
                <p className="text-lg font-semibold text-gray-900 mb-4">What you'll learn</p>
                <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                  <li>Lifetime access to the course</li>
                  <li>Step-by-step tutorials, hands-on project guidance</li>
                  <li>Downloadable resources and source code</li>
                  <li>Quizzes and practice exercises to test your knowledge</li>
                  <li>Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <Footer/>
    </>
  ) : <Loading/>
}

export default CourseDetails