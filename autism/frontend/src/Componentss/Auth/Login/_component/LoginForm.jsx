import { motion } from 'framer-motion';
import useAuthStore from "../../../../store/authStore";
import { themeColors } from "../../../../config/colors";
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../_component/Button';
import ErrorBox from '../../../_component/ErrorBox';


export default function LoginForm() {
    const { theme, login, error, setError, isLoading, loginFormData, setLoginFormData } = useAuthStore();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginFormData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const success = await login(loginFormData.email, loginFormData.password);
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
            setError('Invalid email or password');
        }

    };

    return (
        <div className="w-full md:w-1/2 flex items-center justify-center p-12">
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
                className="w-full max-w-md"
            >
                {error && (
                    <ErrorBox error={error} />
                )}

                <div className="text-center mb-8">
                    <h2 className={`text-2xl font-bold mb-2 ${themeColors === 'dark' ? 'text-white' : 'text-primary'}`}>
                        Welcome to GazeVLM
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Your trusted platform for autism support and therapy management
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                            Email Address
                        </label>
                        <input
                            type="text"
                            name="email"
                            value={loginFormData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                }`}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={loginFormData.password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                }`}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-primary'}`}>
                            Role
                        </label>
                        <select
                            name="role"
                            value={loginFormData.role}
                            onChange={(e) => setFormData({ ...loginFormData, role: e.target.value })}
                            className={`w-full px-4 py-3 rounded-lg border cursor-pointer ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                                }`}
                        >
                            <option value="parent">Parent</option>
                            <option value="specialist">Specialist</option>
                            <option value="child">Child</option>
                        </select>
                    </div> */}

                    <div className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>

                        <div className="text-center space-y-2">
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-secondary'}`}>
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className={`
                                        font-medium cursor-pointer 
                                        ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`
                                    }
                                >
                                    Register
                                </Link>
                            </p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-secondary'}`}>
                                Want to try demo accounts?{' '}
                                <Link
                                    to="/quick-login"
                                    className={`
                                        font-medium cursor-pointer 
                                        ${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`
                                    }
                                >
                                    Quick Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    )

}