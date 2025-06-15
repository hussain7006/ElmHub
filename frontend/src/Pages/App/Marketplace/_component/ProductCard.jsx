import { motion } from 'framer-motion';
export default function ProductCard({ icon: Icon, title, description, colors }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            style={{ backgroundColor: colors.surface }}
        >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: '#c900ba' }}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
                <h3 className="text-md font-bold text-gray-500 mb-1">{title}</h3>
                <p className="text-[12px] leading-tight" style={{ color: colors.textSecondary }}>{description}</p>
            </div>
        </motion.div>
    );
}