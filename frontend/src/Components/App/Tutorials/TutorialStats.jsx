import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpenIcon,
    VideoCameraIcon,
    StarIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

const TutorialStats = ({ colors, totalTutorials, totalDemos, averageRating, itemVariants }) => {
    const stats = [
        {
            icon: BookOpenIcon,
            label: 'Total Tutorials',
            value: totalTutorials,
            color: colors.primary,
            description: 'Comprehensive guides'
        },
        {
            icon: VideoCameraIcon,
            label: 'Interactive Demos',
            value: totalDemos,
            color: colors.accent,
            description: 'Hands-on learning'
        },
        {
            icon: StarIcon,
            label: 'Average Rating',
            value: averageRating,
            color: '#F59E0B',
            description: 'User satisfaction'
        },
        {
            icon: UsersIcon,
            label: 'Active Learners',
            value: '2.5K+',
            color: '#10B981',
            description: 'Community growing'
        }
    ];

    return (
        <motion.section
            className="px-4 sm:px-6 lg:px-8 mb-16"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={itemVariants}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="text-center p-6 rounded-2xl"
                            style={{ 
                                backgroundColor: colors.surface,
                                border: `1px solid ${colors.borderColor}`
                            }}
                            whileHover={{ 
                                y: -5,
                                scale: 1.02,
                                boxShadow: `0 10px 25px ${stat.color}15`
                            }}
                            transition={{ 
                                duration: 0.3,
                                delay: index * 0.1
                            }}
                        >
                            <motion.div
                                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: stat.color + '15' }}
                                whileHover={{ 
                                    scale: 1.1,
                                    rotate: 5
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <stat.icon 
                                    className="w-8 h-8" 
                                    style={{ color: stat.color }} 
                                />
                            </motion.div>
                            
                            <motion.div
                                className="text-3xl font-bold mb-2"
                                style={{ color: colors.textPrimary }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                    delay: 0.5 + (index * 0.1),
                                    type: "spring",
                                    stiffness: 200
                                }}
                            >
                                {stat.value}
                            </motion.div>
                            
                            <h3 
                                className="text-sm font-semibold mb-1"
                                style={{ color: colors.textPrimary }}
                            >
                                {stat.label}
                            </h3>
                            
                            <p 
                                className="text-xs"
                                style={{ color: colors.textSecondary }}
                            >
                                {stat.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default TutorialStats; 