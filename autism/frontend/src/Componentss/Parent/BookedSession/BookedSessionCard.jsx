import { motion } from 'framer-motion';
import useAuthStore from '../../../store/authStore';
export default function BookedSessionCard({ sessions }) {
    const { showHeader } = useAuthStore();

    return (
        <div className={`overflow-y-auto ${showHeader ? 'max-h-[calc(100vh-200px)]' : 'max-h-[calc(100vh-100px)]'} grid grid-cols-1 lg:grid-cols-2 gap-6 p-2`}>
            {sessions && sessions.map((session) => (
                <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg shadow-md p-6 bg-white dark:bg-gray-800 transition-colors duration-200`}
                >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium
                                    ${session.status === "ongoing"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : session.status === "completed"
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    }`}>
                                    {session.status}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(session.date_of_session).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold dark:text-white">
                                Session with {session?.specialist?.first_name} {session?.specialist?.last_name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">{session.description}</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="text-sm dark:text-gray-200">
                                <span className="font-medium">Child: </span>
                                {session?.child?.first_name} {session?.child?.last_name}
                            </div>
                            <div className="text-sm dark:text-gray-200">
                                <span className="font-medium">Time: </span>
                                {new Date(session.start_time).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>

                    {session.activities && session.activities.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-medium mb-2 dark:text-gray-200">Activities:</h4>
                            <div className="flex flex-wrap gap-2">
                                {session.activities.map((activity) => (
                                    <span
                                        key={activity.id}
                                        className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${activity.is_completed
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                            }`}
                                    >
                                        {activity.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    )
}