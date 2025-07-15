import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../../config/colors";
import useAuthStore from "../../store/authStore";
import useSpecialistDashboardStore from "../../store/specialistDashboardStore";
import { useState } from "react";
import { completeSession, getSessionAlertsList, handleDownload } from "../../services/specialist/sessions";
import useSWR from "swr";
import VideoStream from "../../components/VideoStream";
import CompleteSessionModal from "../../components/modals/CompleteSessionModal";
import SuccessModal from "../../components/modals/SuccessModal";

export default function Sessions({ sessionsLst, isLoading }) {
    const { theme, showHeader } = useAuthStore();
    const {
        activeTab,
        selectedSession,
        setActiveTab,
        setSelectedSession,
    } = useSpecialistDashboardStore();

    const [loading, setLoading] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleCompleteSession = async () => {
        setLoading(true);
        try {
            await completeSession(selectedSession.id, feedback);
            setShowCompleteModal(false);
            setFeedback("");
            setShowSuccess(true);
            await mutate("getSessionsList");
            setSelectedSession(null);
            // Optionally refresh session list here
        } catch (e) {
            // Optionally show error
        } finally {
            setLoading(false);
        }
    };

    const RenderSessionCard = () => {
        const temp_sessions = sessionsLst.filter(
            (session) => session.status === activeTab
        );

        return (
            <>
                {temp_sessions.map((session) => (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                        style={
                            theme === "light"
                                ? { border: `1px solid ${colors.gray[200]}` }
                                : { border: `1px solid ${colors.gray[700]}` }
                        }
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3
                                        className="text-lg font-semibold mb-1"
                                        style={
                                            theme === "light" ? { color: colors.primary.DEFAULT } : {}
                                        }
                                    >
                                        {session?.child?.first_name + " " + session?.child?.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Parent:{" "}
                                        {session?.parent?.first_name + " " + session?.parent?.last_name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Service: {session?.service?.title || "--"}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(session.date_of_session).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${session.status === "upcoming"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : session.status === "ongoing"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {session.status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                {session.description}
                            </p>

                            <div
                                className="flex items-center justify-between mt-4 pt-4 border-t"
                                style={
                                    theme === "light"
                                        ? { borderColor: colors.gray[200] }
                                        : { borderColor: colors.gray[700] }
                                }
                            >
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Activities: {session.activities?.length || 0}
                                </span>
                                {session.status == "ongoing" && (
                                    <button
                                        onClick={() => setSelectedSession(session)}
                                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                                    >
                                        View Details →
                                    </button>
                                )}
                                {session.status == "completed" && (
                                    <button
                                        onClick={() => handleDownload(session.report_path)}
                                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                                    >
                                        Download Report
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </>
        );
    };

    return (
        <div className={`${showHeader ? "h-[calc(100vh-170px)]" : "h-[calc(100vh-70px)]"} px-0`}>
            {!selectedSession && (
                <div
                    className="mb-8 border-b overflow-x-auto scrollbar-hide"
                    style={
                        theme === "light"
                            ? { borderColor: colors.gray[200] }
                            : { borderColor: colors.gray[800] }
                    }
                >
                    <div className="flex space-x-6 md:space-x-10 min-w-max">
                        {[
                            { id: "upcoming", label: "Upcoming", icon: "📅" },
                            { id: "ongoing", label: "Ongoing", icon: "⏳" },
                            { id: "completed", label: "Completed", icon: "✅" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-3 flex items-center space-x-2 font-medium relative transition-colors duration-200 cursor-pointer
                    ${activeTab === tab.id
                                        ? "text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <span className="text-xl">{tab.icon}</span>
                                <span>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                        }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {selectedSession ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <RenderSessionDetails
                            selectedSession={selectedSession}
                            theme={theme}
                            setShowCompleteModal={setShowCompleteModal}
                            setSelectedSession={setSelectedSession}
                            showCompleteModal={showCompleteModal}
                            feedback={feedback}
                            setFeedback={setFeedback}
                            loading={loading}
                            handleCompleteSession={handleCompleteSession}
                            showSuccess={showSuccess}
                            setShowSuccess={setShowSuccess}
                            getSessionAlertsList={getSessionAlertsList}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`overflow-y-auto ${showHeader ? "max-h-[calc(100vh-250px)]" : "max-h-[calc(100vh-150px)]"} px-2 grid gap-4 sm:grid-cols-1 md:grid-cols-2`}
                    >
                        {/* {sessions[activeTab].map(renderSessionCard)} */}
                        {isLoading ||
                            sessionsLst == null ||
                            sessionsLst == undefined ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-10 h-10 border-t-transparent border-b-transparent border-r-transparent border-l-transparent border-2 border-gray-400 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <RenderSessionCard />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}


function RenderSessionDetails({
    selectedSession,
    theme,
    setShowCompleteModal,
    setSelectedSession,
    showCompleteModal,
    feedback,
    setFeedback,
    loading,
    handleCompleteSession,
    showSuccess,
    setShowSuccess,
    getSessionAlertsList,
}) {
    const { data: alertsLst, isLoading: isLoadingAlerts } = useSWR(
        ["getSessionAlertsList", selectedSession?.id],
        () => getSessionAlertsList(selectedSession?.id),
        {
            refreshInterval: 4500,
            revalidateOnMount: true,
            revalidateIfStale: true,
            keepPreviousData: false,
        }
    );
    if (selectedSession.status === "ongoing") {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 "
            >
                {/* Top Card - Student Info and Metrics */}
                <div
                    className="p-4 md:p-6 rounded-lg shadow-lg"
                    style={
                        theme === "light"
                            ? {
                                background: colors.background.light,
                                color: colors.text.light,
                                border: `1px solid ${colors.gray[200]}`,
                            }
                            : {
                                background: colors.gray[800],
                                color: colors.text.dark,
                            }
                    }
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <div>
                                <h2
                                    className="text-xl md:text-2xl font-bold"
                                    style={
                                        theme === "light" ? { color: colors.primary.DEFAULT } : {}
                                    }
                                >
                                    {selectedSession.child.first_name}
                                </h2>
                                <p
                                    style={
                                        theme === "light"
                                            ? { color: colors.gray[500] }
                                            : { color: colors.gray[400] }
                                    }
                                >
                                    Age: 7 | Gender: Male
                                </p>
                            </div>
                            <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowCompleteModal(true)}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                            >
                                Complete Session
                            </button>
                            <button
                                onClick={() => setSelectedSession(null)}
                                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                                aria-label="Close"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { label: "Avg Gaze Fixation Time", value: "- sec" },
                            {
                                label: "No. of Activity solved",
                                value: `${selectedSession.activities.filter(
                                    (activity) => activity.is_completed
                                ).length
                                    } out of ${selectedSession.activities.length}`,
                            },
                            { label: "Expression", value: "-" },
                            { label: "Streaming Time", value: "- min" },
                            { label: "Reaction Time", value: "- sec" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg border"
                                style={
                                    theme === "light"
                                        ? {
                                            border: `1px solid ${colors.gray[200]}`,
                                            background: colors.background.light,
                                            color: colors.text.light,
                                        }
                                        : {
                                            border: `1px solid ${colors.gray[700]}`,
                                            background: colors.gray[900],
                                            color: colors.text.dark,
                                        }
                                }
                            >
                                <h3
                                    className="text-sm font-medium mb-2"
                                    style={
                                        theme === "light"
                                            ? { color: colors.gray[500] }
                                            : { color: colors.gray[400] }
                                    }
                                >
                                    {item.label}
                                </h3>
                                <p className="text-lg font-semibold">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className="p-2 md:p-4 rounded-lg shadow-lg"
                    style={
                        theme === "light"
                            ? {
                                background: colors.background.light,
                                color: colors.text.light,
                                border: `1px solid ${colors.gray[200]}`,
                            }
                            : {
                                background: colors.gray[800],
                                color: colors.text.dark,
                            }
                    }
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <div>
                                <h2
                                    className="text-xl md:text-2xl font-bold"
                                    style={
                                        theme === "light" ? { color: colors.primary.DEFAULT } : {}
                                    }
                                >
                                    Activities
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {selectedSession.activities.map((item, index) => (
                            <div
                                key={index}
                                className="p-2 rounded-lg border"
                                style={
                                    theme === "light"
                                        ? {
                                            border: item.is_completed
                                                ? `1px solid #16a34a`
                                                : `1px solid ${colors.gray[200]}`,
                                            background: item.is_completed
                                                ? "#dcfce7"
                                                : colors.background.light,
                                            color: colors.text.light,
                                        }
                                        : {
                                            border: item.is_completed
                                                ? `1px solid #22c55e`
                                                : `1px solid ${colors.gray[700]}`,
                                            background: item.is_completed
                                                ? "#14532d"
                                                : colors.gray[900],
                                            color: colors.text.dark,
                                        }
                                }
                            >
                                <p className="text-md font-semibold text-center">
                                    {item?.title || "--"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Two Cards in a Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Session Information Card */}
                    <div
                        className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"
                            }`}
                    >
                        <h3 className="text-xl font-bold text-primary mb-4">
                            Session Information
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr
                                        className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"
                                            }`}
                                    >
                                        <th className="text-left py-2 px-4">Detected Movement</th>
                                        <th className="text-left py-2 px-4">Intensity</th>
                                        <th className="text-left py-2 px-4">Accuracy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alertsLst &&
                                        alertsLst.map((row) => (
                                            <tr
                                                key={row.sno}
                                                className={`border-b ${theme === "dark"
                                                    ? "border-gray-700"
                                                    : "border-gray-200"
                                                    }`}
                                            >
                                                <td className="py-2 px-4">{row?.title || "--"}</td>
                                                <td className="py-2 px-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs ${row.intensity === "High"
                                                            ? "bg-red-100 text-red-800"
                                                            : row.intensity === "Medium"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-green-100 text-green-800"
                                                            }`}
                                                    >
                                                        {row.intensity}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-4">{row.accuracy}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Live Stream Card */}
                    <div
                        className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"
                            }`}
                    >
                        <h3 className="text-xl font-bold text-primary mb-4">Live Stream</h3>
                        <VideoStream sessionId={selectedSession.id} />
                    </div>
                </div>
                <CompleteSessionModal
                    isOpen={showCompleteModal}
                    onClose={() => {
                        setShowCompleteModal(false);
                        setFeedback("");
                    }}
                    onSubmit={handleCompleteSession}
                    loading={loading}
                    feedback={feedback}
                    setFeedback={setFeedback}
                />
                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => {
                        setShowSuccess(false);
                        setSelectedSession(null);
                    }}
                    title="Session Completed"
                    message="The session has been successfully completed."
                />
            </motion.div>
        );
    }

    // Default session details view for non-ongoing sessions
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
        >
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-primary">
                    {selectedSession?.child?.first_name}'s Session Details
                </h2>
                <button
                    onClick={() => setSelectedSession(null)}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                        }`}
                >
                    <span>←</span>
                    <span>Back</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium">Age:</span> 7 years
                            </p>
                            <p>
                                <span className="font-medium">Diagnosis:</span> Eye
                            </p>
                            <p>
                                <span className="font-medium">Parent:</span>{" "}
                                {selectedSession?.parent?.first_name}
                            </p>
                            <p>
                                <span className="font-medium">Date & Time:</span>{" "}
                                {selectedSession?.date_of_session}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Session Notes</h3>
                        {/* {session.notes} */}
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Current Goals</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {selectedSession.activities.map((goal, index) => (
                                <li key={index} className="text-gray-600 dark:text-gray-300">
                                    {goal?.title || "--"}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Previous Progress</h3>
                        {/* {session.previousProgress} */}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
                        {/* {session.nextSteps} */}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
                <button
                    className={`px-4 py-2 rounded-lg ${theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                        }`}
                >
                    Edit Session
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    Add Notes
                </button>
            </div>
        </motion.div>
    );
}


