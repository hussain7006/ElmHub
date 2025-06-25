import React from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../../store/themeStore';

export default function ObjectDetectionDisplay({ detectedClasses, results, colors, colorPalette }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-60 w-full"
        >
            <div 
                className="rounded-lg border shadow-md overflow-hidden" 
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
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                        <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                            Detections
                        </h3>
                        <div 
                            className="ml-auto px-1.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                                backgroundColor: colors.accent + '20',
                                color: colors.accent
                            }}
                        >
                            {detectedClasses.length}
                        </div>
                    </div>
                </div>
                
                {/* Legend Items */}
                <div className="p-3 space-y-2">
                    {detectedClasses.map((className, index) => {
                        const color = colorPalette[index % colorPalette.length];
                        return (
                            <div
                                key={className}
                                className="group flex items-center space-x-3 p-2 rounded-md transition-all duration-200 hover:shadow-sm"
                                style={{ 
                                    backgroundColor: colors.background,
                                    border: `1px solid ${color}40`
                                }}
                            >
                                {/* Color Indicator */}
                                <div className="relative">
                                    <div
                                        className="w-4 h-4 rounded-md shadow-sm"
                                        style={{ backgroundColor: color }}
                                    ></div>
                                    <div 
                                        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        style={{ 
                                            background: `linear-gradient(45deg, ${color}, ${color}80)`,
                                            boxShadow: `0 0 0 1px ${color}60`
                                        }}
                                    ></div>
                                </div>
                                
                                {/* Class Name */}
                                <div className="flex-1 min-w-0">
                                    <span 
                                        className="text-xs font-medium block truncate"
                                        style={{ color: colors.textPrimary }}
                                    >
                                        {className.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </div>
                                
                                {/* Count Badge */}
                                <div 
                                    className="px-1.5 py-0.5 rounded-full text-xs font-medium"
                                    style={{ 
                                        backgroundColor: color + '20',
                                        color: color
                                    }}
                                >
                                    {results.response[0].class.filter(c => c === className).length}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Footer */}
                <div 
                    className="px-4 py-2 border-t" 
                    style={{ 
                        borderColor: colors.borderColor,
                        backgroundColor: colors.background + '80'
                    }}
                >
                    <div className="flex items-center justify-between text-xs" style={{ color: colors.textSecondary }}>
                        <span>Total</span>
                        <span className="font-semibold" style={{ color: colors.textPrimary }}>
                            {results.response[0].xyxy.length}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}