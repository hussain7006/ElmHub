import { AnimatePresence, motion } from 'framer-motion';
import { themeColors } from "../../../config/colors";
import { colors } from "../../../config/colors";
import useReportStore from "../../../store/reportStore";
import useAuthStore from "../../../store/authStore";
import Button from '../../_component/Button';
export default function SessionDetails({
    showFeedback,
    submitFeedback,
    isSubmitting,
    handleREport,
    parentFeedback,
    setParentFeedback,
    setShowFeedback
}) {
    const { selectedSession, isDownloading } = useReportStore();
    const { theme } = useAuthStore();
    return (
        <div className="lg:col-span-3">
            {selectedSession ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Session Details */}
                    <div className="p-6 rounded-lg"
                        style={{
                            background:
                                theme === "dark" ? colors.gray[800] : colors.gray[50],
                            border: `1px solid ${theme === "dark" ? colors.gray[700] : colors.gray[200]
                                }`,
                        }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2
                                className="text-xl font-semibold"
                                style={{ color: themeColors[theme].text }}
                            >
                                Session Details
                            </h2>
                            <div className="flex items-center gap-2">
                                {/* {["Improved Focus", "Better Motor Control"].map(
                                    (milestone, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm rounded-full"
                                            style={{
                                                background:
                                                    theme === "dark"
                                                        ? colors.gray[700]
                                                        : colors.gray[200],
                                                color: themeColors[theme].text,
                                            }}
                                        >
                                            {milestone}
                                        </span>
                                    )
                                )} */}

                                <Button
                                    onClick={() =>
                                        handleREport(selectedSession.report_path)
                                    }
                                    disabled={isDownloading}
                                    className="flex items-center gap-2"
                                >
                                    {isDownloading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                />
                                            </svg>
                                            Download PDF
                                        </>
                                    )}
                                </Button>
                                {/* <button
                                    onClick={() =>
                                        handleREport(selectedSession.report_path)
                                    }
                                    disabled={isDownloading}
                                    className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                                    style={{
                                        background: themeColors[theme].primary,
                                        opacity: isDownloading ? 0.7 : 1,
                                    }}
                                >
                                    {isDownloading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                />
                                            </svg>
                                            Download PDF
                                        </>
                                    )}
                                </button> */}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3
                                    className="font-medium mb-3"
                                    style={{ color: themeColors[theme].text }}
                                >
                                    Activities Completed
                                </h3>
                                <ul className="space-y-2">
                                    {selectedSession.activities.map((activity, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2"
                                            style={{ color: themeColors[theme].text }}
                                        >
                                            <svg
                                                className="w-5 h-5 mt-0.5 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            {activity.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <div>
                                    <h3
                                        className="font-medium mb-1"
                                        style={{ color: themeColors[theme].text }}
                                    >
                                        Session Description
                                    </h3>
                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{ color: themeColors[theme].text }}
                                    >
                                        {selectedSession.description}
                                    </p>
                                </div>
                                <div>
                                    <h3
                                        className="font-medium mb-3"
                                        style={{ color: themeColors[theme].text }}
                                    >
                                        Specialist Feedback
                                    </h3>
                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{ color: themeColors[theme].text }}
                                    >
                                        {selectedSession.comments}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Parent Feedback */}
                    <div
                        className="p-6 rounded-lg"
                        style={{
                            background:
                                theme === "dark" ? colors.gray[800] : colors.gray[50],
                            border: `1px solid ${theme === "dark" ? colors.gray[700] : colors.gray[200]
                                }`,
                        }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2
                                className="text-xl font-semibold"
                                style={{ color: themeColors[theme].text }}
                            >
                                Parent Feedback
                            </h2>
                            <Button
                                onClick={() => setShowFeedback(!showFeedback)}
                                className="px-3 py-1 rounded-lg font-medium transition-all duration-200"
                                type="button"
                                style={{
                                    background:
                                        theme === "dark"
                                            ? colors.gray[700]
                                            : colors.gray[200],
                                    color: themeColors[theme].text,
                                }}>
                                {showFeedback ? "Hide" : "Add Feedback"}
                            </Button>
                            {/* <button
                                onClick={() => setShowFeedback(!showFeedback)}
                                className="px-3 py-1 rounded-lg font-medium transition-all duration-200"
                                style={{
                                    background:
                                        theme === "dark"
                                            ? colors.gray[700]
                                            : colors.gray[200],
                                    color: themeColors[theme].text,
                                }}
                            >
                                {showFeedback ? "Hide" : "Add Feedback"}
                            </button> */}
                        </div>

                        <AnimatePresence>
                            {showFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-6"
                                >
                                    {/* <div>
                                        <label
                                            className="block text-sm font-medium mb-3"
                                            style={{ color: themeColors[theme].text }}
                                        >
                                            Rating
                                        </label>
                                        <div className="flex space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    className="text-2xl focus:outline-none transition-transform hover:scale-110"
                                                    style={{
                                                        color: star <= rating
                                                            ? theme === 'dark'
                                                                ? colors.primary.light
                                                                : colors.primary.DEFAULT
                                                            : theme === 'dark'
                                                                ? colors.gray[600]
                                                                : colors.gray[300]
                                                    }}
                                                >
                                                    ⭐
                                                </button>
                                            ))}
                                        </div>
                                    </div> */}
                                    <div>
                                        <label
                                            className="block text-sm font-medium mb-3"
                                            style={{ color: themeColors[theme].text }}
                                        >
                                            Feedback
                                        </label>
                                        <textarea
                                            value={parentFeedback}
                                            onChange={(e) => setParentFeedback(e.target.value)}
                                            placeholder="Share your thoughts about the session..."
                                            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                                            rows={4}
                                            style={{
                                                borderColor:
                                                    theme === "dark"
                                                        ? colors.gray[700]
                                                        : colors.gray[300],
                                                background:
                                                    theme === "dark"
                                                        ? colors.gray[800]
                                                        : colors.gray[50],
                                                color:
                                                    theme === "dark"
                                                        ? colors.gray[100]
                                                        : colors.gray[900],
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={submitFeedback}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50"
                                            style={{
                                                background: themeColors[theme].primary,
                                                opacity: isSubmitting ? 0.7 : 1,
                                            }}
                                        >
                                            {isSubmitting ? "Submitting..." : "Submit Feedback"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            ) : (
                <div
                    className="p-8 rounded-lg text-center"
                    style={{
                        background:
                            theme === "dark" ? colors.gray[800] : colors.gray[50],
                        border: `1px solid ${theme === "dark" ? colors.gray[700] : colors.gray[200]
                            }`,
                    }}
                >
                    <p style={{ color: themeColors[theme].text }}>
                        Select a session to view details and provide feedback
                    </p>
                </div>
            )}
        </div>
    )
}