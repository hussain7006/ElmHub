import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useAuthStore from '../../store/authStore';
import { colors } from '../../config/colors';
import PageTitle from '../../Componentss/_component/PageTitle';
import Calender from '../../Componentss/Specialist/ViewCalender/Calender';

const localizer = momentLocalizer(moment);

const EventModal = ({ event, onClose, isOpen }) => {
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
};

const ViewCalendarPage = () => {
    const { theme, showHeader } = useAuthStore();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sample events data - replace with actual data from your backend
    const events = [
        {
            id: 1,
            title: 'Speech Therapy Session',
            start: new Date(2025, 3, 15, 10, 0), // April 15, 2025 at 10:00 AM
            end: new Date(2025, 3, 15, 11, 0), // April 15, 2025 at 11:00 AM
            status: 'booked',
            client: 'John Doe',
            type: 'Online'
        },
        {
            id: 2,
            title: 'Available Slot',
            start: new Date(2025, 3, 16, 14, 0), // April 15, 2025 at 2:00 PM
            end: new Date(2025, 3, 16, 15, 0), // April 15, 2025 at 3:00 PM
            status: 'available',
            type: 'Online'
        },
        // Add more sample events as needed
    ];

    const eventStyleGetter = (event) => {
        let backgroundColor = colors.primary.DEFAULT;
        let borderColor = colors.primary.dark;
        let textColor = 'white';

        if (event.status === 'available') {
            backgroundColor = colors.success;
            borderColor = '#059669';
        } else if (event.status === 'booked') {
            backgroundColor = colors.secondary.DEFAULT;
            borderColor = colors.secondary.light;
        }

        return {
            style: {
                backgroundColor,
                borderColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: textColor,
                border: '1px solid',
                display: 'block',
                padding: '2px 5px',
            },
        };
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleViewChange = (newView) => {
        setView(newView);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const CustomDayCell = ({ date, children }) => {
        const isDisabled = date < new Date(); // Example: disable past dates
        return (
            <div
                className={`h-full w-full ${isDisabled
                    ? theme === 'dark'
                        ? 'bg-gray-900/50 text-gray-500'
                        : 'bg-gray-100/50 text-gray-400'
                    : ''
                    }`}

            >
                {children}
            </div>
        );
    };

    const CustomToolbar = ({ label, onNavigate }) => {
        return (
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onNavigate('PREV')}
                        className={`p-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onNavigate('TODAY')}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => onNavigate('NEXT')}
                        className={`p-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <h2 className="text-xl font-semibold" style={{ color: theme === 'dark' ? 'white' : colors.text.light }}>
                    {label}
                </h2>
            </div>
        );
    };

    return (
        <div className={``}>
            <PageTitle
                title="View Calendar"
                subTitle={" View and manage your calendar"}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col gap-6 ${showHeader ? "max-h-[calc(100vh-190px)]" : "max-h-[calc(100vh-150px)]"} overflow-y-auto rounded-lg shadow-lg p-4 md:p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            >
                <Calender />
            </motion.div>

            {/* Event Details Modal */}
            <EventModal
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default ViewCalendarPage; 