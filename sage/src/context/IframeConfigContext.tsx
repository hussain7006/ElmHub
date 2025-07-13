import React, { createContext, useContext, ReactNode } from 'react';
import { useIframeMessage, IframeConfig } from '../hooks/useIframeMessage';

interface IframeConfigContextType {
  config: IframeConfig | null;
  isLoading: boolean;
}

const IframeConfigContext = createContext<IframeConfigContextType | undefined>(undefined);

export const useIframeConfig = () => {
  const context = useContext(IframeConfigContext);
  if (context === undefined) {
    throw new Error('useIframeConfig must be used within an IframeConfigProvider');
  }
  return context;
};

interface IframeConfigProviderProps {
  children: ReactNode;
}

export const IframeConfigProvider: React.FC<IframeConfigProviderProps> = ({ children }) => {
  const { config, isLoading } = useIframeMessage();

  return (
    <IframeConfigContext.Provider value={{ config, isLoading }}>
      {children}
    </IframeConfigContext.Provider>
  );
}; 