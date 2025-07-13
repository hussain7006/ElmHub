
import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import router from './Routes';
import useAuthStore from './store/authStore';

function App() {
  const { theme, toggleTheme, setShowHeader } = useAuthStore();

  useEffect(() => {
    const handleMessageFromParent = (event) => {
      // Optional: Check event.origin to restrict messages from unknown sources
      if (event.data?.type === "elmhub" && event.data.theme) {
        const data = event.data;

        const { showHeader } = data;
        console.log("Received theme from elmhub parent:", data);

        // Handle header visibility
        if (typeof showHeader === 'boolean') {
          console.log('Setting showHeader to:', showHeader);
          setShowHeader(showHeader);
        }

        // Handle theme changes if needed
        if (data.theme?.mode && data.theme.mode !== theme) {
          toggleTheme();
        }
      }
    };

    window.addEventListener("message", handleMessageFromParent);

    // Notify parent that iframe is ready
    window.parent.postMessage("READY_FOR_ELMHUB_MESSAGE", "*");

    return () => {
      window.removeEventListener("message", handleMessageFromParent);
    };
  }, [theme, toggleTheme, setShowHeader]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
