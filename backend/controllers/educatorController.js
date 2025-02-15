import { clerkClient } from '@clerk/express'
import Course from '../models/course.js'
import { v2 as cloudinary } from 'cloudinary'
import { Purchase } from '../models/Purchase.js'


// Update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId

        //update user role to educator
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator'
            }
        })

        //send success response
        res.json({success: true, message: 'You can publish course now'})
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//Add new course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId

        if (!imageFile) {
            return res.json({success: false, message: 'Thumbnail not attached'})
        }

        //parse course data
        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
       const newCourse = await Course.create(parsedCourseData)
       //upload image to cloudinary
       const imageUpload = await cloudinary.uploader.upload(imageFile.path)
       newCourse.courseThumbnail = imageUpload.secure_url
       await newCourse.save()

       res.json({success: true, message: 'Course added successfully'})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//Get educator courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({educator})
        res.json({success: true, courses})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


//Educator dashboard data
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId //get educator id  
        const courses = await Course.find({educator}) //get all courses
        const totalCourses = courses.length //get total courses
        const courseIds = courses.map(course => course._id) //get all course ids

        //get all completed purchases
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        })

        //calculate total earnings
        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

        //get enrolled students data
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            }, 'name imageUrl');

            //push enrolled students data to the array
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }

        //prepare dashboard data
        res.json({success: true, dashboardData: {totalEarnings, enrolledStudentsData, totalCourses}})
        
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}



//Get enrolled students data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId //get educator id
        const courses = await Course.find({educator}) //get all courses
        const courseIds = courses.map(course => course._id) //get all course ids

        //get all completed purchases
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle') //populate user and course data

        //prepare enrolled students data
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))

        res.json({success: true, enrolledStudents})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}
