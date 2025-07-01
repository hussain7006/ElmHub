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
  iframeLoaded: false,
  
  // Navigation actions
  setActiveTab: (tabId) => set({ activeTab: tabId }),
  
  // Application launch actions
  setShowIframe: (show) => set({ showIframe: show }),
  setActiveApp: (app) => set({ activeApp: app }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setLaunchingApp: (app) => set({ launchingApp: app }),
  setIframeLoaded: (loaded) => set({ iframeLoaded: loaded }),
  
  // Handle iframe loading completion
  onIframeLoad: () => {
    set({
      isLoading: false,
      iframeLoaded: true
    });
  },
  
  // Handle iframe loading timeout (fallback)
  onIframeTimeout: () => {
    set({
      isLoading: false,
      iframeLoaded: true,
      error: new Error('Application took too long to load. Please try again.')
    });
  },
  
  // Combined actions for better scalability
  launchApplication: (app) => {
    set({
      activeApp: app,
      showIframe: true,
      isLoading: true, // Keep loading until iframe is loaded
      error: null,
      launchingApp: null,
      iframeLoaded: false
    });
  },
  
  closeApplication: () => {
    set({
      showIframe: false,
      activeApp: null,
      isLoading: false,
      error: null,
      launchingApp: null,
      iframeLoaded: false
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
      launchingApp: null,
      iframeLoaded: false
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
      launchingApp: null,
      iframeLoaded: false
    });
  },
  
  navigateToTutorialsTab: () => {
    set({
      activeTab: 'tutorials',
      showIframe: false,
      activeApp: null,
      isLoading: false,
      error: null,
      launchingApp: null,
      iframeLoaded: false
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
      launchingApp: null,
      iframeLoaded: false
    });
  }
}));

export default useApplicationHubStore; 