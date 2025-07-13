import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    PlayIcon,
    ClockIcon,
    StarIcon,
    VideoCameraIcon,
    AcademicCapIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const TutorialCard = ({ tutorial, colors, onClick, index, itemVariants }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner':
                return '#10B981';
            case 'intermediate':
                return '#F59E0B';
            case 'advanced':
                return '#EF4444';
            default:
                return tutorial.color;
        }
    };

    const getDifficultyIcon = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner':
                return AcademicCapIcon;
            case 'intermediate':
                return SparklesIcon;
            case 'advanced':
                return StarIcon;
            default:
                return AcademicCapIcon;
        }
    };

    const DifficultyIcon = getDifficultyIcon(tutorial.difficulty);

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 relative"
                style={{
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.borderColor}`,
                    boxShadow: isHovered 
                        ? `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
                        : `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                whileHover={{ 
                    y: -8,
                    scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
            >
                {/* Header with gradient background */}
                <div 
                    className="relative h-48 overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${tutorial.color}15 0%, ${tutorial.color}25 100%)`
                    }}
                >
                    {/* Status badge */}
                    {/* <div className="absolute top-4 right-4 z-10">
                        <span 
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{
                                backgroundColor: tutorial.status === 'active' ? '#10B981' : '#F59E0B',
                                color: 'white'
                            }}
                        >
                            {tutorial.status}
                        </span>
                    </div> */}

                    {/* Icon overlay */}
                    {/* <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: tutorial.color + '20' }}
                            animate={{ 
                                scale: isHovered ? 1.1 : 1,
                                rotate: isHovered ? 5 : 0
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <tutorial.icon 
                                className="w-10 h-10" 
                                style={{ color: tutorial.color }} 
                            />
                        </motion.div>
                    </div> */}

                    {/* Thumbnail image (if available) */}
                    {tutorial.thumbnail && (
                        <div className="absolute inset-0 opacity-100">
                            <img 
                                src={tutorial.thumbnail} 
                                alt={tutorial.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div 
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(135deg, ${tutorial.color}10 0%, transparent 100%)`
                        }}
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title and Rating */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 
                                className="text-lg font-bold mb-1 line-clamp-1"
                                style={{ color: colors.textPrimary }}
                            >
                                {tutorial.title}
                            </h3>
                            <p 
                                className="text-sm font-medium"
                                style={{ color: tutorial.color }}
                            >
                                {tutorial.subtitle}
                            </p>
                        </div>
                        {/* <div className="flex items-center ml-3">
                            <StarIcon className="w-4 h-4 mr-1" style={{ color: '#F59E0B' }} />
                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                {tutorial.rating}
                            </span>
                        </div> */}
                    </div>

                    {/* Description */}
                    <p 
                        className="text-sm mb-4 line-clamp-2"
                        style={{ color: colors.textSecondary }}
                    >
                        {tutorial.description}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            {/* Demo Count */}
                            <div className="flex items-center">
                                <VideoCameraIcon className="w-4 h-4 mr-1" style={{ color: tutorial.color }} />
                                <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                    {tutorial.demoCount} demo{tutorial.demoCount !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Duration */}
                            {/* <div className="flex items-center">
                                <ClockIcon className="w-4 h-4 mr-1" style={{ color: tutorial.color }} />
                                <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                    {tutorial.duration}
                                </span>
                            </div> */}
                        </div>

                        {/* Difficulty */}
                        {/* <div className="flex items-center">
                            <DifficultyIcon className="w-4 h-4 mr-1" style={{ color: getDifficultyColor(tutorial.difficulty) }} />
                            <span 
                                className="text-xs font-medium px-2 py-1 rounded-full"
                                style={{
                                    backgroundColor: getDifficultyColor(tutorial.difficulty) + '15',
                                    color: getDifficultyColor(tutorial.difficulty)
                                }}
                            >
                                {tutorial.difficulty}
                            </span>
                        </div> */}
                    </div>

                    {/* Tags */}
                    {/* <div className="flex flex-wrap gap-1 mb-4">
                        {tutorial.tags.slice(0, 3).map((tag, index) => (
                            <span 
                                key={index}
                                className="text-xs px-2 py-1 rounded-full"
                                style={{
                                    backgroundColor: colors.borderColor,
                                    color: colors.textSecondary
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                        {tutorial.tags.length > 3 && (
                            <span 
                                className="text-xs px-2 py-1 rounded-full"
                                style={{
                                    backgroundColor: colors.borderColor,
                                    color: colors.textSecondary
                                }}
                            >
                                +{tutorial.tags.length - 3}
                            </span>
                        )}
                    </div> */}

                    {/* Action Button */}
                    <motion.button
                        className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer"
                        style={{
                            backgroundColor: tutorial.color,
                            color: 'white'
                        }}
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: `0 8px 20px ${tutorial.color}40`
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <PlayIcon className="w-4 h-4 mr-2" />
                        Start
                    </motion.button>
                </div>

                {/* Hover overlay */}
                <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                        background: `linear-gradient(135deg, ${tutorial.color}05 0%, transparent 100%)`,
                        border: `2px solid ${tutorial.color}20`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </motion.div>
    );
};

export default TutorialCard; 