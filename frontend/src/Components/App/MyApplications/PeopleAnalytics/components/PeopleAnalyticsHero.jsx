import React from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../../../../store/themeStore';

export default function PeopleAnalyticsHero() {
    const { colors } = useThemeStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8 mb-0"
        >
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                Advanced People Analytics & Detection
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
                AI-powered people detection and analytics system for visitor tracking, demographic analysis, 
                and intelligent person search capabilities in museums and public spaces.
            </p>
        </motion.div>
    );
} 