import React from 'react';
import { motion } from 'framer-motion';
import {
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

const TutorialFilters = ({ 
    colors, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    itemVariants 
}) => {
    return (
        <motion.section
            className="px-4 sm:px-6 lg:px-8 mb-12"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Search Bar */}
                    <motion.div
                        className="flex-1 max-w-md"
                        variants={itemVariants}
                    >
                        <div className="relative">
                            <MagnifyingGlassIcon 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                                style={{ color: colors.textSecondary }}
                            />
                            <input
                                type="text"
                                placeholder="Search tutorials..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.borderColor,
                                    color: colors.textPrimary,
                                    '--tw-ring-color': colors.primary
                                }}
                            />
                            {searchQuery && (
                                <motion.button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                                    style={{ 
                                        backgroundColor: colors.textSecondary + '20',
                                        color: colors.textSecondary
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* Category Filters */}
                    <motion.div
                        className="flex flex-wrap gap-2"
                        variants={itemVariants}
                    >
                        <div className="flex items-center mr-2">
                            <FunnelIcon 
                                className="w-4 h-4 mr-2"
                                style={{ color: colors.textSecondary }}
                            />
                            <span 
                                className="text-sm font-medium"
                                style={{ color: colors.textSecondary }}
                            >
                                Filter:
                            </span>
                        </div>
                        
                        {categories.map((category, index) => (
                            <motion.button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2`}
                                style={{
                                    backgroundColor: selectedCategory === category.id 
                                        ? colors.primary 
                                        : colors.surface,
                                    color: selectedCategory === category.id 
                                        ? 'white' 
                                        : colors.textSecondary,
                                    border: `1px solid ${selectedCategory === category.id 
                                        ? colors.primary 
                                        : colors.borderColor}`
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    backgroundColor: selectedCategory === category.id 
                                        ? colors.primary 
                                        : colors.primary + '10'
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <category.icon className="w-4 h-4" />
                                <span>{category.name}</span>
                                <span 
                                    className="px-2 py-0.5 rounded-full text-xs"
                                    style={{
                                        backgroundColor: selectedCategory === category.id 
                                            ? 'rgba(255, 255, 255, 0.2)' 
                                            : colors.borderColor
                                    }}
                                >
                                    {category.count}
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>
                </div>

                {/* Active Filters Display */}
                {(searchQuery || selectedCategory !== 'all') && (
                    <motion.div
                        className="mt-4 flex flex-wrap items-center gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <span 
                            className="text-sm font-medium"
                            style={{ color: colors.textSecondary }}
                        >
                            Active filters:
                        </span>
                        
                        {searchQuery && (
                            <motion.span
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                                style={{
                                    backgroundColor: colors.primary + '15',
                                    color: colors.primary,
                                    border: `1px solid ${colors.primary}30`
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                Search: "{searchQuery}"
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="ml-2 w-4 h-4 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.span>
                        )}
                        
                        {selectedCategory !== 'all' && (
                            <motion.span
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                                style={{
                                    backgroundColor: colors.accent + '15',
                                    color: colors.accent,
                                    border: `1px solid ${colors.accent}30`
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                Category: {categories.find(c => c.id === selectedCategory)?.name}
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className="ml-2 w-4 h-4 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.span>
                        )}
                        
                        {(searchQuery || selectedCategory !== 'all') && (
                            <motion.button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                                className="text-sm font-medium px-3 py-1 rounded-lg transition-colors"
                                style={{
                                    backgroundColor: colors.surface,
                                    color: colors.textSecondary,
                                    border: `1px solid ${colors.borderColor}`
                                }}
                                whileHover={{
                                    backgroundColor: colors.primary + '10',
                                    color: colors.primary
                                }}
                            >
                                Clear All
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
};

export default TutorialFilters; 