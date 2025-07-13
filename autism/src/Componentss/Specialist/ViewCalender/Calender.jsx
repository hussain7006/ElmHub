import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { colors } from '../../../config/colors';
import useAuthStore from '../../../store/authStore';
import { useState } from 'react';
import EventModal from './EventModal';

const localizer = momentLocalizer(moment);
export default function Calender() {
    const { theme } = useAuthStore();

    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    // Sample events data - replace with actual data from your backend
    const events = [
        {
            id: 1,
            title: 'Speech Therapy Session',
            start: new Date(2025, 4, 15, 10, 0),
            end: new Date(2025, 4, 15, 11, 0),
            status: 'booked',
            client: 'John Doe',
            type: 'Online'
        },
        {
            id: 2,
            title: 'Available Slot',
            start: new Date(2025, 4, 16, 14, 0),
            end: new Date(2025, 4, 16, 15, 0),
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
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



    return (
        <div className="flex-1 flex flex-col space-y-4">
            {/* Calendar Section */}
            <div className="calendar-container" style={{ height: '60vh' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{
                        backgroundColor: theme === 'dark' ? colors.gray[800] : 'white',
                        color: theme === 'dark' ? 'white' : colors.text.light,
                    }}
                    eventPropGetter={eventStyleGetter}
                    onSelectEvent={handleSelectEvent}
                    view={view}
                    views={['month']}
                    date={date}
                    onNavigate={setDate}
                    components={{
                        toolbar: CustomToolbar,

                        event: ({ event }) => (
                            <div className="p-1">
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm">
                                    {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
                                </div>
                            </div>
                        ),
                        dateCellWrapper: CustomDayCell,
                    }}
                    min={new Date()}
                />
            </div>
            {/* Event Legends */}
            <div className="w-full lg:w-full">
                <div className={`p-4 md:p-6 rounded-lg sticky top-0 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h2 className="text-xl font-semibold mb-4" style={{ color: theme === 'dark' ? 'white' : colors.gray[800] }}>
                        Legend
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.secondary.DEFAULT }} />
                            <span style={{ color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }}>
                                Booked Sessions
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.success }} />
                            <span style={{ color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }}>
                                Available Slots
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <EventModal
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    )
}