import React from 'react';
import { motion } from 'framer-motion';

const PageWrapper = ({ children, className = "", ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`h-full flex-1 flex flex-col min-h-0 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper; 