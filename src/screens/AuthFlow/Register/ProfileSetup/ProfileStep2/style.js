import { StyleSheet } from 'react-native';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';

export const styles = StyleSheet.create({
  progressHeader: {
    paddingBottom: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    marginTop: moderateScale(60),
    fontSize: moderateScale(18),
    color: colors.black,
    fontWeight: 'bold',
  },
  imageBackground: {
    resizeMode: 'cover',
    height: moderateScale(219),
  },
  progressContent: {
    width: '95%',
    alignSelf: 'center',
    marginTop: moderateScale(14),
  },
  formContainer: {
    backgroundColor: colors.CardContainer,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(16),
  },
  sectionTitle: {
    fontSize: scaledFontSize(18),
    fontWeight: '600',
    color: colors.black,
    marginBottom: moderateScale(12),
  },
  label: {
    fontSize: scaledFontSize(14),
    fontWeight: '500',
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: moderateScale(10),
    // marginBottom: moderateScale(6),
  },
  required: {
    color: colors.error,
    fontSize: scaledFontSize(15),
  },
  pincodeIcon: {
    top: moderateScale(6),
  },
  inputContainer: {
    // paddingLeft: scale(40),
    paddingVertical: verticalScale(14),
    fontSize: scaledFontSize(14),
    marginTop: verticalScale(10),
    // marginTop: moderateScale(10),
  },
  buttonWrapper: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(32),
  },
  continueButton: {
    height: moderateScale(50),
    borderRadius: moderateScale(10),
    backgroundColor: colors.ButtonColor,
  },
  userName: {
    top: moderateScale(5),
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },

  bottomGap: { paddingBottom: moderateScale(50) },
});
