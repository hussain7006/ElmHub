import { lazy } from "react";

const Dashboard = lazy(() => import("../../Pages/App/Dashboard"));
const DashboardElm = lazy(() => import("../../Pages/App/DashboardElm"));
const Marketplace = lazy(() => import("../../Pages/App/Marketplace/Marketplace"));
const ExaminationCenter = lazy(() => import("../../Pages/App/Products/ExaminationCenter/ExaminationCenter"));
const PeopleAnalytics = lazy(() => import("../../Pages/App/Products/PeopleAnalytics/PeopleAnalytics"));
const ProductDemos = lazy(() => import("../../Pages/App/ProductDemos/ProductDemos"));

// External app integration
const ExternalApp = lazy(() => import("../../Pages/App/MyApplications/ExternalApp"));

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
        element: <ProductDemos />
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