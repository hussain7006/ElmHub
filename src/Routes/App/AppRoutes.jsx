import { lazy } from "react";

const Dashboard = lazy(() => import("../../Pages/App/Dashboard"));

export const appRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
];