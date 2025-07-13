import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import useAuthStore from "../../store/authStore";
import useCreateSessionStore from "../../store/createSessionStore";
import { colors } from "../../config/colors";
import { useSWRConfig } from "swr";
import SuccessModal from "../../components/modals/SuccessModal";

import { createSession } from "../../services/specialist/sessions";
import PageTitle from "../../Componentss/_component/PageTitle";
import ErrorBox from "../../Componentss/_component/ErrorBox";
import ServicesList from "../../Componentss/Specialist/CreateSession/ServicesList";
import ActivitiesList from "../../Componentss/Specialist/CreateSession/ActivitiesList";
import ParentAndScheduleList from "../../Componentss/Specialist/CreateSession/ParentAndScheduleList";
const CreateSessionPage = () => {
  const { theme } = useAuthStore();
  const { mutate } = useSWRConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    service,
    steps,
    activity,
    date,
    time,
    parent,
    child,
    description,
    setDescription,
    resetSession,
    setStep,
  } = useCreateSessionStore((state) => state);
  useEffect(() => {
    resetSession();
  }, []);
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (
        service == null ||
        activity.length === 0 ||
        date == null ||
        time == null ||
        parent == null ||
        child == null
      ) {
        throw new Error("Some fields found empty");
      }
      const dateTimeString = `${date}T${time}:00`; // "2025-05-22T10:59:00"

      // Convert to timestamp
      const timestamp = new Date(dateTimeString).getTime();
      const allIds = activity.map((a) => a.id);
      let temp = {
        service_id: service.service_id,
        child_id: child.child_id,
        parent_id: parent.parent_id,
        description: description,
        date_of_session: timestamp, // Timestamp
        activity: allIds,
      };
      await createSession(temp);
      mutate("getSessionsList");
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || "Failed to create service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const isDisabled = useMemo(() => {
    switch (steps) {
      case 1:
        // Step 1: service must be selected
        return service == null;

      case 2:
        // Step 2: at least one activity must be selected
        return activity.length === 0;

      case 3:
        // Step 3: date and time must be selected
        return date == null || time == null || parent == null || child == null;

      case 5:
        // Step 5: final validation (recheck all just in case)
        return (
          service == null ||
          activity.length === 0 ||
          date == null ||
          time == null ||
          parent == null ||
          child == null
        );

      default:
        return false;
    }
  }, [steps, service, activity, date, time, parent, child]);
  return (
    <div
      className={`${theme === "dark" ? "bg-gray-900" : colors.gray[50]}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mx-auto rounded-lg p-8"
          }`}
      >

        <PageTitle
          title="Create New Session"
          subTitle={
            steps === 1 ? "Select the Service for the Child" :
              steps === 2 ? "Modify the Activities List for the Child" :
                steps === 3 ? "Select the Parent and Child, and Schedule the Date/Time" :
                  steps === 4 ? "Write a Short Description for the Session" :
                    steps === 5 ? "Review and Confirm" :
                      ""
          }
        />

        <div className="space-y-8">
          {/* Step 1: Select Service */}
          {steps === 1 && (
            <ServicesList />
          )}

          {steps === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <ActivitiesList />
            </motion.div>
          )}
          {steps === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <ParentAndScheduleList />
            </motion.div>
          )}

          {/* Step 3: Description */}
          {steps === 4 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color:
                      theme === "dark" ? colors.gray[300] : colors.gray[700],
                  }}
                >
                  Session Description
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:border-transparent"
                  style={{
                    backgroundColor:
                      theme === "dark" ? colors.gray[700] : "white",
                    borderColor: colors.gray[300],
                    color: theme === "dark" ? "white" : colors.gray[700],
                    outlineColor: colors.primary.DEFAULT,
                  }}
                  required
                  placeholder="Describe the session details, objectives, and any specific requirements..."
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Preview */}
          {steps === 5 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full"
            >
              <div
                className={`w-full p-6 rounded-2xl shadow-md transition-all ${theme === "dark"
                  ? "bg-gray-800 text-gray-200"
                  : "bg-white text-gray-700 border border-gray-200"
                  }`}
              >
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold">Service:</span>{" "}
                    <span className="ml-1">{service?.title}</span>
                  </div>

                  <div>
                    <span className="font-semibold">Activities:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {activity?.map((a) => (
                        <span
                          key={a.id}
                          className={`px-3 py-1 text-sm rounded-full ${theme === "dark"
                            ? "bg-blue-700 text-blue-100"
                            : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {a.title}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold">Parent:</span>{" "}
                    <span className="ml-1">
                      {parent?.parent_first_name} {parent?.parent_last_name} (
                      {parent?.parent_email})
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold">Child:</span>{" "}
                    <span className="ml-1">
                      {child?.child_first_name} {child?.child_last_name}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold">Date & Time:</span>{" "}
                    <span className="ml-1">
                      {date} - {time}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold">Description:</span>{" "}
                    <span className="ml-1">{description || "-"}</span>
                  </div>
                  {error && (
                    <ErrorBox error={error} />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between px-2">
            <motion.button
              type="button"
              onClick={() => setStep(steps - 1)}
              className="px-6 py-2 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor:
                  theme === "dark" ? colors.gray[700] : colors.gray[200],
                color: theme === "dark" ? "white" : colors.gray[700],
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={steps == 1}
            >
              Previous
            </motion.button>

            {steps < 5 ? (
              <motion.button
                type="button"
                onClick={() => setStep(steps + 1)}
                className="px-6 py-2 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor: colors.primary.DEFAULT,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isDisabled}
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                className="px-6 py-2 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: colors.success,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Creating" : "Create Session"}
              </motion.button>
            )}
          </div>
        </div>
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            resetSession();
            setStep(1);
          }}
          title="Session Created Successfully!"
          message="Your new session has been created and is now available for use."
        />
      </motion.div>
    </div>
  );
};

export default CreateSessionPage;
