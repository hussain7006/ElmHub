import React, { useEffect } from "react";
import { colors, themeColors } from "../../config/colors";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/authStore";
import useChildDashboardStore from "../../store/childDashboardStore";
import FlappyBirdGame from "../../Componentss/Activities/FlappyBirdGame";
import ColorMatchGame from "../../Componentss/Activities/ColorMatchGame"
import useSWR, { useSWRConfig } from "swr";
import {
  getSessionList,
  completeActivity,
  startSession,
} from "../../services/child/sessions";
import useHeaderStore from "../../store/headerStore";
import PageTitle from "../../Componentss/_component/PageTitle";
import Sessions from "../../Componentss/Child/SessionList/Sessions";
import SessionActivities from "../../Componentss/Child/SessionList/SessionActivities";
import PageWrapper from "../../components/layout/PageWrapper";
// Memoized SessionItem component
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

const ChildDashboard = () => {
  const { user, theme } = useAuthStore();
  const { setActiveSidebarItemFromUrl } = useHeaderStore();
  const {
    selectedSession,
    isStreamActive,
    selectedActivity,
    streamError,
    sessions,
    isActivityExpanded,
    setSelectedSession,
    setIsStreamActive,
    setSelectedActivity,
    setStreamError,
    setIsActivityExpanded,
    resetStates,
  } = useChildDashboardStore();
  const { data: sessionsLst, isLoading: isLoading } = useSWR(
    "getChildSessionsList",
    getSessionList,
    {
      dedupingInterval: 60000,
      revalidateIfStale: true,
      keepPreviousData: true,
    }
  );
  useEffect(() => {
    setActiveSidebarItemFromUrl(user?.role)
  }, []);


  const handleCloseActivity = () => {
    
    setSelectedActivity(null);
    setIsActivityExpanded(false);
  };


  return (
    <PageWrapper>
      <PageTitle title="Sessions" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!isActivityExpanded ? (
            <>
              <Sessions sessionsLst={sessionsLst} />
              <SessionActivities />

            </>
          ) : (
            <motion.div
              key="activity"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 relative"
            >
              <button
                onClick={handleCloseActivity}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                aria-label="Close activity"
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
              <div className="h-full flex flex-col">
                <h3
                  className="text-xl font-semibold mb-2"
                  style={
                    theme === "light" ? { color: colors.primary.DEFAULT } : {}
                  }
                >
                  {selectedActivity?.title}
                </h3>
                {streamError ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-lg font-medium mb-4">{streamError}</p>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          setStreamError(null);
                          initializeStream();
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg">
                    {selectedActivity?.title && selectedActivity?.title.toLowerCase() === "eye movement" ? (
                      <FlappyBirdGame session_id={selectedSession?.id} activity_id={selectedActivity?.id} handleCloseActivity={handleCloseActivity} />
                    ) : (
                      <ColorMatchGame session_id={selectedSession?.id} activity_id={selectedActivity?.id}/>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default ChildDashboard;
