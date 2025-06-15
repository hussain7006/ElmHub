import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ icon: Icon, title, description, colors, isEnabled = true, section }) => {
    const getIconBgColor = () => {
        // if (!isEnabled) return colors.disabled;

        switch (section) {
            case 'Speech Related':
                return '#8B5CF6'; // Purple
            case 'Computer Vision Related':
                return '#3B82F6'; // Blue
            case 'Large Language Models (LLM)':
                return '#F97316'; // Orange
            default:
                return '#8B5CF6'; // Default purple
        }
    };

    return (
        <motion.div
            whileHover={isEnabled ? { scale: 1.02 } : {}}
            whileTap={isEnabled ? { scale: 0.98 } : {}}
            className={`flex items-center p-4 rounded-lg shadow-sm transition-shadow ${isEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            style={{
                backgroundColor: colors.surface,
                opacity: isEnabled ? 1 : 0.6
            }}
        >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: getIconBgColor() }}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>{title}</h3>
                <p className="text-xs" style={{ color: colors.textSecondary }}>{description}</p>
            </div>
        </motion.div>
    );
};

export default ProductCard; 