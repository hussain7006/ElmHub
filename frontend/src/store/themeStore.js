import { create } from 'zustand';
import { colors as themeColors } from '../theme/theme';

const useThemeStore = create(set => ({
  theme: localStorage.getItem('theme') || 'light',
  colors: themeColors[localStorage.getItem('theme') || 'light'], // Corrected this line
  toggleTheme: () =>
    set(state => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return { theme: newTheme, colors: themeColors[newTheme] };
    }),
}));

export default useThemeStore;