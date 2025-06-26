import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchResults = ({ 
  isVisible, 
  results, 
  isSearching, 
  searchQuery, 
  searchHistory, 
  onResultClick, 
  onHistoryClick, 
  onClearHistory,
  colors 
}) => {
  const navigate = useNavigate();

  const handleResultClick = (result) => {
    if (result.type === 'navigation') {
      navigate(result.path);
    } else if (result.type === 'api' || result.type === 'product') {
      // Navigate to the page and scroll to the specific section
      const [path, hash] = result.path.split('#');
      navigate(path);
      
      // Scroll to the specific element after navigation
      setTimeout(() => {
        if (hash) {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Add a highlight effect
            element.style.transition = 'background-color 0.3s ease';
            element.style.backgroundColor = result.color ? result.color + '20' : '#3b82f6' + '20';
            setTimeout(() => {
              element.style.backgroundColor = '';
            }, 2000);
          }
        }
      }, 100);
    }
    onResultClick?.(result);
  };

  const handleHistoryClick = (query) => {
    onHistoryClick?.(query);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 z-50"
      >
        {/* <div 
          className="rounded-lg shadow-lg border overflow-hidden"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.borderColor
          }}
        >
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 flex items-center justify-center"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" 
                       style={{ color: colors.accent }}></div>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Searching...
                  </span>
                </div>
              </motion.div>
            ) : searchQuery.trim() ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {results.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {results.map((result, index) => (
                      <motion.div
                        key={`${result.type}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 hover:bg-opacity-10 cursor-pointer transition-colors border-b last:border-b-0"
                        style={{ 
                          borderColor: colors.borderColor,
                          ':hover': { backgroundColor: colors.accent }
                        }}
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {result.icon && (
                              <result.icon 
                                className="w-5 h-5" 
                                style={{ 
                                  color: result.color || colors.textSecondary 
                                }}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>
                                {result.name}
                              </p>
                              <span className="text-xs px-2 py-1 rounded-full" 
                                    style={{ 
                                      backgroundColor: result.color ? result.color + '20' : colors.accent + '20',
                                      color: result.color || colors.accent 
                                    }}>
                                {result.type}
                              </span>
                            </div>
                            {result.section && (
                              <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                                {result.section}
                              </p>
                            )}
                            {result.description && (
                              <p className="text-xs truncate mt-1" style={{ color: colors.textSecondary }}>
                                {result.description}
                              </p>
                            )}
                            {result.type === 'product' && (
                              <div className="flex items-center mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  result.isEnabled 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {result.isEnabled ? 'Available' : 'Coming Soon'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center"
                  >
                    <MagnifyingGlassIcon 
                      className="w-8 h-8 mx-auto mb-2 opacity-50" 
                      style={{ color: colors.textSecondary }}
                    />
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      No results found for "{searchQuery}"
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : searchHistory.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="p-3 border-b" style={{ borderColor: colors.borderColor }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider" 
                          style={{ color: colors.textSecondary }}>
                      Recent Searches
                    </span>
                    <button
                      onClick={onClearHistory}
                      className="p-1 rounded hover:bg-opacity-10 transition-colors"
                      style={{ ':hover': { backgroundColor: colors.accent } }}
                    >
                      <XMarkIcon className="w-4 h-4" style={{ color: colors.textSecondary }} />
                    </button>
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {searchHistory.map((query, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 hover:bg-opacity-10 cursor-pointer transition-colors border-b last:border-b-0"
                      style={{ 
                        borderColor: colors.borderColor,
                        ':hover': { backgroundColor: colors.accent }
                      }}
                      onClick={() => handleHistoryClick(query)}
                    >
                      <div className="flex items-center space-x-3">
                        <ClockIcon className="w-4 h-4" style={{ color: colors.textSecondary }} />
                        <span className="text-sm truncate" style={{ color: colors.textPrimary }}>
                          {query}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div> */}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchResults; 