import React from 'react';
import LoginCard from '../../Components/Auth/Login/LoginCard';
import useThemeStore from '../../store/themeStore';
import { motion } from 'framer-motion'; // Import motion for animations

const Login = () => {
  const { colors } = useThemeStore();

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{ backgroundColor: colors.background }}
    >
      {/* Left Section: Project Details */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{ backgroundColor: colors.primary }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center text-white max-w-md mx-auto">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-wider">Welcome to ElmHub</h1>
          <p className="text-xl mb-8 opacity-90">
            Your unified gateway to APIs, applications, and innovation.
          </p>
          <ul className="text-left text-lg space-y-4">
            <li className="flex items-center">
              <span className="mr-3 text-2xl">🔐</span> Secure Access to All APIs
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-2xl">🧪</span> Interactive API Testing Playground
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-2xl">🎥</span> Video Demos for Every Application
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-2xl">🚀</span> Launch and Explore Real-time Apps
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-2xl">🎨</span> Consistent UI Based on Elm's Design
            </li>
          </ul>
          {/* You can add more project details, images, or SVGs here */}
          <motion.button
            className="mt-10 px-8 py-4 rounded-full font-bold text-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
            style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </div>
      </motion.div>

      {/* Right Section: Login Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <LoginCard />
      </motion.div>
    </div>
  );
};

export default Login;