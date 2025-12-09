import { StyleSheet } from 'react-native';
import {
  moderateScale,
  scale,
  verticalScale,
  scaledFontSize,
} from '../../../utils/responsive'; // Import responsive utility for scaling UI elements
import { fonts } from '../../../themes/fonts';
import { colors } from '../../../themes/colors';

export const styles = StyleSheet.create({
  logo: {
    width: scale(180),
    height: verticalScale(100),
  },
  messageContainer: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: verticalScale(20),
  },
  title: {
    color: colors.black,
    marginBottom: verticalScale(15),
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: fonts.semiBold,
    fontSize: scaledFontSize(18),
    lineHeight: verticalScale(24),
  },
  subtitle: {
    color: colors.textPrimary,
    marginBottom: verticalScale(70),
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(14),
    lineHeight: verticalScale(20),
  },
  button: {
    backgroundColor: colors.Primary010,
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(12),
    width: '100%',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  buttonText: {
    fontSize: scaledFontSize(16),
    fontWeight: '600',
    lineHeight: verticalScale(22),
    fontFamily: fonts.medium,
    color: colors.white,
  },
});
