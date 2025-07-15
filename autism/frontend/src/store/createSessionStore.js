import { create } from "zustand";

const useCreateSessionStore = create((set) => ({
  service: null,
  date: null,
  time: null,
  parent: null,
  child: null,
  description: "",
  activity: [],
  steps: 1,

  // Setters for individual steps
  setService: (service) => set({ service }),
  setDate: (date) => set({ date }),
  setTime: (time) => set({ time }),
  setParent: (parent) => set({ parent }),
  setChild: (child) => set({ child }),
  setDescription: (description) => set({ description }),
  setActivity: (activity) => set({ activity }),
  addActivity: (newActivity) =>
    set((state) => ({ activity: [...state.activity, newActivity] })),
  removeActivityById: (id) =>
    set((state) => ({
      activity: state.activity.filter((act) => act.id !== id),
    })),
  setStep: (step) => set({ steps: step }),
  incrementStep: () => set((state) => ({ steps: state.steps + 1 })),
  decrementStep: () => set((state) => ({ steps: state.steps - 1 })),

  // Reset all session data
  resetSession: () =>
    set({
      service: null,
      date: null,
      time: null,
      parent: null,
      child: null,
      description: "",
      activity: [],
      steps: 1,
    }),
}));

export default useCreateSessionStore;
