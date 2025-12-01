import { StyleSheet } from 'react-native';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../../../../utils/responsive';
import { colors } from '../../../../themes/colors';
import { fonts } from '../../../../themes/fonts';

export const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
  progressHeader: {
    paddingBottom: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    resizeMode: 'cover',
    height: moderateScale(219),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '92%',
    marginTop: verticalScale(60),
    justifyContent: 'center',
    // marginBottom: verticalScale(24),
  },
  bell: {
    borderRadius: moderateScale(9),
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    paddingLeft: moderateScale(12),
    paddingRight: moderateScale(14),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    color: colors.black,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
    // marginLeft: moderateScale(85),
  },
  progressContent: {
    width: '95%',
    alignSelf: 'center',
    marginTop: moderateScale(14),
  },
  formContainer: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
  },
  sectionTitle: {
    fontSize: scaledFontSize(18),
    fontWeight: '600',
    color: colors.black,
    marginBottom: moderateScale(20),
  },
  label: {
    fontSize: scaledFontSize(14),
    fontWeight: '500',
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: moderateScale(10),
  },
  required: {
    color: colors.error,
    fontSize: scaledFontSize(15),
  },
  inputIcon:{ top: moderateScale(7) },
  dropdownIcon:{ top: moderateScale(5) },
  inputContainer: {
    paddingVertical: verticalScale(14),
    fontSize: scaledFontSize(14),
    marginTop: verticalScale(15),
    height: moderateScale(56),
  },
  buttonWrapper: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(32),
    backgroundColor: colors.CardContainer,
  },
  continueButton: {
    height: moderateScale(50),
    borderRadius: moderateScale(10),
    backgroundColor: colors.ButtonColor,
  },
});
