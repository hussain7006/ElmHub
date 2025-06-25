import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import useThemeStore from '../../../../store/themeStore';
import useSidebarStore from '../../../../store/sidebarStore';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CircleStackIcon,
  BellIcon,
  CodeBracketIcon,
  BeakerIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import logo from '/images/logo.png'

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const { theme, toggleTheme, colors } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Products',
      items: [
        { name: 'Home', icon: HomeIcon, path: '/', disabled: false },
        { name: 'Examination Center', icon: BeakerIcon, path: '/examination-center', disabled: false },
        { name: 'People Analytics', icon: ClipboardDocumentListIcon, path: '/people-analytics', disabled: false },
      ]
    },
    {
      title: 'My Applications',
      items: [
        { name: 'Examination Center', icon: BeakerIcon, path: '/products/examination', disabled: false },
        { name: 'People Analytics', icon: ClipboardDocumentListIcon, path: '/products/peopleanalytics', disabled: false },
        // { name: 'Google', icon: ClipboardDocumentListIcon, path: '/products/Google', disabled: false },
      ]
    },
    {
      title: 'Product Demos',
      items: [
        {
          name: 'Examination Center',
          icon: BeakerIcon,
          path: '/demo/examination-center',
          disabled: false
        },
        {
          name: 'People Analytics',
          icon: ClipboardDocumentListIcon,
          path: '/demo/people-analytics',
          disabled: false
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        // { name: 'User Management', icon: UserGroupIcon, path: '/user-management', disabled: true },
        { name: 'Profile', icon: UserIcon, path: '/user-management', disabled: true },
        // { name: 'Data Resources', icon: CircleStackIcon, path: '/data-resources', disabled: true },
      ]
    },
    // {
    //   title: 'Analytics Dashboard',
    //   items: [
    //     { name: 'Notifications', icon: BellIcon, path: '/notifications', disabled: true },
    //     { name: 'API Management', icon: CodeBracketIcon, path: '/api-management', disabled: true },
    //   ]
    // }
  ];

  // useEffect(() => {
  // navigate('/marketplace');
  // }, []);

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '220px' }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen fixed left-0 top-0 shadow-lg z-50 overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="flex flex-col h-full w-full">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.borderColor }}>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold truncate"
                style={{ color: colors.textPrimary }}
              >
                <img src={logo} alt="ElmHub" className="w-20" />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            onClick={toggleSidebar}
            className="p-2 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              backgroundColor: 'transparent',
              color: colors.textPrimary,
              ':hover': { backgroundColor: colors.accent }
            }}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={"M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </motion.button>
        </div>

        {/* Search Bar */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    backgroundColor: colors.inputBackground,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.borderColor}`,
                    '--tw-ring-color': colors.accent,
                  }}
                />
                <svg
                  className="w-5 h-5 absolute left-3 top-2.5"
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            marginTop: isCollapsed ? '0px' : '0px',
            transition: 'margin-top 0.3s ease-in-out'
          }}
        >
          {menuItems.map((section, index) => (
            <div key={index} className="mb-2">
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 mb-2 text-sm font-semibold uppercase tracking-wider truncate"
                    style={{ color: colors.textSecondary }}
                  >
                    {section.title}
                  </motion.h2>
                )}
              </AnimatePresence>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {/* Main Product Item */}
                  <motion.button
                    whileHover={{ scale: item.disabled ? 1 : 1.02 }}
                    whileTap={{ scale: item.disabled ? 1 : 0.98 }}
                    onClick={() => navigate(item.path)}
                    disabled={item.disabled}
                    className={`w-full flex items-center px-4 ${isCollapsed ? 'py-2' : 'py-1'} transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : 'justify-start'
                      } ${location.pathname === item.path ? 'bg-opacity-10' : ''}`}
                    style={{
                      color: colors.textPrimary,
                      backgroundColor: location.pathname === item.path ? colors.accent : 'transparent',
                      ':hover': { backgroundColor: colors.accent },
                      cursor: item.disabled ? 'not-allowed' : 'pointer'
                    }}
                    title={item.name}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${location.pathname === item.path ? 'text-white' : ''}`} />
                    </div>
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`truncate text-sm`}
                          style={{
                            color: location.pathname === item.path ? colors.surface : colors.textSecondary
                          }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              ))}

              {/* Divider */}
              <div className="h-1 w-full border-b mb-3" style={{ borderColor: colors.borderColor }}></div>
            </div>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-t " style={{ borderColor: colors.borderColor }}>
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer w-full flex items-center justify-center p-2 rounded-lg transition-colors"
            style={{
              color: colors.textPrimary,
              ':hover': { backgroundColor: colors.accent }
            }}
            aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar; 