import { motion } from 'framer-motion';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function KeypointDisplay({ keypointResult, colors }) {
    const totalPoints = keypointResult.xy.reduce((total, person) => total + person.length, 0);
    const totalPeople = keypointResult.xy.length;

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
                        <MapPinIcon className="w-5 h-5" style={{ color: '#F59E0B' }} />
                        <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                            Keypoint Detection
                        </h3>
                    </div>
                </div>
                
                {/* Keypoint Details */}
                <div className="p-4 space-y-3">
                    {/* Summary */}
                    <div className="text-center">
                        <div 
                            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
                            style={{ 
                                background: `linear-gradient(135deg, #F59E0B, #EF4444)`,
                                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                            }}
                        >
                            <MapPinIcon className="w-6 h-6 text-white" />
                        </div>
                        <h4 
                            className="text-2xl font-bold mb-1"
                            style={{ color: colors.textPrimary }}
                        >
                            {totalPoints}
                        </h4>
                        <p 
                            className="text-sm"
                            style={{ color: colors.textSecondary }}
                        >
                            Total Keypoints
                        </p>
                    </div>

                    {/* Statistics */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span style={{ color: colors.textSecondary }}>People Detected:</span>
                            <span className="font-semibold" style={{ color: colors.textPrimary }}>
                                {totalPeople}
                            </span>
                        </div>
                    </div>

                    {/* People Breakdown */}
                    <div className="pt-3 border-t" style={{ borderColor: colors.borderColor }}>
                        <h5 className="text-xs font-medium mb-2" style={{ color: colors.textPrimary }}>
                            Keypoints per Person
                        </h5>
                        <div className="space-y-1">
                            {keypointResult.xy.map((person, index) => (
                                <div key={index} className="flex justify-between text-xs">
                                    <span style={{ color: colors.textSecondary }}>
                                        Person {index + 1}:
                                    </span>
                                    <span className="font-medium" style={{ color: colors.textPrimary }}>
                                        {person.length} points
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-2 border-t" style={{ borderColor: colors.borderColor }}>
                        <div className="grid grid-cols-1 gap-2 text-xs">
                            <div>
                                <span style={{ color: colors.textSecondary }}>Type:</span>
                                <div className="font-medium" style={{ color: colors.textPrimary }}>
                                    {keypointResult.type}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 