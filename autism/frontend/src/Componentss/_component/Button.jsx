import { motion } from 'framer-motion';
import useAuthStore from "../../store/authStore";

export default function Button({ children, onClick, className, isLoading, type, disabled, variant = 'primary', ...props }) {
    const { theme } = useAuthStore();
    const isIcon = type === 'icon';
    const variantClasses = {
        primary: theme === 'dark'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: theme === 'dark'
            ? 'bg-gray-600 hover:bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        outline: theme === 'dark'
            ? 'border border-gray-500 text-white bg-transparent hover:bg-gray-700'
            : 'border border-gray-400 text-gray-900 bg-transparent hover:bg-gray-100',
    };

    const mergedClassName = isIcon
        ? `p-1 rounded-full flex items-center justify-center bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer ${className || ''}`
        : `p-2 sm:p-3 rounded-lg text-base sm:text-md font-medium relative cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                ${isLoading || disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : variantClasses[variant] || variantClasses.primary}
                ${className || ''}`;
    const mergedStyle = isIcon
        ? { minWidth: 0, minHeight: 0, ...(props.style || {}) }
        : props.style;
    return (

        <motion.button
            initial={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={mergedClassName}
            style={mergedStyle}
            disabled={isLoading || disabled}
            onClick={onClick}
            type={type || 'button'}
            {...props}
        >
            {children}
        </motion.button>
    )
}
