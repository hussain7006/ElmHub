import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useChildProfileStore from '../../store/childProfileStore';
import useAuthStore from '../../store/authStore';
import { registerChild } from '../../services/authService';
import useHeaderStore from '../../store/headerStore';
import PageTitle from '../../Componentss/_component/PageTitle';
import ErrorBox from '../../Componentss/_component/ErrorBox';
import ChildRegistrationForm from '../../Componentss/Parent/ManageChild/ChildRegistrationForm';
import SuccessModal from '../../Componentss/_component/SuccessModal';

const ManageChild = () => {
  const { user, showHeader } = useAuthStore();
  const { setActiveSidebarItemFromUrl } = useHeaderStore();
  const { formData, resetForm } = useChildProfileStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.basicInfo.username || !formData.basicInfo.password || !formData.basicInfo.firstName || !formData.basicInfo.lastName || !formData.basicInfo.age || !formData.basicInfo.gender || !formData.basicInfo.diagnosis) {
      setError('Please fill all the fields');
      setIsLoading(false);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    try {
      // Prepare child data for API
      const childData = {
        username: formData.basicInfo.username,
        password: formData.basicInfo.password,
        firstName: formData.basicInfo.firstName,
        lastName: formData.basicInfo.lastName,
        phone: formData.basicInfo.phone || '',
        language: formData.basicInfo.language?.toLowerCase() || 'en',
        age: formData.basicInfo.age,
        gender: formData.basicInfo.gender.toLowerCase(),
        diagnosis: formData.basicInfo.diagnosis,
        parentId: user.id
      };
      // Call the child registration API
      const response = await registerChild(childData);

      // Show success modal
      setShowSuccessModal(true);

    } catch (err) {
      setError(err.message || 'Failed to add child. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setActiveSidebarItemFromUrl(user?.role)
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${showHeader ? "h-[calc(100vh-100px)]" : "h-full"}`}
    >
      {error && (<ErrorBox error={error} />)}

      <PageTitle title="Add New Child" />
      <ChildRegistrationForm handleSubmit={handleSubmit} isLoading={isLoading} />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Child Added Successfully!"
        subtitle="The child has been successfully registered to your account."
        showSubmitButton={true}
        submitButtonText={"Close"}
        submitButtonAction={() => {
          setShowSuccessModal(false);
          resetForm();
        }}

      />
    </motion.div >
  );
};

export default ManageChild; 