import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./Auth/AuthRoutes";
import { appRoutes } from "./App/AppRoutes";




const router = createBrowserRouter([
  ...authRoutes,
  ...appRoutes,
]);

export default router;