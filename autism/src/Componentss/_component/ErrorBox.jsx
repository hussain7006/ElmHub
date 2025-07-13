import { motion } from 'framer-motion';

export default function ErrorBox({ error }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.5 } }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
            {error}
        </motion.div>
    );
}
