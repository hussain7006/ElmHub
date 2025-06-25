import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import useThemeStore from '../../../store/themeStore';
import {
    EyeIcon,
    UserGroupIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import ExaminationCenter from '../../../Components/App/MyApplications/ExaminationCenter';
import PeopleAnalytics from '../../../Components/App/MyApplications/PeopleAnalytics';

// Configuration for your personal deployed applications
const PERSONAL_APPS = {
    examination: {
        name: 'Examination Center',
        url: 'https://www.examinationcenter.com.pk',
        icon: EyeIcon,
        color: '#3B82F6',
        description: 'AI-powered exam monitoring and cheating detection'
    },
    peopleanalytics: {
        name: 'People Analytics',
        url: 'https://www.google.com.pk',
        icon: UserGroupIcon,
        color: '#10B981',
        description: 'Advanced people detection and analysis'
    },
    google: {
        name: 'Google',
        url: 'https://www.google.com.pk',
        icon: GlobeAltIcon,
        color: '#10B981',
        description: 'Advanced people detection and analysis'
    }
};

export default function ExternalApp() {
    const { appName } = useParams();
    const { colors } = useThemeStore();
    const [isLoading, setIsLoading] = useState(true);
    console.log("appName", appName);
    
    const appConfig = PERSONAL_APPS[appName.toLowerCase()];

    console.log("appConfig", appConfig);
    
    useEffect(() => {
        setIsLoading(true);
        // Simulate loading
        // const timer = setTimeout(() => setIsLoading(false), 1000);
        // return () => clearTimeout(timer);
    }, [appName]);
    
    if (!appConfig) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                        Application Not Found
                    </h1>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                        The requested application is not configured or deployed.
                    </p>
                </div>
            </div>
        );
    }

    // Render Examination Center UI
    if (appName === 'examination') {
        return (
            <div className="h-full flex flex-col">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-6 border-b"
                    style={{ borderColor: colors.borderColor, backgroundColor: colors.surface }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: appConfig.color }}
                            >
                                <appConfig.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                                    {appConfig.name}
                                </h1>
                                <p className="text-sm" style={{ color: colors.textSecondary }}>
                                    {appConfig.description}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => window.open(appConfig.url, '_blank')}
                            className="px-4 py-2 rounded-lg transition-colors cursor-not-allowed opacity-50"
                            style={{ 
                                backgroundColor: colors.accent, 
                                color: 'white' 
                            }}
                            disabled={true}
                        >
                            Open Full App
                        </button>
                    </div>
                </motion.div>

                {/* Examination Center Content */}
                <ExaminationCenter />
            </div>
        );
    }

    // Render People Analytics UI
    if (appName === 'peopleanalytics') {
        return (
            <div className="h-full flex flex-col">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-6 border-b"
                    style={{ borderColor: colors.borderColor, backgroundColor: colors.surface }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: appConfig.color }}
                            >
                                <appConfig.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                                    {appConfig.name}
                                </h1>
                                <p className="text-sm" style={{ color: colors.textSecondary }}>
                                    {appConfig.description}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => window.open(appConfig.url, '_blank')}
                            className="px-4 py-2 rounded-lg transition-colors cursor-not-allowed opacity-50"
                            style={{ 
                                backgroundColor: colors.accent, 
                                color: 'white' 
                            }}
                            disabled={true}
                        >
                            Open Full App
                        </button>
                    </div>
                </motion.div>

                {/* People Analytics Content */}
                <PeopleAnalytics />
            </div>
        );
    }

    // Default iframe for other apps
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-4 border-b flex items-center justify-between"
                style={{ borderColor: colors.borderColor, backgroundColor: colors.surface }}
            >
                <div className="flex items-center space-x-3">
                    <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center" 
                        style={{ backgroundColor: appConfig.color }}
                    >
                        <appConfig.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                            {appConfig.name}
                        </h1>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                            {appConfig.description}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => window.open(appConfig.url, '_blank')}
                        className="px-3 py-1 text-sm rounded-lg transition-colors"
                        style={{ 
                            backgroundColor: colors.accent, 
                            color: 'white' 
                        }}
                    >
                        Open in New Tab
                    </button>
                </div>
            </motion.div>

            {/* Embedded Application */}
            <div className="flex-1 relative">
                <iframe
                    src={appConfig.url}
                    className="w-full h-full border-0"
                    title={appConfig.name}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
                    loading="lazy"
                />
            </div>
        </div>
    );
} 