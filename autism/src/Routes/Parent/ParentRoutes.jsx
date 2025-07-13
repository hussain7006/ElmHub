import BookSession from "../../pages/parent/BookSession";
import ProtectedRoute from "../Auth/ProtectedRoutes";
import MainLayout from "../../components/layout/MainLayout";
import ManageChild from "../../pages/parent/ManageChild";
import BookedSessions from "../../pages/parent/BookedSessions";
import DownloadReport from "../../pages/parent/DownloadReport";
import ProfilePage from "../../pages/ProfilePage";
export const parentRoutes = [
    {
        path: "/parent",
        element: (
            <ProtectedRoute allowedRoles={["parent"]}>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "", element: <ManageChild /> },
            { path: "manage-child", element: <ManageChild /> },
            { path: "booked-sessions", element: <BookedSessions /> },
            { path: "book-session", element: <BookSession /> },
            { path: "download-report", element: <DownloadReport /> },
            { path: "profile", element: <ProfilePage /> },
        ],
    },
];
