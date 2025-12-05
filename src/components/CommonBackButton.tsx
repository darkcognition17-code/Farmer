import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { BackButton } from '../assets/icons';
import { moderateScale } from '../utils/responsive';
import { colors } from '../themes/colors';

interface CommonBackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  width?: number;
  height?: number;
}

const CommonBackButton: React.FC<CommonBackButtonProps> = ({
  onPress,
  style,
  iconStyle,
  width = moderateScale(10),
  height = moderateScale(15),
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.defaultButton, style]}
    >
      <BackButton width={width} height={height} style={iconStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultButton: {
    borderRadius: moderateScale(14),
    backgroundColor: colors.white,
    padding: moderateScale(10),
  },
});

export default CommonBackButton;
