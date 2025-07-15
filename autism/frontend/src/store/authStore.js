import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, logoutUser } from '../services/authService';

// Dummy users data
const dummyUsers = {
  parent: [
    { id: 'p1', name: 'John Smith', email: 'parent1@example.com', password: 'parent123', role: 'parent' },
    { id: 'p2', name: 'Mary Johnson', email: 'parent2@example.com', password: 'parent123', role: 'parent' }
  ],
  specialist: [
    { id: 's1', name: 'Dr. Sarah Wilson', email: 'specialist1@example.com', password: 'specialist123', role: 'specialist' },
    { id: 's2', name: 'Dr. Michael Brown', email: 'specialist2@example.com', password: 'specialist123', role: 'specialist' }
  ],
  child: [
    { id: 'c1', name: 'Alex Smith', email: 'child1@example.com', password: 'child123', role: 'child', parentId: 'p1' },
    { id: 'c2', name: 'Bob Johnson', email: 'child2@example.com', password: 'child123', role: 'child', parentId: 'p2' }
  ]
};

const useAuthStore = create(
  persist(
    (set) => ({
      // Auth state
      loginFormData: {
        email: 'csaad',
        password: '123456',
      },
      registerFormData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        type: '',
        phone: '',
        language: '',
        bio: '',
        specialization: '',
        role: '',
        user_id: ''
      },
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      // Theme state
      theme: 'light',
      // Header visibility state
      showHeader: true,
      // Session state
      currentSession: null,
      sessions: [],

      // Actions
      setLoginFormData: (formData) => set({ loginFormData: formData }),
      setRegisterFormData: (formData) => set({ registerFormData: formData }),
      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {

          const response = await loginUser(email, password);

          // Check if response is valid
          if (!response || typeof response !== 'object') {
            set({
              isLoading: false,
              error: 'Invalid server response'
            });
            return false;
          }

          // Handle error response
          if (response.detail) {
            set({
              isLoading: false,
              error: response.detail
            });
            return false;
          }

          // Validate required fields
          const { access_token, role, profile } = response;
          if (!access_token || !role || !profile) {
            set({
              isLoading: false,
              error: 'Missing required login data'
            });
            return false;
          }

          set({
            user: { ...profile, role },
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'An unexpected error occurred during login'
          });
          return false;
        }
      },

      logout: async () => {
        await logoutUser();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          currentSession: null,
          sessions: []
        })

        return true;
      },

      setUser: (user) => set({ user }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        // Update document class
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        return { theme: newTheme };
      }),

      setCurrentSession: (session) => set({ currentSession: session }),

      setSessions: (sessions) => set({ sessions }),

      setShowHeader: (show) => set({ showHeader: show }),

      // Get all users for a specific role
      getUsersByRole: (role) => dummyUsers[role] || [],
    })
    ,
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme
      })
    }
  )
);

// Initialize theme on store creation
const { theme } = useAuthStore.getState();
document.documentElement.classList.toggle('dark', theme === 'dark');

export default useAuthStore; 