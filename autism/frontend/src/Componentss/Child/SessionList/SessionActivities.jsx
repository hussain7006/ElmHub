import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useChildDashboardStore from "../../../store/childDashboardStore";
import { colors, themeColors } from "../../../config/colors";
import useAuthStore from "../../../store/authStore";
import { useSWRConfig } from "swr";
import { startSession } from "../../../services/child/sessions";
import FullScreenGazeCalibrator from "./ConfigModal/ConfigModal";
export default function SessionActivities() {
  const { theme, showHeader } = useAuthStore();
  const [activityName, setActivityName] = useState(null);
  const [isConfigCompleted, setIsConfigCompleted] = useState(false);

  const {
    selectedSession,
    setSelectedSession,
    setSelectedActivity,
    setIsStreamActive,
    setIsActivityExpanded,
  } = useChildDashboardStore();
  const handleStartActivity = useCallback(
    (activity) => {
      setSelectedActivity(activity);
      setIsStreamActive(true);
      setActivityName(activity.title);
      setIsActivityExpanded(true);
    },
    [setSelectedActivity, setIsStreamActive, setIsActivityExpanded]
  );
  return (
    <motion.div
      key="details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={`overflow-y-auto ${showHeader ? "max-h-[calc(100vh-170px)]" : "max-h-[calc(100vh-70px)]"} lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-auto`}
    >
      {selectedSession ? (
        selectedSession.status === "ongoing" ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Available Activities</h3>
            <FullScreenGazeCalibrator
              onComplete={() => setIsConfigCompleted(true)}
              isConfigCompleted={isConfigCompleted}
            />
            {selectedSession.activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onStartActivity={handleStartActivity}
                theme={theme}
                isConfigCompleted={isConfigCompleted}
                showHeader={showHeader}
              />
            ))}
          </div>
        ) : (
          <SessionDetails session={selectedSession} theme={theme} showHeader={showHeader} />
        )
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>Select a session to view details</p>
        </div>
      )}
    </motion.div>
  );
}

const ActivityItem = React.memo(
  ({ activity, onStartActivity, theme, isConfigCompleted, showHeader }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`overflow-y-auto ${showHeader ? "max-h-[calc(100vh-170px)]" : "max-h-[calc(100vh-70px)]"} p-4 rounded-lg mb-4 flex items-center justify-between
        ${
          theme === "light"
            ? "bg-white hover:bg-gray-50"
            : "bg-gray-800 hover:bg-gray-700"
        }
        transition-all duration-200 shadow-sm hover:shadow-md`}
      style={
        theme === "light"
          ? {
              border: `1px solid ${colors.gray[200]}`,
            }
          : {
              border: `1px solid ${colors.gray[700]}`,
            }
      }
    >
      <div className="flex items-center flex-1">
        <div className="text-4xl mr-4">{activity.icon}</div>
        <div className="flex-1">
          <h3
            className="font-semibold mb-1"
            style={theme === "light" ? { color: colors.primary.DEFAULT } : {}}
          >
            {activity.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {activity.description}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartActivity(activity);
          }}
          disabled={isConfigCompleted == false}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors cursor-pointer"
          style={{
            backgroundColor: colors.primary.DEFAULT,
            cursor: isConfigCompleted ? "pointer" : "not-allowed",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          <span>Start Activity</span>
        </button>
      </div>
    </motion.div>
  )
);

const SessionDetails = React.memo(({ session, theme, showHeader }) => {
  if (!session) return null;
  const { setSelectedSession } = useChildDashboardStore();
  const { mutate } = useSWRConfig();
  const startCallSession = async () => {
    await startSession(session?.id);
    await mutate("getChildSessionsList");
    setSelectedSession(null);
  };
  const sessionDate = new Date(session.date_of_session); // make sure to use 'T' and 'Z' for proper ISO parsing
  const currentDate = new Date();

  const isSessionAvailable =
    session.status === "upcoming" && currentDate > sessionDate;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`overflow-y-auto ${showHeader ? "max-h-[calc(100vh-170px)]" : "max-h-[calc(100vh-70px)]"} p-4 space-y-4`}
    >
      <div className="flex justify-between w-full">
        <div>
          <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400">
            {session.service_title}
          </h3>
          <p className="text-md text-primary-600 dark:text-primary-400">
            {session.description}
          </p>
        </div>
        {isSessionAvailable && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={startCallSession}
            type="button"
            className="mt-4 md:mt-0 px-6 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
            style={{
              background: "transparent",
              color: themeColors[theme].primary,
              border: `2px solid ${themeColors[theme].primary}`,
            }}
          >
            <span>Start Session</span>
          </motion.button>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {new Date(session.date_of_session).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>{session.specialist.first_name}</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg> */}
          {/* <span>{session.duration}</span> */}
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-2">Session Goals:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
            {session.activities.map((goal, index) => (
              <li key={index}>{goal.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
});
