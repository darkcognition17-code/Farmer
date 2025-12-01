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
    // width: '92%',
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
  subTitle:{
    fontSize: scaledFontSize(14),
    lineHeight: verticalScale(21),
    fontFamily: fonts.medium,
    fontWeight: '500',
    marginBottom: 45,
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
    color: colors.green,
    fontFamily: fonts.medium,
  },
  mobile: {
    fontFamily: fonts.medium,
    color: colors.gray,
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
  disabledResend: {
    color: colors.gray,
    fontFamily: fonts.medium,
  },

  continueButton: {
    backgroundColor: colors.ButtonColor,
    borderRadius: moderateScale(10),
    height: verticalScale(50),
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
