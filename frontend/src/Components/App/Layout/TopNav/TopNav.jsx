import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
    HomeIcon,
    ChevronRightIcon,
    BellIcon,
    MagnifyingGlassIcon,
    // Bars3Icon
} from '@heroicons/react/24/outline';
// import useSidebarStore from '../../../../store/sidebarStore';

const TopNav = ({ colors }) => {
    const location = useLocation();
    // const { toggleSidebar } = useSidebarStore();
    const username = "Hussain"; // This should come from your auth context/store
    const initials = username.split(' ').map(n => n[0]).join('').toUpperCase();

    // Menu structure for breadcrumbs (matching sidebar)
    const menuItems = [
        {
            title: 'Products',
            items: [
                { name: 'Home', icon: HomeIcon, path: '/marketplace' },
                { name: 'Examination Center', icon: HomeIcon, path: '/examination-center' },
                { name: 'People Analytics', icon: HomeIcon, path: '/people-analytics' },
            ]
        },
        {
            title: 'Settings',
            items: [
                { name: 'User Management', icon: HomeIcon, path: '/user-management' },
                { name: 'Data Resources', icon: HomeIcon, path: '/data-resources' },
            ]
        },
        {
            title: 'Analytics Dashboard',
            items: [
                { name: 'Notifications', icon: HomeIcon, path: '/notifications' },
                { name: 'API Management', icon: HomeIcon, path: '/api-management' },
            ]
        }
    ];

    // Generate dynamic breadcrumbs
    const generateBreadcrumbs = () => {
        const breadcrumbs = [
            // { name: 'Home', path: '/', icon: HomeIcon }
        ];

        // Find current page info
        let currentPage = null;
        let currentSection = null;

        for (const section of menuItems) {
            for (const item of section.items) {
                if (item.path === location.pathname) {
                    currentPage = item;
                    currentSection = section;
                    break;
                }
            }
            if (currentPage) break;
        }

        if (currentSection && currentPage) {
            breadcrumbs.push(
                { name: currentSection.title, path: '#', icon: null },
                { name: currentPage.name, path: currentPage.path, icon: currentPage.icon }
            );
        }

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    // Get current page title for mobile display
    // const getCurrentPageTitle = () => {
    //     for (const section of menuItems) {
    //         for (const item of section.items) {
    //             if (item.path === location.pathname) {
    //                 return item.name;
    //             }
    //         }
    //     }
    //     return 'Dashboard';
    // };

    return (
        <div className="flex flex-col shadow-sm rounded-sm"
            style={{
                backgroundColor: colors.surface,
            }}
        >
            {/* Top Navigation Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-12 sm:h-14 md:h-16 px-3 sm:px-4 md:px-6 flex items-center justify-between"
                style={{ borderColor: colors.borderColor, backgroundColor: colors.surface }}
            >
                {/* Left side - Mobile menu button and page title */}
                <div className="flex items-center space-x-2 sm:space-x-4">

                    {/* Section title - visible on desktop */}
                    <div className="lg:flex items-center space-x-4">
                        <span
                            className="text-lg md:text-xl lg:text-3xl font-bold"
                            style={{ color: colors.textPrimary }}
                        >
                            {breadcrumbs.length > 1 ? breadcrumbs[1].name : 'Dashboard'}
                        </span>
                    </div>
                </div>

                {/* Right side - Search, Notification, User */}
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                    {/* Search - hidden on mobile, visible on tablet+ */}
                    <div className="hidden sm:block relative">
                        <input
                            type="text"
                            placeholder="Search for any content..."
                            className="w-48 md:w-64 lg:w-80 pl-3 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors text-xs sm:text-sm"
                            style={{
                                backgroundColor: colors.inputBackground,
                                color: colors.textPrimary,
                                border: `1px solid ${colors.borderColor}`,
                                '--tw-ring-color': colors.accent,
                            }}
                        />
                        <MagnifyingGlassIcon
                            className="w-4 h-4 sm:w-5 sm:h-5 absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2"
                            style={{ color: colors.textSecondary }}
                        />
                    </div>

                    {/* Mobile search button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 sm:p-2 rounded-lg sm:hidden"
                        style={{
                            backgroundColor: 'transparent',
                            color: colors.textPrimary,
                        }}
                        aria-label="Search"
                    >
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </motion.button>

                    {/* Notification button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer"
                        style={{ backgroundColor: 'transparent', color: colors.textPrimary }}
                    >
                        <BellIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center text-xs">
                            3
                        </span>
                    </motion.button>

                    {/* User avatar */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white font-medium cursor-pointer text-xs sm:text-sm"
                        style={{ backgroundColor: colors.accent }}
                    >
                        {initials}
                    </motion.div>
                </div>
            </motion.div>

            {/* Greeting and Breadcrumbs - hidden on mobile, visible on desktop */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="lg:block px-6 py-2"
                style={{ borderColor: colors.borderColor }}
            >
                {/* Greeting */}
                <div className="flex items-center space-x-2 mb-2">
                    <span
                        className="text-lg md:text-xl font-bold"
                        style={{ color: colors.textPrimary }}
                    >
                        Good Morning, {username.split(' ')[0]}!
                    </span>
                </div>

                {/* Dynamic Breadcrumbs */}
                <div className="flex items-center space-x-1 md:space-x-2">
                    {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={index}>
                            <div className="flex items-center space-x-1 md:space-x-2">
                                {breadcrumb.icon && (
                                    <breadcrumb.icon
                                        className="w-3 h-3 md:w-4 md:h-4"
                                        style={{ color: colors.textSecondary }}
                                    />
                                )}
                                <span
                                    className={`text-xs md:text-sm ${index === breadcrumbs.length - 1
                                        ? 'font-medium'
                                        : ''
                                        }`}
                                    style={{
                                        color: colors.textSecondary
                                    }}
                                >
                                    {breadcrumb.name}
                                </span>
                            </div>
                            {index < breadcrumbs.length - 1 && (
                                <ChevronRightIcon
                                    className="w-3 h-3 md:w-4 md:h-4"
                                    style={{ color: colors.textSecondary }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default TopNav;