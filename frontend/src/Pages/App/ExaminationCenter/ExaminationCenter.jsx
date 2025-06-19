import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../../store/themeStore';
import {
    EyeIcon,
    UserIcon,
    DevicePhoneMobileIcon,
    IdentificationIcon,
    BeakerIcon,
    MapPinIcon,
    PlayIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClipboardDocumentIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';

export default function ExaminationCenter() {
    const { colors } = useThemeStore();
    const [expandedApi, setExpandedApi] = useState(null);
    const [loading, setLoading] = useState(null);
    const [results, setResults] = useState({});
    const [errors, setErrors] = useState({});

    const apis = {
        url: "http://localhost:3000/api/v1",
        endpoints: {
            head: {
                name: "Head Detection",
                description: "Detect and analyze head positions and movements in real-time",
                icon: EyeIcon,
                color: "#3B82F6",
                parameters: {
                    image: { type: "file", label: "Upload Image", required: true }
                }
            },
            standing: {
                name: "Standing Detection",
                description: "Identify standing posture and body positioning analysis",
                icon: UserIcon,
                color: "#10B981",
                parameters: {
                    image: { type: "file", label: "Upload Image", required: true }
                }
            },
            mobile: {
                name: "Mobile Device Detection",
                description: "Detect mobile phones and electronic devices in images",
                icon: DevicePhoneMobileIcon,
                color: "#F59E0B",
                parameters: {
                    image: { type: "file", label: "Upload Image", required: true }
                }
            },
            idCard: {
                name: "ID Card Detection",
                description: "Extract and validate information from identification cards",
                icon: IdentificationIcon,
                color: "#8B5CF6",
                parameters: {
                    image: { type: "file", label: "Upload Image", required: true }
                }
            },
            waterBottle: {
                name: "Water Bottle Detection",
                description: "Identify water bottles and liquid containers in images",
                icon: BeakerIcon,
                color: "#06B6D4",
                parameters: {
                    image: { type: "file", label: "Upload Image", required: true }
                }
            },
            keyPoint: {
                name: "Key Point Detection",
                description: "Detect and track key points and landmarks in images",
                icon: MapPinIcon,
                color: "#EF4444",
                parameters: {
                    image: { type: "file", label: "Upload Image", required: true }
                }
            }
        }
    };

    const handleApiClick = (apiKey) => {
        setExpandedApi(expandedApi === apiKey ? null : apiKey);
        if (expandedApi === apiKey) {
            // Clear results when collapsing
            setResults(prev => ({ ...prev, [apiKey]: null }));
            setErrors(prev => ({ ...prev, [apiKey]: null }));
        }
    };

    const handleFileChange = (apiKey, event) => {
        const file = event.target.files[0];
        if (file) {
            // Store file for API call
            setResults(prev => ({ 
                ...prev, 
                [apiKey]: { ...prev[apiKey], file } 
            }));
        }
    };

    const testApi = async (apiKey) => {
        const api = apis.endpoints[apiKey];
        const file = results[apiKey]?.file;

        if (!file) {
            setErrors(prev => ({ 
                ...prev, 
                [apiKey]: "Please upload an image first" 
            }));
            return;
        }

        setLoading(apiKey);
        setErrors(prev => ({ ...prev, [apiKey]: null }));

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${apis.url}${apis.endpoints[apiKey].endpoint || `/${apiKey}`}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResults(prev => ({ 
                ...prev, 
                [apiKey]: { ...prev[apiKey], response: data } 
            }));
        } catch (error) {
            setErrors(prev => ({ 
                ...prev, 
                [apiKey]: error.message || "Failed to test API" 
            }));
        } finally {
            setLoading(null);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    };

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
        <div className="p-3 sm:p-4 md:p-6 mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-4 sm:mb-6"
            >
                <h1 
                    className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3"
                    style={{ color: colors.textPrimary }}
                >
                    API Testing Center
                </h1>
                <p 
                    className="text-xs sm:text-sm px-2 sm:px-4 font-semibold"
                    style={{ color: colors.textSecondary }}
                >
                    Test and validate our AI-powered detection APIs with real-time results
                </p>
            </motion.div>

            {/* API Cards Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-3 sm:gap-4"
            >
                {Object.entries(apis.endpoints).map(([key, api]) => (
                    <motion.div
                        key={key}
                        variants={cardVariants}
                        className="relative"
                    >
                        {/* Main Card */}
                        <motion.div
                            // whileHover={{ scale: 1.02 }}
                            // whileTap={{ scale: 0.98 }}
                            onClick={() => handleApiClick(key)}
                            className={`cursor-pointer rounded-lg sm:rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                                expandedApi === key ? 'ring-2' : ''
                            }`}
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: expandedApi === key ? api.color : colors.borderColor,
                                border: expandedApi === key ? '2px solid' : '1px solid'
                            }}
                        >
                            {/* Card Header */}
                            <div className="p-3 sm:p-4">
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
                                            className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                                            style={{ color: colors.textSecondary }}
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
                                                className="w-full py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
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
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-2 sm:space-y-3"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                                                                <span 
                                                                    className="text-xs sm:text-sm md:text-base font-medium"
                                                                    style={{ color: colors.textPrimary }}
                                                                >
                                                                    API Response
                                                                </span>
                                                            </div>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    copyToClipboard(results[key].response);
                                                                }}
                                                                className="p-1 sm:p-1.5 md:p-2 rounded-lg transition-colors"
                                                                style={{ backgroundColor: colors.accent, color: 'white' }}
                                                            >
                                                                <ClipboardDocumentIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                                                            </motion.button>
                                                        </div>
                                                        
                                                        <div 
                                                            className="p-2 sm:p-3 md:p-4 rounded-lg text-xs sm:text-sm md:text-base font-mono overflow-x-auto max-h-48 sm:max-h-60 md:max-h-80 overflow-y-auto"
                                                            style={{ 
                                                                backgroundColor: colors.background,
                                                                border: `1px solid ${colors.borderColor}`,
                                                                color: colors.textPrimary
                                                            }}
                                                        >
                                                            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(results[key].response, null, 2)}</pre>
                                                        </div>
                                                    </motion.div>
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
        </div>
    );
}