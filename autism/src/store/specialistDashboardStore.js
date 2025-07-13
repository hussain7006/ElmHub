import { create } from "zustand";

const useSpecialistDashboardStore = create((set) => ({
  // States
  activeTab: "upcoming",
  selectedSession: null,
  showChildInfo: false,
  isEditing: false,
  childInfo: {
    name: "",
    gender: "",
    location: "",
    personality: "",
    about: "",
    coreNeeds: "",
    frustrations: "",
    platform: "",
  },

  // Mock data
  sessions: [
    {
      id: 1,

      child: "Charlie Brown",
      parent: "Lucy Brown",
      date: "2024-04-20",
      time: "10:00 AM",
      status: "upcoming",
      notes: "Focus on social interaction exercises",
      age: 8,
      diagnosis: "Autism Spectrum Disorder",
      goals: [
        "Improve eye contact during conversations",
        "Develop turn-taking skills in group activities",
        "Practice recognizing basic emotions",
      ],
      previousProgress:
        "Showed improvement in maintaining conversations for up to 5 minutes",
      nextSteps:
        "Introduce more complex social scenarios and role-playing exercises",
    },
    {
      id: 2,
      child: "Bob Johnson",
      parent: "Mary Johnson",
      date: "2024-04-21",
      time: "02:00 PM",
      status: "upcoming",
      notes: "Communication skills assessment",
      age: 6,
      diagnosis: "Autism Spectrum Disorder",
      goals: [
        "Enhance verbal communication",
        "Work on sentence structure",
        "Practice asking and answering questions",
      ],
      previousProgress: "Started using 3-4 word sentences consistently",
      nextSteps: "Focus on expanding vocabulary and sentence complexity",
    },
    {
      id: 3,
      streamId: "abc123",
      child: "Alex Smith",
      parent: "John Smith",
      date: "2024-04-19",
      time: "11:00 AM",
      status: "ongoing",
      notes: "Currently in session - Social skills development",
      age: 7,
      diagnosis: "Autism Spectrum Disorder",
      goals: [
        "Develop peer interaction skills",
        "Practice sharing and cooperation",
        "Work on emotional regulation",
      ],
      previousProgress: "Successfully participated in small group activities",
      nextSteps: "Continue group activities with increased complexity",
    },
    {
      id: 4,
      child: "David Wilson",
      parent: "Sarah Wilson",
      date: "2024-04-18",
      time: "03:00 PM",
      status: "completed",
      notes: "Good progress in emotional recognition",
      age: 9,
      diagnosis: "Autism Spectrum Disorder",
      goals: [
        "Identify basic emotions in others",
        "Express own emotions appropriately",
        "Understand cause and effect of emotions",
      ],
      previousProgress: "Can identify 4 basic emotions with 80% accuracy",
      nextSteps: "Move on to more complex emotions and social situations",
    },
  ],

  // Actions for states
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedSession: (session) => set({ selectedSession: session }),
  setShowChildInfo: (show) => set({ showChildInfo: show }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  setChildInfo: (info) => set({ childInfo: info }),

  // Actions for sessions
  setSessions: (newSessions) => set({ sessions: newSessions }),
  addSession: (session, status) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [status]: [
          ...state.sessions[status],
          { ...session, id: state.sessions[status].length + 1 },
        ],
      },
    })),
  updateSession: (id, updatedSession, status) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [status]: state.sessions[status].map((session) =>
          session.id === id ? { ...session, ...updatedSession } : session
        ),
      },
    })),
  deleteSession: (id, status) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [status]: state.sessions[status].filter((session) => session.id !== id),
      },
    })),

  // Reset all states
  resetStates: () =>
    set({
      activeTab: "upcoming",
      selectedSession: null,
      showChildInfo: false,
      isEditing: false,
      childInfo: {
        name: "",
        gender: "",
        location: "",
        personality: "",
        about: "",
        coreNeeds: "",
        frustrations: "",
        platform: "",
      },
    }),
}));

export default useSpecialistDashboardStore;
