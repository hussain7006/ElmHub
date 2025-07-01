import React from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../../../store/themeStore';

const ApplicationLoader = ({ 
    isLoading, 
    error, 
    appName = 'Application',
    onRetry = null,
    onClose = null 
}) => {
    const { colors, theme } = useThemeStore();

    if (!isLoading && !error) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)' }}
        >
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                style={{ 
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.borderColor}`
                }}
            >
                {isLoading && (
                    <div className="text-center">
                        {/* Loading Spinner */}
                        <motion.div
                            className="w-16 h-16 mx-auto mb-6 border-4 border-gray-200 rounded-full"
                            style={{ borderTopColor: colors.primary }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        
                        {/* Loading Text */}
                        <motion.h3
                            className="text-xl font-semibold mb-2"
                            style={{ color: colors.textPrimary }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Launching {appName}
                        </motion.h3>
                        
                        <motion.p
                            className="text-sm"
                            style={{ color: colors.textSecondary }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Please wait while we authenticate and load the application...
                        </motion.p>
                        
                        {/* Progress Steps */}
                        <motion.div
                            className="mt-6 space-y-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center justify-between text-xs">
                                <span style={{ color: colors.textSecondary }}>Authenticating...</span>
                                <motion.div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: colors.primary }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span style={{ color: colors.textSecondary }}>Loading application...</span>
                                <motion.div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: colors.primary }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}

                {error && (
                    <div className="text-center">
                        {/* Error Icon */}
                        <motion.div
                            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <svg
                                className="w-8 h-8"
                                style={{ color: '#ef4444' }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </motion.div>

                        {/* Error Message */}
                        <motion.h3
                            className="text-xl font-semibold mb-2"
                            style={{ color: colors.textPrimary }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Failed to Launch {appName}
                        </motion.h3>

                        <motion.p
                            className="text-sm mb-6"
                            style={{ color: colors.textSecondary }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {error.message || 'An unexpected error occurred while launching the application.'}
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div
                            className="flex space-x-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {onRetry && (
                                <button
                                    onClick={onRetry}
                                    className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: '#ffffff'
                                    }}
                                >
                                    Try Again
                                </button>
                            )}
                            
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 border"
                                    style={{
                                        borderColor: colors.borderColor,
                                        color: colors.textSecondary
                                    }}
                                >
                                    Close
                                </button>
                            )}
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ApplicationLoader; 