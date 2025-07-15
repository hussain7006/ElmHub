import { create } from "zustand";

const useChildDashboardStore = create((set) => ({
  // States
  selectedEvent: null,
  isStreamActive: false,
  selectedActivity: null,
  streamError: null,
  selectedSession: null,
  isActivityExpanded: false,

  // Data
  activities: [
    {
      id: 1,
      icon: "🎯",
      name: "Focus Training",
      description: "Improve concentration through interactive exercises",
      difficulty: "Advanced",
      activityName: "flappybird",
    },
    {
      id: 2,
      icon: "🧩",
      name: "Pattern Recognition",
      description: "Enhance pattern recognition abilities",
      difficulty: "Beginner",
      activityName: "colormatch",
    },
    // {
    //   id: 2,
    //   icon: '🗣️',
    //   name: 'Speech Practice',
    //   description: 'Practice pronunciation and communication skills',
    //   difficulty: 'Intermediate'
    // },
    // {
    //   id: 3,
    //   icon: '🧩',
    //   name: 'Pattern Recognition',
    //   description: 'Enhance pattern recognition abilities',
    //   difficulty: 'Advanced'
    // },
    // {
    //   id: 4,
    //   icon: '🎨',
    //   name: 'Creative Expression',
    //   description: 'Express yourself through digital art and music',
    //   difficulty: 'Beginner'
    // },
    // {
    //   id: 5,
    //   icon: '🤝',
    //   name: 'Social Skills',
    //   description: 'Learn social interactions through role-play',
    //   difficulty: 'Intermediate'
    // }
  ],

  // Categorized sessions
  sessions: {
    current: [
      {
        id: "1",
        title: "Speech Therapy",
        start: new Date().toISOString(),
        specialist: "Dr. Sarah Johnson",
        type: "Speech Session",
        duration: "45 minutes",
        goals: ["Improve pronunciation", "Practice conversation skills"],
        status: "current",
        activities: [
          {
            id: 1,
            icon: "🎯",
            name: "Focus Training",
            description: "Improve concentration through interactive exercises",
            difficulty: "Advanced",
            activityName: "flappybird",
          },
          {
            id: 2,
            icon: "🧩",
            name: "Pattern Recognition",
            description: "Enhance pattern recognition abilities",
            difficulty: "Beginner",
            activityName: "colormatch",
          },
        ],
      },
    ],
    past: [
      {
        id: "2",
        title: "Physical Therapy",
        start: new Date(Date.now() - 86400000).toISOString(),
        specialist: "Dr. Mike Wilson",
        type: "Physical Session",
        duration: "60 minutes",
        goals: ["Balance training", "Coordination exercises"],
        status: "completed",
        activities: [
          {
            id: 2,
            icon: "🧩",
            name: "Pattern Recognition",
            description: "Enhance pattern recognition abilities",
            difficulty: "Beginner",
            activityName: "colormatch",
          },
        ],
      },
    ],
    future: [
      {
        id: "3",
        title: "Occupational Therapy",
        start: new Date(Date.now() + 172800000).toISOString(),
        specialist: "Dr. Emily Brown",
        type: "OT Session",
        duration: "50 minutes",
        goals: ["Fine motor skills", "Daily living activities"],
        status: "scheduled",
        activities: [
          {
            id: 1,
            icon: "🎯",
            name: "Focus Training",
            description: "Improve concentration through interactive exercises",
            difficulty: "Advanced",
            activityName: "flappybird",
          },
        ],
      },
    ],
  },

  // Computed property for calendar events
  getCalendarEvents: () => {
    const { sessions } = useChildDashboardStore.getState();
    const allSessions = [
      ...sessions.current,
      ...sessions.past,
      ...sessions.future,
    ];
    return allSessions.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      extendedProps: {
        specialist: event.specialist,
        type: event.type,
        duration: event.duration,
        goals: event.goals,
        status: event.status,
      },
      className: "calendar-event",
    }));
  },

  // Actions for states
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setIsStreamActive: (isActive) => set({ isStreamActive: isActive }),
  setSelectedActivity: (activity) => set({ selectedActivity: activity }),
  setStreamError: (error) => set({ streamError: error }),
  setSelectedSession: (session) => set({ selectedSession: session }),
  setIsActivityExpanded: (isExpanded) =>
    set({ isActivityExpanded: isExpanded }),

  // Actions for activities
  setActivities: (newActivities) => set({ activities: newActivities }),
  addActivity: (activity) =>
    set((state) => ({
      activities: [
        ...state.activities,
        { ...activity, id: state.activities.length + 1 },
      ],
    })),
  updateActivity: (id, updatedActivity) =>
    set((state) => ({
      activities: state.activities.map((activity) =>
        activity.id === id ? { ...activity, ...updatedActivity } : activity
      ),
    })),
  deleteActivity: (id) =>
    set((state) => ({
      activities: state.activities.filter((activity) => activity.id !== id),
    })),

  // Actions for sessions
  setSessions: (newSessions) => set({ sessions: newSessions }),
  addSession: (session, category) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [category]: [
          ...state.sessions[category],
          { ...session, id: Date.now().toString() },
        ],
      },
    })),
  updateSession: (id, updatedSession, category) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [category]: state.sessions[category].map((session) =>
          session.id === id ? { ...session, ...updatedSession } : session
        ),
      },
    })),
  deleteSession: (id, category) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [category]: state.sessions[category].filter(
          (session) => session.id !== id
        ),
      },
    })),

  // Reset all states
  resetStates: () =>
    set({
      selectedEvent: null,
      isStreamActive: false,
      selectedActivity: null,
      streamError: null,
      selectedSession: null,
      isActivityExpanded: false,
    }),
}));

export default useChildDashboardStore;
