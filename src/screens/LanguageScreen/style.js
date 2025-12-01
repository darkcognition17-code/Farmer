/* File associated with : LanguageScreen Styles
   Developed by : VP
   Date & time : Friday, 19 September 2025 07:30:00 UTC
*/

import { StyleSheet, Dimensions } from 'react-native';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../utils/responsive';
import { fonts } from '../../themes/fonts';
import { colors } from '../../themes/colors';
const { width } = Dimensions.get('window');
const cardMargin = scale(16); // same as your grid padding
const cardWidth = (width - cardMargin * 5) / 2; // 2 per row (accounting for side paddings & spacing)

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GradientColor + '55',
    justifyContent: 'center',
  },
  video: { ...StyleSheet.absoluteFillObject },

  headerImage: {
    width: scale(42),
    height: scale(42),
  },
  headerContainer: {
    marginTop: verticalScale(80),
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: moderateScale(20),
    marginBottom: moderateScale(24),
    gap: moderateScale(20),
    maxWidth: width - moderateScale(50),
  },
  title: {
    fontSize: scaledFontSize(24),
    fontWeight: '600',
    color: colors.Neutrals100,
    fontFamily: fonts.semiBold,
    marginLeft: moderateScale(18),
    marginBottom: moderateScale(20),
  },
  gridContainer: {
    // flex: 1,
    backgroundColor: colors.white,
    borderRadius: scale(32),
    paddingTop: verticalScale(30),
    marginHorizontal: moderateScale(16),
    // justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // ✅ evenly distribute 2 per row
    marginHorizontal: moderateScale(16),
  },
  langCard: {
    width: cardWidth,
    height: verticalScale(94),
    borderWidth: scale(1),
    borderColor: colors.Neutrals900,
    borderRadius: scale(12),
    marginBottom: verticalScale(11),
    backgroundColor: colors.white,
    overflow: 'hidden',
  },

  langCardSelected: {
    borderColor: colors.ButtonColor,
    borderWidth: moderateScale(1.5),
  },

  langRow: {
    marginTop: verticalScale(20),
    flexDirection: 'row',
    marginLeft: moderateScale(10),
    alignItems: 'center',
    textAlignVertical: 'center',
  },

  langLabel: {
    fontSize: scaledFontSize(15),
    fontFamily: fonts.regular,
    fontWeight: '400',
    marginLeft: moderateScale(10),
    // lineHeight: verticalScale(22),
  },

  langImage: {
    width: scale(70),
    height: scale(60),
    position: 'absolute',
    bottom: verticalScale(-5),
    right: scale(-5),
  },

  deviceLangTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.LanguageCardBackground,
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(6),
  },

  deviceLangText: {
    fontSize: scaledFontSize(10),
    color: colors.ButtonColor,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: fonts.medium,
  },

  continueBtn: {
    borderRadius: scale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    marginBottom: verticalScale(28),
    top: moderateScale(10),
    width: '91%',
    alignSelf: 'center',
  },
});
