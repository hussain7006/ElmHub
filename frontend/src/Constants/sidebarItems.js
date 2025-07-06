import {
    HomeIcon,
    ClipboardDocumentListIcon,
    BeakerIcon,
    UserIcon,
    SparklesIcon,
    ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';

export const sidebarItems = [
    {
        title: 'Products',
        items: [
            // { name: 'Home', icon: HomeIcon, path: '/', disabled: false },
            { name: 'Home', icon: SparklesIcon, path: '/', disabled: false },
            // { name: 'Examination Center', icon: BeakerIcon, path: '/examination-center', disabled: false },
            // { name: 'People Analytics', icon: ClipboardDocumentListIcon, path: '/people-analytics', disabled: false },
        ]
    },
    {
        title: 'My Applications',
        items: [
           
            // { name: 'Examination Center', icon: BeakerIcon, path: '/products/examination', disabled: false },
            // { name: 'People Analytics', icon: ClipboardDocumentListIcon, path: '/products/peopleanalytics', disabled: false },
            // { name: 'Google', icon: ClipboardDocumentListIcon, path: '/products/Google', disabled: false },
        ]
    },
    {
        title: 'Product Demos',
        items: [
            {
                name: 'Examination Center',
                icon: BeakerIcon,
                path: '/demo/examination-center',
                disabled: false
            },
            {
                name: 'People Analytics',
                icon: ClipboardDocumentListIcon,
                path: '/demo/people-analytics',
                disabled: false
            }
        ]
    },
    {
        title: 'Settings',
        items: [
            // { name: 'User Management', icon: UserGroupIcon, path: '/user-management', disabled: true },
            { name: 'Profile', icon: UserIcon, path: '/user-management', disabled: true },
            // { name: 'Data Resources', icon: CircleStackIcon, path: '/data-resources', disabled: true },
        ]
    },
    // {
    //   title: 'Analytics Dashboard',
    //   items: [
    //     { name: 'Notifications', icon: BellIcon, path: '/notifications', disabled: true },
    //     { name: 'API Management', icon: CodeBracketIcon, path: '/api-management', disabled: true },
    //   ]
    // }
];