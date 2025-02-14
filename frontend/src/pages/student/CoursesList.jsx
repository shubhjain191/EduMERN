import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../context/AppContext"
import SearchBar from "../../components/student/SearchBar"
import { useParams, useNavigate, Link } from "react-router-dom"
import CourseCard from "../../components/student/CourseCard"
import Footer from "../../components/student/Footer"

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext)
  const { input } = useParams()
  const [filteredCourse, setFilteredCourse] = useState([])

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice()
      
      if (input) {
        const filtered = tempCourses.filter(item => 
          item.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
        setFilteredCourse(filtered)
      } else {
        setFilteredCourse(tempCourses)
      }
    }
  }, [allCourses, input])

  const clearSearch = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate('/courses-list')
  }

  return (
    <>
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-sky-800 mb-4">Course List</h1>
            <p className="text-sky-600">
              <Link to="/" className="cursor-pointer hover:text-sky-700 transition-colors">
                Home
              </Link>{" "}
              / <span className="text-sky-500">Course List</span>
            </p>
          </div>
        </div>
        
        <div className="mb-8 flex justify-center">
          <SearchBar data={input || ""} />
        </div>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCourse.map((course, index) => (
          <CourseCard 
            key={course.id || index} 
            course={course}
            onClick={(e) => e.stopPropagation()} 
          />
        ))}
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default CoursesList