import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Components/App/Dashboard/Sidebar/Sidebar';
import useThemeStore from '../../store/themeStore';
import useSidebarStore from '../../store/sidebarStore';
import TopNav from '../../Components/App/Dashboard/TopNav/TopNav';

export default function Dashboard() {
  const { colors } = useThemeStore();
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900" >
      <Sidebar />
      <motion.div
        initial={false}
        animate={{ marginLeft: isCollapsed ? '80px' : '220px' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 flex flex-col "
      // style={{
      //   backgroundColor: colors.surface
      // }}
      >
        <TopNav colors={colors} />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex-1 p-0 overflow-auto"
        >
          <Outlet />
        </motion.main>
      </motion.div>
    </div>
  );
}