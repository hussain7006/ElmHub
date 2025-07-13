import useAuthStore from "../../../store/authStore";
import useParentDashboardStore from "../../../store/parentDashboardStore";
import { useState } from "react";
import { motion } from 'framer-motion';
import { colors } from "../../../config/colors";

export default function SessionDateTime() {
    const { theme, showHeader } = useAuthStore();
    const { date, time, parent, child, setDate, setTime, setParent, setChild } =
        useParentDashboardStore((state) => state);



    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatDateLocal = (date) => {
        return date.getFullYear() + '-' +
            (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
            date.getDate().toString().padStart(2, '0');
    };

    const generateAvailableDates = () => {
        const dates = [];
        const currentDate = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + i);
            dates.push(formatDateLocal(date));
        }
        return dates;
    };

    const availableDates = generateAvailableDates();

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 17; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            slots.push(time);
        }
        return slots;
    };

    const availableTimes = generateTimeSlots();

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const isDateAvailable = (dateString) => {
        return availableDates.includes(dateString);
    };

    const isDateSelected = (dateString) => {
        return date === dateString;
    };

    const isDatePast = (dateString) => {
        const checkDate = new Date(dateString);
        return checkDate < today;
    };

    const handleDateClick = (dateString) => {
        if (isDateAvailable(dateString) && !isDatePast(dateString)) {
            setDate(dateString);
        }
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-10" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = formatDateLocal(new Date(year, month, day));
            const isAvailable = isDateAvailable(dateString);
            const isSelected = isDateSelected(dateString);
            const isPast = isDatePast(dateString);

            days.push(
                <motion.button
                    key={day}
                    whileHover={{ scale: isAvailable && !isPast ? 1.05 : 1 }}
                    whileTap={{ scale: isAvailable && !isPast ? 0.95 : 1 }}
                    onClick={() => handleDateClick(dateString)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all
              ${isAvailable && !isPast
                            ? isSelected
                                ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2'
                                : 'hover:bg-blue-50 text-blue-600'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                    disabled={!isAvailable || isPast}
                >
                    {day}
                </motion.button>
            );
        }

        return days;
    };

    return (
        <div className={`space-y-8`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg `}
            >
                <h2
                    className="text-xl font-semibold mb-6"
                    style={theme === 'light' ? { color: colors.primary.DEFAULT } : { color: colors.text.dark }}
                >
                    Select Date and Time
                </h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <h3 className="text-base font-semibold">
                                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </h3>
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                                        {day}
                                    </div>
                                ))}
                                {renderCalendar()}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="text-base font-semibold mb-4">Available Time Slots</h3>
                            {date ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {availableTimes.map(timeSlot => (
                                        <motion.button
                                            key={timeSlot}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setTime(timeSlot)}
                                            className={`p-3 rounded-lg text-center text-sm font-medium transition-all
                          ${time === timeSlot
                                                    ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2'
                                                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{timeSlot}</span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                                    Please select a date first
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};