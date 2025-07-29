import {
    UserIcon,
    UserGroupIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    FaceSmileIcon,
    DevicePhoneMobileIcon,
    IdentificationIcon,
    BeakerIcon,
    MapPinIcon,
    CodeBracketIcon
} from '@heroicons/react/24/outline';

const baseUrl = "http://192.168.18.10";

export const PeopleAnalyticsApis = {
    url: baseUrl,
    endpoints: {
        gender: {
            name: "Gender Detection",
            description: "Analyze and classify gender from facial features in images",
            icon: UserIcon,
            color: "#3B82F6",
            endpoint: ":8000/predict"
        },
        ethnicity: {
            name: "Ethnicity Detection",
            description: "Identify and classify ethnic background from facial characteristics",
            icon: UserGroupIcon,
            color: "#10B981",
            endpoint: "/ethnicity"
        },
        person: {
            name: "Person Detector",
            description: "Detect and locate people in images with bounding box coordinates",
            icon: MagnifyingGlassIcon,
            color: "#F59E0B",
            endpoint: "/person"
        },
        gaze: {
            name: "Gaze Detection",
            description: "Track eye gaze direction and attention patterns",
            icon: EyeIcon,
            color: "#8B5CF6",
            endpoint: "/gaze"
        },
        face: {
            name: "Face Detector",
            description: "Detect and analyze facial features, landmarks, and expressions",
            icon: FaceSmileIcon,
            color: "#06B6D4",
            endpoint: "/face"
        },
        keypoint: {
            name: "Key Point Detection",
            description: "Detect and track key points and landmarks in images",
            icon: MapPinIcon,
            color: "#EF4444",
            endpoint: ":8000/predict"
        }
    }
};

// Unified API Applications Configuration
export const API_APPLICATIONS = [
    {
        id: 'people-analytics',
        name: 'People Analytics',
        description: 'AI-powered people detection and analysis APIs for demographic insights, gaze tracking, and facial analysis.',
        icon: UserGroupIcon,
        color: '#10B981',
        route: '/people-analytics',
        features: [
            'Gender Detection',
            'Ethnicity Detection', 
            'Person Detection',
            'Gaze Detection',
            'Face Detection',
            'Key Point Detection'
        ],
        stats: {
            endpoints: 6,
            accuracy: '95%+',
            responseTime: '< 2s'
        },
        apiConfig: 'PeopleAnalyticsApis'
    },
    {
        id: 'examination-center',
        name: 'Examination Center',
        description: 'AI-powered examination monitoring and detection APIs for academic integrity and security.',
        icon: EyeIcon,
        color: '#3B82F6',
        route: '/examination-center',
        features: [
            'Head Detection',
            'Standing Detection',
            'Mobile Device Detection',
            'ID Card Detection',
            'Water Bottle Detection',
            'Key Point Detection'
        ],
        stats: {
            endpoints: 6,
            accuracy: '98%+',
            responseTime: '< 1.5s'
        },
        apiConfig: 'ExaminationCenterApis'
    }
];

// Helper function to get API applications with dynamic endpoint counts
export const getApiApplications = () => {
    return API_APPLICATIONS.map(app => ({
        ...app,
        stats: {
            ...app.stats,
            endpoints: app.apiConfig === 'PeopleAnalyticsApis' 
                ? Object.keys(PeopleAnalyticsApis.endpoints).length
                : Object.keys(ExaminationCenterApis.endpoints).length
        }
    }));
};

// Helper function to get total endpoints across all applications
export const getTotalEndpoints = () => {
    return Object.keys(PeopleAnalyticsApis.endpoints).length + 
           Object.keys(ExaminationCenterApis.endpoints).length;
};

// Helper function to get application by ID
export const getApiApplicationById = (id) => {
    return getApiApplications().find(app => app.id === id);
};

// Helper function to get application by route
export const getApiApplicationByRoute = (route) => {
    return getApiApplications().find(app => app.route === route);
};

export const ExaminationCenterApis = {
    url: baseUrl,
    endpoints: {
        head: {
            name: "Head Detection",
            description: "Detect and analyze head positions and movements in real-time",
            icon: EyeIcon,
            color: "#3B82F6",
            endpoint: ":8007/predict",
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
            endpoint: ":8003/predict",
            parameters: {
                image: { type: "file", label: "Upload Image", required: true }
            }
        }
    }
};