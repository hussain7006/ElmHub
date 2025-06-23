import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../../store/themeStore';
import {
    CheckCircleIcon,
    ClipboardDocumentIcon,
    DocumentTextIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

export default function ApiResultsDisplay({ results, copyToClipboard }) {
    const { colors } = useThemeStore();
    const [activeTab, setActiveTab] = useState('json');
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [detectedClasses, setDetectedClasses] = useState([]);

    // Color palette for different classes
    const colorPalette = [
        '#FF0000', // Red
        '#00FF00', // Green
        '#0000FF', // Blue
        '#FFFF00', // Yellow
        '#FF00FF', // Magenta
        '#00FFFF', // Cyan
        '#FFA500', // Orange
        '#800080', // Purple
        '#008000', // Dark Green
        '#FFC0CB', // Pink
        '#A52A2A', // Brown
        '#808080', // Gray
    ];

    // Create object URL when file changes
    useEffect(() => {
        if (results?.file) {
            const url = URL.createObjectURL(results.file);
            setImageUrl(url);
            setImageLoaded(false);
            setIsDrawing(false);

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
            if (firstResult.class && Array.isArray(firstResult.class)) {
                const uniqueClasses = [...new Set(firstResult.class)];
                setDetectedClasses(uniqueClasses);
            }
        }
    }, [results?.response]);

    // Draw bounding boxes on canvas when results change
    useEffect(() => {
        if (activeTab === 'visual' && results?.response && imageUrl && imageLoaded) {
            setIsDrawing(true);
            // Small delay to ensure canvas is ready
            setTimeout(() => {
                drawBoundingBoxes();
                setIsDrawing(false);
            }, 500);
        }
    }, [activeTab, results, imageUrl, imageLoaded]);

    // Force redraw when switching to visual tab
    useEffect(() => {
        if (activeTab === 'visual' && results?.response && imageUrl && imageLoaded) {
            setIsDrawing(true);
            // Force redraw when switching to visual tab
            const timer = setTimeout(() => {
                drawBoundingBoxes();
                setIsDrawing(false);
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [activeTab]);

    // Additional effect to ensure redraw when visual tab is active
    useEffect(() => {
        if (activeTab === 'visual') {
            // Force a redraw whenever visual tab is active
            const timer = setTimeout(() => {
                if (results?.response && imageUrl && imageLoaded) {
                    setIsDrawing(true);
                    drawBoundingBoxes();
                    setIsDrawing(false);
                }
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [activeTab, results?.response, imageUrl, imageLoaded]);

    const handleImageLoad = () => {
        console.log('Image loaded successfully');
        setImageLoaded(true);
    };

    const drawBoundingBoxes = () => {
        const canvas = canvasRef.current;
        const image = imageRef.current;

        if (!canvas || !image || !results.response) {
            console.log('Missing required elements:', { canvas: !!canvas, image: !!image, response: !!results.response });
            return;
        }

        console.log('Drawing bounding boxes...');
        console.log('Full response:', results.response);

        const ctx = canvas.getContext('2d');

        // Fixed canvas width
        const fixedWidth = 600; // Fixed width in pixels

        console.log('Fixed canvas width:', fixedWidth);
        console.log('Image natural size:', image.naturalWidth, 'x', image.naturalHeight);

        // Calculate height to maintain aspect ratio
        const aspectRatio = image.naturalHeight / image.naturalWidth;
        const canvasHeight = fixedWidth * aspectRatio;

        console.log('Aspect ratio:', aspectRatio);
        console.log('Calculated canvas height:', canvasHeight);

        // Set canvas size with fixed width and calculated height
        canvas.width = fixedWidth;
        canvas.height = canvasHeight;

        console.log('Canvas size set to:', canvas.width, 'x', canvas.height);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the image maintaining aspect ratio
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        console.log('Image drawn on canvas');
        console.log("results.response", results.response);

        // Safety checks for response structure
        if (!Array.isArray(results.response) || results.response.length === 0) {
            console.log('Response is not an array or is empty');
            return;
        }

        const firstResult = results.response[0];
        if (!firstResult || typeof firstResult !== 'object') {
            console.log('First result is not a valid object');
            return;
        }

        // Calculate scale factor for bounding boxes
        const scaleX = canvas.width / image.naturalWidth;
        const scaleY = canvas.height / image.naturalHeight;

        console.log('Scale factors:', { scaleX, scaleY });

        // Draw bounding boxes using original coordinates, then scale
        if (firstResult.xyxy && Array.isArray(firstResult.xyxy)) {
            console.log('Drawing boxes:', firstResult.xyxy);
            console.log('Number of boxes:', firstResult.xyxy.length);

            firstResult.xyxy.forEach((box, index) => {
                try {
                    if (!Array.isArray(box) || box.length !== 4) {
                        console.log(`Invalid box ${index}:`, box);
                        return;
                    }

                    const [x1, y1, x2, y2] = box;

                    // Validate coordinates are numbers
                    if (typeof x1 !== 'number' || typeof y1 !== 'number' ||
                        typeof x2 !== 'number' || typeof y2 !== 'number') {
                        console.log(`Invalid coordinates in box ${index}:`, box);
                        return;
                    }

                    // Scale the coordinates to match the canvas size
                    const scaledX1 = x1 * scaleX;
                    const scaledY1 = y1 * scaleY;
                    const scaledX2 = x2 * scaleX;
                    const scaledY2 = y2 * scaleY;

                    const width = scaledX2 - scaledX1;
                    const height = scaledY2 - scaledY1;

                    console.log(`Box ${index}:`, {
                        original: { x1, y1, x2, y2 },
                        scaled: { scaledX1, scaledY1, width, height }
                    });

                    // Get class and assign color
                    const className = firstResult.class?.[index] || `class_${index}`;
                    const classIndex = detectedClasses.indexOf(className);
                    const boxColor = colorPalette[classIndex % colorPalette.length] || '#FF0000';

                    console.log(`Box ${index} class: ${className}, color: ${boxColor}`);

                    // Draw rectangle with color coding
                    ctx.strokeStyle = boxColor;
                    ctx.lineWidth = Math.max(2, 3);
                    ctx.strokeRect(scaledX1, scaledY1, width, height);
                    console.log(`Drew rectangle for box ${index} with color ${boxColor}`);

                } catch (error) {
                    console.error(`Error drawing box ${index}:`, error);
                }
            });
        } else {
            console.log('No valid xyxy data found in response');
            if (firstResult) {
                console.log('Response structure:', Object.keys(firstResult));
            }
        }
    };

    // Handle tab change specifically
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // If switching to visual tab, ensure redraw
        if (tabId === 'visual' && results?.response && imageUrl && imageLoaded) {
            setTimeout(() => {
                drawBoundingBoxes();
            }, 500);
        }
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
            name: 'Visual Output',
            icon: PhotoIcon,
            color: '#10B981'
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
                            <div className="flex flex-col lg:flex-row gap-6 items-start">
                                {/* Image Container */}
                                <div className="flex-1 relative min-w-0">
                                    <canvas
                                        key={`canvas-${activeTab}-${imageLoaded}`}
                                        ref={canvasRef}
                                        className="w-full max-w-[600px] h-auto rounded-lg border mx-auto block"
                                        style={{ borderColor: colors.borderColor }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <img
                                        ref={imageRef}
                                        src={imageUrl}
                                        alt="Uploaded image"
                                        className="hidden"
                                        onLoad={handleImageLoad}
                                        onError={(e) => console.error('Image failed to load:', e)}
                                    />
                                    {(!imageLoaded || isDrawing) && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg">
                                            <div className="text-center">
                                                <div className="relative">
                                                    {/* Outer ring */}
                                                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                                                    {/* Animated inner ring */}
                                                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                                                    {/* Center dot */}
                                                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-3 font-medium">
                                                    {!imageLoaded ? 'Loading image...' : 'Drawing bounding boxes...'}
                                                </p>
                                                {isDrawing && (
                                                    <div className="flex space-x-1 mt-2 justify-center">
                                                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                                                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Legend */}
                                {detectedClasses.length > 0 && (
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