import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate('/course-list/' + input);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-xl">
      <form 
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
          <div className="flex-shrink-0 text-gray-400">
            <svg 
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for courses"
            className="flex-1 h-10 px-3 text-base text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
            style={{ pointerEvents: 'auto' }}
          />

          <button
            type="submit"
            className="flex-shrink-0 px-6 h-10 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;