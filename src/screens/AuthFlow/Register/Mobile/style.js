import { StyleSheet } from 'react-native';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../../utils/responsive';
import { colors } from '../../../../themes/colors';
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
  forgotPassFlagStyle: {
    borderRightWidth: 0,
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
    // lineHeight: verticalScale(26),
    fontFamily: fonts.semiBold,
    fontWeight: '600',
  },

  inputLabel: {
    marginTop: verticalScale(20),
  },

  inputContainer: {
    paddingLeft: scale(53),
    paddingVertical: verticalScale(16),
    fontSize: scaledFontSize(16),
    marginBottom: verticalScale(3),
  },
  passwordInputContainer: {
    paddingVertical: verticalScale(16),
    fontSize: scaledFontSize(16),
  },
  flagAndCode: {
    // gap: moderateScale(8),
    flexDirection: 'row',
    borderRightColor: colors.Neutral,
    borderRightWidth: 1,
    paddingRight: scale(3),
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

  continueButton: {
    backgroundColor: colors.ButtonColor,
    borderRadius: moderateScale(10),
    height: verticalScale(50),
    marginTop: verticalScale(60),
    marginBottom: verticalScale(20),
  },

  signUpContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: scaledFontSize(14),
    color: colors.Neutrals500,
  },
  signUpLink: {
    fontSize: scaledFontSize(14),
    color: colors.ButtonColor,
    fontWeight: '600',
    marginLeft: scale(4),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  logo: {
    height: verticalScale(80),
    width: scale(150),
  },
  linearGradient: {
    flex: 1,
  },
  subtitle: {
    color: colors.Neutrals500,
  },
});
