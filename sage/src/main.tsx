import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { APIProvider } from "@vis.gl/react-google-maps";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { IframeConfigProvider } from "./context/IframeConfigContext";
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
    <IframeConfigProvider>
      <APIProvider apiKey={API_KEY}>
        <QueryClientProvider client={queryClient}>
          <App API_KEY={API_KEY} />
        </QueryClientProvider>
      </APIProvider>
    </IframeConfigProvider>
);
