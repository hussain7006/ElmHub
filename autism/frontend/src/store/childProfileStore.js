import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChildProfileStore = create(
  persist(
    (set) => ({
      // State
      children: [],
      currentChild: null,
      isEditing: false,
      activeStep: 0,
      formData: {
        basicInfo: {
          fullName: '',
          age: '',
          gender: '',
          profilePicture: null,
          username: '',
          password: '',
          phone: '',
          language: '',
          diagnosis: '',
          interests: '',
          email: '',
        },
        autismDetails: {
          diagnosisSummary: '',
          sensoryPreferences: '',
          communicationStyle: '',
          behavioralNotes: '',
          specialInterests: '',
          supportNeeds: '',
        },
        medicalInfo: {
          currentTherapies: '',
          medication: '',
          documents: [],
        },
      },

      // Actions
      setActiveStep: (step) => set({ activeStep: step }),
      setIsEditing: (isEditing) => set({ isEditing }),
      setCurrentChild: (child) => set({ currentChild: child }),
      
      updateFormData: (section, data) => 
        set((state) => ({
          formData: {
            ...state.formData,
            [section]: {
              ...state.formData[section],
              ...data,
            },
          },
        })),

      addChild: (childData) => 
        set((state) => ({
          children: [...state.children, { ...childData, id: Date.now() }],
        })),

      updateChild: (childId, updatedData) =>
        set((state) => ({
          children: state.children.map((child) =>
            child.id === childId ? { ...child, ...updatedData } : child
          ),
        })),

      deleteChild: (childId) =>
        set((state) => ({
          children: state.children.filter((child) => child.id !== childId),
        })),

      resetForm: () =>
        set({
          formData: {
            basicInfo: {
              fullName: '',
              age: '',
              gender: '',
              profilePicture: null,
            },
            autismDetails: {
              diagnosisSummary: '',
              sensoryPreferences: '',
              communicationStyle: '',
              behavioralNotes: '',
              specialInterests: '',
              supportNeeds: '',
            },
            medicalInfo: {
              currentTherapies: '',
              medication: '',
              documents: [],
            },
          },
          activeStep: 0,
          isEditing: false,
          currentChild: null,
        }),
    }),
    {
      name: 'child-profiles-storage',
    }
  )
);

export default useChildProfileStore; 