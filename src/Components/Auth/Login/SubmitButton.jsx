import React from 'react';
import useThemeStore from '../../../store/themeStore';

const SubmitButton = ({ text }) => {
  const { colors } = useThemeStore();

  return (
    <button
      type="submit"
      className="w-full p-3 rounded-md text-white font-semibold transition-colors duration-300"
      style={{ backgroundColor: colors.buttonBackground }}
    >
      {text}
    </button>
  );
};

export default SubmitButton;