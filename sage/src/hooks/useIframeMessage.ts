import { useEffect, useState } from 'react';

export interface IframeConfig {
  type: string;
  theme: {
    mode: string;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    surfaceColor: string;
    borderColor: string;
    textSecondaryColor: string;
  };
  colors: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    buttonBackground: string;
    inputBackground: string;
    borderColor: string;
    placeholderColor: string;
  };
  showHeader: boolean;
}

export const useIframeMessage = () => {
  const [config, setConfig] = useState<IframeConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin if needed for security
      // if (event.origin !== 'expected-origin') return;
      
      try {
        const data = event.data;
        
        // Check if the message has the expected structure
        if (data && typeof data === 'object' && data.type === 'elmhub') {
            console.log("received data", data);
            
          setConfig(data as IframeConfig);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error parsing iframe message:', error);
      }
    };

    // Listen for messages from parent window
    window.addEventListener('message', handleMessage);

    // Request configuration from parent window
    const requestConfig = () => {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'request-config' }, '*');
      }
    };

    // Request config immediately and also set up a fallback
    requestConfig();
    
    // Fallback: if no config received within 5 seconds, set loading to false
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, []);

  return { config, isLoading };
}; 