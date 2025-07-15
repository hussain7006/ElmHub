import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import Header from '../../Componentss/Auth/_component/Header';
import useAuthStore from '../../store/authStore';
import RegisterForm from '../../Componentss/Auth/Register/_component/RegisterForm';
import RegisterInfo from '../../Componentss/Auth/Register/_component/RegisterInfo';
import SuccessModal from '../../Componentss/_component/SuccessModal';


const RegisterPage = () => {
  const navigate = useNavigate();
  const { theme, registerFormData } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (registerFormData.password !== registerFormData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      // Call the registration API
      const data = await registerUser(registerFormData);
      // Show success modal
      setShowSuccessModal(true);

      // Navigate after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />

      <div className="flex-1 flex flex-col md:flex-row">
        <RegisterInfo />
        <RegisterForm handleSubmit={handleSubmit} isLoading={isLoading} error={error} />
      </div>


      <SuccessModal
        isOpen={showSuccessModal}
        title="Registration Successful!"
        subtitle="Your account has been created successfully."
        showSubmitButton={true}
        submitButtonText="Continue"
        submitButtonAction={() => navigate('/')}
      />
    </div>
  );
};


export default RegisterPage; 