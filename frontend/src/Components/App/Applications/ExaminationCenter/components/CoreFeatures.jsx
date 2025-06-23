import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../../../../store/themeStore';
import {
    CpuChipIcon,
    VideoCameraIcon,
    EyeIcon,
    UserGroupIcon,
    ChartBarIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Examination Center application characteristics
const APP_CHARACTERISTICS = [
    {
        id: 'ai-monitoring',
        name: 'AI-Powered Monitoring',
        description: 'Advanced computer vision and machine learning algorithms to detect suspicious behavior in real-time',
        icon: CpuChipIcon,
        color: '#3B82F6',
        features: ['Facial recognition', 'Behavioral analysis', 'Pattern detection', 'Real-time alerts']
    },
    {
        id: 'multi-camera',
        name: 'Multi-Camera Support',
        description: 'Support for multiple camera feeds to monitor different angles and areas of the examination hall',
        icon: VideoCameraIcon,
        color: '#10B981',
        features: ['360° coverage', 'HD video streams', 'Low-light detection', 'Wide-angle views']
    },
    {
        id: 'behavior-detection',
        name: 'Behavioral Analysis',
        description: 'Comprehensive detection of various suspicious behaviors and cheating attempts',
        icon: EyeIcon,
        color: '#F59E0B',
        features: ['Hand raising detection', 'Looking around', 'Device usage', 'Communication attempts']
    },
    {
        id: 'invigilator-tools',
        name: 'Invigilator Dashboard',
        description: 'Dedicated interface for invigilators to manage and respond to alerts efficiently',
        icon: UserGroupIcon,
        color: '#8B5CF6',
        features: ['Alert management', 'Student tracking', 'Communication tools', 'Report generation']
    },
    {
        id: 'reporting',
        name: 'Comprehensive Reporting',
        description: 'Detailed reports and analytics for examination authorities and administrators',
        icon: ChartBarIcon,
        color: '#06B6D4',
        features: ['Incident logs', 'Performance metrics', 'Student analytics', 'Export capabilities']
    },
    {
        id: 'security',
        name: 'Security & Privacy',
        description: 'Enterprise-grade security measures to protect student privacy and data integrity',
        icon: ShieldCheckIcon,
        color: '#EF4444',
        features: ['Data encryption', 'Access controls', 'Audit trails', 'GDPR compliance']
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
        >
            <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: colors.textPrimary }}>
                Core Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {APP_CHARACTERISTICS.map((characteristic, index) => (
                    <motion.div
                        key={characteristic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group p-6 rounded-2xl border transition-all duration-300 cursor-pointer"
                        style={{ 
                            borderColor: colors.borderColor,
                            backgroundColor: colors.surface,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        onClick={() => setActiveFeature(activeFeature === characteristic.id ? null : characteristic.id)}
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                style={{ backgroundColor: characteristic.color + '20' }}
                            >
                                <characteristic.icon className="w-6 h-6" style={{ color: characteristic.color }} />
                            </div>
                            <h4 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                                {characteristic.name}
                            </h4>
                        </div>
                        <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                            {characteristic.description}
                        </p>
                        
                        {/* Expandable Features */}
                        <AnimatePresence>
                            {activeFeature === characteristic.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-4 border-t"
                                    style={{ borderColor: colors.borderColor }}
                                >
                                    <p className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: colors.textSecondary }}>
                                        Key Capabilities
                                    </p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {characteristic.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center space-x-3 text-sm">
                                                <div 
                                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: characteristic.color }}
                                                ></div>
                                                <span style={{ color: colors.textPrimary }}>{feature}</span>
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