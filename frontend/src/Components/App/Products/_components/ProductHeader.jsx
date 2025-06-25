import { motion } from 'framer-motion';
import useThemeStore from '../../../../store/themeStore';

export default function ProductHeader({ title, subtitle }) {
    const { colors, theme } = useThemeStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4 sm:mb-6"
            style={{
                color: theme === 'dark' ? colors.textPrimary : colors.textSecondary
            }}
        >
            <h1
                className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3"
                style={{ color: colors.textPrimary }}
            >
                {title}
            </h1>
            <p
                className="text-xs sm:text-sm px-2 sm:px-4 font-semibold"
                style={{ color: colors.textSecondary }}
            >
                {subtitle}
            </p>
        </motion.div>
    )
}