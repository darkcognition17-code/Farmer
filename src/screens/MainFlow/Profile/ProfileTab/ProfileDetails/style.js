import { StyleSheet } from 'react-native';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';
import {
  verticalScale,
  moderateScale,
  scale,
  scaledFontSize,
} from '../../../../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: moderateScale(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: moderateScale(18),
    color: colors.black,
  },
  iconOffset: {
    top: moderateScale(-2),
  },
  profileBox: {
    alignItems: 'center',
    // backgroundColor: colors.lightGreen,
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(20),
    marginBottom: verticalScale(16),
  },
  profileImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
  },
  name: {
    marginTop: verticalScale(8),
    fontFamily: fonts.semiBold,
    fontSize: moderateScale(16),
    // color: colors.n010,
  },
  titleText: {
    fontFamily: fonts.medium,
    fontWeight: '500',
    fontSize: scaledFontSize(14),
    color: colors.Neutrals300,
  },
  valueText: {
    fontFamily: fonts.medium,
    fontWeight: '500',
    fontSize: scaledFontSize(14),
    color: colors.Neutrals010,
  },
  // New common styles
  sectionContainer: {
    marginHorizontal: moderateScale(16),
    // marginTop: verticalScale(70), // This is specific to the first section, might not be common
  },
  sectionContainerExtraStyling: { marginTop: verticalScale(70) },
  iconAndTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  twoColumnWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    rowGap: verticalScale(16),
    marginTop: verticalScale(16),
  },
  halfWidthColumn: {
    width: '48%',
  },
  menuItemsWrapper: {
    gap: verticalScale(12),
    marginBottom: verticalScale(20),
  },
  deleteAccountBtn: {
    marginBottom: verticalScale(60),
    paddingVertical: verticalScale(18),
    paddingHorizontal: moderateScale(16),
    backgroundColor: colors.transparent,
    borderColor: colors.Neutrals900,
    borderWidth: 1,
    borderRadius: moderateScale(16),
    gap: moderateScale(16),
  },
});
