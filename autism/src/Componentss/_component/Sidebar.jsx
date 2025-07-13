import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from "../../store/authStore";
import useHeaderStore from "../../store/headerStore";
import { colors } from '../../config/colors';
import { useNavigate } from 'react-router';

export default function Sidebar() {
    const { activeSidebarItem, isSidebarOpen, setActiveSidebarItem, setActiveSidebarItemFromUrl, toggleSidebar } = useHeaderStore();
    const { user, theme, logout, showHeader } = useAuthStore();
    const navigate = useNavigate();

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
            roles: ['parent', 'specialist'],
            icon: '📊'
        },
        {
            id: 'session-list',
            label: 'Session List',
            roles: ['child'],
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

    // Don't render sidebar if header is hidden
    // if (!showHeader) {
    //     return null;
    // }

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isSidebarOpen ? 256 : 0,
                x: isSidebarOpen ? 0 : -256,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
            }}
            className={`fixed left-0 ${showHeader ? 'top-16' : 'top-0'} bottom-0 z-40 overflow-hidden
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
            <motion.nav
                className="h-full"
                animate={{
                    opacity: isSidebarOpen ? 1 : 0,
                    x: isSidebarOpen ? 0 : -20,
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    delay: isSidebarOpen ? 0.2 : 0,
                }}
            >
                {/* Selected Item Indicator */}
                <div
                    className="p-4 border-b"
                    style={{
                        borderColor: theme === 'dark' ? colors.gray[700] : colors.gray[200]
                    }}
                >
                    {filteredNavItems.map((item) => (
                        activeSidebarItem === item.id && (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                                style={{
                                    // background: theme === 'dark' ? colors.primary.dark : colors.primary.light,
                                    // color: 'white'
                                }}
                            >
                                <span className="text-xl font-bold bg-blue-400 border border-gray-300 rounded-full flex items-center justify-center p-1 dark:border-gray-10000">{item.icon}</span>
                                <span className="font-bold text-lg">{item.label}</span>
                            </div>
                        )
                    ))}
                </div>

                <div className="p-4">
                    <ul className="space-y-2">
                        {filteredNavItems.map((item) => (
                            <motion.li
                                key={item.id}
                                initial={false}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <button
                                    onClick={async () => {
                                        if (item.id === 'logout') {
                                            await logout();
                                            navigate('/quick-login');
                                        } else {
                                            navigate(item.id);
                                            setActiveSidebarItemFromUrl(user?.role);
                                            if (window.innerWidth < 768) {
                                                toggleSidebar();
                                            }
                                        }
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ease-in-out
                      flex items-center group hover:scale-[1.02] cursor-pointer
                      ${activeSidebarItem === item.id
                                            ? theme === 'dark'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-blue-100 text-blue-600'
                                            : theme === 'dark'
                                                ? 'hover:bg-gray-700'
                                                : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <motion.span
                                        className="mr-3 text-xl"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {item.icon}
                                    </motion.span>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </motion.nav>
        </motion.aside>
    )
}