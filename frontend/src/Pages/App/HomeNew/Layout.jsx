import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../Components/App/Layout/Sidebar/Sidebar';
import DelosTopNav from '../../../Components/App/Layout/TopNav/DelosTopNav';
import useThemeStore from '../../../store/themeStore';
import useSidebarStore from '../../../store/sidebarStore';

export default function HomeNewLayout() {
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
        style={{ backgroundColor: colors.background }}>
        <DelosTopNav />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex-1 p-0 overflow-auto mt-16"
        >
          <Outlet />
        </motion.main>
      </motion.div>
    </div>
  );
} 