import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import useAuthStore from './store/authStore';

// Initialize theme from store
const { theme } = useAuthStore.getState();
document.documentElement.classList.toggle('dark', theme === 'dark');

// Subscribe to theme changes
useAuthStore.subscribe(
  (state) => state.theme,
  (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
