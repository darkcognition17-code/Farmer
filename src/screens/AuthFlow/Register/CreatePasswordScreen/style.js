import { Platform, StyleSheet } from 'react-native';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../../utils/responsive';
import { colors } from '../../../../themes/colors';
import { fonts } from '../../../../themes/fonts';

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: moderateScale(20),
    backgroundColor: colors.white,
    borderRadius: moderateScale(30),
    width: '96%',
  },
  resetPassword: {
    marginTop: verticalScale(24),
  },
  backButtonComponentStyle: { resizeMode: 'contain' },
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
    marginTop: verticalScale(24),
  },
  logo: {
    height: verticalScale(97),
    width: scale(94),
  },
  title: {
    fontSize: scaledFontSize(22),
    fontWeight: '600',
    color: colors.Neutrals010,
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: scaledFontSize(14),
    color: colors.gray,
    marginBottom: verticalScale(24),
  },
  hintText: {
    fontSize: scaledFontSize(12),
    color: colors.gray,
    marginTop: -verticalScale(10),
    marginBottom: verticalScale(16),
  },
  buttonContainer: {
    marginTop: verticalScale(50),
  },
  video: { ...StyleSheet.absoluteFillObject },
  backgroundGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    backgroundColor: colors.GradientColor + '80',
  },
  input: {
    height: verticalScale(56),
  },
  button: {
    height: verticalScale(56),
    backgroundColor: colors.ButtonColor,
  },
  backButton: {
    backgroundColor: colors.white,
    borderRadius: scale(8),
    padding: moderateScale(10),
    alignSelf: 'flex-start',
    marginLeft: scale(18),
    // position: 'absolute',
    top: verticalScale(Platform.OS == 'android' ? 20 : 50),
    zIndex: 5,
    elevation: 10,
    left: 0,
    height: moderateScale(40),
    width: moderateScale(40),
  },
  linearGradient: {
    flex: 1,
  },
});
