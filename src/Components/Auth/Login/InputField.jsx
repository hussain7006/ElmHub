import React from 'react';
import useThemeStore from '../../../store/themeStore';

const InputField = ({ type, placeholder }) => {
  const { colors } = useThemeStore();

  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-colors duration-300"
      style={{
        backgroundColor: colors.inputBackground,
        color: colors.textPrimary,
        borderColor: colors.borderColor,
        '--tw-ring-color': colors.accent,
      }}
    />
  );
};

export default InputField;
