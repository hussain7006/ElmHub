import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const CSSVariablesUpdater = () => {
  const colors = useSelector((data) => data.colors);

  useEffect(() => {
    if (colors) {
      const root = document.documentElement;
      
      // Update CSS custom properties
      root.style.setProperty('--primary-color', colors.primary || '#0070c7');
      root.style.setProperty('--accent-color', colors.accent || '#f16845');
      root.style.setProperty('--background-color', colors.background || '#F9FAFB');
      root.style.setProperty('--surface-color', colors.surface || '#FFFFFF');
      root.style.setProperty('--text-primary-color', colors.textPrimary || '#0c1d46');
      root.style.setProperty('--text-secondary-color', colors.textSecondary || '#64748B');
      root.style.setProperty('--button-background-color', colors.buttonBackground || '#0070c7');
      root.style.setProperty('--input-background-color', colors.inputBackground || '#FFFFFF');
      root.style.setProperty('--border-color', colors.borderColor || '#D1D5DB');
      root.style.setProperty('--placeholder-color', colors.placeholderColor || '#9CA3AF');
    }
  }, [colors]);

  return null; // This component doesn't render anything
};

export default CSSVariablesUpdater; 