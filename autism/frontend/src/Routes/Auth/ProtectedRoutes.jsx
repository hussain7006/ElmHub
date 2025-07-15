import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";


const ProtectedRoute = ({ children, allowedRoles }) => {

    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : null;

};

export default ProtectedRoute;
