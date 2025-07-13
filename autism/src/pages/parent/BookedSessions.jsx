import useSWR from 'swr';
import { getSessionsList } from '../../services/parentsService';
import PageTitle from '../../Componentss/_component/PageTitle';
import BookedSessionCard from '../../Componentss/Parent/BookedSession/BookedSessionCard';
import useAuthStore from '../../store/authStore';

const ParentBookedSessions = () => {
  const { showHeader } = useAuthStore();
  const { data: sessions, isLoading, error } = useSWR(
    "getSessionsList",
    getSessionsList,
    {
      dedupingInterval: 60000,
      revalidateIfStale: true,
      keepPreviousData: true,
    }
  );

  if (isLoading) {
    return (
      <div className="w-full h-20 flex items-center justify-center">
        <img src="/loading_gif.gif" alt="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading sessions: {error.message}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        No sessions booked yet
      </div>
    );
  }


  return (
    <div className={`${showHeader ? "h-[calc(100vh-100px)]" : "h-screen"} w-full`}>
      <PageTitle
        title="Booked Sessions"
        subTitle={"View and manage all your scheduled therapy sessions"}
      />

      <BookedSessionCard sessions={sessions} />

    </div>
  );
};

export default ParentBookedSessions; 