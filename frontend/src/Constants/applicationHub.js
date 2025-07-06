import {
    Squares2X2Icon,
    NewspaperIcon,
    PlayIcon,
    ChatBubbleLeftEllipsisIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    DocumentTextIcon,
    VideoCameraIcon,
    LanguageIcon,
    InboxIcon,
    CursorArrowRaysIcon,
    UserGroupIcon
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
    {
        id: 'news',
        name: 'News',
        icon: NewspaperIcon,
        description: 'Latest news and updates'
    },
    {
        id: 'tutorials',
        name: 'Tutorials',
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
        icon: ChatBubbleLeftEllipsisIcon,
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
        icon: ChatBubbleLeftEllipsisIcon,
        color: 'orange',
        category: 'AI Tools',
        tags: ['ai', 'assistant', 'chat', 'personal'],
        enabled: true,
        status: 'active',
        iframeUrl: URL.BALEEG,
        lastUpdated: '2024-01-12',
        iframeUrl: 'https://nuha.ai:3001/',
    },
    {
        id: 'people-analytics',
        name: 'People Analytics',
        description: 'Gain insights into your organization.',
        icon: UserGroupIcon,
        color: 'teal',
        category: 'Analytics',
        tags: ['analytics', 'people', 'team', 'organization', 'insights', 'hr'],
        enabled: true,
        status: 'beta',
        lastUpdated: '2024-06-01',
        // iframeUrl: 'http://localhost:5175/pa/',
        iframeUrl: URL.PEOPLE_ANALYTICS,
        version: '0.9.0'
    },

    // { 
    //     id: 'assistant',
    //     name: 'Assistant', 
    //     description: 'Your personal AI assistant.', 
    //     icon: ChatBubbleLeftEllipsisIcon, 
    //     color: 'purple',
    //     category: 'AI Tools',
    //     tags: ['ai', 'assistant', 'chat', 'personal'],
    //     enabled: true,
    //     status: 'active',
    //     lastUpdated: '2024-01-12',
    //     iframeUrl: 'http://138.197.186.229/',
    //     authTokenName: '',
    //     version: '2.1.0'
    // },
    // { 
    //     id: 'explore',
    //     name: 'Explore', 
    //     description: 'Search the Internet.', 
    //     icon: MagnifyingGlassIcon, 
    //     color: 'blue',
    //     category: 'Search',
    //     tags: ['search', 'internet', 'explore', 'browse'],
    //     enabled: true,
    //     status: 'active',
    //     lastUpdated: '2024-01-08',
    //     iframeUrl: 'http://138.197.186.229/',
    //     authTokenName: '',
    //     version: '1.5.0'
    // },
    // { 
    //     id: 'scribe',
    //     name: 'Scribe', 
    //     description: 'Write, reformulate and correct.', 
    //     icon: PencilSquareIcon, 
    //     color: 'indigo',
    //     category: 'Writing',
    //     tags: ['writing', 'text', 'correction', 'reformulation'],
    //     enabled: true,
    //     status: 'active',
    //     lastUpdated: '2024-01-14',
    //     iframeUrl: 'http://138.197.186.229/',
    //     authTokenName: '',
    //     version: '1.8.0'
    // },
    // { 
    //     id: 'docs',
    //     name: 'Docs', 
    //     description: 'Manage and chat with your files.', 
    //     icon: DocumentTextIcon, 
    //     color: 'red',
    //     category: 'Documentation',
    //     tags: ['files', 'documents', 'management', 'chat'],
    //     enabled: false, // Disabled for maintenance
    //     status: 'maintenance',
    //     lastUpdated: '2024-01-05',
    //     iframeUrl: 'http://138.197.186.229/',
    //     authTokenName: '',
    //     version: '1.3.0',
    //     maintenanceMessage: 'Scheduled maintenance - Back online soon'
    // },
    // { 
    //     id: 'recap',
    //     name: 'Recap', 
    //     description: 'Smart meeting notes.', 
    //     icon: VideoCameraIcon, 
    //     color: 'teal',
    //     category: 'Productivity',
    //     tags: ['meeting', 'notes', 'recording', 'smart'],
    //     enabled: true,
    //     status: 'beta',
    //     lastUpdated: '2024-01-13',
    //     iframeUrl: 'http://138.197.186.229/',
    //     authTokenName: '',
    //     version: '0.9.0'
    // },
    // { 
    //     id: 'trad',
    //     name: 'Trad', 
    //     description: 'Translate text and files.', 
    //     icon: LanguageIcon, 
    //     color: 'green',
    //     category: 'Translation',
    //     tags: ['translation', 'language', 'text', 'files'],
    //     enabled: true,
    //     status: 'active',
    //     lastUpdated: '2024-01-11',
    //     iframeUrl: 'http://138.197.186.229/',
    //     authTokenName: '',
    //     version: '1.1.0'
    // },
    // { 
    //     id: 'actu',
    //     name: 'Actu', 
    //     description: 'Automated newsletters.', 
    //     icon: InboxIcon, 
    //     color: 'orange',
    //     category: 'Communication',
    //     tags: ['newsletter', 'automation', 'email', 'communication'],
    //     enabled: false, // Disabled
    //     status: 'deprecated',
    //     lastUpdated: '2023-12-20',
    //     iframeUrl: 'http://138.197.186.229/',
    //     authTokenName: '',
    //     version: '1.0.0',
    //     deprecationMessage: 'This app has been deprecated and will be removed soon'
    // },
    // { 
    //     id: 'companion',
    //     name: 'Companion', 
    //     description: 'Delos in your browser.', 
    //     icon: CursorArrowRaysIcon, 
    //     color: 'cyan',
    //     category: 'Browser',
    //     tags: ['browser', 'companion', 'extension', 'delos'],
    //     enabled: true,
    //     status: 'active',
    //     lastUpdated: '2024-01-16',
    //     iframeUrl: 'http://138.197.186.229/',
    //     authTokenName: '',
    //     version: '1.4.0'
    // },
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

// Tab content configurations
export const APPLICATION_HUB_CONTENT = {
    news: {
        title: 'News Feed',
        description: 'Latest news and updates will be displayed in this section.',
        placeholder: 'No news available at the moment.'
    },
    tutorials: {
        title: 'Tutorials Library',
        description: 'Browse our collection of helpful tutorials and guides.',
        placeholder: 'Tutorials will be available soon.'
    }
};

// Component configuration
export const APPLICATION_HUB_CONFIG = {
    defaultActiveTab: 'applications',
    applicationsPerPage: 4,
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