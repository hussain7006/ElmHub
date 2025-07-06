import React from 'react';
import { motion } from 'framer-motion';
import { 
    CodeBracketIcon, 
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../../../store/themeStore';
import { getApiApplications, getTotalEndpoints } from '../../../Constants/products';

export default function API() {
    const { colors } = useThemeStore();
    const navigate = useNavigate();

    // Get API applications from unified configuration
    const apiApplications = getApiApplications();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const handleApplicationClick = (app) => {
        navigate(app.route);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            {/* Header Section */}
            <motion.div
                className="relative overflow-hidden"
                style={{ backgroundColor: colors.surface }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, ${colors.primary} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${colors.accent} 0%, transparent 50%)`,
                        backgroundSize: '400px 400px'
                    }} />
                </div>

                <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl mb-4 sm:mb-6" style={{ backgroundColor: colors.primary }}>
                                <CodeBracketIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h1 
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4"
                                style={{ color: colors.textPrimary }}
                            >
                                API Applications
                            </h1>
                            <p 
                                className="text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8"
                                style={{ color: colors.textSecondary }}
                            >
                                Explore our comprehensive suite of AI-powered API applications. 
                                Each application offers specialized endpoints for different use cases.
                            </p>
                            
                            {/* Overall Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto">
                                <motion.div
                                    className="text-center p-3 rounded-lg"
                                    style={{ backgroundColor: colors.inputBackground }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                >
                                    <div 
                                        className="text-xl sm:text-2xl font-bold mb-1"
                                        style={{ color: colors.primary }}
                                    >
                                        {apiApplications.length}
                                    </div>
                                    <div 
                                        className="text-xs font-medium"
                                        style={{ color: colors.textSecondary }}
                                    >
                                        Applications
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="text-center p-3 rounded-lg"
                                    style={{ backgroundColor: colors.inputBackground }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.5 }}
                                >
                                    <div 
                                        className="text-xl sm:text-2xl font-bold mb-1"
                                        style={{ color: colors.primary }}
                                    >
                                        {getTotalEndpoints()}
                                    </div>
                                    <div 
                                        className="text-xs font-medium"
                                        style={{ color: colors.textSecondary }}
                                    >
                                        Endpoints
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="text-center p-3 rounded-lg"
                                    style={{ backgroundColor: colors.inputBackground }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.6 }}
                                >
                                    <div 
                                        className="text-xl sm:text-2xl font-bold mb-1"
                                        style={{ color: colors.primary }}
                                    >
                                        99%+
                                    </div>
                                    <div 
                                        className="text-xs font-medium"
                                        style={{ color: colors.textSecondary }}
                                    >
                                        Accuracy
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Applications Grid */}
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
                    >
                        {apiApplications.map((app) => (
                            <motion.div
                                key={app.id}
                                variants={cardVariants}
                                className="group cursor-pointer"
                                onClick={() => handleApplicationClick(app)}
                            >
                                <motion.div
                                    className="h-full rounded-xl shadow-md overflow-hidden transition-all duration-300"
                                    style={{ 
                                        backgroundColor: colors.surface,
                                        border: `1px solid ${colors.borderColor}`
                                    }}
                                    whileHover={{ 
                                        scale: 1.01,
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Header */}
                                    <div className="p-4 sm:p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                {/* <div 
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                    style={{ backgroundColor: app.color }}
                                                >
                                                    <app.icon className="w-6 h-6 text-white" />
                                                </div> */}
                                                <div>
                                                    <h3 
                                                        className="text-xl sm:text-2xl font-bold mb-1"
                                                        style={{ color: colors.textPrimary }}
                                                    >
                                                        {app.name}
                                                    </h3>
                                                    <p 
                                                        className="text-sm sm:text-base"
                                                        style={{ color: colors.textSecondary }}
                                                    >
                                                        {app.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.div
                                                className="flex-shrink-0"
                                                whileHover={{ x: 3 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ArrowRightIcon 
                                                    className="w-5 h-5" 
                                                    style={{ color: colors.textSecondary }}
                                                />
                                            </motion.div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: colors.inputBackground }}>
                                                <div 
                                                    className="text-base font-bold mb-1"
                                                    style={{ color: colors.primary }}
                                                >
                                                    {app.stats.endpoints}
                                                </div>
                                                <div 
                                                    className="text-xs font-medium"
                                                    style={{ color: colors.textSecondary }}
                                                >
                                                    Endpoints
                                                </div>
                                            </div>
                                            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: colors.inputBackground }}>
                                                <div 
                                                    className="text-base font-bold mb-1"
                                                    style={{ color: colors.primary }}
                                                >
                                                    {app.stats.accuracy}
                                                </div>
                                                <div 
                                                    className="text-xs font-medium"
                                                    style={{ color: colors.textSecondary }}
                                                >
                                                    Accuracy
                                                </div>
                                            </div>
                                            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: colors.inputBackground }}>
                                                <div 
                                                    className="text-base font-bold mb-1"
                                                    style={{ color: colors.primary }}
                                                >
                                                    {app.stats.responseTime}
                                                </div>
                                                <div 
                                                    className="text-xs font-medium"
                                                    style={{ color: colors.textSecondary }}
                                                >
                                                    Response
                                                </div>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div>
                                            <h4 
                                                className="text-xs font-semibold uppercase tracking-wider mb-2"
                                                style={{ color: colors.primary }}
                                            >
                                                Key Features
                                            </h4>
                                            <div className="grid grid-cols-2 gap-1">
                                                {app.features.map((feature, index) => (
                                                    <div 
                                                        key={index}
                                                        className="flex items-center space-x-2 text-xs"
                                                        style={{ color: colors.textSecondary }}
                                                    >
                                                        <div 
                                                            className="w-1 h-1 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: app.color }}
                                                        />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div 
                                        className="px-4 sm:px-6 py-3 border-t"
                                        style={{ borderColor: colors.borderColor }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span 
                                                className="text-xs font-medium"
                                                style={{ color: colors.textSecondary }}
                                            >
                                                Click to explore APIs
                                            </span>
                                            <motion.div
                                                className="flex items-center space-x-1 text-xs font-medium"
                                                style={{ color: app.color }}
                                                whileHover={{ x: 2 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <span>View APIs</span>
                                                <ArrowRightIcon className="w-3 h-3" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div
                        className="mt-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <h3 
                            className="text-xl sm:text-2xl font-bold mb-3"
                            style={{ color: colors.textPrimary }}
                        >
                            Ready to get started?
                        </h3>
                        <p 
                            className="text-base max-w-xl mx-auto"
                            style={{ color: colors.textSecondary }}
                        >
                            Choose an application above to start testing our AI-powered APIs with real-time results and interactive demos.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 