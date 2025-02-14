import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link 
      to={'/course/' + course._id} 
      onClick={() => scrollTo(0, 0)}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-xl"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          src={course.courseThumbnail} 
          alt={course.courseTitle}
        />
        {/* Discount Badge */}
        <div className="absolute right-2 top-2 rounded px-1.5 py-0.5 bg-red-500 text-[10px] font-medium text-white sm:text-xs">
          {course.discount}% OFF
        </div>
      </div>
      
      {/* Content Container */}
      <div className="p-2 sm:p-3 lg:p-4">
        {/* Title Container */}
        <div className="min-h-[32px] sm:min-h-[36px] lg:min-h-[40px]">
          <h3 className="text-xs font-bold text-gray-900 line-clamp-2 sm:text-sm lg:text-base">
            {course.courseTitle}
          </h3>
          <p className='text-gray-500 mt-1 mb-1 text-xs sm:text-sm'>Shubh Jain</p>
        </div>
        
        {/* Rating Container */}
        <div className="mb-1.5 mt-1 flex items-center space-x-1 sm:mb-2">
          <span className="text-xs font-semibold sm:text-sm">{calculateRating(course)}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                alt=""
                className="h-3 w-3 sm:h-3.5 sm:w-3.5"
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-500 sm:text-xs">{course.courseRatings.length}</span>
        </div>
        
        {/* Price Container */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-gray-900 sm:text-base">
              {currency}{(course.coursePrice - (course.discount * course.coursePrice / 100)).toFixed(2)}
            </span>
            <span className="text-[10px] text-gray-400 line-through sm:text-xs">
              {currency}{course.coursePrice}
            </span>
          </div>
          
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-700 sm:px-3 sm:py-1 sm:text-xs">
            View Course
          </span>
        </div>
      </div>
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent transition-colors duration-300 group-hover:border-blue-500 sm:rounded-xl" />
    </Link>
  );
};

export default CourseCard;