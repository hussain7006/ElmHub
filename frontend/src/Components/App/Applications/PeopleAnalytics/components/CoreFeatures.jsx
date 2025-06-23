import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../../../../store/themeStore';
import {
    UserGroupIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    ChartBarIcon,
    CameraIcon,
    FaceSmileIcon
} from '@heroicons/react/24/outline';

// People Analytics application characteristics
const PEOPLE_ANALYTICS_FEATURES = [
    {
        id: 'person-detection',
        name: 'Person Detection',
        description: 'Advanced computer vision algorithms to detect and track people in real-time across multiple camera feeds',
        icon: UserGroupIcon,
        color: '#3B82F6',
        features: ['Real-time detection', 'Multi-camera tracking', 'Person counting', 'Trajectory analysis']
    },
    {
        id: 'gender-detection',
        name: 'Gender Detection',
        description: 'AI-powered gender classification with high accuracy for demographic analysis and visitor insights',
        icon: FaceSmileIcon,
        color: '#EC4899',
        features: ['Gender classification', 'Age estimation', 'Demographic analysis', 'Privacy compliance']
    },
    {
        id: 'gaze-detection',
        name: 'Gaze Detection',
        description: 'Track where people are looking to understand visitor engagement and interest patterns',
        icon: EyeIcon,
        color: '#F59E0B',
        features: ['Eye tracking', 'Attention analysis', 'Engagement metrics', 'Interest mapping']
    },
    {
        id: 'search-person',
        name: 'Search Person by Image',
        description: 'Powerful facial recognition system to search and locate specific individuals across the facility',
        icon: MagnifyingGlassIcon,
        color: '#10B981',
        features: ['Facial recognition', 'Image search', 'Person location', 'Historical tracking']
    },
    {
        id: 'visitor-analytics',
        name: 'Visitor Analytics',
        description: 'Comprehensive analytics dashboard for understanding visitor patterns and museum performance',
        icon: ChartBarIcon,
        color: '#8B5CF6',
        features: ['Visitor counts', 'Peak hour analysis', 'Dwell time tracking', 'Popular exhibits']
    },
    {
        id: 'surveillance',
        name: 'Intelligent Surveillance',
        description: 'Enhanced security monitoring with people detection and suspicious behavior identification',
        icon: CameraIcon,
        color: '#EF4444',
        features: ['Security monitoring', 'Behavior analysis', 'Alert system', 'Incident recording']
    }
];

export default function CoreFeatures() {
    const { colors } = useThemeStore();
    const [activeFeature, setActiveFeature] = useState(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
        >
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                    Core Features
                </h3>
                <p className="text-sm max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
                    Advanced AI-powered capabilities for comprehensive people analytics and monitoring
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {PEOPLE_ANALYTICS_FEATURES.map((feature, index) => (
                    <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group p-8 rounded-2xl border transition-all duration-300 cursor-pointer"
                        style={{ 
                            borderColor: colors.borderColor,
                            backgroundColor: colors.surface,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                    >
                        <div className="flex items-start space-x-4 mb-6">
                            <div 
                                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0"
                                style={{ backgroundColor: feature.color + '20' }}
                            >
                                <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                                    {feature.name}
                                </h4>
                                <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                        
                        {/* Expandable Features */}
                        <AnimatePresence>
                            {activeFeature === feature.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-6 border-t"
                                    style={{ borderColor: colors.borderColor }}
                                >
                                    <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                                        Key Capabilities
                                    </p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {feature.features.map((capability, idx) => (
                                            <div key={idx} className="flex items-center space-x-3 text-sm">
                                                <div 
                                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: feature.color }}
                                                ></div>
                                                <span style={{ color: colors.textPrimary }}>{capability}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
} 