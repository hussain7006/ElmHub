import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../../../store/themeStore'
import {
    CheckCircleIcon,
    ClipboardDocumentIcon,
    DocumentTextIcon,
    PhotoIcon,
    UserIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import ImageCanvasDisplay from './ImageCanvasDisplay';
import ClassificationResultDisplay from './ClassificationResultDisplay';
import ObjectDetectionDisplay from './ObjectDetectionDisplay';
import KeypointDisplay from './KeypointDisplay';

export default function ApiResultsDisplay({ results, copyToClipboard }) {
    const { colors } = useThemeStore();
    const [activeTab, setActiveTab] = useState('json');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [detectedClasses, setDetectedClasses] = useState([]);
    const [classificationResult, setClassificationResult] = useState(null);
    const [keypointResult, setKeypointResult] = useState(null);

    // Color palette for different classes
    const colorPalette = [
        '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
        '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A', '#808080',
    ];

    // Create object URL when file changes
    useEffect(() => {
        if (results?.file) {
            const url = URL.createObjectURL(results.file);
            setImageUrl(url);
            setImageLoaded(false);
            setIsDrawing(false);

            // Reset states when new file is uploaded
            setClassificationResult(null);
            setDetectedClasses([]);
            setKeypointResult(null);

            // Cleanup previous URL
            return () => {
                if (url) URL.revokeObjectURL(url);
            };
        }
    }, [results?.file]);

    // Extract unique classes when results change
    useEffect(() => {
        if (results?.response && Array.isArray(results.response) && results.response.length > 0) {
            const firstResult = results.response[0];

            // Check if this is a classification result
            if (firstResult.type === 'classification') {
                setClassificationResult(firstResult);
                setDetectedClasses([]);
                setKeypointResult(null);
            } else if (firstResult.type === 'keypoints') {
                setKeypointResult(firstResult);
                setClassificationResult(null);
                setDetectedClasses([]);
            } else if (firstResult.class && Array.isArray(firstResult.class)) {
                const uniqueClasses = [...new Set(firstResult.class)];
                setDetectedClasses(uniqueClasses);
                setClassificationResult(null);
                setKeypointResult(null);
            }
        } else {
            // Clear states when no response data
            setClassificationResult(null);
            setDetectedClasses([]);
            setKeypointResult(null);
        }
    }, [results?.response]);

    // Handle drawing state
    useEffect(() => {
        if (activeTab === 'visual' && results?.response && imageUrl && imageLoaded) {
            setIsDrawing(true);
            setTimeout(() => {
                setIsDrawing(false);
            }, 500);
        }
    }, [activeTab, results?.response, imageUrl, imageLoaded]);

    const handleImageLoad = () => {
        console.log('Image loaded successfully');
        setImageLoaded(true);
    };

    // Handle tab change
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const tabs = [
        {
            id: 'json',
            name: 'JSON Output',
            icon: DocumentTextIcon,
            color: '#3B82F6'
        },
        {
            id: 'visual',
            name: classificationResult ? 'Classification Result' :
                keypointResult ? 'Keypoint Result' : 'Visual Output',
            icon: classificationResult ? UserIcon :
                keypointResult ? MapPinIcon : PhotoIcon,
            color: classificationResult ? '#EC4899' :
                keypointResult ? '#F59E0B' : '#10B981'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        API Response
                    </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(results.response)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ backgroundColor: colors.accent, color: 'white' }}
                >
                    <ClipboardDocumentIcon className="w-4 h-4" />
                </motion.button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 p-1 rounded-lg" style={{ backgroundColor: colors.background }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTabChange(tab.id);
                        }}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium \
                            transition-all duration-200 cursor-pointer hover:scale-105 transition-all duration-200
                            ${activeTab === tab.id ? 'text-white' : ''
                            }`}
                        style={{
                            backgroundColor: activeTab === tab.id ? tab.color : 'transparent',
                            color: activeTab === tab.id ? 'white' : colors.textSecondary
                        }}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className=''>{tab.name}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'json' && (
                    <motion.div
                        key="json"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="p-3 rounded-lg text-sm font-mono overflow-x-auto max-h-60 overflow-y-auto"
                        style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.textPrimary
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <pre className="whitespace-pre-wrap break-words">
                            {JSON.stringify(results.response, null, 2)}
                        </pre>
                    </motion.div>
                )}

                {activeTab === 'visual' && (
                    <motion.div
                        key="visual"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {results.file && imageUrl ? (
                            <div className={`flex gap-6 items-start ${classificationResult ? 'flex-col lg:flex-row justify-center' : 'flex-col lg:flex-row'}`}>
                                {/* Image Canvas Display */}
                                <ImageCanvasDisplay
                                    results={results}
                                    imageUrl={imageUrl}
                                    classificationResult={classificationResult}
                                    detectedClasses={detectedClasses}
                                    keypointResult={keypointResult}
                                    colorPalette={colorPalette}
                                    onImageLoad={handleImageLoad}
                                    isDrawing={isDrawing}
                                    imageLoaded={imageLoaded}
                                />

                                {/* Classification Result Display */}
                                {classificationResult && (
                                    <ClassificationResultDisplay
                                        classificationResult={classificationResult}
                                        colors={colors}
                                    />
                                )}

                                {/* Keypoint Result Display */}
                                {keypointResult && (
                                    <KeypointDisplay
                                        keypointResult={keypointResult}
                                        colors={colors}
                                    />
                                )}

                                {/* Object Detection Display */}
                                {!classificationResult && !keypointResult && detectedClasses.length > 0 && (
                                    <ObjectDetectionDisplay
                                        detectedClasses={detectedClasses}
                                        results={results}
                                        colors={colors}
                                        colorPalette={colorPalette}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="p-8 text-center rounded-lg border-2 border-dashed" style={{ borderColor: colors.borderColor }}>
                                <PhotoIcon className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textSecondary }} />
                                <p className="text-sm" style={{ color: colors.textSecondary }}>
                                    No image uploaded for visual display
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}