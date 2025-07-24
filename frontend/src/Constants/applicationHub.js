import {
    Squares2X2Icon,
    NewspaperIcon,
    PlayIcon,
    ChatBubbleLeftEllipsisIcon,
    UserGroupIcon,
    AcademicCapIcon,
    MicrophoneIcon,
    PhoneIcon,
    MapIcon,
} from '@heroicons/react/24/outline';
import { URL } from './url';

// Tab configurations
export const APPLICATION_HUB_TABS = [
    {
        id: 'applications',
        name: 'Applications',
        icon: Squares2X2Icon,
        description: 'Browse and access your applications'
    },
    // {
    //     id: 'news',
    //     name: 'News',
    //     icon: NewspaperIcon,
    //     description: 'Latest news and updates'
    // },
    {
        id: 'tutorials',
        name: 'Demos',
        icon: PlayIcon,
        description: 'Helpful tutorials and guides'
    },
];

// Application configurations with enable/disable functionality
export const APPLICATION_HUB_APPS = [
    {
        id: 'nuhaai',
        name: 'Nuha AI',
        description: 'AI tools for your business',
        icon: ChatBubbleLeftEllipsisIcon,
        color: 'purple',
        category: 'AI Tools',
        tags: ['ai', 'assistant', 'chat', 'personal'],
        enabled: true,
        status: 'maintenance', // 'active', 'maintenance', 'beta', 'deprecated'
        iframeUrl: URL.NUHA_AI,
        lastUpdated: '2024-01-15',
        version: '1.2.0'
    },
    {
        id: 'autism',
        name: 'Autism',
        description: 'AI tools for autism',
        icon: AcademicCapIcon,
        color: 'blue',
        category: 'AI Tools',
        tags: ['ai', 'assistant', 'chat', 'personal'],
        enabled: true,
        status: 'active',
        iframeUrl: URL.AUTISM,
        lastUpdated: '2024-01-10',
    },
    {
        id: 'baleeg',
        name: 'Baleeg',
        description: 'Your personal AI assistant.',
        icon: MicrophoneIcon,
        color: 'orange',
        category: 'AI Tools',
        tags: ['ai', 'assistant', 'chat', 'personal'],
        enabled: true,
        status: 'active',
        iframeUrl: URL.BALEEG,
        lastUpdated: '2024-01-12',
    },
    {
        id: 'callbot',
        name: 'Callbot',
        description: 'Call center AI assistant.',
        icon: PhoneIcon,
        color: 'green',
        category: 'AI Tools',
        tags: ['ai', 'assistant', 'chat', 'personal'],
        enabled: true,
        status: 'active',
        iframeUrl: URL.CALLBOT,
        lastUpdated: '2024-01-12',
    },
    {
        id: 'people-analytics',
        name: 'People Analytics',
        description: 'Gain insights into your organization.',
        icon: UserGroupIcon,
        color: 'red',
        category: 'Analytics',
        tags: ['analytics', 'people', 'team', 'organization', 'insights', 'hr'],
        enabled: true,
        status: 'beta',
        lastUpdated: '2024-06-01',
        iframeUrl: URL.PEOPLE_ANALYTICS,
        version: '0.9.0'
    },
    {
        id: 'sage',
        name: 'Sage',
        description: 'AI tools for your business',
        icon: MapIcon,
        color: 'cyan',
        category: 'AI Tools',
        tags: ['ai', 'assistant', 'chat', 'personal'],
        enabled: true,
        status: 'beta',
        lastUpdated: '2024-06-01',
        iframeUrl: URL.SAGE,
        version: '0.9.0'
    },
    {
        id: 'dga',
        name: 'DGA',
        description: 'AI tools for your business',
        icon: MicrophoneIcon,
        color: 'indigo',
        category: 'AI Tools',
        tags: ['ai', 'assistant', 'chat', 'personal'],
        enabled: true,
        status: 'beta',
        lastUpdated: '2024-06-01',
        iframeUrl: URL.DGA,
        version: '0.0.0'
    }

];

