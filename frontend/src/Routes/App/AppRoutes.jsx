import { lazy } from "react";

const Dashboard = lazy(() => import("../../Pages/App/Dashboard"));
const DashboardElm = lazy(() => import("../../Pages/App/DashboardElm"));
const Marketplace = lazy(() => import("../../Pages/App/Marketplace/Marketplace"));
const ExaminationCenter = lazy(() => import("../../Pages/App/ExaminationCenter/ExaminationCenter"));
const DemoCenter = lazy(() => import("../../Pages/App/DemoCenter/DemoCenter"));

export const appRoutes = [
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "marketplace",
        element: <Marketplace />
      },
      {
        path: "examination-center",
        element: <ExaminationCenter />
      },
      {
        path: "product-showcase/:demoType",
        element: <DemoCenter />
      }
    ]
  },
  {
    path: "/task-track",
    element: <DashboardElm />
  }
];