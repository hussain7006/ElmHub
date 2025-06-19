import {
    BeakerIcon,
    ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

export const demos = {
    'examination-center': {
        title: "Examination Center",
        subtitle: "AI-Powered Detection & Analysis",
        icon: BeakerIcon,
        color: "#3B82F6",
        description: "Experience our comprehensive AI detection system that can identify and analyze various objects and patterns in real-time.",
        demos: {
            '1': {
                name: "Basic Demo",
                subtitle: "Introduction to AI Detection",
                description: "Get started with our AI detection system through this comprehensive introduction.",
                duration: "3-5 minutes",
                difficulty: "Beginner",
                thumbnailImage: "/images/thumbnail/examinationCenter/1.png",
                videoUrl: "/videos/examinationCenter/1.mp4",
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
                }
            }
            ,
            '2': {
                name: "API Testing Demo",
                subtitle: "Interactive API Testing",
                description: "Test our AI detection APIs with real-time image uploads and instant results.",
                duration: "5-8 minutes",
                difficulty: "Intermediate",
                thumbnailImage: "/images/thumbnail/examinationCenter/1.png",
                videoUrl: "/videos/examinationCenter/1.mp4",
                features: [
                    "Real-time API Testing",
                    "Image Upload & Processing",
                    "Detailed Results Analysis",
                    "Error Handling"
                ],
                requirements: [
                    "Modern web browser",
                    "Stable internet connection",
                    "Sample images for testing"
                ],
                instructions: [
                    "Upload test images",
                    "Test different API endpoints",
                    "Analyze detection results",
                    "Review error scenarios"
                ],

                technicalSpecs: {
                    "API Endpoints": "6 RESTful endpoints",
                    "Response Time": "< 2 seconds",
                    "Accuracy": "95%+ detection rate",
                    "Supported Formats": "JPEG, PNG, WebP",
                    "Max File Size": "10MB per image"
                }
            },
            '3': {
                name: "Real-time Demo",
                subtitle: "Live Detection Processing",
                description: "Experience real-time AI detection with live video feeds and instant processing.",
                duration: "8-12 minutes",
                difficulty: "Advanced",
                thumbnailImage: "/images/thumbnail/examinationCenter/1.png",
                videoUrl: "/videos/examinationCenter/1.mp4",
                features: [
                    "Live Video Processing",
                    "Real-time Detection",
                    "Multi-object Tracking",
                    "Performance Monitoring"
                ],
                requirements: [
                    "Modern web browser",
                    "High-speed internet",
                    "Webcam access (optional)"
                ],
                instructions: [
                    "Connect to live video feed",
                    "Observe real-time processing",
                    "Monitor detection accuracy",
                    "Analyze performance metrics"
                ],

                technicalSpecs: {
                    "Processing Speed": "Real-time (30 FPS)",
                    "Detection Range": "Multiple objects",
                    "Accuracy": "97%+ detection rate",
                    "Latency": "< 100ms"
                }
            }
        }
    },
    'people-analytics': {
        title: "People Analytics",
        subtitle: "Advanced Human Behavior Analysis",
        icon: ClipboardDocumentListIcon,
        color: "#10B981",
        description: "Discover how our AI system analyzes human behavior patterns, crowd dynamics, and social interactions in real-time.",
        demos: {
            '1': {
                name: "Overview Demo",
                subtitle: "Introduction to People Analytics",
                description: "Learn about our people analytics capabilities and use cases.",
                duration: "4-6 minutes",
                difficulty: "Beginner",
                thumbnailImage: "/images/thumbnail/peopleAnalytics/1.png",
                videoUrl: "/videos/peopleAnalytics/1.mp4",
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
                }
            },
            '2': {
                name: "Advanced Analytics",
                subtitle: "Deep Dive into Analytics",
                description: "Explore advanced analytics features including behavioral classification and pattern recognition.",
                duration: "6-10 minutes",
                difficulty: "Intermediate",
                thumbnailImage: "/images/thumbnail/peopleAnalytics/1.png",
                videoUrl: "/videos/peopleAnalytics/1.mp4",
                features: [
                    "Advanced Behavioral Analysis",
                    "Pattern Recognition",
                    "Predictive Analytics",
                    "Custom Metrics"
                ],
                requirements: [
                    "Modern web browser",
                    "Stable internet connection",
                    "Sample data sets"
                ],
                instructions: [
                    "Review advanced features",
                    "Analyze behavioral patterns",
                    "Explore predictive models",
                    "Customize analytics parameters"
                ],
                technicalSpecs: {
                    "Processing Speed": "Real-time (30 FPS)",
                    "Detection Range": "Up to 100 people",
                    "Accuracy": "92%+ behavior classification",
                    "Data Retention": "Configurable (30-365 days)"
                }
            },
            '3': {
                name: "Dashboard Demo",
                subtitle: "Analytics Dashboard Walkthrough",
                description: "Navigate through our comprehensive analytics dashboard with real-time data visualization.",
                duration: "5-8 minutes",
                difficulty: "Intermediate",
                thumbnailImage: "/images/thumbnail/peopleAnalytics/1.png",
                videoUrl: "/videos/peopleAnalytics/1.mp4",
                features: [
                    "Real-time Dashboard",
                    "Interactive Charts",
                    "Data Export",
                    "Custom Reports"
                ],
                requirements: [
                    "Modern web browser",
                    "Stable internet connection"
                ],
                instructions: [
                    "Navigate dashboard interface",
                    "Explore data visualizations",
                    "Generate custom reports",
                    "Export analytics data"
                ],
                technicalSpecs: {
                    "Dashboard Updates": "Real-time",
                    "Chart Types": "15+ visualization types",
                    "Export Formats": "PDF, CSV, Excel",
                    "Integration": "REST API + WebSocket"
                }
            }
        }
    }
};