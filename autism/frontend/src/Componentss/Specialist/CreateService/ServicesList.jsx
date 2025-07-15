import { motion } from "framer-motion";
import useAuthStore from "../../../store/authStore";
import useSWR from "swr";
import { getServicesList } from "../../../services/specialist/services";
import { colors } from "../../../config/colors";

export default function ServicesList() {
    const { theme, user, showHeader } = useAuthStore();
    const { data: services, isLoading: isLoading } = useSWR(
        "getServicesList",
        getServicesList,
        {
            dedupingInterval: 60000,
            revalidateIfStale: true,
            keepPreviousData: true,
        }
    );
    return (
        <div className={`overflow-y-auto ${showHeader ? 'max-h-[calc(100vh-240px)]' : 'max-h-[calc(100vh-100px)]'} px-2 grid grid-cols-1 md:grid-cols-2 gap-6`}>
            {isLoading && (
                <div className="w-full h-20 flex items-center justify-center">
                    <img src="/loading_gif.gif" />
                </div>
            )}
            {!isLoading &&
                services &&
                services.map(( service) => (
                    <motion.div
                        key={service.service_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 w-100"
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
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3
                                        className="text-lg font-semibold mb-1"
                                        style={
                                            theme === "light" ? { color: colors.primary.DEFAULT } : {}
                                        }
                                    >
                                        {service.title}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                {service.description}
                            </p>

                            <div
                                className="flex items-center justify-between mt-4 pt-4 border-t"
                                style={
                                    theme === "light"
                                        ? { borderColor: colors.gray[200] }
                                        : { borderColor: colors.gray[700] }
                                }
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Default Activities: {service.activities?.length || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center flex-wrap gap-2 mt-2">
                                {service.activities &&
                                    service.activities.length > 0 &&
                                    service.activities.map((avt, index) => (
                                        <span
                                            key={index}
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${service.status === "upcoming"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : service.status === "ongoing"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {avt.title}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
        </div>
    );
}

