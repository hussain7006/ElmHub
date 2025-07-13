import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Header from '../../Componentss/Auth/_component/Header';
import Button from '../../Componentss/_component/Button';
import ErrorBox from '../../Componentss/_component/ErrorBox';
import { colors } from '../../config/colors';

const QuickLoginPage = () => {
    const { theme, login, error, setError, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);

    // Predefined credentials
    const credentials = {
        specialist: {
            email: 'abcd@gmail.com',
            password: '123456',
            title: 'Specialist',
            description: 'Access therapy sessions and manage services',
            icon: '👨‍⚕️',
            color: 'from-blue-500 to-blue-600'
        },
        parent: {
            email: 'abc@gmail.com',
            password: '123456',
            title: 'Parent',
            description: 'Book sessions and manage your child\'s progress',
            icon: '👨‍👩‍👧‍👦',
            color: 'from-green-500 to-green-600'
        },
        child: {
            email: 'csaad',
            password: '123456',
            title: 'Child',
            description: 'Participate in therapeutic activities and games',
            icon: '🧒',
            color: 'from-purple-500 to-purple-600'
        }
    };

    const handleQuickLogin = async (role) => {
        setError('');
        setSelectedRole(role);

        const creds = credentials[role];
        const success = await login(creds.email, creds.password);
        const loggedInUser = useAuthStore.getState().user;

        if (success) {
            if (loggedInUser && loggedInUser.role === 'parent') {
                navigate('/parent/manage-child');
            } else if (loggedInUser && loggedInUser.role === 'specialist') {
                navigate('/specialist/book-session');
            } else if (loggedInUser && loggedInUser.role === 'child') {
                navigate('/child');
            }
        } else {
            setError(`Failed to login as ${role}. Please check your credentials.`);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Header />

            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-4xl"
                >
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        >
                            Welcome to GazeVLM
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                            Choose your role to quickly access the platform
                        </motion.p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6"
                        >
                            <ErrorBox error={error} />
                        </motion.div>
                    )}

                    {/* Role Selection Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {Object.entries(credentials).map(([role, creds], index) => (
                            <motion.div
                                key={role}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                  relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300
                  ${theme === 'dark'
                                        ? 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                                        : 'bg-white border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
                                    }
                `}
                                onClick={() => handleQuickLogin(role)}
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${creds.color} opacity-10`} />

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">{creds.icon}</div>
                                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {creds.title}
                                        </h3>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {creds.description}
                                        </p>
                                    </div>

                                    {/* Login Button */}
                                    <div className="mt-6">
                                        <Button
                                            variant="primary"
                                            className={`w-full bg-gradient-to-r ${creds.color} hover:opacity-90 transition-opacity`}
                                            disabled={isLoading && selectedRole === role}
                                        >
                                            {isLoading && selectedRole === role ? 'Signing in...' : `Login as ${creds.title}`}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Divider */}
                    {/* <div className="flex items-center justify-center mb-8">
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <span className={`px-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              or
            </span>
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </div> */}

                    {/* Manual Login Link */}
                    {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Need to login with different credentials?
            </p>
            <Link
              to="/login"
              className={`
                inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${theme === 'dark' 
                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
                }
              `}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Manual Login
            </Link>
          </motion.div> */}

                    {/* Footer Info */}
                    {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              This is a demo application. Use the predefined credentials above for testing.
            </p>
          </motion.div> */}
                </motion.div>
            </div>
        </div>
    );
};

export default QuickLoginPage; 