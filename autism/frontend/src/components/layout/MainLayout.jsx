import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import { colors } from '../../config/colors';
import Header from '../../Componentss/_component/Header';
import useHeaderStore from '../../store/headerStore';
import Sidebar from '../../Componentss/_component/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const { user, theme, showHeader } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isSidebarOpen, activeSidebarItem, setActiveSidebarItem } = useHeaderStore();

  useEffect(() => {
    if (user && user.role) {
      useHeaderStore.getState().setActiveSidebarItemFromUrl(user.role);
    }
  }, []);

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <Header />
      
      {/* Content Area with Sidebar and Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Enhanced Sidebar with smoother animations */}
        <Sidebar />

        {/* Main Content with smooth transition */}
        <motion.main
          animate={{ marginLeft: isSidebarOpen ? 256 : 35, }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
          className={`flex-1 transition-all duration-300 flex flex-col
            ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
          style={{
            ...(theme === 'light' ? { background: colors.gray[100] } : {}),
            paddingTop: showHeader ? '0' : '0'
          }}
        >
          <motion.div
            className="flex-1 flex flex-col p-4 overflow-y-auto"
            animate={{
              paddingLeft: isSidebarOpen ? "1rem" : "1.5rem",
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <motion.div
              key={activeSidebarItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </motion.div>
        </motion.main>
      </div>

      {/* Improved overlay with fade animation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0  backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Click outside handler */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout; 