import { create } from 'zustand';

const useParentDashboardStore = create((set, get) => ({
  // States
  activeTab: 'book-session',
  selectedSpecialist: null,
  selectedChild: null,
  selectedDate: null,
  selectedTime: null,

  // Session states
  service: null,
  steps: 1,
  activity: [],
  date: null,
  time: null,
  parent: null,
  child: null,
  description: "",

  // Demo data for specialists
  availableSpecialists: [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Speech Therapy',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      workingHours: {
        start: '09:00',
        end: '17:00'
      }
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Behavioral Therapy',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      workingHours: {
        start: '10:00',
        end: '18:00'
      }
    },
    {
      id: 3,
      name: 'Dr. Emily Wilson',
      specialization: 'Occupational Therapy',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      workingHours: {
        start: '08:00',
        end: '16:00'
      }
    }
  ],

  // Demo data for children
  children: [
    { id: 1, name: 'Alex Smith', age: 8, diagnosis: 'ASD Level 1' },
    { id: 2, name: 'Emma Smith', age: 6, diagnosis: 'ASD Level 2' }
  ],

  availableDates: [],
  availableTimes: [],

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedSpecialist: (specialist) => set({ selectedSpecialist: specialist }),
  setSelectedChild: (child) => set({ selectedChild: child }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTime: (time) => set({ selectedTime: time }),

  // Session actions
  setService: (service) => set({ service }),
  setDate: (date) => set({ date }),
  setTime: (time) => set({ time }),
  setParent: (parent) => set({ parent }),
  setChild: (child) => set({ child }),
  setDescription: (description) => set({ description }),
  setActivity: (activity) => set({ activity }),
  addActivity: (newActivity) => set((state) => ({ activity: [...state.activity, newActivity] })),
  removeActivityById: (id) => set((state) => ({
    activity: state.activity.filter((act) => act.id !== id),
  })),

  // Step management
  setStep: (step) => {
    const currentState = get();
    let canProceed = true;

    switch (step) {
      case 1:
        // Can always go back to step 1
        canProceed = true;
        break;
      case 2:
        // Can proceed to step 2 if service is selected
        canProceed = currentState.service != null;
        break;
      case 3:
        // Can proceed to step 3 if date and time are selected
        canProceed = currentState.date != null && currentState.time != null;
        break;
      case 4:
        // Can proceed to step 4 if child and description are filled
        canProceed = currentState.child != null && currentState.description.trim() !== "";
        break;
      default:
        canProceed = false;
    }

    if (canProceed) {
      set({ steps: step });
    }
  },

  incrementStep: () => {
    const currentStep = get().steps;
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      get().setStep(nextStep);
    }
  },

  decrementStep: () => {
    const currentStep = get().steps;
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      get().setStep(prevStep);
    }
  },

  // Function to generate available dates for a specialist
  fetchAvailableDates: (specialistId) => {
    const specialist = get().availableSpecialists.find(s => s.id === specialistId);
    if (!specialist) return;

    const today = new Date();
    const availableDates = [];
    
    // Generate dates for the next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Check if the day is in the specialist's available days
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (specialist.availableDays.includes(dayName)) {
        availableDates.push(date.toISOString().split('T')[0]);
      }
    }

    set({ availableDates });
  },

  // Function to generate available times for a specialist on a specific date
  fetchAvailableTimes: (specialistId, date) => {
    const specialist = get().availableSpecialists.find(s => s.id === specialistId);
    if (!specialist) return;

    const availableTimes = [];
    const [startHour, startMinute] = specialist.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = specialist.workingHours.end.split(':').map(Number);

    // Generate 30-minute slots
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === startHour && minute < startMinute) continue;
        if (hour === endHour - 1 && minute + 30 > endMinute) continue;

        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const formattedTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        // Add some randomness to simulate booked slots
        if (Math.random() > 0.3) {
          availableTimes.push(formattedTime);
        }
      }
    }

    set({ availableTimes });
  },

  // Reset all states
  resetStates: () => set({
    activeTab: 'book-session',
    selectedSpecialist: null,
    selectedChild: null,
    selectedDate: null,
    selectedTime: null,
    availableDates: [],
    availableTimes: [],
    service: null,
    steps: 1,
    activity: [],
    date: null,
    time: null,
    parent: null,
    child: null,
    description: ""
  })
}));

export default useParentDashboardStore; 