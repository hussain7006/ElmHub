import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../../store/authStore';

export default function EventModal({ event, onClose, isOpen }) {
    if (!event) return null;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        key="modal"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            duration: 0.2
                        }}
                        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-8 rounded-xl shadow-2xl z-50 ${useAuthStore.getState().theme === 'dark'
                            ? 'bg-gray-800 border border-gray-700'
                            : 'bg-white border border-gray-200'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">{event.title}</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${event.status === 'booked'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    }`}>
                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</h3>
                                    <p className="text-lg">{moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}</p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</h3>
                                    <p className="text-lg">{event.type}</p>
                                </div>

                                {event.client && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Client</h3>
                                        <p className="text-lg">{event.client}</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={onClose}
                                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}