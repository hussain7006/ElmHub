import React from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../../../../store/themeStore';
import {
    CpuChipIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

// Application overview data
const APP_OVERVIEW = {
    technology: 'AI & Computer Vision',
    deployment: 'Cloud & On-Premise',
    scalability: 'Up to 1000+ students',
    accuracy: '98.5% detection rate',
    compliance: 'GDPR & FERPA',
    integration: 'LMS & SIS Systems'
};

export default function TechnicalSpecs() {
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
                    { label: 'Technology', value: APP_OVERVIEW.technology, icon: CpuChipIcon, color: '#3B82F6' },
                    { label: 'Deployment', value: APP_OVERVIEW.deployment, icon: ShieldCheckIcon, color: '#10B981' },
                    { label: 'Scalability', value: APP_OVERVIEW.scalability, icon: UserGroupIcon, color: '#F59E0B' },
                    { label: 'Accuracy', value: APP_OVERVIEW.accuracy, icon: CheckCircleIcon, color: '#EF4444' },
                    { label: 'Compliance', value: APP_OVERVIEW.compliance, icon: ShieldCheckIcon, color: '#8B5CF6' },
                    { label: 'Integration', value: APP_OVERVIEW.integration, icon: ChartBarIcon, color: '#06B6D4' }
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