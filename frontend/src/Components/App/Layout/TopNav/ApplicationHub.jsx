import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import useThemeStore from '../../../../store/themeStore';
import ElmTitle from './ElmTitle';
import ApplicationLoader from './ApplicationLoader';
import {
    APPLICATION_HUB_TABS,
    APPLICATION_HUB_APPS,
    getApplicationHubColorScheme,
    APPLICATION_HUB_CONTENT,
    APPLICATION_HUB_CONFIG,
    getApplicationStatusConfig
} from '../../../../Constants/applicationHub';
import { ApiService } from '../../../../services/api';
import { CookieUtils } from '../../../../utils/cookies';
import { NUHA_CREDENTIALS } from '../../../../Constants/nuha';

// The main ApplicationHub component
export default function ApplicationHub() {
    const { colors, theme } = useThemeStore();
    // State to keep track of the active tab. Using the default from config.
    const [activeTab, setActiveTab] = useState(APPLICATION_HUB_CONFIG.defaultActiveTab);
    const [isExpanded, setIsExpanded] = useState(false); // State for See More/Less

    // Application launch states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [launchingApp, setLaunchingApp] = useState(null);
    const [activeApp, setActiveApp] = useState(null);
    const [showIframe, setShowIframe] = useState(false);

    // Credentials for Nuha AI (in production, this should be handled securely)


    // Handle application launch
    const handleAppLaunch = async (app) => {
        if (!app.enabled || app.status === 'deprecated') {
            return;
        }

        setIsLoading(true);
        setError(null);
        setLaunchingApp(app);

        try {
            let response;
            const appWithIframe = {
                ...app,
                iframeUrl: app.iframeUrl
                // iframeUrl: "http://138.197.186.229/"
            };
            // Use specific API call for Nuha AI
            if (app.id === 'nuhaai') {
                response = await ApiService.signInNuhaAI(NUHA_CREDENTIALS.email, NUHA_CREDENTIALS.password, app.id);
                if (response.success) {
                    setActiveApp(appWithIframe);
                    setShowIframe(true);
                    setError(null);
                } else {
                    setError(new Error(response.error || 'Failed to launch application'));
                }
                return;
            }


            console.log("appWithIframe", appWithIframe);
            setActiveApp(appWithIframe);
            // setShowIframe(true);
            setError(null);

        } catch (err) {
            setError(new Error('Failed to launch application. Please try again.'));
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                setShowIframe(true);
                setLaunchingApp(null);
            }, 2000)
        }
    };

    // Handle retry
    const handleRetry = () => {
        if (launchingApp) {
            handleAppLaunch(launchingApp);
        }
    };

    // Handle close loader
    const handleCloseLoader = () => {
        setIsLoading(false);
        setError(null);
        setLaunchingApp(null);
    };



    // Handle iframe back
    const handleIframeBack = () => {
        setShowIframe(false);
        setActiveApp(null);
        if (activeApp.id === 'nuhaai') {
            console.log("handleIframeBack", activeApp);
            CookieUtils.deleteCookie('token');

        }
    };

    // If iframe is active, show it instead of the hub
    if (showIframe && activeApp) {
        return (
            <div className="mt-0 flex flex-col items-center justify-center font-sans">
                <div className="w-full">
                    {/* Header with back button */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleIframeBack}
                                className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                style={{ color: colors.textSecondary }}
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                            </button>

                            <div>
                                <h1
                                    className="text-xl font-semibold"
                                    style={{ color: colors.textPrimary }}
                                >
                                    {activeApp.name}
                                </h1>
                                <p
                                    className="text-sm"
                                    style={{ color: colors.textSecondary }}
                                >
                                    {activeApp.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Iframe */}
                    <div className="w-full h-[80vh] rounded-lg overflow-hidden border"
                        style={{ borderColor: colors.borderColor }}>
                        <iframe
                            src={activeApp.iframeUrl}
                            title={activeApp.name}
                            className="w-full h-full border-0"
                            allowFullScreen
                            allow="camera; microphone; geolocation; encrypted-media"
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Reusable Application Card Component with animation
    const ApplicationCard = ({ app }) => {
        const { icon: Icon, name, description, color, enabled, status } = app;
        const cardStyle = getApplicationHubColorScheme(color, theme);
        const statusConfig = getApplicationStatusConfig(status);

        // Determine if app should be interactive
        const isInteractive = enabled && status !== 'deprecated';

        // Get appropriate classes based on enabled state
        const cardClasses = `
            rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out relative
            ${isInteractive
                ? 'hover:scale-105 group cursor-pointer'
                : 'cursor-not-allowed opacity-60'
            }
        `;

        const backgroundClasses = `
            h-16 ${cardStyle.bgColor} transition-colors duration-300 relative
            ${isInteractive ? cardStyle.hoverBg : ''}
        `;

        const iconClasses = `
            absolute -bottom-5 left-4 w-10 h-10 rounded-lg flex items-center justify-center 
            ${cardStyle.iconBg} shadow-sm
        `;

        const handleClick = (e) => {
            if (!isInteractive) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            // Launch the application
            handleAppLaunch(app);
        };

        return (
            <motion.div
                className={cardClasses}
                style={{ backgroundColor: colors.surface }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: APPLICATION_HUB_CONFIG.animationDuration }}
                onClick={handleClick}
            >
                {/* Colored background section - 25% height */}
                <div className={backgroundClasses}>
                    {/* Icon positioned to overlap both sections */}
                    <div className={iconClasses}>
                        <Icon
                            className="w-6 h-6"
                            style={{
                                color: isInteractive ? colors.textPrimary : colors.textSecondary
                            }}
                        />
                    </div>

                    {/* Status badge for disabled/maintenance apps */}
                    {!isInteractive && (
                        <div
                            className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                                backgroundColor: theme === 'dark' ? statusConfig.darkBgColor : statusConfig.bgColor,
                                color: theme === 'dark' ? statusConfig.darkTextColor : statusConfig.textColor
                            }}
                        >
                            {statusConfig.label}
                        </div>
                    )}
                </div>

                {/* Text content section - 75% height with top padding for icon */}
                <div className="p-4 pt-8">
                    <h4
                        className="font-semibold"
                        style={{
                            color: isInteractive ? colors.textPrimary : colors.textSecondary
                        }}
                    >
                        {name}
                    </h4>
                    <p
                        className="text-sm mt-1"
                        style={{
                            color: isInteractive ? colors.textSecondary : colors.textSecondary
                        }}
                    >
                        {description}
                    </p>

                    {/* Status message for disabled apps */}
                    {!isInteractive && app.maintenanceMessage && (
                        <p
                            className="text-xs mt-2 italic"
                            style={{ color: colors.textSecondary }}
                        >
                            {app.maintenanceMessage}
                        </p>
                    )}

                    {!isInteractive && app.deprecationMessage && (
                        <p
                            className="text-xs mt-2 italic"
                            style={{ color: colors.textSecondary }}
                        >
                            {app.deprecationMessage}
                        </p>
                    )}
                </div>
            </motion.div>
        );
    };

    // Helper function to render the content based on the active tab.
    const renderContent = () => {
        switch (activeTab) {
            case 'applications':
                // Filter applications based on configuration
                let filteredApplications = APPLICATION_HUB_APPS;
                if (!APPLICATION_HUB_CONFIG.enableDisable.showDisabledApps) {
                    filteredApplications = APPLICATION_HUB_APPS.filter(app => app.enabled);
                }

                const displayedApplications = isExpanded
                    ? filteredApplications
                    : filteredApplications.slice(0, APPLICATION_HUB_CONFIG.applicationsPerPage);

                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4" style={{ color: colors.textPrimary }}>Apps</h3>
                        <div className={`grid grid-cols-1 sm:grid-cols-${APPLICATION_HUB_CONFIG.gridConfig.cols.sm} lg:grid-cols-${APPLICATION_HUB_CONFIG.gridConfig.cols.lg} xl:grid-cols-${APPLICATION_HUB_CONFIG.gridConfig.cols.xl} gap-${APPLICATION_HUB_CONFIG.gridConfig.gap.default} md:gap-${APPLICATION_HUB_CONFIG.gridConfig.gap.md}`}>
                            {displayedApplications.map((app, index) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: APPLICATION_HUB_CONFIG.animationDuration,
                                        delay: index * APPLICATION_HUB_CONFIG.animationDelay
                                    }}
                                >
                                    <ApplicationCard app={app} />
                                </motion.div>
                            ))}
                        </div>
                        {filteredApplications.length > APPLICATION_HUB_CONFIG.applicationsPerPage && (
                            <motion.div
                                className="mt-8 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: APPLICATION_HUB_CONFIG.animationDuration,
                                    delay: 0.5
                                }}
                            >
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="inline-flex items-center gap-2 font-semibold transition-colors duration-200 cursor-pointer"
                                    style={{ color: colors.primary }}
                                >
                                    <span>{isExpanded ? 'See Less' : 'See More'}</span>
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: APPLICATION_HUB_CONFIG.animationDuration }}
                                    >
                                        {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                                    </motion.div>
                                </button>
                            </motion.div>
                        )}
                    </div>
                );
            case 'news':
                return (
                    <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: colors.surface }}
                    >

                        <h3
                            className="text-lg font-semibold"
                            style={{ color: colors.textPrimary }}
                        >
                            {APPLICATION_HUB_CONTENT.news.title}
                        </h3>
                        <p
                            className="mt-2"
                            style={{ color: colors.textSecondary }}
                        >
                            {APPLICATION_HUB_CONTENT.news.description}
                        </p>

                    </div>
                );
            case 'tutorials':
                return (
                    <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: colors.surface }}
                    >
                        <h3
                            className="text-lg font-semibold"
                            style={{ color: colors.textPrimary }}
                        >
                            {APPLICATION_HUB_CONTENT.tutorials.title}
                        </h3>
                        <p
                            className="mt-2"
                            style={{ color: colors.textSecondary }}
                        >
                            {APPLICATION_HUB_CONTENT.tutorials.description}
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="mt-10 flex flex-col items-center justify-center font-sans">
                <div className="w-full px-4">

                    <ElmTitle />

                    {/* Tab Navigation Container */}
                    <div className="mb-4 w-md mx-auto">
                        <div
                            className="border border-gray-200 dark:border-gray-700 p-1.5 rounded-md flex items-center justify-between space-x-1"
                            style={{
                                backgroundColor: colors.background
                            }}
                        >
                            {APPLICATION_HUB_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        w-full flex items-center justify-center space-x-2 text-sm font-medium p-2 rounded-sm 
                                        transition-all duration-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800
                                        ${activeTab === tab.id
                                            ? 'bg-gray-100 dark:bg-gray-800'
                                            : 'hover:bg-opacity-60'
                                        }
                                    `}
                                    style={{
                                        color: activeTab === tab.id ? colors.textPrimary : colors.textSecondary,
                                        '--tw-bg-opacity': activeTab === tab.id ? '1' : '0.6'
                                    }}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content Area */}
                    <div className="mt-6">
                        {renderContent()}
                    </div>

                </div>
            </div>

            {/* Application Loader */}
            <ApplicationLoader
                isLoading={isLoading}
                error={error}
                appName={launchingApp?.name || 'Application'}
                onRetry={handleRetry}
                onClose={handleCloseLoader}
            />
        </>
    );
} 