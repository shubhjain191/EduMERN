import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';

// Sidebar component for educator dashboard
const Sidebar = () => {
    // Context to access educator status
    const { isEducator } = useContext(AppContext);
    
    // Menu items for the sidebar
    const menuItems = [
        { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
        { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
        { name: 'My Courses', path: '/educator/my-course', icon: assets.my_course_icon },
        { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
    ];

    // Render the sidebar if educator status is true
    return isEducator && (
        // Sidebar container with responsive width, border, and styling
        <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
            {/* Map through menu items and render NavLink components */}
            {menuItems.map((item) => (
                // NavLink component for each menu item
                <NavLink
                    // Set the path for the NavLink
                    to={item.path}
                    key={item.name}
                    // Set the active state for the NavLink
                    end={item.path === '/educator'}
                      className={({ isActive }) =>
                       `flex items-center md:flex-row flex-col  md:justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-cyan-50 border-r-4 border-cyan-500 text-cyan-600 font-semibold' : 'text-gray-600 hover:text-cyan-600'}`
                    }
                >
                   <img src={item.icon} alt="" className='w-6 h-6'/>
                   <p className='md:block hiddentext-center'>{item.name}</p>
                </NavLink>
            ))}
        </div>
    );
};

export default Sidebar;