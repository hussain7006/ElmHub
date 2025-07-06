import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../../../store/themeStore';
import { getAllDemoProducts } from '../../../Constants/demos';
import {
    PlayIcon,
    ClockIcon,
    StarIcon,
    SparklesIcon,
    RocketLaunchIcon,
    LightBulbIcon,
    AcademicCapIcon,
    BookOpenIcon,
    VideoCameraIcon,
    UserGroupIcon,
    ChatBubbleLeftEllipsisIcon,
    MicrophoneIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';

// Import components
import TutorialCard from '../../../Components/App/Tutorials/TutorialCard';
// import TutorialHero from '../../../Components/App/Tutorials/TutorialHero';
// import TutorialFilters from '../../../Components/App/Tutorials/TutorialFilters';
// import TutorialStats from '../../../Components/App/Tutorials/TutorialStats';

const Tutorials = () => {
    const { colors, theme } = useThemeStore();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading effect
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Get tutorial data from demos.js
    const demosData = getAllDemoProducts();
    
    // Transform demos data to tutorials format
    const tutorialsData = demosData.map(product => {
        const demoCount = Object.keys(product.demos).length;
        const firstDemo = Object.values(product.demos)[0];
        
        return {
            id: product.id,
            title: product.title,
            subtitle: product.subtitle,
            description: product.description,
            icon: product.icon,
            color: product.color,
            category: product.category,
            tags: product.tags,
            demoCount: demoCount,
            difficulty: firstDemo?.difficulty || 'Beginner',
            duration: firstDemo?.duration || '3-5 minutes',
            thumbnail: firstDemo?.thumbnailImage || null,
            features: firstDemo?.features || [],
            status: 'active',
            rating: 4.8,
            lastUpdated: '2024-01-15'
        };
    });

    // Categories for filtering - dynamically generated from tutorials data
    const uniqueCategories = [...new Set(tutorialsData.map(t => t.category))];
    const categories = [
        { id: 'all', name: 'All Tutorials', icon: BookOpenIcon, count: tutorialsData.length },
        ...uniqueCategories.map(category => ({
            id: category.toLowerCase().replace(/\s+/g, '-'),
            name: category,
            icon: category.includes('Analytics') ? StarIcon : 
                  category.includes('AI') ? LightBulbIcon : 
                  category.includes('Product') ? RocketLaunchIcon : 
                  AcademicCapIcon,
            count: tutorialsData.filter(t => t.category === category).length
        }))
    ];

    // Filter tutorials based on category and search
    const filteredTutorials = tutorialsData.filter(tutorial => {
        const categoryMatch = selectedCategory === 'all' ||
            tutorial.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;

        const searchMatch = !searchQuery ||
            tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutorial.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

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

    const handleTutorialClick = (tutorialId) => {
        // Navigate to demo page since we're using demo data
        navigate(`/demo/${tutorialId}`);
    };

    const getTotalTutorials = () => {
        return tutorialsData.length;
    };

    const getTotalDemos = () => {
        return tutorialsData.reduce((total, tutorial) => total + tutorial.demoCount, 0);
    };

    const getAverageRating = () => {
        const totalRating = tutorialsData.reduce((sum, tutorial) => sum + tutorial.rating, 0);
        return (totalRating / tutorialsData.length).toFixed(1);
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
                        Loading tutorials...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-5" style={{ backgroundColor: colors.background }}>
            {/* Hero Section */}
            {/* <TutorialHero 
                colors={colors}
                containerVariants={containerVariants}
                itemVariants={itemVariants}
            /> */}

            {/* Stats Section */}
            {/* <TutorialStats 
                colors={colors}
                totalTutorials={getTotalTutorials()}
                totalDemos={getTotalDemos()}
                averageRating={getAverageRating()}
                itemVariants={itemVariants}
            /> */}

            {/* Search and Filter Section */}
            {/* <TutorialFilters 
                colors={colors}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                itemVariants={itemVariants}
            /> */}

            {/* Tutorials Grid */}
            <motion.section
                className="px-4 sm:px-6 lg:px-8 pb-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Results Header */}
                    <motion.div
                        className="mb-8"
                        variants={itemVariants}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 
                                    className="text-xl sm:text-2xl font-bold"
                                    style={{ color: colors.textPrimary }}
                                >
                                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Available Tutorials'}
                                </h2>
                                <p 
                                    className="text-sm mt-1"
                                    style={{ color: colors.textSecondary }}
                                >
                                    {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''} found
                                </p>
                            </div>
                            {/* {filteredTutorials.length > 0 && (
                                <div className="mt-4 sm:mt-0">
                                    <span 
                                        className="text-sm px-3 py-1 rounded-full"
                                        style={{
                                            backgroundColor: colors.primary + '15',
                                            color: colors.primary
                                        }}
                                    >
                                        {filteredTutorials.length} result{filteredTutorials.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            )} */}
                        </div>
                    </motion.div>

                    {/* Tutorials Grid */}
                    {filteredTutorials.length > 0 ? (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                        >
                            {filteredTutorials.map((tutorial, index) => (
                                <TutorialCard
                                    key={tutorial.id}
                                    tutorial={tutorial}
                                    colors={colors}
                                    onClick={() => handleTutorialClick(tutorial.id)}
                                    index={index}
                                    itemVariants={itemVariants}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="text-center py-16"
                            variants={itemVariants}
                        >
                            <div className="max-w-md mx-auto">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: colors.surface }}>
                                    <BookOpenIcon 
                                        className="w-12 h-12" 
                                        style={{ color: colors.textSecondary }} 
                                    />
                                </div>
                                <h3 
                                    className="text-lg font-semibold mb-2"
                                    style={{ color: colors.textPrimary }}
                                >
                                    No tutorials found
                                </h3>
                                <p 
                                    className="text-sm"
                                    style={{ color: colors.textSecondary }}
                                >
                                    {searchQuery 
                                        ? `No tutorials match your search for "${searchQuery}". Try different keywords or browse all tutorials.`
                                        : 'No tutorials are currently available. Please check back later.'
                                    }
                                </p>
                                {searchQuery && (
                                    <motion.button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        style={{
                                            backgroundColor: colors.primary,
                                            color: 'white'
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Clear Search
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.section>
        </div>
    );
};

export default Tutorials; 