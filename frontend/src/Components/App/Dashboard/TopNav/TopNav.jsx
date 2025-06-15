import React from 'react';
import { motion } from 'framer-motion';
import { HomeIcon, ChevronRightIcon, BellIcon } from '@heroicons/react/24/outline';

const TopNav = ({ colors }) => {
    const username = "Hussain"; // This should come from your auth context/store
    const initials = username.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="flex flex-col ml-2 shadow-sm rounded-sm"
            style={{
                backgroundColor: colors.surface,
            }}
        >
            {/* Top Navigation Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-16 px-6 flex items-center justify-between"
                style={{ borderColor: colors.borderColor, backgroundColor: colors.surface }}
            >
                {/* Left side - Marketplace text */}
                <div className="flex items-center space-x-4">
                    <span className="text-gray-500 font-medium text-[22px]">Marketplace</span>
                </div>

                {/* Right side - Search, Notification, User */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for any content..."
                            className="w-64 pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                            style={{
                                backgroundColor: colors.inputBackground,
                                color: colors.textPrimary,
                                border: `1px solid ${colors.borderColor}`,
                                '--tw-ring-color': colors.accent,
                            }}
                        />
                        <svg
                            className="w-5 h-5 absolute right-3 top-2.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: colors.textSecondary }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative p-2 rounded-full"
                        style={{ backgroundColor: '#2ecc71' }}
                    >
                        <BellIcon className="w-5 h-5 text-white" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                            3
                        </span>
                    </motion.button>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium cursor-pointer"
                        style={{ backgroundColor: colors.accent }}
                    >
                        {initials}
                    </motion.div>
                </div>
            </motion.div>

            {/* Greeting and Breadcrumbs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="px-6 py-0"
                style={{ borderColor: colors.borderColor }}
            >
                <div className="flex items-center space-x-2 text-2xl font-bold text-gray-600">
                    <span >Good Morning, {username.split(' ')[0]}!</span>
                </div>
                <div className="flex items-center space-x-2 mt-2 mb-6">
                    <HomeIcon className="w-4 h-4 text-gray-400" />
                    <ChevronRightIcon className="w-4 h-4 text-gray-400 "/>
                    <span className='text-gray-400 text-sm'>Marketplace</span>
                </div>
            </motion.div>
        </div>
    );
};

export default TopNav;