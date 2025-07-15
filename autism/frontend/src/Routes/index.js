import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./Auth/AuthRoutes";
import { parentRoutes } from "./Parent/ParentRoutes";
import { specialistRoutes } from "./Specialist/SpecialistRoutes";
import { childRoutes } from "./Child/ChildRoutes";



const router = createBrowserRouter([
  ...authRoutes,
  ...parentRoutes,
  ...specialistRoutes,
  ...childRoutes,
],
  {
    basename: '/autism', // Change this to your repository name if needed
  }

);

export default router;
