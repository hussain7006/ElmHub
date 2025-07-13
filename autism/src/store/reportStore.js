import { create } from "zustand";

const useReportStore = create((set) => ({
  // State
  selectedChild: null,
  selectedSession: null,
  parentFeedback: "",
  rating: 0,
  isSubmitting: false,
  isDownloading: false,
  toastMessage: null,

  // Mock data for completed sessions
  completedSessions: [
    {
      id: 1,
      childName: "John Doe",
      sessionName: "Communication Skills",
      date: "2024-03-15",
      time: "10:00 AM",
      activities: [
        "Verbal Communication Practice",
        "Social Interaction Games",
        "Emotion Recognition",
      ],
      specialistFeedback:
        "John showed great improvement in maintaining eye contact and responding to questions. He was particularly engaged during the social interaction games.",
      progress: {
        badges: ["Communication Star", "Social Butterfly"],
        milestones: ["Improved Eye Contact", "Better Response Time"],
      },
    },
    {
      id: 2,
      childName: "John Doe",
      sessionName: "Sensory Integration",
      date: "2024-03-14",
      time: "02:00 PM",
      activities: ["Sensory Play", "Fine Motor Skills", "Balance Exercises"],
      specialistFeedback:
        "John demonstrated good progress in handling different textures and showed improved focus during the activities.",
      progress: {
        badges: ["Sensory Explorer"],
        milestones: ["Improved Focus", "Better Motor Control"],
      },
    },
  ],

  // Actions
  setSelectedChild: (child) => set({ selectedChild: child }),
  setSelectedSession: (session) => set({ selectedSession: session }),
  setParentFeedback: (feedback) => set({ parentFeedback: feedback }),
  setRating: (rating) => set({ rating }),

  // Submit feedback
  submitFeedback: async () => {
    set({ isSubmitting: true });
    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({
        toastMessage: "Feedback submitted successfully!",
        isSubmitting: false,
      });
      setTimeout(() => set({ toastMessage: null }), 3000);
    } catch (error) {
      set({
        toastMessage: "Error submitting feedback. Please try again.",
        isSubmitting: false,
      });
      setTimeout(() => set({ toastMessage: null }), 3000);
    }
  },
  setIsDownloading: (isDownloading) =>
    set({
      isDownloading,
    }),

  // Download report
  // downloadReport: async () => {
  //   set({ isDownloading: true });
  //   try {
  //     // TODO: Implement actual PDF generation and download
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //     set({
  //       toastMessage: 'Report downloaded successfully!',
  //       isDownloading: false
  //     });
  //     setTimeout(() => set({ toastMessage: null }), 3000);
  //   } catch (error) {
  //     set({
  //       toastMessage: 'Error downloading report. Please try again.',
  //       isDownloading: false
  //     });
  //     setTimeout(() => set({ toastMessage: null }), 3000);
  //   }
  // },

  // Reset state
  reset: () =>
    set({
      selectedChild: null,
      selectedSession: null,
      parentFeedback: "",
      rating: 0,
      isSubmitting: false,
      isDownloading: false,
      toastMessage: null,
    }),
}));

export default useReportStore;
