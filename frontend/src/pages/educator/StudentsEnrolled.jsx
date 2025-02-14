import React, { useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/student/Loading'

// Component to display list of enrolled students in a tabular format
const StudentsEnrolled = () => {
  // State to store enrolled students data
  const [enrollledStudents, setEnrolledStudents] = useState(null)

  // Function to fetch enrolled students data
  const fetchEnrolledStudents = async () => {
    // Currently using dummy data, should be replaced with actual API call
    setEnrolledStudents(dummyStudentEnrolled)
  }

  // Fetch enrolled students data on component mount
  useEffect(() => {
    fetchEnrolledStudents()
  }, [])
  
  return enrollledStudents ? (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Map through enrolled students and render each row */}
            {enrollledStudents.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img src={item.student.imageUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <span className="ml-4 text-sm text-gray-900">{item.student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.courseTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default StudentsEnrolled