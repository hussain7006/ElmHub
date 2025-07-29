import { colors } from "../../../config/colors";
import useAuthStore from "../../../store/authStore";
import { Link, useLocation } from "react-router-dom";


const Header = () => {
    const { theme, toggleTheme, showHeader } = useAuthStore();
    const location = useLocation();
    const isQuickLoginPage = location.pathname === '/quick-login' || location.pathname === '/';
    
    // Don't render header if showHeader is false
    if (!showHeader) {
        return null;
    }
    
    return (
        <header className={`w-full py-4 px-6 flex justify-between items-center
      ${theme === 'dark' ? 'bg-gray-800' : ``}`}
            style={{
                backgroundColor: theme === 'dark' ? undefined : colors.primary.DEFAULT,
                color: theme === 'dark' ? colors.gray[50] : colors.gray[50]
            }}>
            <div className="flex items-center space-x-3">
                <img src="/autism/logo.png" alt="GazeVLM Logo" className="h-8 w-8" />
                <h1 className="text-xl font-bold">
                    GazeVLM
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                {!isQuickLoginPage && (
                    <Link
                        to="/quick-login"
                        className="text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                        Quick Login
                    </Link>
                )}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full cursor-pointer transition-colors duration-200"
                    style={{
                        backgroundColor: theme === 'dark' ? colors.primary.DEFAULT : colors.gray[600],
                        color: theme === 'dark' ? colors.accent.light : colors.gray[700]
                    }}
                >
                    {theme === 'dark' ? '🌞' : '🌙'}
                </button>
            </div>
        </header>
    );
};

export default Header; 