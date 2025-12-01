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
  },
  progressHeader: {
    paddingBottom: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: moderateScale(24),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '92%',
    marginTop: verticalScale(60),
    marginBottom: verticalScale(24),
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
    fontSize: moderateScale(18),
    color: colors.black,
    fontWeight: '700',
    fontFamily: fonts.bold,
  },
  progressContent: {
    width: '92%',
    alignSelf: 'center',
  },
  scrollViewContent: {
    paddingBottom: moderateScale(80),
  },
  contentContainer: {
    paddingHorizontal: moderateScale(16),
  },
  subHeader: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: moderateScale(16),
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.Neutrals010,
  },
  inputStyle: {
    paddingVertical: verticalScale(17),
    // paddingHorizontal: moderateScale(17),
    marginBottom: 0,
  },
  divider: {
    height: verticalScale(0),
    borderWidth: 0.8,
    borderColor: colors.Neutrals900,
    marginVertical: verticalScale(5),
  },
  inputLabel: {
    marginTop: moderateScale(6),
    fontSize: moderateScale(14),
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.Neutrals100,
  },
  requiredAsterisk: {
    color: colors.error,
    fontSize: 16,
  },
  ownershipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(8),
  },
  genderOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.ButtonDisableColor,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  genderOptionSelected: {
    borderColor: colors.Secondary,
  },
  genderText: {
    fontSize: scaledFontSize(14),
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.DarkGray,
  },
  ownershipTextSelected: {
    color: colors.Secondary,
  },
  ownLandLabel: {
    marginTop: moderateScale(16),
  },
  landInputContainer: {
    flexDirection: 'row',
    marginTop: moderateScale(2),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  landValueInput: {
    flex: 1,
    marginRight: moderateScale(8),
    marginBottom: 0,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(17),
    // height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.Neutrals900,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    width: moderateScale(120),
  },
  dropdownText: {
    fontSize: scaledFontSize(14),
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.Neutrals500,
  },
  dropdownIcon: {
    fontSize: 14,
    marginLeft: 6,
  },
  landInputContainerWithMargin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(8),
  },
  leasedLandDropdown: {
    width: moderateScale(120),
    justifyContent: 'center',
    paddingHorizontal: moderateScale(12),
  },
  spacer: {
    height: moderateScale(24),
  },
  buttonWrapper: {
    paddingVertical: 15,
    marginTop: verticalScale(10),
    position: 'absolute',
    bottom: 0,
    width: '90%',
    alignSelf: 'center',
  },
  continueButton: {
    height: 55,
    borderRadius: 10,
  },
  leasedLandLabel: {
    marginTop: moderateScale(16),
  },
  unitText: {
    fontSize: 14,
    marginLeft: 6,
  },
});
