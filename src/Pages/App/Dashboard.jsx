import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../store/themeStore';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { colors } = useThemeStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Sidebar */}
      <motion.div
        className={`flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out`}
        style={{ backgroundColor: colors.primary }}
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Sidebar Top Bar */}
        <div className="flex items-center justify-between p-4">
          {isSidebarOpen && <div className="text-xl font-bold">ElmHub</div>}
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <nav className="mt-5">
          {isSidebarOpen ? (
            <>
              <h3 className="text-xs uppercase font-semibold text-gray-400 px-4 mb-2">Products</h3>
              {/* Search Bar */}
              <div className="px-4 mb-4">
                <input
                  type="text"
                  placeholder="Search apps..."
                  className="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Demo Applications */}
              <ul>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"><span className="mr-2">🏠</span> Smart Home</li>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"><span className="mr-2">✅</span> Task Tracker</li>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"><span className="mr-2">🏋️</span> Fitness Pro</li>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"><span className="mr-2">📚</span> EduLearn</li>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"><span className="mr-2">❤️</span> Health Monitor</li>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"><span className="mr-2">💰</span> Finance Buddy</li>
              </ul>

              <h3 className="text-xs uppercase font-semibold text-gray-400 px-4 mt-6 mb-2">Settings</h3>
              {/* Settings */}
              <ul>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"><span className="mr-2">👥</span> User Management</li>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"><span className="mr-2">🗄️</span> Data Resources</li>
              </ul>

              <h3 className="text-xs uppercase font-semibold text-gray-400 px-4 mt-6 mb-2">Analytics Dashboard</h3>
              {/* Analytics Dashboard */}
              <ul>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"><span className="mr-2">🔔</span> Notifications</li>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"><span className="mr-2">💻</span> API Management</li>
              </ul>
            </>
          ) : (
            <div className="flex flex-col items-center mt-4 space-y-4">
              <span className="text-2xl">🏠</span>
              <span className="text-2xl">✅</span>
              <span className="text-2xl">🏋️</span>
              <span className="text-2xl">📚</span>
              <span className="text-2xl">❤️</span>
              <span className="text-2xl">💰</span>
              <span className="text-2xl">👥</span>
              <span className="text-2xl">🗄️</span>
              <span className="text-2xl">🔔</span>
              <span className="text-2xl">💻</span>
            </div>
          )}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8" style={{ color: colors.textPrimary }}>
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        <p>Welcome to your dashboard. More content will go here.</p>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;