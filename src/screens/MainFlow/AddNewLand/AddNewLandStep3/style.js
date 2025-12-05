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
    backgroundColor: colors.error,
  },
  headerBackground: {
    paddingBottom: moderateScale(20),
    alignItems: 'center',
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    overflow: 'hidden',
  },
  headerContainer: {
    marginTop: verticalScale(60),
    marginBottom: verticalScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.black,
    fontFamily: fonts.bold,
  },
  progressWrapper: {
    width: '92%',
    alignSelf: 'center',
  },
  formContainer: {
    // padding: moderateScale(16),
    flex: 1,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(40),
    marginTop: moderateScale(100),
    margin: moderateScale(16),
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cropIcon: {
    width: moderateScale(64),
    height: moderateScale(64),
    marginBottom: moderateScale(10),
  },
  emptyTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.black,
    marginBottom: moderateScale(12),
  },
  addCropButton: {
    borderWidth: 1,
    borderColor: colors.ButtonColor,
    backgroundColor: colors.ButtonColor + '10',
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(24),
  },
  addCropText: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  farmName: {
    fontSize: moderateScale(16),
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.Neutrals100,
  },
  acresText: {
    fontSize: moderateScale(12),
    color: colors.OwnedLabelText,
    fontWeight: '400',
    fontFamily: fonts.regular,

    // marginBottom: moderateScale(8),
  },
  farmInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  formContent: {
    backgroundColor: colors.white,
    padding: moderateScale(16),
  },
  areaInput: {
    paddingVertical: verticalScale(17),
    marginBottom: 0,
  },
  areaInputContainer: {
    flex: 1,
    marginRight: moderateScale(8),
    marginBottom: 0,
  },
  saveButton: {
    backgroundColor: colors.ButtonColor,
    paddingVertical: verticalScale(17),
  },
  acresTextValue: {
    color: colors.Neutrals100,
    fontWeight: '700',
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: colors.Neutrals010,
    fontFamily: fonts.semiBold,
    marginBottom: moderateScale(20),
    marginTop: moderateScale(12),
  },
  cropCard: {
    backgroundColor: colors.CardContainer,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(5),
  },
  cropTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    fontFamily: fonts.semiBold,
    color: colors.Neutrals300,
  },
  clearText: {
    color: colors.ButtonColor,
    fontWeight: '500',
    fontSize: moderateScale(16),
    fontFamily: fonts.medium,
    textDecorationLine: 'underline',
  },
  addAnotherButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.ButtonColor,
    backgroundColor: colors.ButtonColor + '10',
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(24),
    marginTop: moderateScale(10),
  },
  addAnotherText: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonWrapper: {
    padding: moderateScale(16),
    borderTopWidth: 0.5,
    borderColor: colors.LightGray,
    backgroundColor: colors.white,
  },

  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.Neutrals700,
    paddingHorizontal: 15,
    paddingVertical: 17,
    backgroundColor: colors.white,
    gap: 10,
    // width: moderateScale(120),
  },
  dropdownText: {
    fontSize: scaledFontSize(14),
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.Neutrals500,
  },
  inputLabel: {
    marginTop: moderateScale(16),
    marginBottom: moderateScale(6),
    fontSize: moderateScale(14),
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.Neutrals100,
  },
  requiredAsterisk: {
    color: colors.error,
    fontSize: 16,
  },
  cropInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
