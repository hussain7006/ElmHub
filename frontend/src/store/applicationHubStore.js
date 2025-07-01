import { create } from 'zustand';
import { APPLICATION_HUB_CONFIG } from '../Constants/applicationHub';

const useApplicationHubStore = create((set, get) => ({
  // Active tab state
  activeTab: APPLICATION_HUB_CONFIG.defaultActiveTab,
  
  // Iframe and application states
  showIframe: false,
  activeApp: null,
  isLoading: false,
  error: null,
  launchingApp: null,
  
  // Navigation actions
  setActiveTab: (tabId) => set({ activeTab: tabId }),
  
  // Application launch actions
  setShowIframe: (show) => set({ showIframe: show }),
  setActiveApp: (app) => set({ activeApp: app }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setLaunchingApp: (app) => set({ launchingApp: app }),
  
  // Combined actions for better scalability
  launchApplication: (app) => {
    set({
      activeApp: app,
      showIframe: true,
      isLoading: false,
      error: null,
      launchingApp: null
    });
  },
  
  closeApplication: () => {
    set({
      showIframe: false,
      activeApp: null,
      isLoading: false,
      error: null,
      launchingApp: null
    });
  },
  
  // Platform navigation actions - these are the main actions for DelosTopNav
  navigateToApplicationTab: () => {
    set({
      activeTab: 'applications',
      showIframe: false,
      activeApp: null,
      isLoading: false,
      error: null,
      launchingApp: null
    });
  },
  
  // Future navigation actions - ready for implementation
  navigateToNewsTab: () => {
    set({
      activeTab: 'news',
      showIframe: false,
      activeApp: null,
      isLoading: false,
      error: null,
      launchingApp: null
    });
  },
  
  navigateToTutorialsTab: () => {
    set({
      activeTab: 'tutorials',
      showIframe: false,
      activeApp: null,
      isLoading: false,
      error: null,
      launchingApp: null
    });
  },
  
  // Reset all states
  resetState: () => {
    set({
      activeTab: APPLICATION_HUB_CONFIG.defaultActiveTab,
      showIframe: false,
      activeApp: null,
      isLoading: false,
      error: null,
      launchingApp: null
    });
  }
}));

export default useApplicationHubStore; 