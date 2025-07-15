import useSWR from "swr";
import { motion } from "framer-motion";
import useAuthStore from "../../../store/authStore";
import useCreateSessionStore from "../../../store/createSessionStore";
import { getActivitesList } from "../../../services/specialist/services";
import { colors } from "../../../config/colors";

export default function ActivitiesList() {
    const { theme, user } = useAuthStore();
    const { addActivity, activity, removeActivityById } = useCreateSessionStore(
        (state) => state
    );
    const {
        data: activities,
        isLoading: isDataLoading,
        mutate: mutateActivity,
    } = useSWR("activitiesLst", getActivitesList, {
        dedupingInterval: 60000,
        revalidateIfStale: true,
        keepPreviousData: true,
    });
    const handleDayToggle = (day) => {
        if (activity.some((act) => act.id === day.id)) {
            // Remove activity if it's already selected
            removeActivityById(day.id);
        } else {
            // Add activity if not selected
            addActivity({ id: day.id, title: day.title });
        }
    };
    return (
        <div className="overflow-y-auto max-h-[calc(100vh-260px)] px-2 flex flex-wrap gap-2">
            {isDataLoading ? (
                <div className="w-full h-20 flex items-center justify-center">
                    <img src="/loading_gif.gif" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {activities.map((day) => (
                        <motion.button
                            key={day.id}
                            type="button"
                            onClick={() => handleDayToggle(day)} // Toggle activity selection
                            className="px-4 py-2 rounded-lg border transition-colors duration-200 cursor-pointer"
                            style={{
                                backgroundColor: activity.some((act) => act.id === day.id)
                                    ? colors.primary.DEFAULT // Green if selected
                                    : theme === "dark"
                                        ? colors.gray[700] // Dark background if not selected
                                        : "white", // Light background if not selected
                                borderColor: activity.some((act) => act.id === day.id)
                                    ? colors.primary.dark // Darker green border if selected
                                    : colors.gray[300], // Light gray border if not selected
                                color: activity.some((act) => act.id === day.id)
                                    ? "white" // White text if selected
                                    : theme === "dark"
                                        ? colors.gray[300] // Dark text in dark mode
                                        : colors.gray[700], // Light gray text in light mode
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {day.title}
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}