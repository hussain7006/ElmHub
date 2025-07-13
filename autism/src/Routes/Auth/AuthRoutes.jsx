
import React from "react";
import LoginPage from "../../pages/auth/LoginPage";
import QuickLoginPage from "../../pages/auth/QuickLoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import NotFound from "../../pages/NotFound";

export const authRoutes = [
    {
        path: "",
        element: <QuickLoginPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/quick-login",
        element: <QuickLoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "*",
        element: <NotFound />,
    }
];
