import { motion } from 'framer-motion';
export default function Header({ product, colors }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
        >


            {/* Title Section */}
            <div className="flex items-center space-x-4 mb-6">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: product.color }}
                >
                    <product.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1
                        className="text-xl font-bold mb-1"
                        style={{ color: colors.textPrimary }}
                    >
                        {product.title}
                    </h1>
                    <p
                        className="text-sm"
                        style={{ color: colors.textSecondary }}
                    >
                        {product.subtitle}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
