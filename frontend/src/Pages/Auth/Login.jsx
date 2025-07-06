import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import useThemeStore from '../../store/themeStore';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  GlobeAltIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Login = () => {
  const { colors, theme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Secure Access",
      description: "Enterprise-grade security for all your APIs"
    },
    {
      icon: RocketLaunchIcon,
      title: "Real-time Apps",
      description: "Launch and explore applications instantly"
    },
    {
      icon: CpuChipIcon,
      title: "AI-Powered",
      description: "Advanced machine learning capabilities"
    },
    {
      icon: GlobeAltIcon,
      title: "Global Platform",
      description: "Access from anywhere, anytime"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle login logic here
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden" style={{ backgroundColor: colors.background }}>

      {/* Left Section: Hero & Features - Hidden on mobile */}
      <motion.div
        className="hidden lg:flex w-full lg:w-1/2 items-center justify-center p-6 lg:p-12 relative"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%)`
        }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center text-white max-w-lg mx-auto">
          {/* Logo/Brand */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Welcome to ElmHub</h1>
            <p className="text-lg opacity-90">Your AI-Powered Innovation Platform</p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-4 rounded-xl text-left"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs opacity-80">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.button
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
            whileHover={{ scale: 1.05, boxShadow: `0 8px 25px ${colors.accent}40` }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Explore Platform
          </motion.button>
        </div>
      </motion.div>

      {/* Right Section: Login Form - Full width on mobile */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-full max-w-md">
          {/* Form Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${colors.primary}20` }}>
              <UserIcon className="w-8 h-8" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              Welcome Back
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Sign in to access your account
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <EnvelopeIcon className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.borderColor,
                  color: colors.textPrimary,
                  focusRingColor: colors.primary
                }}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <LockClosedIcon className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.borderColor,
                  color: colors.textPrimary,
                  focusRingColor: colors.primary
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors duration-200 cursor-pointer"
                style={{ color: colors.textSecondary }}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            {/* <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{
                    accentColor: colors.primary,
                    backgroundColor: colors.surface,
                    borderColor: colors.borderColor
                  }}
                />
                <span style={{ color: colors.textSecondary }}>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="font-medium transition-colors duration-200 cursor-pointer"
                style={{ color: colors.primary }}
              >
                Forgot password?
              </Link>
            </div> */}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundColor: colors.primary }}
              whileHover={{ scale: 1.02, boxShadow: `0 8px 25px ${colors.primary}40` }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Signing in...</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>



          {/* Sign Up Link */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold transition-colors duration-200 cursor-pointer"
                style={{ color: colors.primary }}
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;