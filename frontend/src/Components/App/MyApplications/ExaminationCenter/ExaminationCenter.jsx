import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../../../store/themeStore';
import ExaminationHero from './components/ExaminationHero';
import CoreFeatures from './components/CoreFeatures';
import TechnicalSpecs from './components/TechnicalSpecs';

export default function ExaminationCenter() {
    const { colors } = useThemeStore();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg" style={{ color: colors.textSecondary }}>
                        Initializing Examination Center...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto space-y-8">
                <ExaminationHero />
                <CoreFeatures />
                <TechnicalSpecs />
            </div>
        </div>
    );
} 