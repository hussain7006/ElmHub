import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
    HomeIcon,
    ChevronRightIcon,
    BellIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    // Bars3Icon
} from '@heroicons/react/24/outline';
// import useSidebarStore from '../../../../store/sidebarStore';
import { sidebarItems } from '../../../../Constants/sidebarItems';
import useSearchStore from '../../../../store/searchStore';
import SearchResults from './SearchResults';

const TopNav = ({ colors }) => {
    const location = useLocation();
    // const { toggleSidebar } = useSidebarStore();
    const username = "Hussain"; // This should come from your auth context/store
    const initials = username.split(' ').map(n => n[0]).join('').toUpperCase();

    // Search functionality
    const {
        searchQuery,
        searchResults,
        isSearching,
        searchHistory,
        isFiltering,
        setSearchQuery,
        performSearch,
        clearSearch,
        clearSearchHistory,
        setCurrentPage,
        setIsFiltering
    } = useSearchStore();

    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);

    // Set current page for context-aware search
    useEffect(() => {
        setCurrentPage(location.pathname);
    }, [location.pathname, setCurrentPage]);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                setIsFiltering(true);
                performSearch(searchQuery);
            } else {
                setIsFiltering(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, performSearch, setIsFiltering]);

    // Handle click outside to close search results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setShowSearchResults(true);
        
        // Clear filtering if search is empty
        if (!value.trim()) {
            setIsFiltering(false);
        }
    };

    // Handle search result click
    const handleResultClick = (result) => {
        setShowSearchResults(false);
        clearSearch();
    };

    // Handle search history click
    const handleHistoryClick = (query) => {
        setSearchQuery(query);
        setShowSearchResults(false);
    };

    // Menu structure for breadcrumbs (matching sidebar)
    // const sidebarItems = [
    //     {
    //         title: 'Products',
    //         items: [
    //             { name: 'Home', icon: HomeIcon, path: '/marketplace' },
    //             { name: 'Examination Center', icon: HomeIcon, path: '/examination-center' },
    //             { name: 'People Analytics', icon: HomeIcon, path: '/people-analytics' },
    //         ]
    //     },
    //     {
    //         title: 'Settings',
    //         items: [
    //             { name: 'User Management', icon: HomeIcon, path: '/user-management' },
    //             { name: 'Data Resources', icon: HomeIcon, path: '/data-resources' },
    //         ]
    //     },
    //     {
    //         title: 'Analytics Dashboard',
    //         items: [
    //             { name: 'Notifications', icon: HomeIcon, path: '/notifications' },
    //             { name: 'API Management', icon: HomeIcon, path: '/api-management' },
    //         ]
    //     }
    // ];

    // Generate dynamic breadcrumbs
    const generateBreadcrumbs = () => {
        const breadcrumbs = [
            // { name: 'Home', path: '/', icon: HomeIcon }
        ];

        // Find current page info
        let currentPage = null;
        let currentSection = null;

        for (const section of sidebarItems) {
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
    //     for (const section of sidebarItems) {
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
                    <div className="hidden sm:block relative" ref={searchContainerRef}>
                        <div className="relative">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search for any content..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setShowSearchResults(true)}
                                className="w-48 md:w-64 lg:w-80 pl-3 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors text-xs sm:text-sm"
                                style={{
                                    backgroundColor: colors.inputBackground,
                                    color: colors.textPrimary,
                                    border: `1px solid ${colors.borderColor}`,
                                    '--tw-ring-color': colors.accent,
                                }}
                            />
                            <AnimatePresence mode="wait">
                                {isSearching ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-transparent border-t-current rounded-full animate-spin" 
                                             style={{ color: colors.accent }}></div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        <MagnifyingGlassIcon
                                            className="w-4 h-4 sm:w-5 sm:h-5"
                                            style={{ color: colors.textSecondary }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Search Results */}
                        <SearchResults
                            isVisible={showSearchResults}
                            results={searchResults}
                            isSearching={isSearching}
                            searchQuery={searchQuery}
                            searchHistory={searchHistory}
                            onResultClick={handleResultClick}
                            onHistoryClick={handleHistoryClick}
                            onClearHistory={clearSearchHistory}
                            colors={colors}
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
                        onClick={() => setShowMobileSearch(true)}
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

            {/* Mobile Search Modal */}
            <AnimatePresence>
                {showMobileSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 sm:hidden"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-0 left-0 right-0 p-4"
                            style={{ backgroundColor: colors.surface }}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Search for any content..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => setShowSearchResults(true)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors text-base"
                                        style={{
                                            backgroundColor: colors.inputBackground,
                                            color: colors.textPrimary,
                                            border: `1px solid ${colors.borderColor}`,
                                            '--tw-ring-color': colors.accent,
                                        }}
                                        autoFocus
                                    />
                                    <AnimatePresence mode="wait">
                                        {isSearching ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                            >
                                                <div className="w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin" 
                                                     style={{ color: colors.accent }}></div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                            >
                                                <MagnifyingGlassIcon
                                                    className="w-5 h-5"
                                                    style={{ color: colors.textSecondary }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setShowMobileSearch(false);
                                        setShowSearchResults(false);
                                        clearSearch();
                                    }}
                                    className="p-2 rounded-lg"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: colors.textPrimary,
                                    }}
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </motion.button>
                            </div>
                            
                            {/* Mobile Search Results */}
                            <div className="mt-4 max-h-96 overflow-y-auto">
                                <SearchResults
                                    isVisible={true}
                                    results={searchResults}
                                    isSearching={isSearching}
                                    searchQuery={searchQuery}
                                    searchHistory={searchHistory}
                                    onResultClick={(result) => {
                                        handleResultClick(result);
                                        setShowMobileSearch(false);
                                    }}
                                    onHistoryClick={(query) => {
                                        handleHistoryClick(query);
                                        setShowMobileSearch(false);
                                    }}
                                    onClearHistory={clearSearchHistory}
                                    colors={colors}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TopNav;