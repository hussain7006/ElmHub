import React from 'react';
import useThemeStore from '../../../store/themeStore';
import { motion } from 'framer-motion';

const LoginCard = () => {
  const { colors } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: colors.surface,
        color: colors.textPrimary,
        padding: '40px',
        borderRadius: '15px',
        // Removed boxShadow and maxWidth as it's no longer a standalone card
        // boxShadow: `0 10px 25px ${colors.shadowColor || 'rgba(0,0,0,0.2)'}`,
        // maxWidth: '400px',
        width: '100%', // Ensure it takes full width of its container
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        {/* Placeholder SVG - You can replace this with your desired SVG */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ margin: '0 auto', display: 'block', color: colors.accent }}
        >
          <path
            d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7ZM12 15C9.33333 15 7 16.3333 7 18H17C17 16.3333 14.6667 15 12 15Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ color: colors.primary, marginBottom: '10px' }}
      >
        Welcome Back!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ color: colors.textSecondary, marginBottom: '20px' }}
      >
        Sign in to continue to your account.
      </motion.p>

      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <motion.input
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          type="email"
          placeholder="Email"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${colors.borderColor}`,
            backgroundColor: colors.inputBackground,
            color: colors.textPrimary,
            outline: 'none',
            fontSize: '16px',
            '::placeholder': { color: colors.placeholderColor },
          }}
        />
        <motion.input
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          type="password"
          placeholder="Password"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${colors.borderColor}`,
            backgroundColor: colors.inputBackground,
            color: colors.textPrimary,
            outline: 'none',
            fontSize: '16px',
            '::placeholder': { color: colors.placeholderColor },
          }}
        />
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          type="submit"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: colors.buttonBackground,
            color: colors.textPrimary,
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            marginTop: '10px',
          }}
        >
          Login
        </motion.button>
      </form>

      {/* You can add a "Forgot Password?" link or other elements here */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        style={{ color: colors.textSecondary, fontSize: '14px', marginTop: '20px' }}
      >
        Don't have an account? <a href="#" style={{ color: colors.accent, textDecoration: 'none' }}>Sign Up</a>
      </motion.p>
    </motion.div>
  );
};

export default LoginCard;