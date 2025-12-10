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
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
    height: moderateScale(249),
    // paddingBottom: moderateScale(20),
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(35),
    paddingTop: verticalScale(55),
    // alignItems: 'center',
    // justifyContent: 'center',
    // width: '92%',
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
    flex: 1,
    fontSize: scaledFontSize(18),
    fontFamily: fonts.bold,
    color: colors.Neutrals010,
    textAlign: 'center',
    fontWeight: '700',
  },

  // FAQ styles

  container: {
    flex: 1,
    // padding: moderateScale(16),
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
