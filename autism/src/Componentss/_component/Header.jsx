import { motion } from 'framer-motion';
import { colors } from "../../config/colors";
import useAuthStore from "../../store/authStore";
import { useState, useEffect } from "react";
import useHeaderStore from "../../store/headerStore";
import { useNavigate } from 'react-router-dom';

export default function Header() {

    const { user, theme, toggleTheme, logout, showHeader } = useAuthStore();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { isSidebarOpen, toggleSidebar } = useHeaderStore();
    const navigate = useNavigate();

    const handleLogout = async () => { 
        await logout(); 
        navigate('/quick-login');
    };

    const navigationItems = [
        {
            id: 'manage-child',
            label: 'Manage Child',
            roles: ['parent'],
            icon: '👶'
        },
        {
            id: 'book-session',
            label: 'Book Session',
            roles: ['parent', 'specialist', 'child'],
            icon: '📊'
        },
        {
            id: 'booked-sessions',
            label: 'Booked Session',
            roles: ['parent'],
            icon: '📊'
        },
        {
            id: 'create-service',
            label: 'Create Service',
            roles: ['specialist'],
            icon: '🎯'
        },
        {
            id: 'download-report',
            label: 'Download Report',
            roles: ['parent'],
            icon: '📥'
        },
        {
            id: 'create-session',
            label: 'Create Session',
            roles: ['specialist'],
            icon: '➕'
        },
        {
            id: 'calendar',
            label: 'View Calendar',
            roles: ['specialist'],
            icon: '📅'
        },
        {
            id: 'profile',
            label: 'Profile',
            roles: ['parent', 'specialist', 'child'],
            icon: '👤'
        },
        {
            id: 'logout',
            label: 'Logout',
            roles: ['parent', 'specialist', 'child'],
            icon: '🚪'
        }
    ];

    const filteredNavItems = navigationItems.filter(item =>
        item.roles.includes(user?.role)
    );

    // Don't render header if showHeader is false
    if (!showHeader) {
        return null;
    }

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}
                style={theme === 'light' ? { background: colors.primary.light } : { background: colors.gray[900] }}
            >
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-4">
                        {/* Improved Sidebar toggle button with smooth animation */}
                        <button
                            onClick={() => toggleSidebar()}
                            className="p-2 rounded-md hover:bg-opacity-80 transition-all duration-300 ease-in-out cursor-pointer"
                            aria-label="Toggle Sidebar"
                        >
                            <motion.div
                                animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={isSidebarOpen
                                            ? "M4 6h16M4 12h16M4 18h16"
                                            : "M4 6h16M4 12h16M4 18h16"
                                        }
                                    />
                                </svg>
                            </motion.div>
                        </button>
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/book-session')}>
                            <img src="/logo.png" alt="GazeVLM Logo" className="h-8 w-8" />
                            <h1 className="text-xl font-bold text-white">GazeVLM</h1>

                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full cursor-pointer transition-colors duration-200`}
                            style={{
                                backgroundColor: theme === 'dark' ? colors.primary.DEFAULT : colors.gray[600],
                                color: theme === 'dark' ? colors.accent.light : colors.gray[700]
                            }}
                        >
                            {theme === 'dark' ? '🌞' : '🌙'}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                    }`}>
                                    <span className="text-sm font-medium">
                                        {user?.first_name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="font-medium">{user?.first_name} {user?.last_name}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                        } ring-1 ring-black ring-opacity-5`}
                                >
                                    <div className="py-1">
                                        <div className="px-4 py-2 text-sm border-b border-gray-200">
                                            <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                                            <p className="text-gray-500 capitalize">{user?.role}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

        </>

    );
}
