import { RouterProvider } from "react-router-dom";
import router from "./Routes";
import './App.css';

function App() {
  return (
    // <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <RouterProvider router={router} />
    // </div>
  );
}

export default App;
