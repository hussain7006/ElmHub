import { lazy } from "react";

const Dashboard = lazy(() => import("../../Pages/App/Dashboard"));
const DashboardElm = lazy(() => import("../../Pages/App/DashboardElm"));
const Marketplace = lazy(() => import("../../Pages/App/Marketplace/Marketplace"));

export const appRoutes = [
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "marketplace",
        element: <Marketplace />
      }
    ]
  },
  {
    path: "/task-track",
    element: <DashboardElm />
  }
];