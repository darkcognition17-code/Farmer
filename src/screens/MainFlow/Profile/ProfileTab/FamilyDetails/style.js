import { StyleSheet } from 'react-native';
import {
  moderateScale,
  scaledFontSize,
  scale,
  verticalScale,
} from '../../../../../utils/responsive';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';

export const styles = StyleSheet.create({
  progressHeader: {
    paddingBottom: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24)  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '92%',
    marginTop: verticalScale(62),
    marginBottom: verticalScale(20),
  },
  bell: {
    borderRadius: moderateScale(9),
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    paddingLeft: moderateScale(12),
    paddingRight: moderateScale(14),
    position: 'absolute',
    left: 0,
  },
  headerTitle: {
    fontSize: scaledFontSize(18),
    color: colors.Neutrals010,
    fontWeight: '700',
    fontFamily: fonts.semiBold,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: moderateScale(16),
    marginTop: verticalScale(15),
  },
  label: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
    fontSize: scaledFontSize(14),
    fontWeight: '500',
    fontFamily: fonts.medium,
    color: colors.Neutrals100,
  },
  required: {
    color: colors.error,
  },
  inputField: {
    paddingVertical: moderateScale(17),
  },
  buttonContainer: {
    marginTop: verticalScale(30),
    marginBottom: moderateScale(10),
    marginHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
  },
  saveButton: {
    paddingVertical: moderateScale(17),
    paddingHorizontal: moderateScale(14),
  },
});
