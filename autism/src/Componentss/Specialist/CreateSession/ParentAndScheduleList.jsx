import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useAuthStore from "../../../store/authStore";
import useCreateSessionStore from "../../../store/createSessionStore";
import useSWRMutation from "swr/mutation";
import { getParentByEmail } from "../../../services/specialist/sessions";
import { colors } from "../../../config/colors";

export default function ParentAndScheduleList() {
    const { theme, user } = useAuthStore();
    const { date, time, parent, child, setDate, setTime, setParent, setChild } = useCreateSessionStore((state) => state);

    const [email, setEmail] = useState("");

    const {
        data: parentInfo,
        trigger,
        isMutating,
    } = useSWRMutation(["getParentByEmail", email], () => getParentByEmail(email));
    useEffect(() => {
        if (parentInfo) setParent(parentInfo);
    }, [parentInfo]);
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!email) return;
        trigger(email);
    };

    const handleChildSelect = (e) => {
        const childId = e.target.value;
        const selected = parentInfo.childs?.find(
            (c) => c.child_id.toString() === childId
        );
        setChild(selected || null);
        setParent(parentInfo || null);
    };

    const inputStyle =
        theme === "light"
            ? "bg-white border-gray-300 text-gray-800"
            : "bg-gray-700 border-gray-600 text-gray-100";

    return (
        <div className="overflow-y-auto max-h-[calc(100vh-260px)] px-2 flex flex-wrap gap-2">
            <form
                onSubmit={handleSearch}
                className="w-full flex flex-row justify-between items-end gap-8"
            >
                <div className="w-full">
                    <label
                        className="block text-sm font-medium mb-1"
                        style={{
                            color: theme === "light" ? colors.gray[700] : colors.gray[300],
                        }}
                    >
                        Parent Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Type Email of parent"
                        required
                        className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={
                            theme === "light"
                                ? {
                                    borderColor: colors.gray[300],
                                    background: colors.gray[100],
                                    color: colors.gray[500],
                                }
                                : {
                                    borderColor: colors.gray[700],
                                    background: colors.gray[900],
                                    color: colors.gray[400],
                                }
                        }
                    />
                </div>
                <motion.button
                    type="submit"
                    className="px-6 py-2 h-13 text-white rounded-lg transition-colors duration-200"
                    style={{ backgroundColor: colors.success }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isMutating}
                >
                    Search
                </motion.button>
            </form>

            {isMutating && (
                <div className="w-full h-20 flex items-center justify-center">
                    <img src="/loading_gif.gif" alt="Loading..." />
                </div>
            )}

            {parent && !isMutating && (
                <>
                    <div className="w-full max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4">Parent Information</h2>
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium">Name:</span>{" "}
                                {parent.parent_first_name} {parent.parent_last_name}
                            </p>
                            <p>
                                <span className="font-medium">Email:</span>{" "}
                                {parent.parent_email}
                            </p>
                            <p>
                                <span className="font-medium">Phone:</span>{" "}
                                {parent.parent_phone}
                            </p>
                            <p>
                                <span className="font-medium">Language:</span>{" "}
                                {parent.parent_language}
                            </p>
                        </div>

                        <h3 className="text-lg font-semibold mt-6 mb-2">Select a Child</h3>
                        <select
                            value={child?.child_id || ""}
                            onChange={handleChildSelect}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                            <option value="">-- Select a Child --</option>
                            {parent?.childs &&
                                parent?.childs.map((child) => (
                                    <option key={child.child_id} value={child.child_id}>
                                        {child.child_first_name} {child.child_last_name}
                                    </option>
                                ))}
                        </select>

                        {child && (
                            <div className="mt-6 border-t pt-4 border-gray-300 dark:border-gray-600">
                                <h4 className="text-lg font-semibold mb-2">
                                    Child Information
                                </h4>
                                <p>
                                    <span className="font-medium">Name:</span>{" "}
                                    {child.child_first_name} {child.child_last_name}
                                </p>
                                <p>
                                    <span className="font-medium">ID:</span> {child.child_id}
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
            <div className="w-full mt-6 border-t pt-4 border-gray-300 dark:border-gray-600">
                <h4 className="text-lg font-semibold mb-2">Booking Date & Time</h4>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDate(e.target.value)}
                            className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 ${inputStyle}`}
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-1">Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 ${inputStyle}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}