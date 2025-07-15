import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../../store/authStore';
import Button from '../../../_component/Button';
import ErrorBox from '../../../_component/ErrorBox';

export default function RegisterForm({ handleSubmit, isLoading, error }) {
    const { theme, registerFormData, setRegisterFormData } = useAuthStore();
    const navigate = useNavigate();


    return (
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-auto"
            >
                {error && (
                    <ErrorBox error={error} />
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={registerFormData.firstName}
                                onChange={(e) => setRegisterFormData({ ...registerFormData, firstName: e.target.value })}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                required
                                placeholder="Enter your first name"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={registerFormData.lastName}
                                onChange={(e) => setRegisterFormData({ ...registerFormData, lastName: e.target.value })}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                required
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={registerFormData.email}
                            onChange={(e) => setRegisterFormData({ ...registerFormData, email: e.target.value })}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                }`}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={registerFormData.phone}
                                onChange={(e) => setRegisterFormData({ ...registerFormData, phone: e.target.value })}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                required
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                                Language
                            </label>
                            <select
                                name="language"
                                value={registerFormData.language}
                                onChange={(e) => setRegisterFormData({ ...registerFormData, language: e.target.value })}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                required
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="ar">Arabic</option>
                                <option value="ur">Urdu</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                            Role
                        </label>
                        <select
                            name="type"
                            value={registerFormData.type}
                            onChange={(e) => setRegisterFormData({ ...registerFormData, type: e.target.value })}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                }`}
                        >
                            <option value="parent">Parent</option>
                            <option value="specialist">Specialist</option>
                        </select>
                    </div>

                    <AnimatePresence>
                        {registerFormData.type === 'specialist' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="space-y-4 sm:space-y-6 overflow-hidden"
                            >
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ delay: 0.1, duration: 0.3 }}
                                >
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={registerFormData.bio}
                                        onChange={(e) => setRegisterFormData({ ...registerFormData, bio: e.target.value })}
                                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                        required
                                        placeholder="Tell us about yourself"
                                        rows="3"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}
                                >
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                                        Specialization
                                    </label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={registerFormData.specialization}
                                        onChange={(e) => setRegisterFormData({ ...registerFormData, specialization: e.target.value })}
                                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                        required
                                        placeholder="Enter your specialization"
                                    />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={registerFormData.password}
                                onChange={(e) => setRegisterFormData({ ...registerFormData, password: e.target.value })}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={registerFormData.confirmPassword}
                                onChange={(e) => setRegisterFormData({ ...registerFormData, confirmPassword: e.target.value })}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                required
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? (
                                <motion.div
                                    className="flex items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    <span>Registering...</span>
                                </motion.div>
                            ) : (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Register
                                </motion.span>
                            )}
                        </Button>


                        <div className="text-center mt-4">
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-secondary'}`}>
                                Already have an account?{' '}
                                <Link
                                    to="/quick-login"
                                    className={`font-medium cursor-pointer ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                        }`}
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}