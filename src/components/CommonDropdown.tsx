import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextProps,
  TextStyle,
} from 'react-native';
import { moderateScale, verticalScale } from '../utils/responsive';
import { colors } from '../themes/colors';
import CommonText from './CommonText';

interface CommonDropdownProps {
  label: string;
  onPress?: () => void;
  LeftIcon?: React.FC<any>;
  RightIcon?: React.FC<any>;
  disabled?: boolean;
  textWidth?: number;
  textStyle?: StyleProp<TextStyle>;
  isPlaceHolder?: boolean;
}

const CommonDropdown: React.FC<CommonDropdownProps> = ({
  label,
  onPress,
  LeftIcon,
  RightIcon,
  disabled = false,
  textWidth,
  textStyle,
  isPlaceHolder,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.containerDisabled]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
    >
      {LeftIcon && (
        <View style={styles.leftIcon}>
          <LeftIcon width={moderateScale(24)} height={moderateScale(24)} />
        </View>
      )}

      <CommonText
        style={[styles.label, textStyle, textWidth && { maxWidth: textWidth }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </CommonText>

      {RightIcon && (
        <View style={styles.rightIcon}>
          <RightIcon width={moderateScale(16)} height={moderateScale(16)} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CommonDropdown;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.Neutrals900,
    borderRadius: moderateScale(10),
    backgroundColor: colors.white,
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(14),
    height: moderateScale(56),
  },
  containerDisabled: { opacity: 0.6 },
  leftIcon: {
    marginRight: moderateScale(8),
  },
  label: {
    flex: 1,
    fontSize: moderateScale(14),
    color: colors.OwnedLabelText + 'E5',
  },
  rightIcon: {
    marginLeft: moderateScale(6),
  },
});
