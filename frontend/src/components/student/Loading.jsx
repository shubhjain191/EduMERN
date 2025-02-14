import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='relative'>
        {/* Infinity loader container */}
        <div className='w-12 h-6 relative'>
          {/* Left circle of infinity */}
          <div className='absolute w-6 h-6 border-4 border-blue-500 rounded-full animate-[infinity-left_2s_linear_infinite]'></div>
          {/* Right circle of infinity */}
          <div className='absolute right-0 w-6 h-6 border-4 border-blue-500 rounded-full animate-[infinity-right_2s_linear_infinite]'></div>
        </div>
        
        {/* Loading text below the animation */}
        <p className='text-center mt-6 text-gray-600'>Loading...</p>
      </div>
    </div>
  )
}

export default Loading