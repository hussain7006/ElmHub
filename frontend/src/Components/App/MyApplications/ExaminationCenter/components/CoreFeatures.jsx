import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../../../../store/themeStore';
import useSearchStore from '../../../../../store/searchStore';
import { getApplicationFeatures } from '../../../../../Constants/applications';

export default function CoreFeatures() {
    const { colors } = useThemeStore();
    const { searchQuery, isFiltering } = useSearchStore();
    const [activeFeature, setActiveFeature] = useState(null);

    // Get features from the new applications structure
    const allFeatures = getApplicationFeatures('examination');

    // Filter features based on search
    const filteredFeatures = useMemo(() => {
        if (!isFiltering || !searchQuery.trim()) return allFeatures;
        
        const searchTerm = searchQuery.toLowerCase().trim();
        return allFeatures.filter(feature => {
            const nameMatch = feature.name.toLowerCase().includes(searchTerm);
            const descriptionMatch = feature.description.toLowerCase().includes(searchTerm);
            const tagsMatch = feature.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const capabilitiesMatch = feature.capabilities.some(cap => cap.toLowerCase().includes(searchTerm));
            
            return nameMatch || descriptionMatch || tagsMatch || capabilitiesMatch;
        });
    }, [isFiltering, searchQuery, allFeatures]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: colors.textPrimary }}>
                Core Features
            </h3>
            {filteredFeatures.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-lg" style={{ color: colors.textSecondary }}>
                        No features found matching "{searchQuery}"
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFeatures.map((feature, index) => (
                        <motion.div
                            key={feature.id}
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
                            onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div 
                                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: feature.color + '20' }}
                                >
                                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                                </div>
                                <h4 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                                    {feature.name}
                                </h4>
                            </div>
                            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                                {feature.description}
                            </p>
                            
                            {/* Expandable Features */}
                            <AnimatePresence>
                                {activeFeature === feature.id && (
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
                                            {feature.capabilities.map((capability, idx) => (
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
            )}
        </motion.div>
    );
} 