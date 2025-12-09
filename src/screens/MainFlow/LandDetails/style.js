import { StyleSheet } from 'react-native';
import {
  moderateScale,
  scaledFontSize,
  scale,
  verticalScale,
} from '../../../utils/responsive';
import { colors } from '../../../themes/colors';
import { fonts } from '../../../themes/fonts';

export const styles = StyleSheet.create({
  progressHeader: {
    paddingBottom: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
    height: moderateScale(249),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '92%',
    marginTop: verticalScale(-35),
    marginBottom: verticalScale(20),
  },
  bell: {
    borderRadius: moderateScale(9),
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    paddingLeft: moderateScale(12),
    paddingRight: moderateScale(14),
    position: 'absolute',
    zIndex: 3,
    left: 0,
  },
  headerTitle: {
    fontSize: scaledFontSize(18),
    color: colors.Neutrals010,
    fontWeight: '700',
    fontFamily: fonts.semiBold,
  },

  // FAQ styles

  container: {
    flex: 1,
    // padding: moderateScale(16),
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: moderateScale(18),
    color: colors.black,
  },

  titleText: {
    fontFamily: fonts.medium,
    fontWeight: '500',
    fontSize: scaledFontSize(14),
    color: colors.Neutrals500,
  },
  valueText: {
    fontFamily: fonts.medium,
    fontWeight: '500',
    fontSize: scaledFontSize(14),
    color: colors.Neutrals010,
  },
  // New common styles

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

  bottomGap: { marginBottom: moderateScale(100) },
});
