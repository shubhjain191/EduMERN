import  Course  from '../models/course.js'

//Get all courses
export const getAllCourses = async (req, res) => {
    try {

        const courses = await Course.find({isPublished: true}).select(['-courseContent', '-enrolledStudents']).populate({path: 'educator'})//select fields to exclude and populate educator data

        res.json({success: true, courses})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getCourseId = async (req, res) => {
    // Get course id from params
    const { id } = req.params;

    try {
        // Get course data
        const courseData = await Course.findById(id).populate({ path: 'educator' });

        // If course is not found, return an error response
        if (!courseData) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Ensure courseContent is an array before iterating
        if (Array.isArray(courseData.courseContent)) {
            courseData.courseContent.forEach(chapter => {
                // Ensure chapterContent is an array before iterating
                if (Array.isArray(chapter.chapterContent)) {
                    chapter.chapterContent.forEach(lecture => {
                        if (!lecture.isPreviewFree) {
                            lecture.lectureUrl = ""; // Remove URL for non-preview lectures
                        }
                    });
                }
            });
        }

        res.json({ success: true, courseData });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

