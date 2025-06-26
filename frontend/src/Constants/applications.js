import {
    EyeIcon,
    UserGroupIcon,
    GlobeAltIcon,
    CpuChipIcon,
    VideoCameraIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    FaceSmileIcon,
    MagnifyingGlassIcon,
    CameraIcon
} from '@heroicons/react/24/outline';

// Application configurations with searchable content
export const APPLICATIONS = {
    examination: {
        id: 'examination',
        name: 'Examination Center',
        url: 'https://www.examinationcenter.com.pk',
        icon: EyeIcon,
        color: '#3B82F6',
        description: 'AI-powered exam monitoring and cheating detection',
        category: 'My Applications',
        tags: ['examination', 'monitoring', 'cheating', 'detection', 'ai', 'education', 'security'],
        features: [
            {
                id: 'ai-monitoring',
                name: 'AI-Powered Monitoring',
                description: 'Advanced computer vision and machine learning algorithms to detect suspicious behavior in real-time',
                icon: CpuChipIcon,
                color: '#3B82F6',
                capabilities: ['Facial recognition', 'Behavioral analysis', 'Pattern detection', 'Real-time alerts'],
                tags: ['ai', 'monitoring', 'computer vision', 'machine learning', 'behavioral analysis']
            },
            {
                id: 'multi-camera',
                name: 'Multi-Camera Support',
                description: 'Support for multiple camera feeds to monitor different angles and areas of the examination hall',
                icon: VideoCameraIcon,
                color: '#10B981',
                capabilities: ['360° coverage', 'HD video streams', 'Low-light detection', 'Wide-angle views'],
                tags: ['camera', 'multi-camera', 'surveillance', 'coverage', 'video']
            },
            {
                id: 'behavior-detection',
                name: 'Behavioral Analysis',
                description: 'Comprehensive detection of various suspicious behaviors and cheating attempts',
                icon: EyeIcon,
                color: '#F59E0B',
                capabilities: ['Hand raising detection', 'Looking around', 'Device usage', 'Communication attempts'],
                tags: ['behavioral', 'analysis', 'cheating', 'detection', 'suspicious behavior']
            },
            {
                id: 'invigilator-tools',
                name: 'Invigilator Dashboard',
                description: 'Dedicated interface for invigilators to manage and respond to alerts efficiently',
                icon: UserGroupIcon,
                color: '#8B5CF6',
                capabilities: ['Alert management', 'Student tracking', 'Communication tools', 'Report generation'],
                tags: ['dashboard', 'invigilator', 'alerts', 'management', 'tracking']
            },
            {
                id: 'reporting',
                name: 'Comprehensive Reporting',
                description: 'Detailed reports and analytics for examination authorities and administrators',
                icon: ChartBarIcon,
                color: '#06B6D4',
                capabilities: ['Incident logs', 'Performance metrics', 'Student analytics', 'Export capabilities'],
                tags: ['reporting', 'analytics', 'metrics', 'logs', 'export']
            },
            {
                id: 'security',
                name: 'Security & Privacy',
                description: 'Enterprise-grade security measures to protect student privacy and data integrity',
                icon: ShieldCheckIcon,
                color: '#EF4444',
                capabilities: ['Data encryption', 'Access controls', 'Audit trails', 'GDPR compliance'],
                tags: ['security', 'privacy', 'encryption', 'compliance', 'gdpr']
            }
        ]
    },
    peopleanalytics: {
        id: 'peopleanalytics',
        name: 'People Analytics',
        url: 'https://www.google.com.pk',
        icon: UserGroupIcon,
        color: '#10B981',
        description: 'Advanced people detection and analysis',
        category: 'My Applications',
        tags: ['people', 'analytics', 'detection', 'analysis', 'ai', 'computer vision'],
        features: [
            {
                id: 'person-detection',
                name: 'Person Detection',
                description: 'Advanced computer vision algorithms to detect and track people in real-time across multiple camera feeds',
                icon: UserGroupIcon,
                color: '#3B82F6',
                capabilities: ['Real-time detection', 'Multi-camera tracking', 'Person counting', 'Trajectory analysis'],
                tags: ['person', 'detection', 'tracking', 'real-time', 'computer vision']
            },
            {
                id: 'gender-detection',
                name: 'Gender Detection',
                description: 'AI-powered gender classification with high accuracy for demographic analysis and visitor insights',
                icon: FaceSmileIcon,
                color: '#EC4899',
                capabilities: ['Gender classification', 'Age estimation', 'Demographic analysis', 'Privacy compliance'],
                tags: ['gender', 'detection', 'demographics', 'classification', 'age estimation']
            },
            {
                id: 'gaze-detection',
                name: 'Gaze Detection',
                description: 'Track where people are looking to understand visitor engagement and interest patterns',
                icon: EyeIcon,
                color: '#F59E0B',
                capabilities: ['Eye tracking', 'Attention analysis', 'Engagement metrics', 'Interest mapping'],
                tags: ['gaze', 'eye tracking', 'attention', 'engagement', 'interest']
            },
            {
                id: 'search-person',
                name: 'Search Person by Image',
                description: 'Powerful facial recognition system to search and locate specific individuals across the facility',
                icon: MagnifyingGlassIcon,
                color: '#10B981',
                capabilities: ['Facial recognition', 'Image search', 'Person location', 'Historical tracking'],
                tags: ['facial recognition', 'search', 'image', 'person location', 'tracking']
            },
            {
                id: 'visitor-analytics',
                name: 'Visitor Analytics',
                description: 'Comprehensive analytics dashboard for understanding visitor patterns and museum performance',
                icon: ChartBarIcon,
                color: '#8B5CF6',
                capabilities: ['Visitor counts', 'Peak hour analysis', 'Dwell time tracking', 'Popular exhibits'],
                tags: ['visitor', 'analytics', 'dashboard', 'patterns', 'performance']
            },
            {
                id: 'surveillance',
                name: 'Intelligent Surveillance',
                description: 'Enhanced security monitoring with people detection and suspicious behavior identification',
                icon: CameraIcon,
                color: '#EF4444',
                capabilities: ['Security monitoring', 'Behavior analysis', 'Alert system', 'Incident recording'],
                tags: ['surveillance', 'security', 'monitoring', 'behavior', 'alerts']
            }
        ]
    }
};

