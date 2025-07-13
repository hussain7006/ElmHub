import ProtectedRoute from "../Auth/ProtectedRoutes";
import MainLayout from "../../components/layout/MainLayout";
import CreateServicePage from "../../pages/specialist/CreateServicePage";
import SpecialistDashboard from "../../pages/specialist/SpecialistDashboard";
import CreateSessionPage from "../../pages/specialist/CreateSessionPage";
import ViewCalendarPage from "../../pages/specialist/ViewCalendarPage";
import ProfilePage from "../../pages/ProfilePage";
export const specialistRoutes = [
    {
        path: "/specialist",
        element: (
            <ProtectedRoute allowedRoles={["specialist"]}>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "", element: <SpecialistDashboard /> },
            { path: "book-session", element: <SpecialistDashboard /> },
            { path: "create-service", element: <CreateServicePage /> },
            { path: "create-session", element: <CreateSessionPage /> },
            { path: "calendar", element: <ViewCalendarPage /> },
            { path: "profile", element: <ProfilePage /> },


        ],
    },
];
