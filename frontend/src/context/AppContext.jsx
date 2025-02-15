import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from "@clerk/clerk-react";

// Create the AppContext
export const AppContext = createContext()

// Provider component for the AppContext
export const AppContextProvider = (props) => {

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
    const [isEducator, setIsEducator] = useState(true)

    // State for enrolled courses
    const [enrolledCourses, setEnrolledCourses] = useState([])
    
    //Fetch All Courses

    const fetchAllCourses = async() => {
        setAllCourses(dummyCourses)
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
        return totalRating / course.courseRatings.length
    }

    // Function to calculate course Chapter time
const calculateChapterTime = (chapter) => {
    let time = 0  
    chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
    return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
}

    //Function to calculate the course duration
    const calculateCourseDuration = (course) => {
        let time = 0
        course.courseContent.map((chapter) => chapter.chapterContent.map(
            (lecture) => time += lecture.lectureDuration
        ))
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
        setEnrolledCourses(dummyCourses)
    }

    // Effect to fetch all courses and enrolled courses on component mount
    useEffect(() => {
        fetchAllCourses()
        fetchUserEnrolledCourses()
    }, [])

    const logToken = async () => {
        console.log(await getToken());
    }

    // Effect to check if user is educator
    useEffect(() => {
        if(user){
            logToken()
        }
    }, [user])

    // Value to provide to the AppContext
    const value = {
        currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, enrolledCourses, fetchUserEnrolledCourses
    }

    // Render the AppContextProvider
return(
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
)
}