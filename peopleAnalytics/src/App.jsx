import './App.css'
import Routing from './config/router/Routing'

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
// import store from './config/redux/store';
import { store, persistor } from './config/redux/store';


import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useEffect, useState } from 'react';
import PostMessageHandler from './components/PostMessageHandler/PostMessageHandler';
import CSSVariablesUpdater from './components/CSSVariablesUpdater/CSSVariablesUpdater';


function App() {
  const [theme, setTheme] = useState({
    mode: "light",
    primaryColor: "#007bff",
    backgroundColor: "#ffffff",
    textColor: "#000000",
  });

  useEffect(() => {
    // Tell parent we're ready
    window.parent.postMessage("READY_FOR_ELMHUB_MESSAGE", "*");
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PrimeReactProvider>
          <PostMessageHandler />
          <CSSVariablesUpdater />
          <Routing />
        </PrimeReactProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
