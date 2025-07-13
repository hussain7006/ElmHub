import { IframeConfig } from '../hooks/useIframeMessage';

export const applyThemeToElement = (element: HTMLElement, config: IframeConfig) => {
  // Apply CSS custom properties for easy theme switching
  element.style.setProperty('--primary-color', config.colors.primary);
  element.style.setProperty('--accent-color', config.colors.accent);
  element.style.setProperty('--background-color', config.colors.background);
  element.style.setProperty('--surface-color', config.colors.surface);
  element.style.setProperty('--text-primary-color', config.colors.textPrimary);
  element.style.setProperty('--text-secondary-color', config.colors.textSecondary);
  element.style.setProperty('--button-background-color', config.colors.buttonBackground);
  element.style.setProperty('--input-background-color', config.colors.inputBackground);
  element.style.setProperty('--border-color', config.colors.borderColor);
  element.style.setProperty('--placeholder-color', config.colors.placeholderColor);
};

export const getThemeStyles = (config: IframeConfig) => {
  return {
    primary: { color: config.colors.primary },
    accent: { color: config.colors.accent },
    background: { backgroundColor: config.colors.background },
    surface: { backgroundColor: config.colors.surface },
    textPrimary: { color: config.colors.textPrimary },
    textSecondary: { color: config.colors.textSecondary },
    button: { 
      backgroundColor: config.colors.buttonBackground,
      color: '#FFFFFF',
      border: `1px solid ${config.colors.buttonBackground}`
    },
    input: { 
      backgroundColor: config.colors.inputBackground,
      border: `1px solid ${config.colors.borderColor}`,
      color: config.colors.textPrimary
    },
    border: { borderColor: config.colors.borderColor }
  };
};

export const logConfig = (config: IframeConfig) => {
  console.log('Iframe Configuration Received:', config);
  console.log('Theme Mode:', config.theme.mode);
  console.log('Primary Color:', config.colors.primary);
  console.log('Show Header:', config.showHeader);
}; 