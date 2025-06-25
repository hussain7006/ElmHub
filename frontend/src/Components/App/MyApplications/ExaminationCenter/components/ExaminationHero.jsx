import React from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../../../../store/themeStore';

export default function ExaminationHero() {
    const { colors } = useThemeStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
        >
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                AI-Powered Examination Monitoring
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
                Advanced computer vision and machine learning technology to ensure academic integrity 
                and detect suspicious behavior during examinations.
            </p>
        </motion.div>
    );
} 