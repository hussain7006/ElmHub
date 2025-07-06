import { lazy } from "react";
import API from "../../Pages/App/API/API";

const Layout = lazy(() => import("../../Pages/App/Layout"));
const HomeNewLayout = lazy(() => import("../../Pages/App/HomeNew/Layout"));
const DashboardElm = lazy(() => import("../../Pages/App/DashboardElm"));
const Home = lazy(() => import("../../Pages/App/Home/Home"));
const HomeNew = lazy(() => import("../../Pages/App/HomeNew/HomeNew"));
const ExaminationCenter = lazy(() => import("../../Pages/App/Products/ExaminationCenter/ExaminationCenter"));
const PeopleAnalytics = lazy(() => import("../../Pages/App/Products/PeopleAnalytics/PeopleAnalytics"));
const ProductDemos = lazy(() => import("../../Pages/App/ProductDemos/ProductDemos"));

// About pages
const Company = lazy(() => import("../../Pages/App/About/Company"));
const Contact = lazy(() => import("../../Pages/App/About/Contact"));

// Demos pages
const Demos = lazy(() => import("../../Pages/App/Demos/Demos"));


// External app integration
const ExternalApp = lazy(() => import("../../Pages/App/MyApplications/ExternalApp"));

export const appRoutes = [
  {
    path: "/",
    element: <HomeNewLayout />,
    children: [
      {
        path: "",
        element: <HomeNew />
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
        path: "demos",
        element: <Demos />
      },
      {
        path: "demo/:demoType",
        element: <ProductDemos />
      },
      {
        path: "api",
        element: <API />
      },
      {
        path: "api",
        element: <API />
      },
      // External app integrations - dynamic routing
      {
        path: "products/:appName",
        element: <ExternalApp />
      },
      // About pages
      {
        path: "about/company",
        element: <Company />
      },
      {
        path: "about/contact",
        element: <Contact />
      }
    ]
  },
  // {
  //   path: "/home-new",
  //   element: <HomeNewLayout />,
  //   children: [
  //     {
  //       path: "",
  //       element: <HomeNew />
  //     }
  //   ]
  // },
  {
    path: "/task-track",
    element: <DashboardElm />
  }
];