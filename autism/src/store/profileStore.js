import { create } from 'zustand';

const useProfileStore = create((set) => ({
  // States
  isEditing: false,
  profileData: {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    language: 'English',
    role: '',
    email: '',
    bio: '',
    specialization: ''
  },

  // Actions
  setIsEditing: (editing) => set({ isEditing: editing }),
  
  setProfileData: (data) => set((state) => ({
    profileData: {
      ...state.profileData,
      ...data
    }
  })),

  updateProfileField: (field, value) => set((state) => ({
    profileData: {
      ...state.profileData,
      [field]: value
    }
  })),

  // Initialize profile data from user
  initializeProfile: (user) => set({
    profileData: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      phoneNumber: user?.phone_num || '',
      language: user?.language || 'English',
      role: user?.role || '',
      email: user?.email || '',
      bio: user?.bio || '',
      specialization: user?.specialization || ''
    }
  }),

  // Reset all states
  resetProfile: () => set({
    isEditing: false,
    profileData: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      language: 'English',
      role: '',
      email: ''
    }
  })
}));

export default useProfileStore; 