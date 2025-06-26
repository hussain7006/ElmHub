import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useSearchStore from '../store/searchStore';

/**
 * Custom hook for pages to register their search functionality
 * @param {Function} searchFunction - Function that takes a query and returns search results
 * @param {Array} dependencies - Dependencies that should trigger re-registration
 */
const usePageSearch = (searchFunction, dependencies = []) => {
    const location = useLocation();
    const { registerPageSearch, unregisterPageSearch } = useSearchStore();

    // Memoize the search function to prevent infinite loops
    const memoizedSearchFunction = useCallback(searchFunction, dependencies);

    useEffect(() => {
        // Register the search function for the current page
        if (memoizedSearchFunction && typeof memoizedSearchFunction === 'function') {
            registerPageSearch(location.pathname, memoizedSearchFunction);
        }

        // Cleanup: unregister when component unmounts or dependencies change
        return () => {
            unregisterPageSearch(location.pathname);
        };
    }, [location.pathname, memoizedSearchFunction, registerPageSearch, unregisterPageSearch]);

    return null;
};

export default usePageSearch; 