import React from 'react';
import { motion } from 'framer-motion';
import { UserIcon } from '@heroicons/react/24/outline';
import useThemeStore from '../../../store/themeStore';

export default function ClassificationResultDisplay({ classificationResult, colors }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-64 flex justify-center"
        >
            <div 
                className="rounded-lg border shadow-md overflow-hidden w-full max-w-sm" 
                style={{ 
                    borderColor: colors.borderColor,
                    backgroundColor: colors.background
                }}
            >
                {/* Header */}
                <div 
                    className="px-4 py-3 border-b" 
                    style={{ 
                        borderColor: colors.borderColor, 
                        backgroundColor: colors.background 
                    }}
                >
                    <div className="flex items-center space-x-2">
                        <UserIcon className="w-5 h-5" style={{ color: '#EC4899' }} />
                        <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                            Gender Classification
                        </h3>
                    </div>
                </div>
                
                {/* Classification Details */}
                <div className="p-4 space-y-3">
                    {/* Gender Result */}
                    <div className="text-center">
                        <div 
                            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
                            style={{ 
                                background: `linear-gradient(135deg, #3B82F6, #EC4899)`,
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                            }}
                        >
                            <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <h4 
                            className="text-2xl font-bold mb-1"
                            style={{ color: colors.textPrimary }}
                        >
                            {classificationResult.label}
                        </h4>
                        <p 
                            className="text-sm"
                            style={{ color: colors.textSecondary }}
                        >
                            Detected Gender
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-3 border-t" style={{ borderColor: colors.borderColor }}>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span style={{ color: colors.textSecondary }}>Type:</span>
                                <div className="font-medium" style={{ color: colors.textPrimary }}>
                                    {classificationResult.type}
                                </div>
                            </div>
                            <div>
                                <span style={{ color: colors.textSecondary }}>Probability:</span>
                                <div className="font-medium" style={{ color: colors.textPrimary }}>
                                    {classificationResult.prob}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 