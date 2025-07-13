import { motion, AnimatePresence } from 'framer-motion';

export default function SuccessModal(
    {
        isOpen,
        onClose,
        title,
        subtitle,
        showSubmitButton,
        submitButtonText,
        submitButtonAction
    }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg p-6 max-w-sm w-full mx-auto shadow-xl border border-gray-200/20 dark:border-gray-700/20"
                    >
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100/80 dark:bg-green-900/80 backdrop-blur-sm mb-4"
                            >
                                <svg
                                    className="h-8 w-8 text-green-600 dark:text-green-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </motion.div>
                            <motion.h3
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg font-medium text-gray-900 dark:text-white mb-2"
                            >
                                {title}
                            </motion.h3>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-sm text-gray-500 dark:text-gray-400 mb-6"
                            >
                                {
                                    subtitle ? subtitle : null
                                }
                            </motion.p>

                            {
                                showSubmitButton ? (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <button
                                            onClick={submitButtonAction}
                                            className="w-full px-4 py-2 bg-blue-600/90 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                                        >
                                            {submitButtonText}
                                        </button>
                                    </motion.div>
                                ) : null
                            }
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};