import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, XCircleIcon, PlayIcon } from '@heroicons/react/24/outline';
import useThemeStore from '../../../../store/themeStore';
import ApiResultsDisplay from './ApiResultsDisplay';

export default function ApiTestingCard({
    apis,
    handleApiClick,
    handleFileChange,
    testApi,
    copyToClipboard,
    expandedApi,
    results,
    loading,
    errors
}) {
    const { colors } = useThemeStore();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const expandVariants = {
        collapsed: { height: 0, opacity: 0 },
        expanded: { height: "auto", opacity: 1 }
    };


    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3 sm:gap-4"
        >
            {Object.entries(apis.endpoints).map(([key, api]) => (
                <motion.div
                    key={key}
                    id={key}
                    variants={cardVariants}
                    className="relative"
                >
                    {/* Main Card */}
                    <motion.div
                        // whileHover={{ scale: 1.02 }}
                        // whileTap={{ scale: 0.98 }}
                        // onClick={() => handleApiClick(key)}
                        className={`rounded-lg sm:rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${expandedApi === key ? 'ring-2' : ''
                            }`}
                        style={{
                            backgroundColor: colors.surface,
                            borderColor: expandedApi === key ? api.color : colors.borderColor,
                            border: expandedApi === key ? '2px solid' : '1px solid'
                        }}
                    >
                        {/* Card Header */}
                        <div className="p-3 sm:p-4 cursor-pointer "
                            onClick={() => handleApiClick(key)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 flex-1">
                                    <div
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: api.color }}
                                    >
                                        <api.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className="text-sm sm:text-base font-semibold mb-1 truncate opacity-90"
                                            style={{ color: colors.textPrimary }}
                                        >
                                            {api.name}
                                        </h3>
                                        <p
                                            className="text-xs sm:text-smtext-gray-600 line-clamp-2 font-semibold"
                                            style={{ color: colors.textSecondary }}
                                        >
                                            {api.description}
                                        </p>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ rotate: expandedApi === key ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0 ml-2"
                                >
                                    <ChevronDownIcon
                                        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 cursor-pointer"
                                        style={{ color: colors.textSecondary }}
                                        onClick={() => handleApiClick(key)}
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Expandable Content */}
                        <AnimatePresence>
                            {expandedApi === key && (
                                <motion.div
                                    variants={expandVariants}
                                    initial="collapsed"
                                    animate="expanded"
                                    exit="collapsed"
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="border-t"
                                    style={{ borderColor: colors.borderColor }}
                                >
                                    <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 sm:space-y-4">
                                        {/* File Upload */}
                                        <div>
                                            <label
                                                className="block text-xs sm:text-sm font-medium mb-2"
                                                style={{ color: colors.textPrimary }}
                                            >
                                                Upload Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(key, e)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="block w-full text-xs border-2 border-dashed rounded-lg cursor-pointer transition-colors p-2 sm:p-3 md:p-4"
                                                style={{
                                                    borderColor: colors.borderColor,
                                                    backgroundColor: colors.inputBackground,
                                                    color: colors.textPrimary
                                                }}
                                            />
                                            {results[key]?.file && (
                                                <p
                                                    className="text-xs sm:text-sm md:text-base mt-2"
                                                    style={{ color: colors.accent }}
                                                >
                                                    ✓ {results[key].file.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Test Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                testApi(key);
                                            }}
                                            disabled={loading === key || !results[key]?.file}
                                            className="w-full py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base cursor-pointer"
                                            style={{
                                                backgroundColor: loading === key ? colors.textSecondary : api.color,
                                                color: 'white'
                                            }}
                                        >
                                            {loading === key ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    <span>Testing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                                    <span>Test API</span>
                                                </>
                                            )}
                                        </motion.button>

                                        {/* Error Display */}
                                        <AnimatePresence>
                                            {errors[key] && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="p-2 sm:p-3 md:p-4 rounded-lg flex items-center space-x-2"
                                                    style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5' }}
                                                >
                                                    <XCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" />
                                                    <span className="text-xs sm:text-sm md:text-base text-red-800">{errors[key]}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Results Display */}
                                        <AnimatePresence>
                                            {results[key]?.response && (
                                                <ApiResultsDisplay
                                                    results={results[key]}
                                                    copyToClipboard={copyToClipboard}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>
    )
}