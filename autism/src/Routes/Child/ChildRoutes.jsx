import ProtectedRoute from "../Auth/ProtectedRoutes";
import MainLayout from "../../components/layout/MainLayout";
import ChildDashboard from "../../pages/child/ChildDashboard";
import ProfilePage from "../../pages/ProfilePage";
export const childRoutes = [
    {
        path: "/child",
        element: (
            <ProtectedRoute allowedRoles={["child"]}>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "", element: <ChildDashboard /> },
            { path: "session-list", element: <ChildDashboard /> },
            { path: "profile", element: <ProfilePage /> },
        ],
    },
];
