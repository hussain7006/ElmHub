import React from 'react';
import useThemeStore from '../../../store/themeStore';
import ApplicationHub from '../../../Components/App/Layout/TopNav/ApplicationHub';

const HomeNew = () => {
    const { colors } = useThemeStore();

    return (
        <div className="px-6 py-2">
            <ApplicationHub />
        </div>
    );
};

export default HomeNew; 