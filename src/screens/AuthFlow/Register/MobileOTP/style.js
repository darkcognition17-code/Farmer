import { StyleSheet } from 'react-native';
import { colors } from '../../../../themes/colors';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../../utils/responsive';
import { fonts } from '../../../../themes/fonts';

export const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(60),
    backgroundColor: colors.GradientColor + '80',
  },

  video: { ...StyleSheet.absoluteFillObject },

  backButton: {
    backgroundColor: colors.white,
    borderRadius: scale(8),
    padding: moderateScale(10),
    alignSelf: 'flex-start',
    marginLeft: scale(18),
    position: 'absolute',
    top: verticalScale(63),
  },
  backButtonComponent: { resizeMode: 'contain' },
  forgotPassword: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(60),
  },
  forgotPasswordExtrStyling: {
    marginTop: verticalScale(20),
  },

  appLogo: {
    width: scale(96),
    height: verticalScale(96),
    alignSelf: 'center',
    marginBottom: verticalScale(24),
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

  inputLabel: {
    marginTop: verticalScale(20),
  },

  inputContainer: {
    paddingLeft: scale(90),
    paddingVertical: verticalScale(16),
    fontSize: scaledFontSize(16),
    marginBottom: verticalScale(5),
  },
  passwordInputContainer: {
    paddingVertical: verticalScale(16),
    fontSize: scaledFontSize(16),
  },
  flagAndCode: {
    gap: moderateScale(8),
    flexDirection: 'row',
    borderRightColor: colors.Neutral,
    borderRightWidth: 1,
    paddingRight: scale(10),
  },
  flagIcon: {
    height: verticalScale(17),
    width: scale(24),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  countryCode: {
    fontSize: scaledFontSize(16),
    fontWeight: '400',
    color: colors.Neutrals500,
    fontFamily: fonts.regular,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(40),
  },
  resetText: {
    textAlign: 'center',
  },
  timer: {
    color: colors.TimerGreen,
    fontFamily: fonts.medium,
  },
  mobile: {
    fontFamily: fonts.medium,
    color: colors.gray,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  resendLink: {
    color: colors.ButtonColor,
    fontFamily: fonts.medium,
  },
  disabledResend: {
    color: colors.gray,
    fontFamily: fonts.medium,
  },

  continueButton: {
    backgroundColor: colors.ButtonColor,
    borderRadius: moderateScale(10),
    height: verticalScale(50),
    marginTop: verticalScale(64),
    marginBottom: verticalScale(20),
  },
  linearGradient: {
    flex: 1,
  },
  timerText: {
    color: colors.green,
  },
  userIdContainer: {
    flexDirection: 'row',
  },
});
