import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '../utils/responsive';
import { fonts } from '../themes/fonts';
import { colors } from '../themes/colors';
import CommonText from './CommonText';

interface GenderButtonProps {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>; // SVG component (e.g., imported from .svg)
  SelctedIcon: React.FC<React.SVGProps<SVGSVGElement>>; // SVG component (e.g., imported from .svg)
  onPress: () => void;
  isSelected?: boolean;
}

const GenderButton: React.FC<GenderButtonProps> = ({
  label,
  Icon,
  SelctedIcon,
  onPress,
  isSelected = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <CommonText style={[styles.label, isSelected && styles.selectedLabel]}>
        {label}
      </CommonText>
      <View style={styles.iconContainer}>
        {isSelected === true ? (
          <SelctedIcon width={scale(50)} height={scale(50)} />
        ) : (
          <Icon width={scale(56)} height={scale(56)} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GenderButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: colors.Neutrals900,
    backgroundColor: colors.white,
    width: '48%',
    height: moderateScale(52),
    overflow: 'hidden',
  },
  selectedContainer: {
    borderColor: colors.SelectedGenderColor,
    backgroundColor: colors.SelectedGenderColor + '26',
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    fontFamily: fonts.medium,
    color: colors.Neutrals100,
    marginLeft: moderateScale(5),
  },
  selectedLabel: {
    color: colors.SelectedGenderColor,
    fontWeight: '600',
  },
  iconContainer: {
    resizeMode: 'contain',
    marginTop: verticalScale(8),
    right: moderateScale(-7),
  },
});
