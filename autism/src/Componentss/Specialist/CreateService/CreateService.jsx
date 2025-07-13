import useSWR, { useSWRConfig } from "swr";
import { motion } from "framer-motion";
import useAuthStore from "../../../store/authStore";
import { createActivity, createService, getActivitesList } from "../../../services/specialist/services";
import { useState, useRef } from "react";
import { colors, themeColors } from "../../../config/colors";
// import SuccessModal from "../../../components/modals/SuccessModal";
import SuccessModal from "../../_component/SuccessModal"
import ErrorBox from "../../_component/ErrorBox";
import Button from "../../_component/Button";

export default function CreateService() {
    const { theme, user, showHeader } = useAuthStore();
    const { mutate } = useSWRConfig();
    const {
        data: activities,
        isLoading: isDataLoading,
        mutate: mutateActivity,
    } = useSWR("activitiesLst", getActivitesList, {
        dedupingInterval: 60000,
        revalidateIfStale: true,
        keepPreviousData: true,
    });
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        activity: [],
    });
    const [isAddNewActivity, setIsAddNewActivity] = useState(false);

    const [activityData, setActivityData] = useState({
        title: "",
        description: "",
    });
    const [activityErrors, setActivityErrors] = useState(null);
    const [isActivitySubmitting, setIsActivitySubmitting] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successModalTitle, setSuccessModalTitle] = useState("");
    const [successModalSubtitle, setSuccessModalSubtitle] = useState("");
    const formTopRef = useRef(null);

    const handleActivitySubmit = async (e) => {
        setActivityErrors(null);
        setIsActivitySubmitting(true);
        try {
            if (activityData.title == "" || activityData.description == "") {
                throw new Error("Title or description cannot be empty");
            }
            await createActivity(activityData);
            mutateActivity();
            setActivityData({
                title: "",
                description: "",
            });
            setIsAddNewActivity(false);
        } catch (err) {
            setActivityErrors(
                err.message || "Failed to create service. Please try again."
            );
        } finally {
            setIsActivitySubmitting(false);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleDayToggle = (day) => {
        setFormData((prev) => ({
            ...prev,
            activity: prev.activity.includes(day.id)
                ? prev.activity.filter((d) => d !== day.id)
                : [...prev.activity, day.id],
        }));
    };

    const handleChange = (e) => {
        if (error) {
            setError(null);
        }
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            if (formData.title == "" || formData.description == "") {
                setError("Title or description cannot be empty");
                if (formTopRef.current) {
                    formTopRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
                throw new Error("Title or description cannot be empty");
            }

            if (formData.activity.length == 0) {
                setError("Select some activities");
                if (formTopRef.current) {
                    formTopRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
                throw new Error("Select some activities");
            }
            await createService(formData);
            mutate("getServicesList");
            setFormData({
                title: "",
                description: "",
                activity: [],
            });
            setIsAddNewActivity(false);
            setSuccessModalTitle("Service Created Successfully!");
            setSuccessModalSubtitle("Your new service has been created and is now available for use.");
            setShowSuccessModal(true);
        } catch (err) {
            setError(err.message || "Failed to create service. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyles = `w-full p-3 rounded-lg border ${theme === "dark"
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
        }`;

    return (
        <>
            <motion.div
                ref={formTopRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full mx-auto overflow-y-auto ${showHeader ? 'max-h-[calc(100vh-240px)]' : 'max-h-[calc(100vh-100px)]'} px-2 `}
            >
                <div
                    className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    <h1 className="text-2xl font-bold mb-6">Create New Service</h1>

                    {error && (
                        <ErrorBox error={error} />
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={inputStyles}
                                placeholder="Enter service title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={inputStyles}
                                rows="3"
                                placeholder="Enter service description"
                                required
                            />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <div className="flex flex-row items-center gap-2 mb-3">
                                    <label
                                        className="block text-sm font-medium"
                                        style={{
                                            color:
                                                theme === "dark" ? colors.gray[300] : colors.gray[700],
                                        }}
                                    >
                                        Select Default Activities:
                                    </label>
                                    <Button
                                        type="icon"
                                        onClick={() => setIsAddNewActivity(true)}
                                    >
                                        <img
                                            width="24"
                                            height="24"
                                            src="https://img.icons8.com/20C997/ios-filled/24/add--v1.png"
                                            alt="add--v1"
                                        />
                                    </Button>
                                    {/* <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsAddNewActivity(true)}
                                        className=" cursor-pointer"
                                        type="button"
                                    >
                                        <img
                                            width="24"
                                            height="24"
                                            src="https://img.icons8.com/20C997/ios-filled/24/add--v1.png"
                                            alt="add--v1"
                                        />
                                    </motion.button> */}
                                </div>
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
                                                onClick={() => handleDayToggle(day)}
                                                className="px-4 py-2 rounded-lg border transition-colors duration-200 cursor-pointer"
                                                style={{
                                                    backgroundColor: formData.activity.includes(day.id)
                                                        ? colors.primary.DEFAULT
                                                        : theme === "dark"
                                                            ? colors.gray[700]
                                                            : "white",
                                                    borderColor: formData.activity.includes(day.id)
                                                        ? colors.primary.dark
                                                        : colors.gray[300],
                                                    color: formData.activity.includes(day.id)
                                                        ? "white"
                                                        : theme === "dark"
                                                            ? colors.gray[300]
                                                            : colors.gray[700],
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
                        </motion.div>
                        {isAddNewActivity && (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "max-content" }}
                                className="w-full lg:w-full"
                            >
                                <div
                                    className={`p-4 md:p-6 rounded-lg  ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                                        }`}
                                >
                                    <div className=" flex flex-row justify-between mb-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium mb-1">
                                                Activity Title
                                            </label>
                                            <input
                                                type="text"
                                                name="activity"
                                                value={activityData.title}
                                                onChange={(e) =>
                                                    setActivityData((prev) => ({
                                                        ...prev,
                                                        title: e.target.value,
                                                    }))
                                                }
                                                className={inputStyles}
                                                placeholder="Title for the activity"
                                                required
                                            />
                                        </div>
                                        <div className="flex-2 ms-2">
                                            <label className="block text-sm font-medium mb-1">
                                                Activity Description
                                            </label>
                                            <input
                                                type="text"
                                                name="activity"
                                                value={activityData.description}
                                                onChange={(e) =>
                                                    setActivityData((prev) => ({
                                                        ...prev,
                                                        description: e.target.value,
                                                    }))
                                                }
                                                className={inputStyles}
                                                placeholder="Short description of the activity"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {activityErrors && (
                                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                            {activityErrors}
                                        </div>
                                    )}
                                    <div className="flex flex-row justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleActivitySubmit}
                                            disabled={isActivitySubmitting}
                                            className={`flex gap-2 items-center`}

                                        >
                                            {isActivitySubmitting ? (
                                                <span>Submitting</span>
                                            ) : (
                                                <>
                                                    <img
                                                        width="24"
                                                        height="24"
                                                        src="https://img.icons8.com/ffffff/ios/24/add--v1.png"
                                                        alt="add--v1"
                                                    />
                                                    <span>Add Activity</span>
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={() => setIsAddNewActivity(false)}
                                            disabled={isActivitySubmitting}
                                            variant="outline"
                                            className="px-10"
                                        >
                                            <span>Cancel</span>
                                        </Button>

                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                variant="primary"
                                className={`px-6 py-3 bg-blue-600 text-white rounded-lg transition-colors duration-200 ${isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-blue-700"
                                    }`}
                            >
                                {isSubmitting ? "Creating..." : "Create Service"}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={successModalTitle}
                subtitle={successModalSubtitle}
            />
        </>
    );
}

