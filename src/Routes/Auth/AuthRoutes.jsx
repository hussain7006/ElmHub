
import Login from "../../Pages/Auth/Login.jsx";
import Signup from "../../Pages/Auth/Signup";
import NotFound from "../../Pages/Auth/NotFound";

export const authRoutes = [
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "*",
        element: <NotFound />,
    }
];
