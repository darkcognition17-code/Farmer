import { StyleSheet } from 'react-native';
import {
  moderateScale,
  scaledFontSize,
  scale,
  verticalScale,
} from '../../../../utils/responsive';
import { colors } from '../../../../themes/colors';
import { fonts } from '../../../../themes/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuSection: {
    marginTop: moderateScale(60),
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(8),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(10),
  },
  additionalSection: {
    backgroundColor: colors.white,
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    borderWidth: moderateScale(1),
    borderColor: colors.Neutrals900,
    gap: moderateScale(10),
  },
  linkContainerTitle: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    fontSize: scaledFontSize(12),
    color: colors.Neutrals300,
  },
  additionalLinkItem: {
    paddingHorizontal: moderateScale(0),
    paddingVertical: moderateScale(0),
    // borderWidth: moderateScale(0),
    gap: moderateScale(15),
  },
  logoutSection: {
    marginBottom: moderateScale(125),
  },
});
