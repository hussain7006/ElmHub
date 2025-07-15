import { motion } from 'framer-motion';
import { colors } from '../../../../config/colors';
import useAuthStore from '../../../../store/authStore';

export default function RegisterInfo() {
    const { theme } = useAuthStore();
    return (
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-12"
            style={{
                backgroundColor: theme === 'dark' ? colors.primary.dark : colors.primary.light
            }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <img src="/signup_bg_img.svg" alt="" className='w-full h-100 ' />
                <div className="text-center mt-8">
                    <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>
                        Create Your Account
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-200' : 'text-primary text-opacity-80'}`}>
                        Join our community and start your journey with us
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
