import express from 'express'
import { updateRoleToEducator, addCourse, getEducatorCourses, educatorDashboardData, getEnrolledStudentsData } from '../controllers/educatorController.js'
import upload from '../configs/multer.js'
import protectEducator from '../middleware/authMiddleware.js'

const educatorRouter = express.Router()

//Add educator role
educatorRouter.get('/update-role', updateRoleToEducator)
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse)
educatorRouter.get('/courses', protectEducator, getEducatorCourses)
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)



export default educatorRouter
