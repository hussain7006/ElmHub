import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { colors, themeColors } from '../config/colors';
import useAuthStore from '../store/authStore';
import useProfileStore from '../store/profileStore';
import { updateParentProfile } from '../services/parentsService';
import getProfileInfo from '../services/parentsService';
import SuccessModal from '../components/modals/SuccessModal';
import ErrorBox from '../Componentss/_component/ErrorBox';

const ProfilePage = () => {
  const { theme, user, setLoading: setAuthLoading, setError: setAuthError, setUser, showHeader } = useAuthStore();

  const {
    isEditing,
    profileData,
    setProfileData,
    setIsEditing,
    updateProfileField,
    initializeProfile,

  } = useProfileStore();

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");


  // Initialize profile data when user data is available
  useEffect(() => {
    if (user) {
      initializeProfile(useAuthStore.getState().user);
    }
  }, [user]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateProfileField(name, value);
  };

  const handleSave = async () => {
    setError("");
    if (!profileData.firstName || !profileData.lastName || !profileData.phoneNumber || !profileData.language) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await updateParentProfile({
        role: user.role,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone_num: profileData.phoneNumber,
        language: profileData.language,
        bio: profileData.bio || ' ',
        specialization: profileData.specialization || ' '
      });
      const updatedProfile = await getProfileInfo(user.role);
      console.log("updatedProfile", updatedProfile);
      console.log("in if");
      let { first_name, last_name, phone_num, language, bio, specialization, role, user_id } = updatedProfile.profile;
      setUser({ first_name, last_name, phone_num, language, bio, specialization, role, user_id });
      // setProfileData({ first_name, last_name, phone_num, language, bio, specialization, role, user_id });

      setShowSuccess(true);
      setIsEditing(false);
    } catch (e) {
      setError(e.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`${showHeader ? "h-[calc(100vh-100px)]" : "h-screen"} mx-auto w-full px-4 sm:px-6 lg:px-4 py-0`}
    >
      {/* Profile Header */}
      <div className="relative">
        {/* Background Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="h-12 rounded-tl-lg rounded-br-lg overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${themeColors[theme].primary}40, ${themeColors[theme].secondary}40)`
          }}
        />

        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col mt-4 md:flex-row items-center md:items-end justify-between"
        >
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div
                className="w-25 h-25 md:w-15 md:h-15 rounded-full overflow-hidden"
                style={{
                  borderColor: theme === 'light' ? colors.primary.light : colors.gray[800],
                  background: theme === 'light' ? colors.background.light : colors.gray[800]
                }}
              >
                <img
                  src={user?.profilePicture || '/avatar.jpg'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1
                className="text-lg font-bold"
                style={theme === 'light' ? { color: colors.primary.DEFAULT } : { color: colors.text.dark }}
              >
                {user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`}
              </h1>
              <p
                className="text-sm"
                style={theme === 'light' ? { color: colors.gray[600] } : { color: colors.gray[400] }}
              >
                {user?.role}
              </p>
              <p
                className="text-sm"
                style={theme === 'light' ? { color: colors.gray[600] } : { color: colors.gray[400] }}
              >
                {user?.email}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: isEditing ? 1.05 : 1 }}
            whileTap={{ scale: isEditing ? 0.95 : 1 }}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="mt-4 md:mt-0 px-6 py-2 rounded-lg flex items-center space-x-2 cursor-pointer relative"
            style={{
              background: isEditing ? themeColors[theme].primary : 'transparent',
              color: isEditing ? colors.text.light : themeColors[theme].primary,
              border: `2px solid ${themeColors[theme].primary}`
            }}
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white absolute left-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span>{isEditing ? (loading ? 'Submitting...' : 'Save Profile') : 'Edit Profile'}</span>
          </motion.button>
        </motion.div>
        {error && (
          <ErrorBox error={error} />
        )}
        <SuccessModal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          title="Profile Updated"
          message="Your profile has been updated successfully."
        />
      </div>

      {/* Main Content */}
      <div className={`mt-4 p-6 rounded-lg bg-white dark:bg-gray-800 overflow-y-auto ${showHeader ? "max-h-[calc(100vh-240px)]" : "max-h-[calc(100vh-200px)]"} grid grid-cols-1 md:grid-cols-2 gap-8`}>
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2
            className="text-xl font-semibold"
            style={theme === 'light' ? { color: colors.primary.DEFAULT } : { color: colors.text.dark }}
          >
            Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={theme === 'light' ? { color: colors.gray[700] } : { color: colors.gray[300] }}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={theme === 'light' ? {
                  borderColor: colors.gray[300],
                  background: isEditing ? colors.background.light : colors.gray[100],
                  color: colors.text.light
                } : {
                  borderColor: colors.gray[700],
                  background: isEditing ? colors.gray[900] : colors.gray[800],
                  color: colors.text.dark
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={theme === 'light' ? { color: colors.gray[700] } : { color: colors.gray[300] }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={theme === 'light' ? {
                  borderColor: colors.gray[300],
                  background: isEditing ? colors.background.light : colors.gray[100],
                  color: colors.text.light
                } : {
                  borderColor: colors.gray[700],
                  background: isEditing ? colors.gray[900] : colors.gray[800],
                  color: colors.text.dark
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={theme === 'light' ? { color: colors.gray[700] } : { color: colors.gray[300] }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={theme === 'light' ? {
                  borderColor: colors.gray[300],
                  background: isEditing ? colors.background.light : colors.gray[100],
                  color: colors.text.light
                } : {
                  borderColor: colors.gray[700],
                  background: isEditing ? colors.gray[900] : colors.gray[800],
                  color: colors.text.dark
                }}
              />
            </div>

            {user?.role === 'specialist' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1" style={theme === 'light' ? { color: colors.gray[700] } : { color: colors.gray[300] }}>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    rows="3"
                    placeholder="Enter your bio"
                    style={theme === 'light' ? {
                      borderColor: colors.gray[300],
                      background: isEditing ? colors.background.light : colors.gray[100],
                      color: colors.text.light
                    } : {
                      borderColor: colors.gray[700],
                      background: isEditing ? colors.gray[900] : colors.gray[800],
                      color: colors.text.dark
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={theme === 'light' ? { color: colors.gray[700] } : { color: colors.gray[300] }}>
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={profileData.specialization || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    placeholder="Enter your specialization"
                    style={theme === 'light' ? {
                      borderColor: colors.gray[300],
                      background: isEditing ? colors.background.light : colors.gray[100],
                      color: colors.text.light
                    } : {
                      borderColor: colors.gray[700],
                      background: isEditing ? colors.gray[900] : colors.gray[800],
                      color: colors.text.dark
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <h2
            className="text-xl font-semibold"
            style={theme === 'light' ? { color: colors.primary.DEFAULT } : { color: colors.text.dark }}
          >
            Account Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={theme === 'light' ? { color: colors.gray[700] } : { color: colors.gray[300] }}>
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={theme === 'light' ? {
                  borderColor: colors.gray[300],
                  background: colors.gray[100],
                  color: colors.gray[500]
                } : {
                  borderColor: colors.gray[700],
                  background: colors.gray[800],
                  color: colors.gray[400]
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={theme === 'light' ? { color: colors.gray[700] } : { color: colors.gray[300] }}>
                Role
              </label>
              <input
                type="text"
                value={profileData.role}
                disabled
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={theme === 'light' ? {
                  borderColor: colors.gray[300],
                  background: colors.gray[100],
                  color: colors.gray[500]
                } : {
                  borderColor: colors.gray[700],
                  background: colors.gray[800],
                  color: colors.gray[400]
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={theme === 'light' ? { color: colors.gray[700] } : { color: colors.gray[300] }}>
                Language
              </label>
              <select
                name="language"
                value={profileData.language}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={theme === 'light' ? {
                  borderColor: colors.gray[300],
                  background: isEditing ? colors.background.light : colors.gray[100],
                  color: colors.text.light
                } : {
                  borderColor: colors.gray[700],
                  background: isEditing ? colors.gray[900] : colors.gray[800],
                  color: colors.text.dark
                }}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage; 