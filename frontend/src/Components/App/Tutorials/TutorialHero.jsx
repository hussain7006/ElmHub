import React from 'react';
import { motion } from 'framer-motion';
import {
    AcademicCapIcon,
    BookOpenIcon,
    SparklesIcon,
    PlayIcon
} from '@heroicons/react/24/outline';

const TutorialHero = ({ colors, containerVariants, itemVariants }) => {
    return (
        <motion.section
            className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    variants={itemVariants}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center px-4 py-2 rounded-full mb-6"
                        style={{
                            backgroundColor: `${colors.primary}15`,
                            border: `1px solid ${colors.primary}30`
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AcademicCapIcon className="w-4 h-4 mr-2" style={{ color: colors.primary }} />
                        <span className="text-sm font-medium" style={{ color: colors.primary }}>
                            Comprehensive Learning Hub
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                        style={{ color: colors.textPrimary }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Master Our
                        <span 
                            className="block"
                            style={{ 
                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            AI Applications
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8"
                        style={{ color: colors.textSecondary }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Dive deep into our comprehensive tutorials and master the art of AI applications. 
                        From beginner-friendly guides to advanced techniques, unlock the full potential of our cutting-edge technology.
                    </motion.p>

                    {/* Features Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {/* Feature 1 */}
                        <motion.div
                            className="text-center p-6 rounded-2xl"
                            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderColor}` }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div 
                                className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: colors.primary + '15' }}
                            >
                                <BookOpenIcon className="w-6 h-6" style={{ color: colors.primary }} />
                            </div>
                            <h3 
                                className="text-lg font-semibold mb-2"
                                style={{ color: colors.textPrimary }}
                            >
                                Step-by-Step Guides
                            </h3>
                            <p 
                                className="text-sm"
                                style={{ color: colors.textSecondary }}
                            >
                                Follow detailed tutorials with clear instructions and real-world examples
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            className="text-center p-6 rounded-2xl"
                            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderColor}` }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div 
                                className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: colors.accent + '15' }}
                            >
                                <PlayIcon className="w-6 h-6" style={{ color: colors.accent }} />
                            </div>
                            <h3 
                                className="text-lg font-semibold mb-2"
                                style={{ color: colors.textPrimary }}
                            >
                                Interactive Demos
                            </h3>
                            <p 
                                className="text-sm"
                                style={{ color: colors.textSecondary }}
                            >
                                Hands-on experience with live demonstrations and practical exercises
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            className="text-center p-6 rounded-2xl"
                            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderColor}` }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div 
                                className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: colors.primary + '15' }}
                            >
                                <SparklesIcon className="w-6 h-6" style={{ color: colors.primary }} />
                            </div>
                            <h3 
                                className="text-lg font-semibold mb-2"
                                style={{ color: colors.textPrimary }}
                            >
                                Expert Insights
                            </h3>
                            <p 
                                className="text-sm"
                                style={{ color: colors.textSecondary }}
                            >
                                Learn from industry experts with best practices and advanced techniques
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <motion.button
                            className="inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                                color: 'white',
                                boxShadow: `0 10px 30px ${colors.primary}30`
                            }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: `0 15px 40px ${colors.primary}40`
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <PlayIcon className="w-5 h-5 mr-2" />
                            Start Learning Now
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
                    style={{ backgroundColor: colors.primary }}
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-60 h-60 rounded-full opacity-10"
                    style={{ backgroundColor: colors.accent }}
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>
        </motion.section>
    );
};

export default TutorialHero; 