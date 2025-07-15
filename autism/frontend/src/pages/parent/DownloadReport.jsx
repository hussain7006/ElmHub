import { useState } from "react";
import { colors } from "../../config/colors";
import useAuthStore from "../../store/authStore";
import useReportStore from "../../store/reportStore";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import {
  getCompletedSessionsList,
  handleDownload,
} from "../../services/parentsService";
import PageTitle from "../../Componentss/_component/PageTitle";
import SessionList from "../../Componentss/Parent/DownloadReport/SessionList";
import SessionDetails from "../../Componentss/Parent/DownloadReport/SessionDetails";

const DownloadReport = () => {
  const { theme, showHeader } = useAuthStore();
  const {
    selectedSession,
    setSelectedSession,
    parentFeedback,
    setParentFeedback,
    isSubmitting,
    isDownloading,
    submitFeedback,
    toastMessage,
    setIsDownloading,
  } = useReportStore();
  const { data: sessionsLst, isLoading: isLoading } = useSWR(
    "getCompletedServicesListForParent",
    getCompletedSessionsList,
    {
      dedupingInterval: 60000,
      revalidateIfStale: true,
      keepPreviousData: true,
    }
  );

  const [showFeedback, setShowFeedback] = useState(false);

  const handleREport = (report_path) => {
    setIsDownloading(true);
    handleDownload(report_path);
    setIsDownloading(false);
  };
  // Handle toast messages
  if (toastMessage) {
    toast(toastMessage, {
      position: "bottom-right",
      duration: 3000,
      style: {
        background: theme === "dark" ? colors.gray[800] : colors.gray[100],
        color: theme === "dark" ? colors.gray[100] : colors.gray[900],
      },
    });
  }

  return (
    <div className={`${showHeader ? "h-[calc(100vh-100px)]" : "h-screen"} rounded-lg px-2 `}>
      <div className="mx-auto">
        <PageTitle
          title="Session Reports"
          subTitle={" View and download detailed reports of completed sessions"}
        />

        <div className={`overflow-y-auto ${showHeader ? "max-h-[calc(100vh-200px)]" : "max-h-[calc(100vh-160px)]"} p-6 rounded-lg bg-white dark:bg-gray-800 grid grid-cols-1 lg:grid-cols-4 gap-6`}>
          {/* Session List */}
          <SessionList sessionsLst={sessionsLst} />

          <SessionDetails
            sessionsLst={sessionsLst}
            isLoading={isLoading}
            showFeedback={showFeedback}
            submitFeedback={submitFeedback}
            isSubmitting={isSubmitting}
            isDownloading={isDownloading}
            handleREport={handleREport}
            setShowFeedback={setShowFeedback}
            setParentFeedback={setParentFeedback}
            parentFeedback={parentFeedback}
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadReport;
