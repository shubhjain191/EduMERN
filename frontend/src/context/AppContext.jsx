import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

// Create the AppContext
export const AppContext = createContext()

// Provider component for the AppContext
export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // Currency from environment variables
    const currency = import.meta.env.VITE_CURRENCY

    // Navigation hook
    const navigate = useNavigate()

    // Auth hook
    const {getToken} = useAuth()

    // User hook
    const {user} = useUser()

    // State for all courses
    const [allCourses, setAllCourses] = useState([])

    // State for educator status
    const [isEducator, setIsEducator] = useState(false)

    // State for enrolled courses
    const [enrolledCourses, setEnrolledCourses] = useState([])

    const [userData, setUserData] = useState(null)
    
    //Fetch All Courses

    const fetchAllCourses = async() => {
        try {
          const {data}  = await axios.get(backendUrl + '/api/course/all')
          
          if(data.success){
            setAllCourses(data.courses)
          } else {
            toast.error(data.message)
          }

        } catch (error) {
            toast.error(error.message)
        }
    }

    //Fetch user Data

    const fetchUserData = async() => {

        if (user.publicMetadata.role === 'educator') {
            setIsEducator(true)
        }

        try {
            const token = await getToken()

            const {data} =await axios.get(backendUrl + '/api/user/data', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(data.success){
                setUserData(data.user)
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }


    //Function to calculate average rating of course
    const calculateRating = (course) => {
        if(course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    // Function to calculate course Chapter time
const calculateChapterTime = (chapter) => {
    let time = 0
    if (chapter?.chapterContent && Array.isArray(chapter.chapterContent)) {
        chapter.chapterContent.forEach((lecture) => {
            if (lecture?.lectureDuration) {
                time += lecture.lectureDuration
            }
        })
    }
    return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
}

    //Function to calculate the course duration
    const calculateCourseDuration = (course) => {
        let time = 0
        if (course?.courseContent && Array.isArray(course.courseContent)) {
            course.courseContent.forEach((chapter) => {
                if (chapter?.chapterContent && Array.isArray(chapter.chapterContent)) {
                    chapter.chapterContent.forEach((lecture) => {
                        if (lecture?.lectureDuration) {
                            time += lecture.lectureDuration
                        }
                    })
                }
            })
        }
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }

    //Function calculate to No of Lectures in the course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0
        course.courseContent.forEach((chapter) => {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length
            }
        });
        return totalLectures
    }

    //Function to fetch enrolled courses
    const fetchUserEnrolledCourses = async() => {

        try {
            const token = await getToken()

            const {data} = await axios.get(backendUrl + '/api/user/enrolled-courses', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(data.success){
            setEnrolledCourses(data.enrolledCourses.reverse())
        } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Effect to fetch all courses and enrolled courses on component mount
    useEffect(() => {
        fetchAllCourses()
    }, [])



    // Effect to check if user is educator
    useEffect(() => {
        if(user){
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    }, [user])

    // Value to provide to the AppContext
    const value = {
        currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, enrolledCourses, fetchUserEnrolledCourses, backendUrl, userData, setUserData, fetchAllCourses, getToken
    }

    // Render the AppContextProvider
return(
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
)
}