import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import useThemeStore from '../../../store/themeStore';

import ExaminationCenter from '../../../Components/App/MyApplications/ExaminationCenter';
import PeopleAnalytics from '../../../Components/App/MyApplications/PeopleAnalytics';
import { getApplication } from '../../../Constants/applications';
import usePageSearch from '../../../hooks/usePageSearch';
// Configuration for your personal deployed applications


export default function ExternalApp() {
    const { appName } = useParams();
    const { colors } = useThemeStore();
    const [isLoading, setIsLoading] = useState(true);

    const appConfig = getApplication(appName.toLowerCase());

    // Page-specific search function
    const searchMyApplications = useCallback(async (query) => {
        const { searchApplications } = await import('../../../Constants/applications');
        return searchApplications(query);
    }, []);

    // Register page search function
    usePageSearch(searchMyApplications);

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
            <div className="relative h-full flex flex-col">
                {/* Header */}
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => window.open(appConfig.url, '_blank')}
                    className="px-2 py-2 rounded-lg transition-colors cursor-not-allowed opacity-50 absolute top-5 right-10"
                    style={{
                        backgroundColor: colors.accent,
                        color: 'white'
                    }}
                    disabled={true}
                >
                    Open Full App
                </motion.button>

                {/* Examination Center Content */}
                <ExaminationCenter />
            </div>
        );
    }

    // Render People Analytics UI
    if (appName === 'peopleanalytics') {
        return (
            <div className="relative h-full flex flex-col">
                {/* Header */}
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => window.open(appConfig.url, '_blank')}
                    className="px-2 py-2 rounded-lg transition-colors cursor-not-allowed opacity-50 absolute top-5 right-10"
                    style={{
                        backgroundColor: colors.accent,
                        color: 'white'
                    }}
                    disabled={true}
                >
                    Open Full App
                </motion.button>

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