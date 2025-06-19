import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useThemeStore from '../../../store/themeStore';
import {
    BeakerIcon,
    ClipboardDocumentListIcon,
    PlayIcon,
    PauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    ArrowLeftIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    ClockIcon,
    UserIcon,
    CpuChipIcon,
    EyeIcon,
    DevicePhoneMobileIcon,
    IdentificationIcon,
    MapPinIcon,
    VideoCameraIcon,
    DocumentTextIcon,
    ChartBarIcon,
    CogIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import {demos} from "../../../Constants/demos"

export default function DemoCenter() {
    const { colors } = useThemeStore();
    const navigate = useNavigate();
    const { demoType: routeDemoType } = useParams();
    const location = useLocation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedDemo, setSelectedDemo] = useState('basic'); // Default to first demo
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Demo configurations with nested structure
    // const demos = {
    //     'examination-center': {
    //         title: "Examination Center",
    //         subtitle: "AI-Powered Detection & Analysis",
    //         icon: BeakerIcon,
    //         color: "#3B82F6",
    //         description: "Experience our comprehensive AI detection system that can identify and analyze various objects and patterns in real-time.",
    //         demos: {
    //             '1': {
    //                 name: "Basic Demo",
    //                 subtitle: "Introduction to AI Detection",
    //                 description: "Get started with our AI detection system through this comprehensive introduction.",
    //                 duration: "3-5 minutes",
    //                 difficulty: "Beginner",
    //                 thumbnailImage: "/images/thumbnail/examinationCenter/1.png",
    //                 features: [
    //                     "Head Detection Overview",
    //                     "Basic Image Processing",
    //                     "Simple Detection Results"
    //                 ],
    //                 requirements: [
    //                     "Modern web browser",
    //                     "Stable internet connection"
    //                 ],
    //                 instructions: [
    //                     "Watch the introduction video",
    //                     "Learn about basic detection features",
    //                     "Understand the user interface"
    //                 ],
    //                 videoUrl: "/videos/examinationCenter/1.mp4",
    //                 technicalSpecs: {
    //                     "API Endpoints": "2 Basic endpoints",
    //                     "Response Time": "< 1 second",
    //                     "Accuracy": "90%+ detection rate"
    //                 }
    //             },
    //             '2': {
    //                 name: "API Testing Demo",
    //                 subtitle: "Interactive API Testing",
    //                 description: "Test our AI detection APIs with real-time image uploads and instant results.",
    //                 duration: "5-8 minutes",
    //                 difficulty: "Intermediate",
    //                 thumbnailImage: "/images/thumbnail/examinationCenter/2.png",
    //                 features: [
    //                     "Real-time API Testing",
    //                     "Image Upload & Processing",
    //                     "Detailed Results Analysis",
    //                     "Error Handling"
    //                 ],
    //                 requirements: [
    //                     "Modern web browser",
    //                     "Stable internet connection",
    //                     "Sample images for testing"
    //                 ],
    //                 instructions: [
    //                     "Upload test images",
    //                     "Test different API endpoints",
    //                     "Analyze detection results",
    //                     "Review error scenarios"
    //                 ],
    //                 videoUrl: "/videos/examinationCenter/2.mp4",
    //                 technicalSpecs: {
    //                     "API Endpoints": "6 RESTful endpoints",
    //                     "Response Time": "< 2 seconds",
    //                     "Accuracy": "95%+ detection rate",
    //                     "Supported Formats": "JPEG, PNG, WebP",
    //                     "Max File Size": "10MB per image"
    //                 }
    //             },
    //             '3': {
    //                 name: "Real-time Demo",
    //                 subtitle: "Live Detection Processing",
    //                 description: "Experience real-time AI detection with live video feeds and instant processing.",
    //                 duration: "8-12 minutes",
    //                 difficulty: "Advanced",
    //                 thumbnailImage: "/images/thumbnail/examinationCenter/3.png",
    //                 features: [
    //                     "Live Video Processing",
    //                     "Real-time Detection",
    //                     "Multi-object Tracking",
    //                     "Performance Monitoring"
    //                 ],
    //                 requirements: [
    //                     "Modern web browser",
    //                     "High-speed internet",
    //                     "Webcam access (optional)"
    //                 ],
    //                 instructions: [
    //                     "Connect to live video feed",
    //                     "Observe real-time processing",
    //                     "Monitor detection accuracy",
    //                     "Analyze performance metrics"
    //                 ],
    //                 videoUrl: "/videos/examinationCenter/3.mp4",
    //                 technicalSpecs: {
    //                     "Processing Speed": "Real-time (30 FPS)",
    //                     "Detection Range": "Multiple objects",
    //                     "Accuracy": "97%+ detection rate",
    //                     "Latency": "< 100ms"
    //                 }
    //             },
    //             '4': {
    //                 name: "Real-time Demo",
    //                 subtitle: "Live Detection Processing",
    //                 description: "Experience real-time AI detection with live video feeds and instant processing.",
    //                 duration: "8-12 minutes",
    //                 difficulty: "Advanced",
    //                 thumbnailImage: "/images/thumbnail/examinationCenter/3.png",
    //                 features: [
    //                     "Live Video Processing",
    //                     "Real-time Detection",
    //                     "Multi-object Tracking",
    //                     "Performance Monitoring"
    //                 ],
    //                 requirements: [
    //                     "Modern web browser",
    //                     "High-speed internet",
    //                     "Webcam access (optional)"
    //                 ],
    //                 instructions: [
    //                     "Connect to live video feed",
    //                     "Observe real-time processing",
    //                     "Monitor detection accuracy",
    //                     "Analyze performance metrics"
    //                 ],
    //                 videoUrl: "/videos/examinationCenter/3.mp4",
    //                 technicalSpecs: {
    //                     "Processing Speed": "Real-time (30 FPS)",
    //                     "Detection Range": "Multiple objects",
    //                     "Accuracy": "97%+ detection rate",
    //                     "Latency": "< 100ms"
    //                 }
    //             },
    //             '5': {
    //                 name: "Real-time Demo",
    //                 subtitle: "Live Detection Processing",
    //                 description: "Experience real-time AI detection with live video feeds and instant processing.",
    //                 duration: "8-12 minutes",
    //                 difficulty: "Advanced",
    //                 thumbnailImage: "/images/thumbnail/examinationCenter/3.png",
    //                 features: [
    //                     "Live Video Processing",
    //                     "Real-time Detection",
    //                     "Multi-object Tracking",
    //                     "Performance Monitoring"
    //                 ],
    //                 requirements: [
    //                     "Modern web browser",
    //                     "High-speed internet",
    //                     "Webcam access (optional)"
    //                 ],
    //                 instructions: [
    //                     "Connect to live video feed",
    //                     "Observe real-time processing",
    //                     "Monitor detection accuracy",
    //                     "Analyze performance metrics"
    //                 ],
    //                 videoUrl: "/videos/examinationCenter/3.mp4",
    //                 technicalSpecs: {
    //                     "Processing Speed": "Real-time (30 FPS)",
    //                     "Detection Range": "Multiple objects",
    //                     "Accuracy": "97%+ detection rate",
    //                     "Latency": "< 100ms"
    //                 }
    //             }
    //         }
    //     },
    //     'people-analytics': {
    //         title: "People Analytics",
    //         subtitle: "Advanced Human Behavior Analysis",
    //         icon: ClipboardDocumentListIcon,
    //         color: "#10B981",
    //         description: "Discover how our AI system analyzes human behavior patterns, crowd dynamics, and social interactions in real-time.",
    //         demos: {
    //             'overview': {
    //                 name: "Overview Demo",
    //                 subtitle: "Introduction to People Analytics",
    //                 description: "Learn about our people analytics capabilities and use cases.",
    //                 duration: "4-6 minutes",
    //                 difficulty: "Beginner",
    //                 thumbnailImage: "/images/thumbnail/examinationCenter/1.png",
    //                 features: [
    //                     "Behavioral Analysis Overview",
    //                     "Crowd Detection Basics",
    //                     "Analytics Dashboard Preview"
    //                 ],
    //                 requirements: [
    //                     "Modern web browser",
    //                     "Stable internet connection"
    //                 ],
    //                 instructions: [
    //                     "Watch the overview presentation",
    //                     "Understand use cases",
    //                     "Explore dashboard features"
    //                 ],
    //                 videoUrl: "https://example.com/analytics-overview-demo.mp4",
    //                 technicalSpecs: {
    //                     "Processing Speed": "Real-time",
    //                     "Detection Range": "Up to 50 people",
    //                     "Accuracy": "90%+ classification"
    //                 }
    //             },
    //             'advanced': {
    //                 name: "Advanced Analytics",
    //                 subtitle: "Deep Dive into Analytics",
    //                 description: "Explore advanced analytics features including behavioral classification and pattern recognition.",
    //                 duration: "6-10 minutes",
    //                 difficulty: "Intermediate",
    //                 thumbnailImage: "/images/thumbnail/examinationCenter/2.png",
    //                 features: [
    //                     "Advanced Behavioral Analysis",
    //                     "Pattern Recognition",
    //                     "Predictive Analytics",
    //                     "Custom Metrics"
    //                 ],
    //                 requirements: [
    //                     "Modern web browser",
    //                     "Stable internet connection",
    //                     "Sample data sets"
    //                 ],
    //                 instructions: [
    //                     "Review advanced features",
    //                     "Analyze behavioral patterns",
    //                     "Explore predictive models",
    //                     "Customize analytics parameters"
    //                 ],
    //                 videoUrl: "https://example.com/analytics-advanced-demo.mp4",
    //                 technicalSpecs: {
    //                     "Processing Speed": "Real-time (30 FPS)",
    //                     "Detection Range": "Up to 100 people",
    //                     "Accuracy": "92%+ behavior classification",
    //                     "Data Retention": "Configurable (30-365 days)"
    //                 }
    //             },
    //             'dashboard': {
    //                 name: "Dashboard Demo",
    //                 subtitle: "Analytics Dashboard Walkthrough",
    //                 description: "Navigate through our comprehensive analytics dashboard with real-time data visualization.",
    //                 duration: "5-8 minutes",
    //                 difficulty: "Intermediate",
    //                 thumbnailImage: "/images/thumbnail/examinationCenter/3.png",
    //                 features: [
    //                     "Real-time Dashboard",
    //                     "Interactive Charts",
    //                     "Data Export",
    //                     "Custom Reports"
    //                 ],
    //                 requirements: [
    //                     "Modern web browser",
    //                     "Stable internet connection"
    //                 ],
    //                 instructions: [
    //                     "Navigate dashboard interface",
    //                     "Explore data visualizations",
    //                     "Generate custom reports",
    //                     "Export analytics data"
    //                 ],
    //                 videoUrl: "https://example.com/analytics-dashboard-demo.mp4",
    //                 technicalSpecs: {
    //                     "Dashboard Updates": "Real-time",
    //                     "Chart Types": "15+ visualization types",
    //                     "Export Formats": "PDF, CSV, Excel",
    //                     "Integration": "REST API + WebSocket"
    //                 }
    //             }
    //         }
    //     }
    // };

    // Get current product from URL
    const getCurrentProduct = () => {
        const product = demos[routeDemoType];
        if (!product) return null;

        return {
            product,
            productType: routeDemoType
        };
    };

    const currentProductData = getCurrentProduct();

    // Fallback if no product found
    if (!currentProductData) {
        return (
            <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                        Product Not Found
                    </h1>
                    <p className="text-gray-600 mb-4">The requested product could not be found.</p>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="px-4 py-2 rounded-lg"
                        style={{ backgroundColor: colors.accent, color: 'white' }}
                    >
                        Back to Marketplace
                    </button>
                </div>
            </div>
        );
    }

    const { product, productType } = currentProductData;
    const demo = product.demos[selectedDemo];
    const availableDemos = Object.entries(product.demos);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
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

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6" style={{ backgroundColor: colors.background }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >


                    {/* Title Section */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: product.color }}
                        >
                            <product.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1
                                className="text-xl font-bold mb-1"
                                style={{ color: colors.textPrimary }}
                            >
                                {product.title}
                            </h1>
                            <p
                                className="text-sm"
                                style={{ color: colors.textSecondary }}
                            >
                                {product.subtitle}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Video Gallery */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {/* Video Player Modal */}
                    {selectedVideo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>

                                {/* Video Player */}
                                <div className="relative aspect-video">
                                    {/* Actual Video Player */}
                                    {selectedVideo.videoUrl && (
                                        <video
                                            className="w-full h-full object-cover"
                                            controls
                                            poster={`/images/thumbnail/examinationCenter/${selectedVideo.index}.png`}
                                        >
                                            <source src={selectedVideo.videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}

                                    {/* Fallback Placeholder */}
                                    {!selectedVideo.videoUrl && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div
                                                    className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                                                    style={{ backgroundColor: product.color }}
                                                    onClick={togglePlay}
                                                >
                                                    {isPlaying ? (
                                                        <PauseIcon className="w-8 h-8 text-white" />
                                                    ) : (
                                                        <PlayIcon className="w-8 h-8 text-white ml-1" />
                                                    )}
                                                </div>
                                                <p className="text-white text-lg font-medium">{selectedVideo.name}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Video Controls - Only show if no actual video */}
                                    {!selectedVideo.videoUrl && (
                                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={togglePlay}
                                                        className="p-2 rounded-lg bg-black bg-opacity-50 text-white"
                                                    >
                                                        {isPlaying ? (
                                                            <PauseIcon className="w-4 h-4" />
                                                        ) : (
                                                            <PlayIcon className="w-4 h-4" />
                                                        )}
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={toggleMute}
                                                        className="p-2 rounded-lg bg-black bg-opacity-50 text-white"
                                                    >
                                                        {isMuted ? (
                                                            <SpeakerXMarkIcon className="w-4 h-4" />
                                                        ) : (
                                                            <SpeakerWaveIcon className="w-4 h-4" />
                                                        )}
                                                    </motion.button>
                                                </div>
                                                <div className="text-white text-sm">
                                                    0:00 / {selectedVideo.duration}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Video Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 text-white">
                                        {selectedVideo.name}
                                    </h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {selectedVideo.description}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Video Thumbnails Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {availableDemos.map(([demoType, demoData]) => (
                            <motion.div
                                key={demoType}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="cursor-pointer group"
                                onClick={() => setSelectedVideo(demoData)}
                            >
                                <div
                                    className="rounded-lg overflow-hidden shadow-lg transition-all duration-200 group-hover:shadow-xl"
                                    style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderColor}` }}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
                                        {/* Actual Thumbnail Image */}
                                        <img
                                            src={demoData.thumbnailImage}
                                            alt={demoData.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback to dummy thumbnail if image doesn't exist
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />

                                        {/* Fallback Dummy Thumbnail */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900" style={{ display: 'none' }}>
                                            <div className="text-center">
                                                <div
                                                    className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center"
                                                    style={{ backgroundColor: product.color }}
                                                >
                                                    <product.icon className="w-8 h-8 text-white" />
                                                </div>
                                                <p className="text-white text-sm font-medium">{demoData.name}</p>
                                            </div>
                                        </div>

                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:bg-opacity-90"
                                                style={{ backgroundColor: product.color }}
                                            >
                                                <PlayIcon className="w-5 h-5 text-white ml-0.5" />
                                            </div>
                                        </div>

                                    </div>

                                    {/* Video Info */}
                                    <div className="p-4">
                                        <h3
                                            className="font-semibold mb-1 text-sm"
                                            style={{ color: colors.textPrimary }}
                                        >
                                            {demoData.name}
                                        </h3>
                                        <p
                                            className="text-xs line-clamp-2"
                                            style={{ color: colors.textSecondary }}
                                        >
                                            {demoData.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Key Features Section */}
                    {/* <motion.div
                        variants={itemVariants}
                        className="mt-8"
                    >
                        <div 
                            className="rounded-lg p-6"
                            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderColor}` }}
                        >
                            <h3 className="text-xl font-semibold mb-4" style={{ color: colors.textPrimary }}>
                                Key Features
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {demo.features.map((feature, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center space-x-3 p-3 rounded-lg"
                                        style={{ backgroundColor: colors.background }}
                                    >
                                        <div 
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: product.color }}
                                        />
                                        <span className="text-sm" style={{ color: colors.textPrimary }}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div> */}
                </motion.div>
            </div>
        </div>
    );
} 