// Color schemes for light and dark themes
export const APPLICATION_HUB_COLORS = {
    light: {
        purple: { bgColor: 'bg-purple-100', hoverBg: 'hover:bg-purple-200', iconBg: 'bg-purple-200' },
        blue: { bgColor: 'bg-blue-100', hoverBg: 'hover:bg-blue-200', iconBg: 'bg-blue-200' },
        indigo: { bgColor: 'bg-indigo-100', hoverBg: 'hover:bg-indigo-200', iconBg: 'bg-indigo-200' },
        red: { bgColor: 'bg-red-100', hoverBg: 'hover:bg-red-200', iconBg: 'bg-red-200' },
        teal: { bgColor: 'bg-teal-100', hoverBg: 'hover:bg-teal-200', iconBg: 'bg-teal-200' },
        green: { bgColor: 'bg-green-100', hoverBg: 'hover:bg-green-200', iconBg: 'bg-green-200' },
        orange: { bgColor: 'bg-orange-100', hoverBg: 'hover:bg-orange-200', iconBg: 'bg-orange-200' },
        cyan: { bgColor: 'bg-cyan-100', hoverBg: 'hover:bg-cyan-200', iconBg: 'bg-cyan-200' },
    },
    dark: {
        purple: { bgColor: 'bg-purple-900/20', hoverBg: 'hover:bg-purple-800/30', iconBg: 'bg-purple-600/20' },
        blue: { bgColor: 'bg-blue-900/20', hoverBg: 'hover:bg-blue-800/30', iconBg: 'bg-blue-600/20' },
        indigo: { bgColor: 'bg-indigo-900/20', hoverBg: 'hover:bg-indigo-800/30', iconBg: 'bg-indigo-600/20' },
        red: { bgColor: 'bg-red-900/20', hoverBg: 'hover:bg-red-800/30', iconBg: 'bg-red-600/20' },
        teal: { bgColor: 'bg-teal-900/20', hoverBg: 'hover:bg-teal-800/30', iconBg: 'bg-teal-600/20' },
        green: { bgColor: 'bg-green-900/20', hoverBg: 'hover:bg-green-800/30', iconBg: 'bg-green-600/20' },
        orange: { bgColor: 'bg-orange-900/20', hoverBg: 'hover:bg-orange-800/30', iconBg: 'bg-orange-600/20' },
        cyan: { bgColor: 'bg-cyan-900/20', hoverBg: 'hover:bg-cyan-800/30', iconBg: 'bg-cyan-600/20' },
    }
};

// Status configurations for applications
export const APPLICATION_STATUS_CONFIG = {
    active: {
        label: 'Active',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        darkBgColor: 'bg-green-900/20',
        darkTextColor: 'text-green-400'
    },
    maintenance: {
        label: 'Maintenance',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        darkBgColor: 'bg-yellow-900/20',
        darkTextColor: 'text-yellow-400'
    },
    beta: {
        label: 'Beta',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        darkBgColor: 'bg-blue-900/20',
        darkTextColor: 'text-blue-400'
    },
    deprecated: {
        label: 'Deprecated',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        darkBgColor: 'bg-red-900/20',
        darkTextColor: 'text-red-400'
    }
};



// Component configuration
export const APPLICATION_HUB_CONFIG = {
    defaultActiveTab: 'applications',
    applicationsPerPage: 8,
    animationDelay: 0.1,
    animationDuration: 0.3,
    gridConfig: {
        cols: {
            sm: 2,
            lg: 3,
            xl: 4
        },
        gap: {
            default: 4,
            md: 6
        }
    },
    // Enable/Disable configuration
    enableDisable: {
        showDisabledApps: true, // Whether to show disabled apps in the list
        showStatusBadges: true, // Whether to show status badges on app cards
        allowToggle: true, // Whether users can toggle app status
        requireConfirmation: true // Whether to require confirmation for status changes
    }
};

// Helper functions
export const getApplicationHubColorScheme = (color, theme = 'light') => {
    return APPLICATION_HUB_COLORS[theme]?.[color] || APPLICATION_HUB_COLORS[theme]?.purple;
};

export const getApplicationHubAppById = (id) => {
    return APPLICATION_HUB_APPS.find(app => app.id === id);
};

export const getApplicationHubAppsByCategory = (category) => {
    return APPLICATION_HUB_APPS.filter(app => app.category === category);
};

export const searchApplicationHubApps = (query) => {
    const searchTerm = query.toLowerCase().trim();
    return APPLICATION_HUB_APPS.filter(app =>
        app.name.toLowerCase().includes(searchTerm) ||
        app.description.toLowerCase().includes(searchTerm) ||
        app.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
};

export const getApplicationHubTabById = (id) => {
    return APPLICATION_HUB_TABS.find(tab => tab.id === id);
};

// Enable/Disable helper functions
export const getEnabledApplications = () => {
    return APPLICATION_HUB_APPS.filter(app => app.enabled);
};

export const getDisabledApplications = () => {
    return APPLICATION_HUB_APPS.filter(app => !app.enabled);
};

export const getApplicationsByStatus = (status) => {
    return APPLICATION_HUB_APPS.filter(app => app.status === status);
};

export const getApplicationStatusConfig = (status) => {
    return APPLICATION_STATUS_CONFIG[status] || APPLICATION_STATUS_CONFIG.active;
};

export const toggleApplicationStatus = (appId, newEnabled) => {
    const app = APPLICATION_HUB_APPS.find(app => app.id === appId);
    if (app) {
        app.enabled = newEnabled;
        return true;
    }
    return false;
};

export const updateApplicationStatus = (appId, newStatus) => {
    const app = APPLICATION_HUB_APPS.find(app => app.id === appId);
    if (app) {
        app.status = newStatus;
        return true;
    }
    return false;
};

export const getApplicationStats = () => {
    const total = APPLICATION_HUB_APPS.length;
    const enabled = APPLICATION_HUB_APPS.filter(app => app.enabled).length;
    const disabled = total - enabled;

    const statusCounts = {};
    APPLICATION_HUB_APPS.forEach(app => {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    return {
        total,
        enabled,
        disabled,
        statusCounts,
        enabledPercentage: Math.round((enabled / total) * 100)
    };
}; 