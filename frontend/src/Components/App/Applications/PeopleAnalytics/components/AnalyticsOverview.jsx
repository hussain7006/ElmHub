import React from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../../../../store/themeStore';
import {
    CpuChipIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ChartBarIcon,
    CameraIcon
} from '@heroicons/react/24/outline';

// Application overview data
const ANALYTICS_OVERVIEW = {
    technology: 'AI & Computer Vision',
    deployment: 'Cloud & On-Premise',
    accuracy: '99.2% detection rate',
    privacy: 'GDPR Compliant',
    scalability: 'Multi-location support',
    integration: 'Museum Management Systems'
};

export default function AnalyticsOverview() {
    const { colors } = useThemeStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-8 rounded-2xl border"
            style={{ 
                borderColor: colors.borderColor,
                backgroundColor: colors.surface
            }}
        >
            <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: colors.textPrimary }}>
                Technical Specifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                    { label: 'Technology', value: ANALYTICS_OVERVIEW.technology, icon: CpuChipIcon, color: '#3B82F6' },
                    { label: 'Deployment', value: ANALYTICS_OVERVIEW.deployment, icon: ShieldCheckIcon, color: '#10B981' },
                    { label: 'Accuracy', value: ANALYTICS_OVERVIEW.accuracy, icon: CheckCircleIcon, color: '#F59E0B' },
                    { label: 'Privacy', value: ANALYTICS_OVERVIEW.privacy, icon: ShieldCheckIcon, color: '#8B5CF6' },
                    { label: 'Scalability', value: ANALYTICS_OVERVIEW.scalability, icon: UserGroupIcon, color: '#06B6D4' },
                    { label: 'Integration', value: ANALYTICS_OVERVIEW.integration, icon: ChartBarIcon, color: '#EF4444' }
                ].map((spec, index) => (
                    <motion.div
                        key={spec.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="text-center"
                    >
                        <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                            style={{ backgroundColor: spec.color + '20' }}
                        >
                            <spec.icon className="w-6 h-6" style={{ color: spec.color }} />
                        </div>
                        <p className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                            {spec.value}
                        </p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>
                            {spec.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
} 