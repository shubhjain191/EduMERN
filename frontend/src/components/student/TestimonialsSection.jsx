import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialsSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading Section */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Hear from Our Learners
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Join thousands of successful learners who have transformed their careers through our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {dummyTestimonial.map((testimonial, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl 
                         transition-all duration-300 ease-in-out transform hover:-translate-y-2"
            >
              {/* Top Section with Primary Color */}
              <div className="bg-sky-600 p-6">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/30"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                      <svg
                        className="w-3 h-3 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-0.5">
                      {testimonial.name}
                    </h3>
                    <p className="text-blue-100/90 text-sm font-normal">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                {/* Rating */}
                <div className="flex items-center space-x-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                      alt="star"
                      className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-200 
                               filter brightness-200"
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Section with White Background */}
              <div className="bg-white p-6">
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {testimonial.feedback}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 
                             font-medium transition-colors duration-200 group-hover:underline"
                >
                  Read full story
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;