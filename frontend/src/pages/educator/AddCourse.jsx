// Import necessary dependencies
import React, { useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid' // For generating unique IDs
import Quill from 'quill'    // Rich text editor
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext.jsx'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

// Main component for adding a new course
const AddCourse = () => {

  const {backendUrl, getToken} = useContext(AppContext)


  // Refs for Quill editor initialization
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  // State for course basic details
  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  
  // State for managing chapters and lectures
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)

  // State for lecture form details
  const [lectureDetails, setLectureDetails] = useState(
    {
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    }
  )

  // Handle chapter operations (add, remove, toggle collapse)
  const handleChapter = (action, chapterId) => {
    if(action === 'add') {
      const title = prompt('Enter Chapter Name')
      if(title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1
        }
        setChapters([...chapters, newChapter])
      }
      else if(action === 'remove') {
        setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId))
      } else if(action === 'toggle') {
        setChapters(
          chapters.map((chapter) => 
          chapter.chapterId === chapterId ? {...chapter, collapsed: !chapter.collapsed} : chapter
          )
        )
      }
    }
  }

  // Handle lecture operations (add, remove)
  const handleLecture = (action, chapterId, lectureIndex) => {
    if(action === 'add') {
      setCurrentChapterId(chapterId)
      setShowPopup(true)
    }
    else if(action === 'remove') {
      setChapters(chapters.map((chapter) => {
        if(chapter.chapterId === chapterId) {
          chapter.chapterContent.splice(lectureIndex, 1)
        }
        return chapter
      }))
    }
  }

  // Add a new lecture to the specified chapter
  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if(chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid(),
          }
          chapter.chapterContent.push(newLecture)
        }
        return chapter
      })
    )
    setShowPopup(false)
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if(!image){
        toast.error('Please upload a thumbnail image')
      }
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }
      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('thumbnail', image)
      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/educator/add-course', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(data.success){
        toast.success(data.message)
        setCourseTitle('')
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
        quillRef.current.root.innerHTML('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Initialize Quill editor when component mounts
  useEffect(() => {
    if(!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow'
      })
    }
  }, [])

  return (
    // Main container with gray background
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Course creation form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 bg-white rounded-lg shadow-md p-8">
        
        {/* Course Title Section */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-700">Course Title</p>
          <input 
            onChange={e => setCourseTitle(e.target.value)} 
            value={courseTitle} 
            type="text" 
            placeholder='Enter Course Title' 
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Course Description Section with Quill Editor */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-700">Course Description</p>
          <div ref={editorRef} className="h-48 border rounded-md"></div>
        </div>

        {/* Price and Thumbnail Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Course Price Input */}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-700">Course Price</p>
            <input 
              onChange={e => setCoursePrice(e.target.value)} 
              value={coursePrice} 
              type="number" 
              placeholder='Enter Course Price' 
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Course Thumbnail Upload */}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-700">Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <img src={assets.file_upload_icon} alt="" className="w-12 h-12 mb-2" />
              <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept='image/*' hidden/>
              {/* Preview uploaded image */}
              {image && <img src={URL.createObjectURL(image)} alt="" className="max-h-36 object-contain" />}
            </label>
          </div>
        </div>

        {/* Discount Section */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-700">Discount %</p>
          <input 
            onChange={e => setDiscount(e.target.value)} 
            value={discount} 
            type="number" 
            placeholder='Enter Discount %' 
            min={0} 
            max={100} 
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Chapters and Lectures Section */}
        <div className="space-y-4">
          {/* Map through chapters */}
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="border rounded-lg p-4">
              {/* Chapter Header with Toggle and Delete */}
              <div className="flex items-center justify-between">
                {/* Chapter Title and Toggle Button */}
                <div className="flex items-center">
                  <img 
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                    src={assets.dropdown_icon} 
                    width={14} 
                    alt="" 
                    className={`mr-2 cursor-pointer transition-transform duration-200 ${chapter.collapsed ? "-rotate-90" : ""}`}
                  />
                  <span className="font-medium">{chapterIndex + 1}. {chapter.chapterTitle}</span>
                </div>
                {/* Chapter Actions */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{chapter.chapterContent.length} Lectures</span>
                  <img src={assets.cross_icon} alt="" className="w-4 h-4 cursor-pointer hover:opacity-75" />
                </div>
              </div>
              
              {/* Lectures List (shown when chapter is not collapsed) */}
              {!chapter.collapsed && (
                <div className="mt-4 space-y-2 pl-6">
                  {/* Map through lectures */}
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      {/* Lecture Details */}
                      <span className="text-sm">
                        {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins - 
                        <a href={lecture.lectureUrl} target='_blank' className="text-blue-500 hover:underline">Link</a> - 
                        <span className={lecture.isPreviewFree ? "text-green-500" : "text-gray-600"}>
                          {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                        </span>
                      </span>
                      {/* Delete Lecture Button */}
                      <img 
                        src={assets.cross_icon} 
                        onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} 
                        alt="" 
                        className="w-4 h-4 cursor-pointer hover:opacity-75"
                      />
                    </div>
                  ))}
                  {/* Add Lecture Button */}
                  <button 
                    type="button"
                    onClick={() => handleLecture('add', chapter.chapterId)}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    + Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {/* Add Chapter Button */}
          <button 
            type="button"
            onClick={() => handleChapter('add')} 
            className="w-full py-3 border-2 border-dashed rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400"
          >
            + Add Chapter
          </button>

          {/* Add Lecture Popup Modal */}
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <h2 className="text-xl font-semibold mb-4">Add Lecture</h2>
                
                {/* Lecture Form Fields */}
                <div className="space-y-4">
                  {/* Lecture Title Input */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Lecture Title</p>
                    <input 
                      type="text" 
                      value={lectureDetails.lectureTitle}
                      onChange={(e) => setLectureDetails({...lectureDetails, lectureTitle: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Duration Input */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Duration (minutes)</p>
                    <input 
                      type="number" 
                      value={lectureDetails.lectureDuration}
                      onChange={(e) => setLectureDetails({...lectureDetails, lectureDuration: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* URL Input */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Lecture URL</p>
                    <input 
                      type="text" 
                      value={lectureDetails.lectureUrl}
                      onChange={(e) => setLectureDetails({...lectureDetails, lectureUrl: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Free Preview Toggle */}
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      id="isPreviewFree"
                      checked={lectureDetails.isPreviewFree}
                      onChange={(e) => setLectureDetails({...lectureDetails, isPreviewFree: e.target.checked})}
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPreviewFree" className="text-sm font-medium text-gray-700">
                      Make this lecture free for preview
                    </label>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="mt-6 flex justify-end gap-4">
                  <button 
                    type='button' 
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button 
                    type='button' 
                    onClick={addLecture}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Lecture
                  </button>
                </div>

                {/* Close Modal Button */}
                <img 
                  onClick={() => setShowPopup(false)} 
                  src={assets.cross_icon} 
                  alt="" 
                  className="absolute top-4 right-4 w-4 h-4 cursor-pointer hover:opacity-75"
                />
              </div>
            </div>
          )}

          {/* Submit Form Button */}
          <button 
            type='submit'
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCourse