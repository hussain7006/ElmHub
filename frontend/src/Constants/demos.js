import {
    BeakerIcon,
    ClipboardDocumentListIcon,
    MapIcon,
    ChatBubbleLeftEllipsisIcon,
    MicrophoneIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';

export const demos = {
    'examination-center': {
        id: 'examination-center',
        title: "Examination Center",
        subtitle: "AI-Powered Detection & Analysis",
        icon: BeakerIcon,
        color: "#3B82F6",
        description: "Experience our comprehensive AI detection system that can identify and analyze various objects and patterns in real-time.",
        category: 'Product Demos',
        tags: ['examination', 'detection', 'ai', 'monitoring', 'analysis', 'computer vision'],
        demos: {
            '1': {
                id: 'basic-demo',
                name: "Demo",
                subtitle: "Introduction to AI Detection",
                description: "Get started with our AI detection system through this comprehensive introduction.",
                duration: "3-5 minutes",
                difficulty: "Beginner",
                thumbnailImage: "/images/thumbnail/examinationCenter/exam.png",
                videoUrl: "/videos/examinationCenter/exam.mp4",
                features: [
                    "Head Detection Overview",
                    "Basic Image Processing",
                    "Simple Detection Results"
                ],
                requirements: [
                    "Modern web browser",
                    "Stable internet connection"
                ],
                instructions: [
                    "Watch the introduction video",
                    "Learn about basic detection features",
                    "Understand the user interface"
                ],
                technicalSpecs: {
                    "API Endpoints": "2 Basic endpoints",
                    "Response Time": "< 1 second",
                    "Accuracy": "90%+ detection rate"
                },
                tags: ['basic', 'introduction', 'head detection', 'image processing', 'beginner'],
                capabilities: ['Head Detection Overview', 'Basic Image Processing', 'Simple Detection Results']
            },
            // '2': {
            //     id: 'api-testing-demo',
            //     name: "API Testing Demo",
            //     subtitle: "Interactive API Testing",
            //     description: "Test our AI detection APIs with real-time image uploads and instant results.",
            //     duration: "5-8 minutes",
            //     difficulty: "Intermediate",
            //     thumbnailImage: "/images/thumbnail/examinationCenter/1.png",
            //     videoUrl: "/videos/examinationCenter/exam.mp4",
            //     features: [
            //         "Real-time API Testing",
            //         "Image Upload & Processing",
            //         "Detailed Results Analysis",
            //         "Error Handling"
            //     ],
            //     requirements: [
            //         "Modern web browser",
            //         "Stable internet connection",
            //         "Sample images for testing"
            //     ],
            //     instructions: [
            //         "Upload test images",
            //         "Test different API endpoints",
            //         "Analyze detection results",
            //         "Review error scenarios"
            //     ],
            //     technicalSpecs: {
            //         "API Endpoints": "6 RESTful endpoints",
            //         "Response Time": "< 2 seconds",
            //         "Accuracy": "95%+ detection rate",
            //         "Supported Formats": "JPEG, PNG, WebP",
            //         "Max File Size": "10MB per image"
            //     },
            //     tags: ['api', 'testing', 'interactive', 'image upload', 'real-time', 'intermediate'],
            //     capabilities: ['Real-time API Testing', 'Image Upload & Processing', 'Detailed Results Analysis', 'Error Handling']
            // },
            // '3': {
            //     id: 'realtime-demo',
            //     name: "Real-time Demo",
            //     subtitle: "Live Detection Processing",
            //     description: "Experience real-time AI detection with live video feeds and instant processing.",
            //     duration: "8-12 minutes",
            //     difficulty: "Advanced",
            //     thumbnailImage: "/images/thumbnail/examinationCenter/1.png",
            //     videoUrl: "/videos/examinationCenter/exam.mp4",
            //     features: [
            //         "Live Video Processing",
            //         "Real-time Detection",
            //         "Multi-object Tracking",
            //         "Performance Monitoring"
            //     ],
            //     requirements: [
            //         "Modern web browser",
            //         "High-speed internet",
            //         "Webcam access (optional)"
            //     ],
            //     instructions: [
            //         "Connect to live video feed",
            //         "Observe real-time processing",
            //         "Monitor detection accuracy",
            //         "Analyze performance metrics"
            //     ],
            //     technicalSpecs: {
            //         "Processing Speed": "Real-time (30 FPS)",
            //         "Detection Range": "Multiple objects",
            //         "Accuracy": "97%+ detection rate",
            //         "Latency": "< 100ms"
            //     },
            //     tags: ['real-time', 'live', 'video processing', 'multi-object', 'tracking', 'advanced'],
            //     capabilities: ['Live Video Processing', 'Real-time Detection', 'Multi-object Tracking', 'Performance Monitoring']
            // }
        }
    },
    'people-analytics': { 
        id: 'people-analytics',
        title: "People Analytics",
        subtitle: "Advanced Human Behavior Analysis",
        icon: ClipboardDocumentListIcon,
        color: "#10B981",
        description: "Discover how our AI system analyzes human behavior patterns, crowd dynamics, and social interactions in real-time.",
        category: 'Product Demos',
        tags: ['people', 'analytics', 'behavior', 'crowd', 'human', 'ai', 'analysis'],
        demos: {
            '1': {
                id: 'overview-demo',
                name: "Demo",
                subtitle: "Introduction to People Analytics",
                description: "Learn about our people analytics capabilities and use cases.",
                duration: "4-6 minutes",
                difficulty: "Beginner",
                thumbnailImage: "/images/thumbnail/peopleAnalytics/pa.png",
                videoUrl: "/videos/peopleAnalytics/pa.mp4",
                features: [
                    "Behavioral Analysis Overview",
                    "Crowd Detection Basics",
                    "Analytics Dashboard Preview"
                ],
                requirements: [
                    "Modern web browser",
                    "Stable internet connection"
                ],
                instructions: [
                    "Watch the overview presentation",
                    "Understand use cases",
                    "Explore dashboard features"
                ],
                technicalSpecs: {
                    "Processing Speed": "Real-time",
                    "Detection Range": "Up to 50 people",
                    "Accuracy": "90%+ classification"
                },
                tags: ['overview', 'introduction', 'behavioral analysis', 'crowd detection', 'beginner'],
                capabilities: ['Behavioral Analysis Overview', 'Crowd Detection Basics', 'Analytics Dashboard Preview']
            },
            // '2': {
            //     id: 'advanced-analytics-demo',
            //     name: "Advanced Analytics",
            //     subtitle: "Deep Dive into Analytics",
            //     description: "Explore advanced analytics features including behavioral classification and pattern recognition.",
            //     duration: "6-10 minutes",
            //     difficulty: "Intermediate",
            //     thumbnailImage: "/images/thumbnail/peopleAnalytics/1.png",
            //     videoUrl: "/videos/peopleAnalytics/pa.mp4",
            //     features: [
            //         "Advanced Behavioral Analysis",
            //         "Pattern Recognition",
            //         "Predictive Analytics",
            //         "Custom Metrics"
            //     ],
            //     requirements: [
            //         "Modern web browser",
            //         "Stable internet connection",
            //         "Sample data sets"
            //     ],
            //     instructions: [
            //         "Review advanced features",
            //         "Analyze behavioral patterns",
            //         "Explore predictive models",
            //         "Customize analytics parameters"
            //     ],
            //     technicalSpecs: {
            //         "Processing Speed": "Real-time (30 FPS)",
            //         "Detection Range": "Up to 100 people",
            //         "Accuracy": "92%+ behavior classification",
            //         "Data Retention": "Configurable (30-365 days)"
            //     },
            //     tags: ['advanced', 'analytics', 'pattern recognition', 'predictive', 'behavioral', 'intermediate'],
            //     capabilities: ['Advanced Behavioral Analysis', 'Pattern Recognition', 'Predictive Analytics', 'Custom Metrics']
            // },
            // '3': {
            //     id: 'dashboard-demo',
            //     name: "Dashboard Demo",
            //     subtitle: "Analytics Dashboard Walkthrough",
            //     description: "Navigate through our comprehensive analytics dashboard with real-time data visualization.",
            //     duration: "5-8 minutes",
            //     difficulty: "Intermediate",
            //     thumbnailImage: "/images/thumbnail/peopleAnalytics/1.png",
            //     videoUrl: "/videos/peopleAnalytics/pa.mp4",
            //     features: [
            //         "Real-time Dashboard",
            //         "Interactive Charts",
            //         "Data Export",
            //         "Custom Reports"
            //     ],
            //     requirements: [
            //         "Modern web browser",
            //         "Stable internet connection"
            //     ],
            //     instructions: [
            //         "Navigate dashboard interface",
            //         "Explore data visualizations",
            //         "Generate custom reports",
            //         "Export analytics data"
            //     ],
            //     technicalSpecs: {
            //         "Dashboard Updates": "Real-time",
            //         "Chart Types": "15+ visualization types",
            //         "Export Formats": "PDF, CSV, Excel",
            //         "Integration": "REST API + WebSocket"
            //     },
            //     tags: ['dashboard', 'visualization', 'charts', 'data export', 'reports', 'intermediate'],
            //     capabilities: ['Real-time Dashboard', 'Interactive Charts', 'Data Export', 'Custom Reports']
            // }
        }
    },
    'autism': {
        id: 'autism',
        title: "Autism",
        subtitle: "AI-Powered Autism Detection",
        icon: BeakerIcon,
        color: "#bc87ed",
        description: "Experience our comprehensive AI detection system that can identify and analyze various objects and patterns in real-time.",
        category: 'Product Demos',
        tags: ['autism', 'detection', 'ai', 'monitoring', 'analysis', 'computer vision'],
        demos: {
            '1': {
                id: 'basic-demo',
                name: "Demo",
                subtitle: "Introduction to Autism Detection",
                description: "Get started with our AI detection system through this comprehensive introduction.",
                duration: "3-5 minutes",
                difficulty: "Beginner",
                thumbnailImage: "/images/thumbnail/autism/autism.png",
                videoUrl: "/videos/autism/autism.mp4",
                features: [
                    "Autism Detection Overview",
                    "Basic Image Processing",
                    "Simple Detection Results"
                ],
                requirements: [
                    "Modern web browser",
                    "Stable internet connection"
                ],
            }
        }
    },
    'sage': {
        id: 'sage',
        title: "Sage",
        subtitle: "AI-Powered Sage Detection",
        icon: MapIcon,
        color: "#eb8034",
        description: "Experience our comprehensive AI detection system that can identify and analyze various objects and patterns in real-time.",
        category: 'Product Demos',
        tags: ['sage', 'map', 'ai', 'monitoring', 'analysis', 'computer vision'],
        demos: {
            '1': {
                id: 'basic-demo',
                name: "Demo",
                subtitle: "Introduction to Autism Detection",
                description: "Get started with our AI detection system through this comprehensive introduction.",
                duration: "3-5 minutes",
                difficulty: "Beginner",
                thumbnailImage: "/images/thumbnail/sage/sage.png",
                videoUrl: "/videos/sage/sage.mp4",
                features: [
                    "Autism Detection Overview",
                    "Basic Image Processing",
                    "Simple Detection Results"
                ],
                requirements: [
                    "Modern web browser",
                    "Stable internet connection"
                ],
            }
        }
    },
    'nuha-ai': {
        id: 'nuha-ai',
        title: "Nuha AI",
        subtitle: "AI-Powered Nuha AI Detection",
        icon: ChatBubbleLeftEllipsisIcon,
        color: "#333333",
        description: "Experience our comprehensive AI detection system that can identify and analyze various objects and patterns in real-time.",
        category: 'Product Demos',
        tags: ['nuha', 'llm', 'ai', 'monitoring', 'analysis', 'computer vision'],
        demos: {
            '1': {
                id: 'basic-demo',
                name: "Demo",
                subtitle: "Introduction to Nuha AI Detection",
                description: "Get started with our AI detection system through this comprehensive introduction.",
                duration: "3-5 minutes",
                difficulty: "Beginner",
                thumbnailImage: "/images/thumbnail/nuha/nuha.png",
                videoUrl: "/videos/nuha/nuha.mp4",
                features: [
                    "Nuha AI Detection Overview",
                    "Basic Image Processing",
                    "Simple Detection Results"
                ],
                requirements: [
                    "Modern web browser",
                    "Stable internet connection"
                ],
            }
        }
    },
    'baleeg': {
        id: 'baleeg',
        title: "Baleeg",
        subtitle: "AI-Powered Baleeg Detection",
        icon: MicrophoneIcon,
        color: "#43ade8",
        description: "Experience our comprehensive AI detection system that can identify and analyze various objects and patterns in real-time.",
        category: 'Product Demos',
        tags: ['baleeg', 'llm', 'ai', 'monitoring', 'analysis', 'computer vision'],
        demos: {
            '1': {
                id: 'basic-demo',
                name: "Demo",
                subtitle: "Introduction to Baleeg Detection",
                description: "Get started with our audio processing system through this comprehensive introduction.",
                duration: "3-5 minutes",
                difficulty: "Beginner",
                thumbnailImage: "/images/thumbnail/baleeg/baleeg.png",
                videoUrl: "/videos/baleeg/baleeg.mp4",
                features: [
                    "Baleeg audio Overview",
                    "Basic audio Processing",
                    "Simple audio Results"
                ],
            }
        }
    },
    'callbot': {
        id: 'callbot',
        title: "Callbot",
        subtitle: "AI-Powered Callbot",
        icon: PhoneIcon,
        color: "#1da850",
        description: "Experience our comprehensive AI detection system that can identify and analyze various objects and patterns in real-time.",
        category: 'Product Demos',
        tags: ['callbot', 'llm', 'ai', 'monitoring', 'analysis', 'computer vision'],
        demos: {
            '1': {
                id: 'basic-demo',
                name: "Demo",   
                subtitle: "Introduction to Callbot",
                description: "Get started with our audio processing system through this comprehensive introduction.",
                duration: "3-5 minutes",
                difficulty: "Beginner",
                thumbnailImage: "/images/thumbnail/callbot/callbot.png",
                videoUrl: "/videos/callbot/callbot.mp4",
                features: [
                    "Callbot audio Overview",
                    "Basic audio Processing",
                    "Simple audio Results"
                ],
            }
        }
    },
    'dga': {
        id: 'dga',
        title: "DGA",
        subtitle: "AI-Powered DGA",
        icon: MicrophoneIcon,
        color: "#1da850",
        description: "Experience our comprehensive AI detection system that can identify and analyze various objects and patterns in real-time.",
        category: 'Product Demos',
        tags: ['dga', 'llm', 'ai', 'monitoring', 'analysis', 'computer vision'],
        demos: {
            '1': {
                id: 'basic-demo',
                name: "Demo",   
                subtitle: "Introduction to DGA",
                description: "Get started with our audio processing system through this comprehensive introduction.",
                duration: "3-5 minutes",
                difficulty: "Beginner",
                thumbnailImage: "/images/thumbnail/dga/dga.png",
                videoUrl: "/videos/dga/dga.mp4",
                features: [
                    "DGA audio Overview",
                    "Basic audio Processing",
                    "Simple audio Results"
                ],
            }
        }
    }
    
};

// Helper function to search through demos
export const searchDemos = (query) => {
    const searchTerm = query.toLowerCase().trim();
    const results = [];

    Object.values(demos).forEach(product => {
        // Search in product-level properties
        const productNameMatch = product.title.toLowerCase().includes(searchTerm);
        const productDescMatch = product.description.toLowerCase().includes(searchTerm);
        const productTagsMatch = product.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        if (productNameMatch || productDescMatch || productTagsMatch) {
            results.push({
                id: product.id,
                name: product.title,
                description: product.description,
                icon: product.icon,
                color: product.color,
                type: 'product',
                relevance: productNameMatch ? 0 : (productTagsMatch ? 1 : 2),
                path: `/demo/${product.id}`,
                section: product.category
            });
        }

        // Search in individual demos
        Object.entries(product.demos).forEach(([demoKey, demo]) => {
            const demoNameMatch = demo.name.toLowerCase().includes(searchTerm);
            const demoDescMatch = demo.description.toLowerCase().includes(searchTerm);
            const demoTagsMatch = demo.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const capabilitiesMatch = demo.capabilities.some(cap => cap.toLowerCase().includes(searchTerm));

            if (demoNameMatch || demoDescMatch || demoTagsMatch || capabilitiesMatch) {
                results.push({
                    id: demo.id,
                    name: demo.name,
                    description: demo.description,
                    icon: product.icon,
                    color: product.color,
                    type: 'demo',
                    relevance: demoNameMatch ? 0 : (demoTagsMatch ? 1 : (capabilitiesMatch ? 2 : 3)),
                    path: `/demo/${product.id}#${demo.id}`,
                    section: `${product.title} Demos`,
                    parentProduct: product.title,
                    duration: demo.duration,
                    difficulty: demo.difficulty
                });
            }
        });
    });

    return results.sort((a, b) => a.relevance - b.relevance);
};

// Get all demos for a specific product
export const getProductDemos = (productId) => {
    return demos[productId]?.demos || {};
};

// Get all products
export const getAllDemoProducts = () => {
    return Object.values(demos);
};

// Get demo by ID
export const getDemo = (productId, demoId) => {
    return demos[productId]?.demos[demoId];
};