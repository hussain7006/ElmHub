import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./Auth/AuthRoutes";
import { appRoutes } from "./App/AppRoutes";
// import { parentRoutes } from "./Parent/ParentRoutes";
// import { specialistRoutes } from "./Specialist/SpecialistRoutes";
// import { childRoutes } from "./Child/ChildRoutes";



const router = createBrowserRouter([
  ...authRoutes,
  ...appRoutes,
//   ...parentRoutes,
//   ...specialistRoutes,
//   ...childRoutes,
]);

export default router;