import { lazy } from "react";
import PeopleAnalytics from "../../Pages/App/PeopleAnalytics/PeopleAnalytics";

const Dashboard = lazy(() => import("../../Pages/App/Dashboard"));
const DashboardElm = lazy(() => import("../../Pages/App/DashboardElm"));
const Marketplace = lazy(() => import("../../Pages/App/Marketplace/Marketplace"));
const ExaminationCenter = lazy(() => import("../../Pages/App/ExaminationCenter/ExaminationCenter"));
const DemoCenter = lazy(() => import("../../Pages/App/DemoCenter/DemoCenter"));

// External app integration
const ExternalApp = lazy(() => import("../../Pages/App/Products/ExternalApp"));

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
        path: "people-analytics",
        element: <PeopleAnalytics />
      },
      {
        path: "product-showcase/:demoType",
        element: <DemoCenter />
      },
      // External app integrations - dynamic routing
      {
        path: "products/:appName",
        element: <ExternalApp />
      }
    ]
  },
  {
    path: "/task-track",
    element: <DashboardElm />
  }
];