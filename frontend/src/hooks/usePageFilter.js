import { useMemo } from 'react';
import useSearchStore from '../store/searchStore';

// /**
//  * Custom hook for pages to filter their content based on search query
//  * @param {Array} items - Array of items to filter
//  * @param {Function} searchFunction - Function that takes a query and returns filtered items
//  * @param {Array} dependencies - Dependencies that should trigger re-filtering
//  */
const usePageFilter = (items, searchFunction, dependencies = []) => {
    const { searchQuery, isFiltering } = useSearchStore();

    const filteredItems = useMemo(() => {
        if (!isFiltering || !searchQuery.trim()) {
            return items;
        }

        if (searchFunction && typeof searchFunction === 'function') {
            return searchFunction(searchQuery, items);
        }

        // Default filtering behavior
        const searchTerm = searchQuery.toLowerCase().trim();
        return items.filter(item => {
            // Check if item has a name property
            if (item.name && item.name.toLowerCase().includes(searchTerm)) {
                return true;
            }
            // Check if item has a title property
            if (item.title && item.title.toLowerCase().includes(searchTerm)) {
                return true;
            }
            // Check if item has a description property
            if (item.description && item.description.toLowerCase().includes(searchTerm)) {
                return true;
            }
            // Check if item has a key property
            if (item.key && item.key.toLowerCase().includes(searchTerm)) {
                return true;
            }
            return false;
        });
    }, [items, searchQuery, isFiltering, searchFunction, ...dependencies]);

    return {
        filteredItems,
        isFiltering,
        searchQuery: searchQuery.trim()
    };
};

export default usePageFilter; 