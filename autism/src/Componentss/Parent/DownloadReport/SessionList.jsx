import { motion } from 'framer-motion';
import { themeColors } from "../../../config/colors";
import useAuthStore from "../../../store/authStore";
import useReportStore from "../../../store/reportStore";

export default function SessionList({ sessionsLst }) {
    const { theme } = useAuthStore();
    const { selectedSession, setSelectedSession } = useReportStore();

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-4">
                <h2
                    className="text-lg font-semibold mb-4"
                    style={{ color: themeColors[theme].text }}
                >
                    Completed Sessions
                </h2>
                <div className="space-y-3">
                    {sessionsLst &&
                        sessionsLst.map((session) => (
                            <motion.div
                                key={session.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedSession?.id === session.id
                                        ? theme === "dark"
                                            ? "bg-blue-900"
                                            : "bg-blue-50"
                                        : theme === "dark"
                                            ? "bg-gray-800 hover:bg-gray-700"
                                            : "bg-white hover:bg-gray-50"
                                    }`}
                                onClick={() => setSelectedSession(session)}
                            >
                                <div className="space-y-2">
                                    <div>
                                        <h3
                                            className="font-medium"
                                            style={{ color: themeColors[theme].text }}
                                        >
                                            {session["child"]["first_name"] +
                                                " " +
                                                session["child"]["last_name"]}
                                        </h3>
                                        <p
                                            className="text-sm"
                                            style={{ color: themeColors[theme].primary }}
                                        >
                                            {session["service_title"]}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <p
                                            className="flex items-center gap-1"
                                            style={{ color: themeColors[theme].text }}
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {new Date(
                                                session.date_of_session
                                            ).toLocaleDateString()}
                                        </p>
                                        <p
                                            className="flex items-center gap-1"
                                            style={{ color: themeColors[theme].text }}
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {new Date(session.start_time).toLocaleTimeString(
                                                "en-GB",
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>
        </div>
    )
}