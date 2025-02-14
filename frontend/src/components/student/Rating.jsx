import React, { useState, useEffect } from 'react'

// Rating component for displaying and rating courses
const Rating = ({initialRating, onRate}) => {

  // State to store the current rating
  const [rating, setRating] = useState(initialRating || 0);

  // Function to handle rating
  const handleRating = (value) => {
    setRating(value);
    if(onRate) {
      onRate(value);
    }
  }

  // Effect to update the rating when the initial rating changes
  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  // Render the rating component
  return (
    <div>
      {/* Render the rating stars */}
      {Array.from({length: 5}, (_, index) => {
        const starValue = index + 1;
        return (
          // Render the rating star
          <span key={index} className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue <= rating ? 'text-yellow-500' : 'text-gray-400'}`} onClick={() => handleRating(starValue)}>
            &#9733;
          </span>
        )
      })}
    </div>
  )
}

export default Rating