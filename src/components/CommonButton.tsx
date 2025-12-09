import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  TextStyle,
} from 'react-native';
import { moderateScale } from '../utils/responsive';
import { fonts } from '../themes/fonts';
import { colors } from '../themes/colors';
import CommonText from './CommonText'; // Import CommonText

interface CommonButtonProps extends TouchableOpacityProps {
  title: string;
  textStyle?: TextStyle;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  title,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        // Apply different background colors based on the 'disabled' prop.
        // This visually indicates whether the button is interactive or not.
        disabled ? styles.buttonDisabled : styles.buttonEnabled,
        style,
      ]}
      // When the button is disabled, activeOpacity is set to 1 to prevent any visual feedback on press.
      // Otherwise, it uses the default activeOpacity for interactive buttons.
      activeOpacity={disabled ? 1 : 0.7}
      // The native 'disabled' prop prevents touch events and makes the button inaccessible.
      disabled={disabled}
      {...props}
    >
      <CommonText style={[styles.buttonText, textStyle]}>{title}</CommonText>
    </TouchableOpacity>
  );
};

export default CommonButton;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(16),
  },
  buttonEnabled: {
    backgroundColor: colors.ButtonColor,
  },
  buttonDisabled: {
    backgroundColor: colors.gray,
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: fonts.medium,
    lineHeight: moderateScale(22),
    fontWeight: '500',
  },
});
