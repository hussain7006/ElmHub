import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllDemoProducts } from '../../../Constants/demos';
import useThemeStore from '../../../store/themeStore';
import {
    PlayIcon,
    ClockIcon,
    StarIcon,
    SparklesIcon,
    RocketLaunchIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline';

const Demos = () => {
    const { colors, theme } = useThemeStore();
    const navigate = useNavigate();
    const demoProducts = getAllDemoProducts();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading effect
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Categories for filtering
    const categories = [
        { id: 'all', name: 'All Demos', icon: SparklesIcon, count: demoProducts.length },
        { id: 'ai', name: 'AI & ML', icon: LightBulbIcon, count: demoProducts.filter(p => p.tags.includes('ai')).length },
        { id: 'detection', name: 'Detection', icon: RocketLaunchIcon, count: demoProducts.filter(p => p.tags.includes('detection')).length },
        { id: 'analytics', name: 'Analytics', icon: StarIcon, count: demoProducts.filter(p => p.tags.includes('analytics')).length }
    ];

    // Filter products based on category and search
    const filteredProducts = demoProducts.filter(product => {
        const categoryMatch = selectedCategory === 'all' ||
            (selectedCategory === 'ai' && product.tags.includes('ai')) ||
            (selectedCategory === 'detection' && product.tags.includes('detection')) ||
            (selectedCategory === 'analytics' && product.tags.includes('analytics'));

        const searchMatch = !searchQuery ||
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return categoryMatch && searchMatch;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/demo/${productId}`);
    };

    const getTotalDemos = () => {
        return demoProducts.reduce((total, product) => total + Object.keys(product.demos).length, 0);
    };

    const getAverageRating = () => {
        return (4.8).toFixed(1);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full border-4"
                        style={{
                            borderColor: colors.primary,
                            borderTopColor: 'transparent'
                        }}
                    />
                    <p className="text-lg" style={{ color: colors.textSecondary }}>
                        Loading amazing demos...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            {/* Hero Section */}
            <motion.section
                className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="border-red-500 max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-0"
                        variants={itemVariants}
                    >
                        {/* <motion.div
                            className="inline-flex items-center px-3 py-1.5 rounded-full mb-4"
                            style={{
                                backgroundColor: `${colors.primary}15`,
                                border: `1px solid ${colors.primary}30`
                            }}
                        >
                            <SparklesIcon className="w-4 h-4 mr-1.5" style={{ color: colors.primary }} />
                            <span className="text-xs font-medium" style={{ color: colors.primary }}>
                                Interactive AI Demonstrations
                            </span>
                        </motion.div> */}

                        <motion.h1
                            className="text-2xl md:text-4xl font-bold mb-4"
                            style={{ color: colors.textPrimary }}
                        >
                            Experience AI in Action
                        </motion.h1>
                        <motion.p
                            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6"
                            style={{ color: colors.textSecondary }}
                        >
                            Dive into our cutting-edge AI solutions through interactive demonstrations and real-world examples.
                        </motion.p>

                        {/* Stats */}
                        {/* <motion.div 
                            className="flex flex-wrap justify-center gap-6 mb-6"
                            variants={itemVariants}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                                    {demoProducts.length}
                                </div>
                                <div className="text-xs" style={{ color: colors.textSecondary }}>
                                    Products
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                                    {getTotalDemos()}
                                </div>
                                <div className="text-xs" style={{ color: colors.textSecondary }}>
                                    Demos Available
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-1 flex items-center justify-center">
                                    <span style={{ color: colors.primary }}>{getAverageRating()}</span>
                                    <StarIcon className="w-4 h-4 ml-1" style={{ color: colors.accent }} />
                                </div>
                                <div className="text-xs" style={{ color: colors.textSecondary }}>
                                    Average Rating
                                </div>
                            </div>
                        </motion.div> */}
                    </motion.div>

                    {/* Search and Filter Section */}
                    <motion.div
                        className="mb-8"
                        variants={itemVariants}
                    >
                        {/* Search Bar */}
                        <div className="max-w-sm mx-auto mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search demos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-2 pl-10 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.borderColor,
                                        color: colors.textPrimary,
                                        focusRingColor: colors.primary
                                    }}
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-4 h-4" style={{ color: colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Category Filters */}
                        {/* <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((category) => (
                                <motion.button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                                        selectedCategory === category.id 
                                            ? 'text-white' 
                                            : ''
                                    }`}
                                    style={{
                                        backgroundColor: selectedCategory === category.id 
                                            ? colors.primary 
                                            : colors.surface,
                                        border: `1px solid ${selectedCategory === category.id ? colors.primary : colors.borderColor}`,
                                        color: selectedCategory === category.id 
                                            ? 'white' 
                                            : colors.textSecondary
                                    }}
                                    whileHover={{ 
                                        scale: 1.05,
                                        y: -1
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <category.icon className="w-4 h-4" />
                                    <span>{category.name}</span>
                                    <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                                        style={{
                                            backgroundColor: selectedCategory === category.id 
                                                ? 'rgba(255,255,255,0.2)' 
                                                : `${colors.primary}20`,
                                            color: selectedCategory === category.id 
                                                ? 'white' 
                                                : colors.primary
                                        }}
                                    >
                                        {category.count}
                                    </span>
                                </motion.button>
                            ))}
                        </div> */}
                    </motion.div>

                    {/* Results Count */}
                    <motion.div
                        className="text-center mb-6"
                        variants={itemVariants}
                    >
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                            {filteredProducts.length === 0
                                ? 'No demos found matching your criteria'
                                : `Showing ${filteredProducts.length} of ${demoProducts.length} products`
                            }
                        </p>
                    </motion.div>

                    {/* Demo Products Grid */}
                    <AnimatePresence mode="wait">
                        {filteredProducts.length > 0 ? (
                            <motion.div
                                key={`${selectedCategory}-${searchQuery}`}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        className="group cursor-pointer"
                                        whileHover={{
                                            y: -8,
                                            transition: { duration: 0.3 }
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleProductClick(product.id)}
                                        onHoverStart={() => setHoveredProduct(product.id)}
                                        onHoverEnd={() => setHoveredProduct(null)}
                                    >
                                        <div
                                            className="p-6 rounded-2xl h-full transition-all duration-300"
                                            style={{
                                                backgroundColor: colors.surface,
                                                border: `1px solid ${colors.borderColor}`,
                                                background: `linear-gradient(135deg, ${colors.surface}, ${product.color}10)`
                                            }}
                                        >
                                            {/* Product Icon */}
                                            <motion.div
                                                className="w-12 h-12 mb-4 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: product.color }}
                                                whileHover={{
                                                    scale: 1.1,
                                                    rotate: 5
                                                }}
                                            >
                                                <product.icon className="w-6 h-6 text-white" />
                                            </motion.div>

                                            {/* Product Info */}
                                            <motion.h3
                                                className="text-lg font-bold mb-2"
                                                style={{ color: colors.textPrimary }}
                                            >
                                                {product.title}
                                            </motion.h3>

                                            <motion.p
                                                className="text-sm font-medium mb-3"
                                                style={{ color: product.color }}
                                            >
                                                {product.subtitle}
                                            </motion.p>

                                            <motion.p
                                                className="text-xs leading-relaxed mb-4"
                                                style={{ color: colors.textSecondary }}
                                            >
                                                {product.description}
                                            </motion.p>

                                            {/* Demo Count and Features */}
                                            <motion.div
                                                className="flex items-center justify-between mb-3"
                                                style={{ color: colors.textSecondary }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center space-x-1">
                                                        <PlayIcon className="w-3 h-3" />
                                                        <span className="text-xs">
                                                            {Object.keys(product.demos).length} Demo{Object.keys(product.demos).length !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <ClockIcon className="w-3 h-3" />
                                                        <span className="text-xs">5-15 min</span>
                                                    </div>
                                                </div>
                                                <motion.div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: product.color }}
                                                    whileHover={{ scale: 1.2 }}
                                                    animate={hoveredProduct === product.id ? { rotate: 360 } : { rotate: 0 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <PlayIcon className="w-4 h-4 text-white ml-0.5" />
                                                </motion.div>
                                            </motion.div>

                                            {/* Quick Demo Preview */}
                                            <AnimatePresence>
                                                {hoveredProduct === product.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mb-3 p-2 rounded-lg"
                                                        style={{ backgroundColor: `${product.color}10` }}
                                                    >
                                                        <p className="text-xs font-medium mb-1" style={{ color: product.color }}>
                                                            Quick Preview
                                                        </p>
                                                        <div className="space-y-0.5">
                                                            {Object.keys(product.demos).slice(0, 2).map((demoKey, demoIndex) => (
                                                                <div key={demoKey} className="flex items-center justify-between">
                                                                    <span className="text-xs" style={{ color: colors.textSecondary }}>
                                                                        {product.demos[demoKey].name}
                                                                    </span>
                                                                    <span className="text-xs px-1.5 py-0.5 rounded-full"
                                                                        style={{
                                                                            backgroundColor: `${product.color}20`,
                                                                            color: product.color
                                                                        }}
                                                                    >
                                                                        {product.demos[demoKey].difficulty}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                            {Object.keys(product.demos).length > 2 && (
                                                                <div className="text-xs text-center pt-0.5" style={{ color: colors.textSecondary }}>
                                                                    +{Object.keys(product.demos).length - 2} more demos
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Tags */}
                                            <motion.div
                                                className="flex flex-wrap gap-1.5 mt-3"
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                {product.tags.slice(0, 3).map((tag, tagIndex) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 text-xs rounded-full font-medium"
                                                        style={{
                                                            backgroundColor: `${product.color}20`,
                                                            color: product.color
                                                        }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {product.tags.length > 3 && (
                                                    <span
                                                        className="px-2 py-0.5 text-xs rounded-full font-medium"
                                                        style={{
                                                            backgroundColor: `${colors.borderColor}`,
                                                            color: colors.textSecondary
                                                        }}
                                                    >
                                                        +{product.tags.length - 3} more
                                                    </span>
                                                )}
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="no-results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center py-12"
                            >
                                <div className="max-w-sm mx-auto">
                                    <motion.div
                                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${colors.primary}20` }}
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <svg className="w-8 h-8" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </motion.div>
                                    <h3 className="text-lg font-bold mb-3" style={{ color: colors.textPrimary }}>
                                        No Demos Found
                                    </h3>
                                    <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                                        Try adjusting your search or filter criteria to find what you're looking for.
                                    </p>
                                    <motion.button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedCategory('all');
                                        }}
                                        className="px-4 py-2 rounded-lg font-semibold text-white text-sm"
                                        style={{ backgroundColor: colors.primary }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Clear Filters
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CTA Section */}
                    <motion.div
                        className="text-center mt-12"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="p-8 rounded-2xl max-w-3xl mx-auto"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
                                border: `1px solid ${colors.borderColor}`
                            }}
                        >
                            <motion.h2
                                className="text-xl md:text-2xl font-bold mb-4"
                                style={{ color: colors.textPrimary }}
                            >
                                Ready to Experience Our AI Solutions?
                            </motion.h2>
                            <motion.p
                                className="text-base mb-6"
                                style={{ color: colors.textSecondary }}
                            >
                                Dive into our interactive demos and see how our AI technology can transform your business.
                            </motion.p>
                            <motion.button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300"
                                style={{ backgroundColor: colors.primary }}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: `0 8px 20px ${colors.primary}40`
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Explore More Products
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default Demos; 