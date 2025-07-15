import useSWR from "swr";
import { motion } from 'framer-motion';
import useAuthStore from "../../../store/authStore";
import useParentDashboardStore from "../../../store/parentDashboardStore";
import { getServicesListForParent } from "../../../services/parentsService";
import { colors } from "../../../config/colors";

export default function ServicesList() {
    const { theme, user, showHeader } = useAuthStore();
    const {
        setService,
        service: selectedService,
        setActivity,
    } = useParentDashboardStore((state) => state);
    const { data: services, isLoading: isLoading } = useSWR(
        "getServicesListForParent",
        getServicesListForParent,
        {
            dedupingInterval: 60000,
            revalidateIfStale: true,
            keepPreviousData: true,
        }
    );

    return (
        <div className={`overflow-y-auto ${showHeader ? 'max-h-[calc(100vh-255px)]' : 'max-h-[calc(100vh-180px)]'} space-y-2 grid grid-cols-1 lg:grid-cols-2 gap-2 mb-0`}>
            {isLoading && (
                <div className="w-full h-20 flex items-center justify-center">
                    <img src="/loading_gif.gif" />
                </div>
            )}
            {!isLoading &&
                services &&
                services.map((service) => (
                    <motion.div
                        key={service.service_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                            setService(service);
                            setActivity(service.activities);
                        }}
                        className={`mx-1 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer 
                    ${theme === "dark" ? "bg-gray-800" : "bg-white"}`
                        }
                        style={{
                            border:
                                service.service_id === selectedService?.service_id
                                    ? `2px solid ${theme === "light" ? "#16a34a" : "#22c55e"}` // green-600/light or green-500/dark
                                    : `1px solid ${theme === "light" ? colors.gray[200] : colors.gray[700]
                                    }`,
                            backgroundColor:
                                service.service_id === selectedService?.service_id
                                    ? theme === "light"
                                        ? "#dcfce7"
                                        : "#14532d" // light green bg or dark green bg
                                    : theme === "light"
                                        ? "#ffffff"
                                        : "#1f2937", // default white or gray-800
                        }}
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-0">
                                <div>
                                    <h3
                                        className="text-lg font-semibold mb-2"
                                        style={
                                            theme === "light" ? { color: colors.primary.DEFAULT } : {}
                                        }
                                    >
                                        {service.title}
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {service.specialist_fname + " " + service.specialist_lname || 'Not assigned'}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {service.specialist_email || 'Not available'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="flex items-center justify-between mt-2 pt-2 border-t"
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
                                    service.activities.map((avt) => (
                                        <span
                                            key={avt.activity_id}
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
};
