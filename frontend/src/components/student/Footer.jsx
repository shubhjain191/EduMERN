import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-sky-700 w-full mt-10">
      <div className="container mx-auto px-8 md:px-36 py-10 border-b border-sky-300">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 md:gap-20">
          {/* Left Section - Logo and Description */}
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <img src={assets.logo} alt="logo" className="w-34 h-24" />
            <p className="mt-6 text-center md:text-left text-sm max-w-xs">
              EduMERN is your gateway to mastering modern web development. Learn
              full-stack development with hands-on projects, expert guidance,
              and a supportive community. Start your journey today!
            </p>
          </div>

          {/* Middle Section - Company Links */}
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <h2 className="font-semibold  mb-5 text-lg">Company</h2>
            <ul className="flex flex-col space-y-3 text-sm ">
              <li>
                <a href="#" className="hover:text-sky-900 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-900 transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-900 transition-colors">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-900 transition-colors">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>

          {/* Right Section - Newsletter */}
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <h2 className="font-semibold mb-5 text-lg">
              Subscribe to our newsletter
            </h2>
            <p className="text-sm mb-4 max-w-xs text-center md:text-left">
              The latest news, articles, and resources, sent to your inbox
              weekly.
            </p>
            <div className="flex flex-col md:flex-row gap-2 w-full max-w-xs">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-white  focus:outline-none focus:ring-2  border border-sky-300"
              />
              <button className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <p className="py-4 text-center text-xs md:text-sm ">
        Copyright 2025 © EduMERN. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;