import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import useThemeStore from '../../../../store/themeStore';
import useSidebarStore from '../../../../store/sidebarStore';
import useApplicationHubStore from '../../../../store/applicationHubStore';
import logo from '/images/logo.png'
import { sidebarItems } from '../../../../Constants/sidebarItems';
import { APPLICATION_HUB_APPS } from '../../../../Constants/applicationHub';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const { theme, toggleTheme, colors } = useThemeStore();
  const { launchApplication, activeApp, closeApplication } = useApplicationHubStore();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarWidth = isCollapsed ? '80px' : '220px';

  // Reset expansion state when sidebar is collapsed
  useEffect(() => {
    if (isCollapsed) {
      setIsMyApplicationsExpanded(false);
    }
  }, [isCollapsed]);

  // State for My Applications section expansion
  const [isMyApplicationsExpanded, setIsMyApplicationsExpanded] = useState(false);
  const INITIAL_APPS_TO_SHOW = 3;

  // Add applications to the existing "My Applications" section
  const allSidebarItems = sidebarItems.map(section => {
    if (section.title === 'My Applications') {
      // Add the applications to the existing My Applications section
      const applicationItems = APPLICATION_HUB_APPS
        .filter(app => app.enabled && app.status !== 'deprecated')
        .map(app => ({
          name: app.name,
          icon: app.icon,
          path: `/app/${app.id}`, // Virtual path for iframe apps
          disabled: !app.enabled,
          appData: app // Store the full app data for iframe launching
        }));

      return {
        ...section,
        items: [...section.items, ...applicationItems]
      };
    }
    return section;
  });

  const [filteredSidebarItems, setFilteredSidebarItems] = useState(allSidebarItems);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle My Applications section expansion
  const toggleMyApplicationsExpansion = () => {
    setIsMyApplicationsExpanded(!isMyApplicationsExpanded);
  };

  const handleSearch = (input) => {
    setSearchQuery(input);

    // Show loading state immediately
    if (input.trim()) {
      setIsSearching(true);
      // Reset expansion state when searching
      setIsMyApplicationsExpanded(false);
    } else {
      setIsSearching(false);
    }

    // Debounce search: only filter after user stops typing for 500ms
    if (handleSearch._debounceTimeout) {
      clearTimeout(handleSearch._debounceTimeout);
    }
    handleSearch._debounceTimeout = setTimeout(() => {
      if (!input.trim()) {
        // If search is empty, show all items
        setFilteredSidebarItems(allSidebarItems);
        setIsSearching(false);
        return;
      }

      const searchTerm = input.toLowerCase().trim();
      const filteredSidebarItems = allSidebarItems.map((section) => {
        // Filter items within each section
        const filteredItems = section.items.filter((item) =>
          item.name.toLowerCase().includes(searchTerm)
        );

        // Only include sections that have matching items
        if (filteredItems.length > 0) {
          return {
            ...section,
            items: filteredItems
          };
        }
        return null;
      }).filter(Boolean); // Remove null sections

      setFilteredSidebarItems(filteredSidebarItems);
      setIsSearching(false);
    }, 400);
  }

  // Handle item click - either navigate or launch application
  const handleItemClick = (item) => {
    if (item.disabled) return;

    if (item.appData) {
      // Launch application in iframe
      navigate('/');
      launchApplication(item.appData);
    } else {
      // If clicking home and an app is active, close the app first
      if (item.path === '/' && activeApp) {
        closeApplication();
      } else if (activeApp) {
        // If navigating to any other route and an app is active, close the app
        closeApplication();
      }
      // Navigate to regular route
      navigate(item.path);
    }
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: sidebarWidth }}
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
                <img src={theme == "dark" ? "https://cdn.mindrocketsapis.com/client/imgs/elm-logo-white.svg" : logo} alt="ElmHub" className="w-20" />
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
              className="p-2"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => { handleSearch(e.target.value) }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors"
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
                      className="absolute left-3 top-2.5"
                    >
                      <div className="w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin"
                        style={{ color: colors.accent }}></div>
                    </motion.div>
                  ) : (
                    <motion.svg
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
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
                    </motion.svg>
                  )}
                </AnimatePresence>
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
          <AnimatePresence mode="wait">
            {isSearching ? (
              // <motion.div
              //   initial={{ opacity: 0 }}
              //   animate={{ opacity: 1 }}
              //   exit={{ opacity: 0 }}
              //   className="flex items-center justify-center py-8 h-full w-full"
              // >
              //   <div className="text-center h-full flex flex-col items-center justify-center">
              //     <div className="w-8 h-8 border-2 border-transparent border-t-current rounded-full animate-spin mx-auto mb-2" 
              //          style={{ color: colors.accent }}></div>
              //     <p className="text-sm" style={{ color: colors.textSecondary }}>Searching...</p>
              //   </div>
              // </motion.div>
              <></>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredSidebarItems.length === 0 && searchQuery.trim() ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center py-8"
                  >
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 mx-auto mb-3 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: colors.textSecondary }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        No results found for "{searchQuery}"
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  filteredSidebarItems.map((section, index) => {
                    // Special handling for My Applications section
                    const isMyApplicationsSection = section.title === 'My Applications';
                    const hasMoreApps = isMyApplicationsSection && section.items.length > INITIAL_APPS_TO_SHOW;
                    const visibleItems = isMyApplicationsSection && !isMyApplicationsExpanded
                      ? section.items.slice(0, INITIAL_APPS_TO_SHOW)
                      : section.items;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                        className="mb-2"
                      >
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

                        {/* Render visible items */}
                        {visibleItems.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: (index * 0.1) + (itemIndex * 0.05),
                              ease: "easeOut"
                            }}
                          >
                            {/* Main Product Item */}
                            <motion.button
                              whileHover={{ scale: item.disabled ? 1 : 1.02 }}
                              whileTap={{ scale: item.disabled ? 1 : 0.98 }}
                              onClick={() => handleItemClick(item)}
                              disabled={item.disabled}
                              className={`w-full flex items-center px-4 ${isCollapsed ? 'py-2' : 'py-1'} transition-colors cursor-pointer 
                                ${isCollapsed ? 'justify-center' : 'justify-start'} 
                                ${(location.pathname === item.path && !activeApp) || (item.appData && activeApp?.id === item.appData?.id) ? 'bg-opacity-10 font-bold tracking-wide ' : ''}`
                              }
                              style={{
                                color: (location.pathname === item.path && !activeApp) || (item.appData && activeApp?.id === item.appData?.id) ? colors.textPrimary : colors.textSecondary,

                                backgroundColor: (location.pathname === item.path && !activeApp) || (item.appData && activeApp?.id === item.appData?.id) ? colors.accent : 'transparent',
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
                                  >
                                    {item.name}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          </motion.div>
                        ))}

                        {/* Show More/Less button for My Applications section */}
                        {isMyApplicationsSection && hasMoreApps && !isCollapsed && !isSearching && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: (index * 0.1) + (visibleItems.length * 0.05),
                              ease: "easeOut"
                            }}
                            className="px-2 py-1"
                          >
                            <motion.button
                              onClick={toggleMyApplicationsExpansion}
                              whileTap={{
                                scale: 0.98,
                              }}
                              className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-sm font-medium border border-dashed relative overflow-hidden group"
                              style={{
                                color: colors.accent,
                                borderColor: colors.accent + '40',
                                backgroundColor: 'transparent',
                                // boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                              }}
                            >
                              {/* Subtle background gradient */}
                              <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                style={{
                                  background: `linear-gradient(135deg, ${colors.accent}08 0%, ${colors.accent}15 100%)`
                                }}
                              />
                              <motion.div
                                animate={{
                                  rotate: isMyApplicationsExpanded ? 180 : 0,
                                  y: isMyApplicationsExpanded ? 2 : 0
                                }}
                                transition={{
                                  duration: 0.4,
                                  ease: "easeInOut",
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20
                                }}
                                className="mr-2 flex items-center justify-center"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </motion.div>
                              <motion.span
                                animate={{
                                  opacity: 1,
                                  x: 0
                                }}
                                initial={{
                                  opacity: 0.8,
                                  x: -2
                                }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeOut"
                                }}
                                className="font-medium relative z-10"
                              >
                                {isMyApplicationsExpanded ? 'Show Less' : `Show ${section.items.length - INITIAL_APPS_TO_SHOW} More`}
                              </motion.span>

                            </motion.button>
                          </motion.div>
                        )}

                        {/* Divider */}
                        <div className="h-1 w-full border-b mb-3" style={{ borderColor: colors.borderColor }}></div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
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