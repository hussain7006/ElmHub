import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import useThemeStore from '../../../../store/themeStore';
import useApplicationHubStore from '../../../../store/applicationHubStore';
import ElmTitle from './ElmTitle';
import ApplicationLoader from './ApplicationLoader';
import {
    APPLICATION_HUB_TABS,
    APPLICATION_HUB_APPS,
    getApplicationHubColorScheme,
    APPLICATION_HUB_CONFIG,
    getApplicationStatusConfig
} from '../../../../Constants/applicationHub';
import { ApiService } from '../../../../services/api';
import { CookieUtils } from '../../../../utils/cookies';
import { NUHA_CREDENTIALS } from '../../../../Constants/nuha';
import { removeLocalStorage } from '../../../../utils/localStorage';
import Tutorials from '../../../../Pages/App/Tutorials/Tutorials';

// The main ApplicationHub component
export default function ApplicationHub() {
    const iframeRef = useRef(null);
    const { colors, theme } = useThemeStore();
    const {
        activeTab,
        setActiveTab,
        showIframe,
        setShowIframe,
        activeApp,
        setActiveApp,
        isLoading,
        setIsLoading,
        error,
        setError,
        launchingApp,
        setLaunchingApp,
        iframeLoaded,
        setIframeLoaded,
        launchApplication,
        closeApplication,
        onIframeLoad
    } = useApplicationHubStore();

    const [isExpanded, setIsExpanded] = useState(false); // State for See More/Less
    const [timeoutId, setTimeoutId] = useState(null);

    // Handle iframe loading timeout
    useEffect(() => {
        if (isLoading && showIframe && activeApp) {
            // Set a timeout for 30 seconds
            const timeout = setTimeout(() => {
                // Handle timeout directly
                setIsLoading(false);
                setIframeLoaded(true);
                setError(new Error('Application took too long to load. Please try again.'));
            }, 30000); // 30 seconds timeout

            setTimeoutId(timeout);
        } else {
            // Clear timeout if not loading
            if (timeoutId) {
                clearTimeout(timeoutId);
                setTimeoutId(null);
            }
        }

        // Cleanup on unmount
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isLoading, showIframe, activeApp]);

    // PostMessage theme communication effect
    useEffect(() => {
        // Create dynamic theme object based on current theme state
        const postTheme = {
            type: "elmhub",
            theme: {
                mode: theme,
                primaryColor: colors.primary,
                backgroundColor: colors.background,
                textColor: colors.textPrimary,
                surfaceColor: colors.surface,
                borderColor: "red",
                textSecondaryColor: colors.textSecondary
            },
            colors: colors,
            showHeader: false,
        };

        const sendThemeToChild = () => {
            console.log("Sending theme to iframe:", postTheme);

            if (iframeRef.current?.contentWindow) {
                try {
                    iframeRef.current.contentWindow.postMessage(postTheme, "*");
                } catch (error) {
                    console.error("Failed to send theme to iframe:", error);
                }
            }
        };

        // Listen for messages from iframe
        const handleMessage = (event) => {
            // Basic origin validation (you can make this more strict)
            if (event.source !== iframeRef.current?.contentWindow) {
                return;
            }

            if (event.data === "READY_FOR_ELMHUB_MESSAGE") {
                console.log("Iframe is ready. Sending theme...");
                sendThemeToChild();
            } else if (event.data?.type === "THEME_REQUEST") {
                console.log("Iframe requested theme. Sending...");
                sendThemeToChild();
            }
        };

        window.addEventListener("message", handleMessage);

        // Send theme immediately if iframe is already loaded
        if (iframeLoaded && iframeRef.current?.contentWindow) {
            sendThemeToChild();
        }

        // Fallback: send after 1 second if no response
        const fallbackTimeout = setTimeout(() => {
            if (iframeLoaded) {
                sendThemeToChild();
            }
        }, 1000);

        return () => {
            window.removeEventListener("message", handleMessage);
            clearTimeout(fallbackTimeout);
        };
    }, [theme, colors, iframeLoaded]); // Dependencies ensure theme updates are sent

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
            };
            console.log("appWithIframe", appWithIframe);
            // Use specific API call for Nuha AI
            // if (app.id === 'nuhaai') {
            //     response = await ApiService.signInNuhaAI(NUHA_CREDENTIALS.email, NUHA_CREDENTIALS.password, app.id);
            //     await new Promise(resolve => setTimeout(resolve, 1000));
            //     if (response.success) {
            //         launchApplication(appWithIframe);
            //     } else {
            //         setError(new Error(response.error || 'Failed to launch application'));
            //         setIsLoading(false);
            //         setLaunchingApp(null);
            //     }
            //     return;
            // }

            launchApplication(appWithIframe);

        } catch (err) {
            setError(new Error('Failed to launch application. Please try again.'));
            setIsLoading(false);
            setLaunchingApp(null);
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
        if (activeApp && activeApp.id === 'nuhaai') {
            console.log("handleIframeBack", activeApp);
            // CookieUtils.deleteCookie('token');
            removeLocalStorage('token');
        }
        closeApplication();
    };

    // If iframe is active, show it in the right content area
    if (showIframe && activeApp) {
        return (
            <div
                className="flex flex-col font-sans"
                style={{
                    backgroundColor: colors.background,
                    height: 'calc(100vh - 80px)', // Account for top nav height
                    maxHeight: 'calc(100vh - 80px)'
                }}
            >
                {/* Header with back button */}
                <div className="flex-shrink-0 px-0 pb-2 border-b" style={{ borderColor: colors.borderColor }}>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleIframeBack}
                            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                            style={{ color: colors.textSecondary }}
                            aria-label="Go back"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>

                        <div className="flex-1 min-w-0">
                            <h1
                                className="text-xl font-semibold truncate"
                                style={{ color: colors.textPrimary }}
                            >
                                {activeApp.name}
                            </h1>
                            <p
                                className="text-sm truncate mt-0.5"
                                style={{ color: colors.textSecondary }}
                            >
                                {activeApp.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Iframe Container - Takes remaining space */}
                <div className="flex-1 relative overflow-hidden">
                    {/* Loading Overlay */}
                    {isLoading && (
                        <div
                            className="absolute inset-0 flex items-center justify-center z-10"
                            style={{ backgroundColor: colors.background }}
                        >
                            <div className="text-center p-6 rounded-lg shadow-lg" style={{ backgroundColor: colors.surface }}>
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                                    style={{ borderColor: colors.primary }}
                                />
                                <p className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                                    Loading {activeApp.name}
                                </p>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>
                                    Please wait while the application initializes...
                                </p>
                                <div className="mt-4 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full animate-pulse"
                                        style={{ backgroundColor: colors.primary }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Iframe */}
                    <iframe
                        ref={iframeRef}
                        src={activeApp.iframeUrl}
                        title={activeApp.name}
                        className="w-full h-full border-0"
                        allowFullScreen
                        allow="camera; microphone; geolocation; encrypted-media; clipboard-read; clipboard-write"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
                        onLoad={() => {
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                                setTimeoutId(null);
                            }
                            onIframeLoad();
                        }}
                        onError={() => {
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                                setTimeoutId(null);
                            }
                            setError(new Error(`Failed to load ${activeApp.name}. Please check your connection and try again.`));
                            setIsLoading(false);
                        }}
                        style={{
                            opacity: iframeLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out'
                        }}
                    />
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
            case 'tutorials':
                return (
                    <Tutorials />
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