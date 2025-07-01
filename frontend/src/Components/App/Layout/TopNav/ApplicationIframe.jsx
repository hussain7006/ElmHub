import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import useThemeStore from '../../../../store/themeStore';

const ApplicationIframe = ({ 
    app, 
    isVisible, 
    onClose, 
    onBack 
}) => {
    const { colors, theme } = useThemeStore();
    const [iframeLoading, setIframeLoading] = useState(true);
    const [iframeError, setIframeError] = useState(null);

    useEffect(() => {
        if (isVisible) {
            setIframeLoading(true);
            setIframeError(null);
        }
    }, [isVisible, app]);

    const handleIframeLoad = () => {
        setIframeLoading(false);
    };

    const handleIframeError = () => {
        setIframeLoading(false);
        setIframeError('Failed to load application');
    };

    const handleClose = () => {
        setIframeLoading(false);
        setIframeError(null);
        onClose();
    };

    const handleBack = () => {
        setIframeLoading(false);
        setIframeError(null);
        onBack();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 bg-white dark:bg-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Header */}
                    <motion.div
                        className="flex items-center justify-between px-6 py-4 border-b"
                        style={{ 
                            backgroundColor: colors.surface,
                            borderColor: colors.borderColor
                        }}
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleBack}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                style={{ color: colors.textSecondary }}
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                            </button>
                            
                            <div>
                                <h1 
                                    className="text-lg font-semibold"
                                    style={{ color: colors.textPrimary }}
                                >
                                    {app?.name || 'Application'}
                                </h1>
                                <p 
                                    className="text-sm"
                                    style={{ color: colors.textSecondary }}
                                >
                                    {app?.description || 'Loading application...'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                            style={{ color: colors.textSecondary }}
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </motion.div>

                    {/* Iframe Container */}
                    <div className="relative h-full">
                        {/* Loading Overlay */}
                        {iframeLoading && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center z-10"
                                style={{ backgroundColor: colors.surface }}
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center">
                                    <motion.div
                                        className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 rounded-full"
                                        style={{ borderTopColor: colors.primary }}
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <p 
                                        className="text-sm"
                                        style={{ color: colors.textSecondary }}
                                    >
                                        Loading {app?.name || 'application'}...
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Error Overlay */}
                        {iframeError && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center z-10"
                                style={{ backgroundColor: colors.surface }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center max-w-md mx-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/20">
                                        <svg
                                            className="w-8 h-8 text-red-500"
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
                                    </div>
                                    <h3 
                                        className="text-lg font-semibold mb-2"
                                        style={{ color: colors.textPrimary }}
                                    >
                                        Failed to Load Application
                                    </h3>
                                    <p 
                                        className="text-sm mb-6"
                                        style={{ color: colors.textSecondary }}
                                    >
                                        {iframeError}
                                    </p>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => {
                                                setIframeError(null);
                                                setIframeLoading(true);
                                                // Reload iframe by changing key
                                            }}
                                            className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                            style={{
                                                backgroundColor: colors.primary,
                                                color: '#ffffff'
                                            }}
                                        >
                                            Try Again
                                        </button>
                                        <button
                                            onClick={handleBack}
                                            className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 border"
                                            style={{
                                                borderColor: colors.borderColor,
                                                color: colors.textSecondary
                                            }}
                                        >
                                            Go Back
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Iframe */}
                        <iframe
                            key={`${app?.id}-${Date.now()}`} // Force reload on app change
                            src={app?.iframeUrl || 'https://nuha.ai'}
                            title={app?.name || 'Application'}
                            className="w-full h-full border-0"
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                            allowFullScreen
                            allow="camera; microphone; geolocation; encrypted-media"
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ApplicationIframe; 