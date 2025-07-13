import { useState } from "react";
import { motion } from "framer-motion";
import useAuthStore from "../../store/authStore";
import useSpecialistDashboardStore from "../../store/specialistDashboardStore";
import { colors } from "../../config/colors";
import useSWR from "swr";
import { getSessionList, handleDownload } from "../../services/specialist/sessions";
import PageTitle from "../../Componentss/_component/PageTitle";
import Sessions from "../../Componentss/Specialist/Sessions";
import PageWrapper from "../../components/layout/PageWrapper";



const SpecialistDashboard = () => {
  const { theme } = useAuthStore();
  const { selectedSession, showChildInfo } = useSpecialistDashboardStore();
  const { data: sessionsLst, isLoading: isLoading } = useSWR(
    "getSessionsList",
    getSessionList,
    {
      dedupingInterval: 60000,
      revalidateIfStale: true,
      keepPreviousData: true,
    }
  );


  // Child Info Page Component
  const ChildInfoPage = ({ session }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [info, setInfo] = useState({
      name: session.child,
      gender: "Male",
      location: "New York, USA",
      personality:
        "Friendly and enthusiastic learner who shows great interest in interactive activities. Responds well to positive reinforcement and structured routines.",
      about:
        "A bright and curious child diagnosed with ASD. Shows strong aptitude in mathematical concepts and visual learning.",
      coreNeeds:
        "Structure in daily routines\nClear communication\nSensory-friendly environment\nPatient and consistent guidance",
      frustrations:
        "Unexpected changes in routine\nOverwhelming sensory inputs\nDifficulty in expressing emotions\nGroup social situations",
      platform:
        "Prefers tablet-based learning\nEngages well with visual schedules\nResponds positively to interactive games",
    });

    return (
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div
          className="w-full px-4 md:px-6 lg:px-8 py-6 shadow-sm mb-6"
          style={
            theme === "light"
              ? {
                background: colors.primary.light,
                borderBottom: `1px solid ${colors.gray[200]}`,
              }
              : {
                background: colors.gray[900],
                borderBottom: `1px solid ${colors.gray[800]}`,
              }
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                // onClick={() => setShowChildInfo(false)}
                className="p-2 rounded-lg hover:bg-opacity-80 transition-colors text-white flex items-center space-x-2 cursor-pointer"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back to Session</span>
              </button>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg hover:bg-opacity-80 transition-colors text-white flex items-center space-x-2"
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        {/* Content - Updated grid layout */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column - Now 5 columns wide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-5 space-y-8"
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 shadow-lg"
                  style={
                    theme === "light"
                      ? {
                        borderColor: colors.primary.light,
                        backgroundColor: colors.gray[100],
                      }
                      : {
                        borderColor: colors.gray[700],
                        backgroundColor: colors.gray[800],
                      }
                  }
                >
                  <img
                    src="student.png"
                    alt={info.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={info.name}
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                    className="text-3xl font-bold text-center bg-transparent border-b-2 focus:outline-none focus:border-blue-500 w-full max-w-md"
                    style={
                      theme === "light" ? { color: colors.primary.DEFAULT } : {}
                    }
                  />
                ) : (
                  <h2
                    className="text-3xl font-bold text-center"
                    style={
                      theme === "light" ? { color: colors.primary.DEFAULT } : {}
                    }
                  >
                    {info.name}
                  </h2>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
                <InfoField
                  label="Gender"
                  value={info.gender}
                  isEditing={isEditing}
                  onChange={(value) => setInfo({ ...info, gender: value })}
                  theme={theme}
                />
                <InfoField
                  label="Location"
                  value={info.location}
                  isEditing={isEditing}
                  onChange={(value) => setInfo({ ...info, location: value })}
                  theme={theme}
                />
                <div>
                  <h3
                    className="text-xl font-semibold mb-3"
                    style={
                      theme === "light" ? { color: colors.primary.DEFAULT } : {}
                    }
                  >
                    Personality
                  </h3>
                  {isEditing ? (
                    <textarea
                      value={info.personality}
                      onChange={(e) =>
                        setInfo({ ...info, personality: e.target.value })
                      }
                      className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {info.personality}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Now 7 columns wide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-7 space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-8">
                <InfoSection
                  title="About"
                  content={info.about}
                  isEditing={isEditing}
                  onChange={(value) => setInfo({ ...info, about: value })}
                  theme={theme}
                />
                <InfoSection
                  title="Core Needs"
                  content={info.coreNeeds}
                  isEditing={isEditing}
                  onChange={(value) => setInfo({ ...info, coreNeeds: value })}
                  theme={theme}
                />
                <InfoSection
                  title="Frustrations"
                  content={info.frustrations}
                  isEditing={isEditing}
                  onChange={(value) =>
                    setInfo({ ...info, frustrations: value })
                  }
                  theme={theme}
                />
                <InfoSection
                  title="Platform Preferences"
                  content={info.platform}
                  isEditing={isEditing}
                  onChange={(value) => setInfo({ ...info, platform: value })}
                  theme={theme}
                />
              </div>
            </motion.div>
          </div>

          {/* Footer Actions */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end space-x-4 mt-8 pb-8"
            >
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save changes here
                  setIsEditing(false);
                }}
                className="px-6 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: colors.primary.DEFAULT }}
              >
                Save Changes
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  // Helper components
  const InfoField = ({ label, value, isEditing, onChange, theme }) => (
    <div>
      <label className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 mt-1 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="mt-1 font-medium">{value}</p>
      )}
    </div>
  );

  const InfoSection = ({ title, content, isEditing, onChange, theme }) => (
    <div>
      <h3
        className="text-xl font-semibold mb-3"
        style={theme === "light" ? { color: colors.primary.DEFAULT } : {}}
      >
        {title}
      </h3>
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        />
      ) : (
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
          {content}
        </p>
      )}
    </div>
  );


  return (
    <PageWrapper>
      {showChildInfo ? (
        <ChildInfoPage session={selectedSession} />
      ) : (
        <>
          {/* Dashboard Header */}
          <PageTitle title="Sessions Overview" />
          {/* Main Content */}
          <Sessions sessionsLst={sessionsLst} isLoading={isLoading} />
        </>
      )}
    </PageWrapper>
  );
};

export default SpecialistDashboard;
