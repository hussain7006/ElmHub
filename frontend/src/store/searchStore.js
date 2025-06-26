import { create } from 'zustand';
import { sidebarItems } from '../Constants/sidebarItems';
import { searchDemos } from '../Constants/demos';
import { searchApplications } from '../Constants/applications';

const useSearchStore = create((set, get) => ({
  // Search state
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  searchHistory: [],
  isFiltering: false, // Track if we're filtering page content
  
  // Search settings
  searchDebounceTime: 500,
  maxSearchHistory: 10,
  
  // Page-specific search functions (using plain object instead of Map)
  pageSearchFunctions: {},
  currentPage: null,
  
  // Search actions
  setSearchQuery: (query) => {
    const currentQuery = get().searchQuery;
    if (currentQuery !== query) {
      set({ searchQuery: query });
      
      // Add to search history if not empty
      if (query.trim()) {
        const { searchHistory, maxSearchHistory } = get();
        const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, maxSearchHistory);
        set({ searchHistory: newHistory });
      }
    }
  },
  
  setSearchResults: (results) => {
    const currentResults = get().searchResults;
    if (JSON.stringify(currentResults) !== JSON.stringify(results)) {
      set({ searchResults: results });
    }
  },
  
  setIsSearching: (isSearching) => {
    const currentIsSearching = get().isSearching;
    if (currentIsSearching !== isSearching) {
      set({ isSearching });
    }
  },
  
  setIsFiltering: (isFiltering) => {
    const currentIsFiltering = get().isFiltering;
    if (currentIsFiltering !== isFiltering) {
      set({ isFiltering });
    }
  },
  
  clearSearch: () => {
    set({ 
      searchQuery: '', 
      searchResults: [], 
      isSearching: false,
      isFiltering: false
    });
  },
  
  // Register page-specific search function
  registerPageSearch: (pagePath, searchFunction) => {
    const { pageSearchFunctions } = get();
    const currentFunction = pageSearchFunctions[pagePath];
    
    // Only update if the function is different
    if (currentFunction !== searchFunction) {
      set({ 
        pageSearchFunctions: { 
          ...pageSearchFunctions, 
          [pagePath]: searchFunction 
        } 
      });
    }
  },
  
  // Unregister page-specific search function
  unregisterPageSearch: (pagePath) => {
    const { pageSearchFunctions } = get();
    if (pageSearchFunctions[pagePath]) {
      const newFunctions = { ...pageSearchFunctions };
      delete newFunctions[pagePath];
      set({ pageSearchFunctions: newFunctions });
    }
  },
  
  // Set current page for context-aware search
  setCurrentPage: (pagePath) => {
    const currentPage = get().currentPage;
    if (currentPage !== pagePath) {
      set({ currentPage: pagePath });
    }
  },
  
  // Global search function that can be customized per page
  performSearch: async (query, searchFunction = null) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }
    
    set({ isSearching: true });
    
    try {
      let results = [];
      const { currentPage, pageSearchFunctions } = get();
      
      // First, try to use page-specific search function
      if (currentPage && pageSearchFunctions[currentPage]) {
        const pageSearchFn = pageSearchFunctions[currentPage];
        if (typeof pageSearchFn === 'function') {
          results = await pageSearchFn(query);
        }
      }
      
      // If no page-specific results or function, use custom search function
      if (results.length === 0 && searchFunction && typeof searchFunction === 'function') {
        results = await searchFunction(query);
      }
      
      // If still no results, use default navigation search
      if (results.length === 0) {
        results = get().defaultSearch(query);
      }
      
      set({ searchResults: results, isSearching: false });
    } catch (error) {
      console.error('Search error:', error);
      set({ searchResults: [], isSearching: false });
    }
  },
  
  // Default search through sidebar items, applications, and demos
  defaultSearch: (query) => {
    const searchTerm = query.toLowerCase().trim();
    
    const results = [];
    
    // Search sidebar items
    sidebarItems.forEach(section => {
      section.items.forEach(item => {
        if (item.name.toLowerCase().includes(searchTerm)) {
          results.push({
            ...item,
            section: section.title,
            type: 'navigation',
            relevance: item.name.toLowerCase().indexOf(searchTerm)
          });
        }
      });
    });
    
    // Search applications
    const appResults = searchApplications(query);
    results.push(...appResults);
    
    // Search demos
    const demoResults = searchDemos(query);
    results.push(...demoResults);
    
    // Sort by relevance (exact matches first)
    return results.sort((a, b) => a.relevance - b.relevance);
  },
  
  // Clear search history
  clearSearchHistory: () => {
    set({ searchHistory: [] });
  }
}));

export default useSearchStore; 