import { create } from 'zustand';

const useHeaderStore = create(
    (set) => ({
        // Header state
        isSidebarOpen: true,
        activeSidebarItem: 'book-session',

        // Actions
        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        setActiveSidebarItem: (item) => set({ activeSidebarItem: item }),
        setActiveSidebarItemFromUrl: (userRole) => {
            const path = window.location.pathname;
            // Extract the main route segment after the first slash
            const route = path.split('/')[2] || '';


            // Map URL segments to sidebar item IDs
            const routeToSidebarItem = {
                'manage-child': 'manage-child',
                'book-session': 'book-session',
                'session-list': 'session-list',
                'booked-sessions': 'booked-sessions',
                'create-service': 'create-service',
                'download-report': 'download-report',
                'create-session': 'create-session',
                'calendar': 'calendar',
                'profile': 'profile',
            };

            // Special case for child role on root path
            if (userRole === 'child' && (route === '' || route === undefined)) {
                set({ activeSidebarItem: 'session-list' });
                return;
            } else if (userRole === 'parent' && (route === '' || route === undefined)) {
                set({ activeSidebarItem: 'manage-child' });
                return;
            }

            // Set based on mapping, fallback to 'book-session' for unknown routes
            set({ activeSidebarItem: routeToSidebarItem[route] || 'book-session' });
        }
    })
);
export default useHeaderStore; 