import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useParentDashboardStore from '../../store/parentDashboardStore';
import { createSession } from '../../services/parentsService';
import SuccessModal from '../../components/modals/SuccessModal';
import useSWRMutation from 'swr/mutation';
import PageTitle from '../../Componentss/_component/PageTitle';
import Button from '../../Componentss/_component/Button';
import ServicesList from '../../Componentss/Parent/BookSession/ServicesList';
import SessionDateTime from '../../Componentss/Parent/BookSession/SessionDateTime';
import { ChildAndDescription } from '../../Componentss/Parent/BookSession/ChildAndDescription';
import PageWrapper from '../../components/layout/PageWrapper';

const BookSession = () => {
  const { theme } = useAuthStore();

  const {
    activeTab,
    selectedSpecialist,
    selectedDate,
    fetchAvailableDates,
    fetchAvailableTimes,
    service,
    steps,
    activity,
    date,
    time,
    parent,
    child,
    description,
    resetStates,
    setStep,
    incrementStep,
    decrementStep,
  } = useParentDashboardStore();


  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { trigger: createSessionMutation, isMutating } = useSWRMutation(
    '/parent/sessions',
    async (url, { arg }) => {
      return createSession(arg);
    }
  );

  useEffect(() => {
    if (selectedSpecialist) {
      fetchAvailableDates(selectedSpecialist.id);
    }
  }, [selectedSpecialist, fetchAvailableDates]);

  useEffect(() => {
    if (selectedDate && selectedSpecialist) {
      fetchAvailableTimes(selectedSpecialist.id, selectedDate);
    }
  }, [selectedDate, selectedSpecialist, fetchAvailableTimes]);

  useEffect(() => { resetStates(); }, []);

  const isDisabled = useMemo(() => {
    switch (steps) {
      case 1:
        // Step 1: service must be selected
        return service == null;
      case 2:
        // Step 2: date and time must be selected
        return date == null || time == null;
      case 3:
        // Step 3: child and description must be filled
        return child == null || description.trim() === "";
      case 4:
        // Step 4: final validation
        return (
          service == null ||
          date == null ||
          time == null ||
          child == null ||
          description.trim() === ""
        );
      default:
        return false;
    }
  }, [steps, service, date, time, child, description]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (
        service == null ||
        date == null ||
        time == null ||
        child == null ||
        description.trim() === ""
      ) {
        throw new Error("Some fields found empty");
      }

      const sessionData = {
        service_id: service.service_id,
        child_id: child.id,
        specialist_id: service.specialist_id,
        description: description,
        date_of_session: new Date(`${date}T${time}:00`).getTime(),
        activity: activity?.map((a) => a.activity_id) || []
      };

      console.log("Session Data:", sessionData);

      await createSessionMutation(sessionData);

      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || "Failed to create service. Please try again.");
      console.log("error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex-1 flex flex-col ${theme === "dark" ? "text-white" : "text-gray-800"}`}
        >
          {/* h-[calc(100vh-100px)] w-full */}

          <PageTitle
            title="Book New Session"
            subTitle={
              steps === 1 ? "Select the Service for the Child" :
                steps === 2 ? "Select Date and Time" :
                  steps === 3 ? "Select Child and Add Description" :
                    steps === 4 ? "Review and Confirm" :
                      ""
            }
          />


          <div className="flex flex-col gap-4">
            {/* Step 1: Select Service */}
            {steps === 1 && (
              <ServicesList />
            )}

            {/* Step 2: Select Date and Time */}
            {steps === 2 && (
              <SessionDateTime />
            )}

            {/* Step 3: Select Child and Description */}
            {steps === 3 && (
              <ChildAndDescription />
            )}

            {/* Step 4: Review and Confirm */}
            {steps === 4 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Session Summary</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium">Service:</span> {service?.title}
                    </div>
                    <div>
                      <span className="font-medium">Date & Time:</span> {date} at {time}
                    </div>
                    <div>
                      <span className="font-medium">Child:</span> {child?.first_name} {child?.last_name}
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">{description || "No description provided"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-8  w-[98%] mx-auto">
              <Button onClick={decrementStep} disabled={steps === 1} className={`w-1/4`}>Previous</Button>
              {steps < 4 ? (
                <Button onClick={incrementStep} disabled={isDisabled} className={`w-1/4`}>Next</Button>
              ) : (
                <Button type="submit" onClick={handleSubmit} disabled={isSubmitting} className={`w-1/4`}>
                  {isSubmitting ? "Creating..." : "Create Session"}
                </Button>

              )}
            </div>
          </div>

          <SuccessModal isOpen={showSuccessModal}
            title="Session Created Successfully!"
            message="Your new session has been created and is now available for use."
            onClose={() => {
              setShowSuccessModal(false);
              resetStates();
              setStep(1);
            }}
          />
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  );
};





export default BookSession; 