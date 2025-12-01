import { Dimensions, Platform, StyleSheet } from 'react-native';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../utils/responsive';
import { colors } from '../../../themes/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: moderateScale(16),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: Dimensions.get('window').width - scale(30),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  logo: {
    height: verticalScale(80),
    width: scale(150),
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.Neutrals950,
    borderRadius: moderateScale(10),
    padding: moderateScale(4),
    marginBottom: verticalScale(20),
  },
  tabButton: {
    flex: 1,
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabText: {
    fontSize: scaledFontSize(14),
    color: colors.Neutrals500,
  },
  activeTabText: {
    color: colors.black,
    fontWeight: '600',
  },
  instruction: {
    fontSize: scaledFontSize(14),
    color: colors.Neutrals500,
    marginBottom: verticalScale(30),
  },
  inputContainer: {
    paddingLeft: scale(Platform.OS == 'android' ? 50 : 40),
    paddingVertical: verticalScale(16),
    fontSize: scaledFontSize(16),
  },
  passwordInputContainer: {
    paddingVertical: verticalScale(16),
    fontSize: scaledFontSize(16),
    marginBottom: verticalScale(5),
  },
  flagAndCode: {
    gap: moderateScale(8),
    flexDirection: 'row',
    borderRightColor: colors.Neutrals500,
    borderRightWidth: 1,
    paddingRight: scale(3),
  },
  countryCode: {
    color: colors.Neutrals500,
  },
  flagIcon: {
    height: verticalScale(17),
    width: scale(24),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(10),
  },
  footerText: {
    textAlignVertical: 'center',
    fontSize: scaledFontSize(13),
    color: colors.Neutrals900,
  },
  signUpText: {
    fontSize: scaledFontSize(13),
    color: colors.ButtonColor,
    fontWeight: '600',
  },
  video: { ...StyleSheet.absoluteFillObject },
  backgroundGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(60),
    backgroundColor: colors.GradientColor + '80',
  },
  forgotPass: {
    alignSelf: 'flex-end',
    top: moderateScale(-10),
  },
  userName: {
    gap: moderateScale(8),
    flexDirection: 'row',
  },
  inputContainer2: {
    paddingLeft: scale(40),
    paddingVertical: verticalScale(16),
    fontSize: scaledFontSize(16),
  },
  linearGradient: {
    flex: 1,
  },
  forgotPassContainer: {
    flexDirection: 'row-reverse',
    right: 0,
  },
  orText: {
    paddingHorizontal: scale(5),
  },
  loginButton: {
    backgroundColor: colors.ButtonColor,
    marginTop: verticalScale(60),
  },
});