// Helper function to search through applications and features
export const searchApplications = (query) => {
    const searchTerm = query.toLowerCase().trim();
    const results = [];

    Object.values(APPLICATIONS).forEach(app => {
        // Search in app-level properties
        const appNameMatch = app.name.toLowerCase().includes(searchTerm);
        const appDescMatch = app.description.toLowerCase().includes(searchTerm);
        const appTagsMatch = app.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        if (appNameMatch || appDescMatch || appTagsMatch) {
            results.push({
                id: app.id,
                name: app.name,
                description: app.description,
                icon: app.icon,
                color: app.color,
                type: 'application',
                relevance: appNameMatch ? 0 : (appTagsMatch ? 1 : 2),
                path: `/products/${app.id}`,
                section: app.category
            });
        }

        // Search in features
        app.features.forEach(feature => {
            const featureNameMatch = feature.name.toLowerCase().includes(searchTerm);
            const featureDescMatch = feature.description.toLowerCase().includes(searchTerm);
            const featureTagsMatch = feature.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const capabilitiesMatch = feature.capabilities.some(cap => cap.toLowerCase().includes(searchTerm));

            if (featureNameMatch || featureDescMatch || featureTagsMatch || capabilitiesMatch) {
                results.push({
                    id: feature.id,
                    name: feature.name,
                    description: feature.description,
                    icon: feature.icon,
                    color: feature.color,
                    type: 'feature',
                    relevance: featureNameMatch ? 0 : (featureTagsMatch ? 1 : (capabilitiesMatch ? 2 : 3)),
                    path: `/products/${app.id}#${feature.id}`,
                    section: `${app.name} Features`,
                    parentApp: app.name
                });
            }
        });
    });

    return results.sort((a, b) => a.relevance - b.relevance);
};

// Get application by ID
export const getApplication = (id) => {
    return APPLICATIONS[id];
};

// Get all applications
export const getAllApplications = () => {
    return Object.values(APPLICATIONS);
};

// Get features for a specific application
export const getApplicationFeatures = (appId) => {
    return APPLICATIONS[appId]?.features || [];
}; 