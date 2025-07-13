import useSWR from "swr";
import { motion } from 'framer-motion';
import useAuthStore from "../../../store/authStore";
import useParentDashboardStore from "../../../store/parentDashboardStore";
import { getChildListForParent } from "../../../services/parentsService";
import { colors } from "../../../config/colors";
export function ChildAndDescription() {
    const { theme, user } = useAuthStore();
    const { description, setDescription, child, setChild } = useParentDashboardStore((state) => state);

    // Mock children data - replace with actual data from your API
    // const children = [
    //   { id: 1, name: "John Doe", age: 8 },
    //   { id: 2, name: "Jane Doe", age: 6 },
    //   { id: 3, name: "Mike Smith", age: 7 }
    // ];


    const { data: children, isLoading: isLoading } = useSWR(
        "getChildListForParent",
        getChildListForParent,
        {
            dedupingInterval: 60000,
            revalidateIfStale: true,
            keepPreviousData: true,
        }
    );


    return (
        <div className="space-y-6 min-h-[calc(100vh-255px)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6"
            >
                <div className="space-y-6">
                    {/* Child Selection */}
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{
                                color: theme === "dark" ? colors.gray[300] : colors.gray[700],
                            }}
                        >
                            Select Child
                        </label>
                        <div className="relative">
                            <select
                                value={child?.id || ""}
                                onChange={(e) => {
                                    const selectedChild = children.find(c => c.id === parseInt(e.target.value));
                                    setChild(selectedChild || null);
                                }}
                                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                    ${theme === "dark"
                                        ? "bg-gray-700 border-gray-600 text-gray-100"
                                        : "bg-white border-gray-300 text-gray-800"
                                    }`}
                            >
                                <option value="">Select a child</option>
                                {children && children.map(child => (
                                    <option key={child.id} value={child.id}>
                                        {child.first_name} {child.last_name} (Age: 7)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description Input */}
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{
                                color: theme === "dark" ? colors.gray[300] : colors.gray[700],
                            }}
                        >
                            Session Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the session details, objectives, and any specific requirements..."
                            rows="4"
                            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none
                  ${theme === "dark"
                                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                }`}
                        />
                    </div>

                    {/* Selected Child Info */}
                    {/* {child && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <h3 className="text-sm font-medium mb-2" style={{ color: theme === "dark" ? colors.gray[300] : colors.gray[700] }}>
                  Selected Child Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {child.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Age: {child.age} years
                    </span>
                  </div>
                </div>
              </motion.div>
            )} */}
                </div>
            </motion.div>
        </div>
    );
};