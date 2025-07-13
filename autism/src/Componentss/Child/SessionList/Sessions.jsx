import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, themeColors } from "../../../config/colors";
import useAuthStore from "../../../store/authStore";
import useChildDashboardStore from "../../../store/childDashboardStore";

export default function Sessions({ sessionsLst }) {
    const { selectedSession, setSelectedSession } = useChildDashboardStore();
    const { theme, showHeader } = useAuthStore();

    // Memoized handlers
    const handleSessionSelect = useCallback(
        (session) => {
            setSelectedSession(session);
        },
        [setSelectedSession]
    );
    return (
        <motion.div
            key="sessions"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={`overflow-y-auto ${showHeader ? "max-h-[calc(100vh-170px)]" : "max-h-[calc(100vh-70px)]"} lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-auto`}
        >
            <div className="space-y-6">
                {/* Current Sessions */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        Current Sessions
                    </h3>
                    <div className="space-y-4">
                        {sessionsLst &&
                            sessionsLst
                                .filter((session) => session.status === "ongoing")
                                .map((session) => (
                                    <SessionItem
                                        key={session.id}
                                        session={session}
                                        category="current"
                                        isSelected={selectedSession?.id === session.id}
                                        onSelect={handleSessionSelect}
                                        theme={theme}
                                    />
                                ))}
                    </div>
                </div>
                {/* Future Sessions */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        Future Booked Sessions
                    </h3>
                    <div className="space-y-4">
                        {sessionsLst &&
                            sessionsLst
                                .filter((session) => session.status === "upcoming")
                                .map((session) => (
                                    <SessionItem
                                        key={session.id}
                                        session={session}
                                        category="future"
                                        isSelected={selectedSession?.id === session.id}
                                        onSelect={handleSessionSelect}
                                        theme={theme}
                                    />
                                ))}
                    </div>
                </div>
                {/* Past Sessions */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        Past Sessions
                    </h3>
                    <div className="space-y-4">
                        {sessionsLst &&
                            sessionsLst
                                .filter((session) => session.status === "completed")
                                .map((session) => (
                                    <SessionItem
                                        key={session.id}
                                        session={session}
                                        category="past"
                                        isSelected={selectedSession?.id === session.id}
                                        onSelect={handleSessionSelect}
                                        theme={theme}
                                    />
                                ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}


const SessionItem = React.memo(
    ({ session, category, isSelected, onSelect, theme }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-4 cursor-pointer transition-all duration-200
        ${theme === "light"
                    ? "bg-white hover:bg-gray-50"
                    : "bg-gray-800 hover:bg-gray-700"
                }
        ${isSelected ? "ring-2 ring-primary-500" : ""}`}
            style={
                theme === "light"
                    ? {
                        border: `1px solid ${colors.gray[200]}`,
                    }
                    : {
                        border: `1px solid ${colors.gray[700]}`,
                    }
            }
            onClick={() => onSelect(session)}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3
                        className="font-semibold mb-1"
                        style={theme === "light" ? { color: colors.primary.DEFAULT } : {}}
                    >
                        {session.service_title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(session.date_of_session).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {session.specialist.first_name}
                </div>
            </div>
        </motion.div>
    )
);