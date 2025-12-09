import { StyleSheet } from 'react-native';
import { colors } from '../../../../../themes/colors';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';
import { fonts } from '../../../../../themes/fonts';

export const styles = StyleSheet.create({
  screenWrapperContainer: {
    flex: 1,
  },
  imageBackgroundStyle: {
    width: '100%',
    height: verticalScale(170),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: moderateScale(24),
    borderBottomLeftRadius: moderateScale(24),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(65),
  },
  bell: {
    borderRadius: moderateScale(9),
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    paddingLeft: moderateScale(12),
    paddingRight: moderateScale(14),
    position: 'absolute',
    left: 14,
  },
  headerTitle: {
    fontSize: scaledFontSize(18),
    color: colors.Neutrals010,
    fontWeight: '700',
    fontFamily: fonts.bold,
    textAlignVertical: 'center',
  },
  backgroundGradient: {
    flex: 1,
    alignItems: 'center',
    paddingTop: verticalScale(60),
  },
  container: {
    width: '92%',
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(24),
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(55),
  },
  title: {
    fontSize: scaledFontSize(24),
    lineHeight: verticalScale(26),
    fontFamily: fonts.semiBold,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: scaledFontSize(14),
    lineHeight: verticalScale(21),
    fontFamily: fonts.medium,
    fontWeight: '500',
    marginBottom: 45,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(50),
    marginBottom: verticalScale(18),
  },
  resendLink: {
    color: colors.ButtonColor,
    fontFamily: fonts.medium,
  },
  continueButton: {
    backgroundColor: colors.ButtonColor,
    borderRadius: moderateScale(10),
    height: verticalScale(50),
    marginBottom: verticalScale(20),
  },
  timerText: {
    color: colors.green,
  },
});
