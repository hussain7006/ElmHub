import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import useThemeStore from '../../../../store/themeStore';
import useSidebarStore from '../../../../store/sidebarStore';
import useApplicationHubStore from '../../../../store/applicationHubStore';
import { PLATFORM_NAVIGATION_CONFIG, getPlatformItemConfig } from '../../../../Constants/platformNavigation';
import { useNavigate } from 'react-router-dom';

const DelosTopNav = () => {
    const navigate = useNavigate();
    const { colors, theme } = useThemeStore();
    const { isCollapsed } = useSidebarStore();
    const { navigateToApplicationTab } = useApplicationHubStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navItems = [
        {
            name: "Platform",
            dropdown: {
                columns: PLATFORM_NAVIGATION_CONFIG.columns
            }
        },
        { name: "API" },
        { name: "Security" },
        // { name: "Demos" },
        { name: "Pricing" },
        { name: "About us", dropdown: ["Company", "Contact"] },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // This will be handled by CSS hover states now
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const PlatformDropdownMenu = () => {
        const handleApplicationClick = (item) => {
            const itemConfig = getPlatformItemConfig(item.name);

            if (!itemConfig || !itemConfig.enabled) {
                return; // Item is disabled or not found
            }

            // Handle different actions based on configuration
            switch (itemConfig.action) {
                case "navigateToApplicationTab":
                    navigateToApplicationTab();
                    navigate('/');
                    break;
                case "navigateToAssistant":
                    // Future implementation
                    console.log("Navigate to Assistant - not implemented yet");
                    break;
                case "navigateToExplore":
                    // Future implementation
                    console.log("Navigate to Explore - not implemented yet");
                    break;
                case "navigateToScribe":
                    // Future implementation
                    console.log("Navigate to Scribe - not implemented yet");
                    break;
                case "navigateToDocs":
                    // Future implementation
                    console.log("Navigate to Docs - not implemented yet");
                    break;
                case "navigateToRecap":
                    // Future implementation
                    console.log("Navigate to Recap - not implemented yet");
                    break;
                case "navigateToTrad":
                    // Future implementation
                    console.log("Navigate to Trad - not implemented yet");
                    break;
                case "navigateToActu":
                    // Future implementation
                    console.log("Navigate to Actu - not implemented yet");
                    break;
                case "navigateToExtension":
                    // Future implementation
                    console.log("Navigate to Extension - not implemented yet");
                    break;
                case "navigateToCompanion":
                    // Future implementation
                    console.log("Navigate to Companion - not implemented yet");
                    break;
                case "navigateToOrganizations":
                    // Future implementation
                    console.log("Navigate to Organizations - not implemented yet");
                    break;
                case "navigateToTeams":
                    // Future implementation
                    console.log("Navigate to Teams - not implemented yet");
                    break;
                default:
                    console.log(`Action ${itemConfig.action} not implemented yet`);
            }
        };

        return (
            <div
                className="absolute top-full left-0 mt-0 w-45 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 py-10 px-6 z-50 transform origin-top transition-all duration-300 ease-out scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100"
                style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.borderColor
                }}
            >
                <div className="grid grid-cols-3 ">
                    {navItems[0].dropdown.columns.map((column, columnIndex) => (
                        <div key={column.title} className="space-y-4">
                            <h3
                                className="text-xs font-semibold uppercase tracking-wider"
                                style={{ color: colors.primary }}
                            >
                                {column.title}
                            </h3>
                            <div className="space-y-3">
                                {column.items.map((item, itemIndex) => (
                                    <motion.button
                                        key={item.name}
                                        onClick={() => handleApplicationClick(item)}
                                        disabled={!item.enabled}
                                        className={`block text-sm transition-all duration-300 ease-out text-left w-full ${!item.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                        style={{ color: colors.textSecondary }}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2, delay: (columnIndex * 0.1) + (itemIndex * 0.05) }}
                                        whileHover={item.enabled ? {
                                            x: 8,
                                            color: colors.primary
                                        } : {}}
                                    >
                                        {item.name}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const SimpleDropdownMenu = ({ items, parentName }) => {
        const handleItemClick = (item) => {

            if (parentName === "About us") {
                const route = item.toLowerCase();
                navigate(`/about/${route}`);
            }
        };

        return (
            <div
                className="absolute top-full left-0 mt-0 w-48 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 py-8 px-6 z-50 transform origin-top transition-all duration-300 ease-out scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100"
                style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.borderColor
                }}
            >
                <span className='px-4 py-3 w-full text-xs font-semibold uppercase tracking-wide text-center' style={{ color: colors.primary }}>{parentName}</span>
                {items.map((item, index) => (
                    <motion.button
                        key={item}
                        onClick={() => handleItemClick(item)}
                        className="block px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-out w-full text-left cursor-pointer"
                        style={{ color: colors.textSecondary }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{
                            x: 8,
                            color: colors.primary
                        }}
                    >
                        {item}
                    </motion.button>
                ))}
            </div>
        );
    };

    return (
        <motion.nav
            className="fixed top-0 z-50 backdrop-blur-md"
            ref={dropdownRef}
            initial={false}
            animate={{
                left: isCollapsed ? '80px' : '220px',
                right: '0px'
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className="h-full lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Left side - Empty space for logo */}
                    <div className="flex-1"></div>

                    {/* Center - Navigation items */}
                    <div className="hidden md:flex items-center justify-center space-x-8">
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative group"
                            >
                                <motion.button
                                    onClick={() => {
                                        if (item.name === "Demos") {
                                            navigate('/demos');
                                        }
                                        if (item.name === "API") {
                                            navigate('/api');
                                        }
                                    }}
                                    className="text-sm transition-colors duration-300 relative flex items-center py-3 px-2 cursor-pointer"
                                    style={{ color: colors.textSecondary }}
                                    whileHover={{
                                        color: colors.primary
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {item.name}
                                    {item.dropdown && (
                                        <motion.span
                                            className="ml-2 inline-flex items-center transition-transform duration-300 group-hover:rotate-[-180deg]"
                                        >
                                            <ChevronDownIcon className="w-4 h-4" strokeWidth={4} />
                                        </motion.span>
                                    )}
                                    {/* Animated underline */}
                                    <motion.div
                                        className="absolute -bottom-1 left-0 right-0 h-0.5"
                                        style={{ backgroundColor: colors.primary }}
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </motion.button>

                                {/* Dropdown menu */}
                                {item.dropdown && (
                                    item.name === "Platform" ? (
                                        <PlatformDropdownMenu />
                                    ) : (
                                        <SimpleDropdownMenu items={item.dropdown} parentName={item.name} />
                                    )
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right side - Empty space for buttons */}
                    <div className="flex-1"></div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                            style={{ color: colors.textSecondary }}
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <motion.div
                                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                    />
                                </svg>
                            </motion.div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            backgroundColor: colors.surface,
                            borderTop: `1px solid ${colors.borderColor}`
                        }}
                        className="md:hidden max-h-[calc(100vh-80px)] overflow-y-auto"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.1 }}
                                >
                                    <motion.button
                                        onClick={() => {
                                            if (item.name === "Demos") {
                                                navigate('/demos');
                                            } else if (item.name === "API") {
                                                navigate('/api');
                                            }
                                            setIsMenuOpen(false);
                                        }}
                                        className="block px-3 py-2 text-base font-medium rounded-md transition-colors duration-300 relative group w-full text-left"
                                        style={{
                                            color: colors.textSecondary,
                                            '--tw-text-opacity': '1'
                                        }}
                                        whileHover={{
                                            color: colors.primary,
                                            backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)'
                                        }}
                                    >
                                        {item.name}
                                        {/* Mobile animated underline */}
                                        <motion.div
                                            className="absolute -bottom-1 left-3 right-3 h-0.5"
                                            style={{ backgroundColor: colors.primary }}
                                            initial={{ scaleX: 0 }}
                                            whileHover={{ scaleX: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </motion.button>

                                    {/* Mobile dropdown items */}
                                    {item.dropdown && (
                                        <div className="ml-4 mt-1 space-y-1">
                                            {item.dropdown.columns ? (
                                                // Platform dropdown in mobile
                                                item.dropdown.columns.map((column, columnIndex) => (
                                                    <div key={column.title} className="space-y-1">
                                                        <h4
                                                            className="text-xs font-semibold uppercase tracking-wider px-3 py-1"
                                                            style={{ color: colors.primary }}
                                                        >
                                                            {column.title}
                                                        </h4>
                                                        {column.items.map((dropdownItem, dropdownIndex) => (
                                                            <motion.button
                                                                key={dropdownItem.name}
                                                                onClick={() => {
                                                                    const itemConfig = getPlatformItemConfig(dropdownItem.name);

                                                                    if (itemConfig && itemConfig.enabled) {
                                                                        switch (itemConfig.action) {
                                                                            case "navigateToApplicationTab":
                                                                                navigateToApplicationTab();
                                                                                navigate('/');
                                                                                break;
                                                                            default:
                                                                                console.log(`Action ${itemConfig.action} not implemented yet`);
                                                                        }
                                                                    }
                                                                    setIsMenuOpen(false);
                                                                }}
                                                                disabled={!dropdownItem.enabled}
                                                                whileHover={dropdownItem.enabled ? {
                                                                    x: 8,
                                                                    color: colors.primary
                                                                } : {}}
                                                                className={`block px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-out w-full text-left t ${!dropdownItem.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                style={{ color: colors.textSecondary }}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ duration: 0.1, delay: index * 0.05 }}
                                                                // whileHover={{
                                                                //     x: 8,
                                                                //     color: colors.primary
                                                                // }}
                                                            >
                                                                {dropdownItem.name}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                ))
                                            ) : (
                                                // Simple dropdown in mobile
                                                item.dropdown.map((dropdownItem, dropdownIndex) => (
                                                    <motion.button
                                                        key={dropdownItem}
                                                        onClick={() => {
                                                            if (item.name === "About us") {
                                                                const route = dropdownItem.toLowerCase();
                                                                navigate(`/about/${route}`);
                                                            }
                                                            setIsMenuOpen(false);
                                                        }}
                                                        className="block px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-out w-full text-left cursor-pointer"
                                                        style={{ color: colors.textSecondary }}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.1, delay: index * 0.05 }}
                                                        whileHover={{
                                                            x: 8,
                                                            color: colors.primary
                                                        }}
                                                    >
                                                        {dropdownItem}
                                                    </motion.button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default DelosTopNav; 