import { StyleSheet } from 'react-native';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';

export const styles = StyleSheet.create({
  progressHeader: {
    paddingBottom: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '92%',
    marginTop: verticalScale(62),
    marginBottom: verticalScale(20),
  },
  errorText: {
    flex: 1, textAlign: 'center', marginTop: 50 
    
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
    paddingHorizontal: moderateScale(16),
  },
  flatListContent: {
    gap: moderateScale(6),
    marginTop: moderateScale(16),
  },
  itemContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    justifyContent: 'space-between',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(14),
    flexDirection: 'row',
  },
  itemLeftContainer: {
    flexDirection: 'row',
    gap: moderateScale(16),
    alignItems: 'center',
  },
  itemIconContainer: {
    backgroundColor: colors.ButtonColor + '1A',
    padding: moderateScale(10),
    borderRadius: moderateScale(60),
  },
  itemName: {
    color: colors.Neutrals100,
    fontFamily: fonts.bold,
    fontSize: scaledFontSize(14),
    fontWeight: '700',
  },
  itemRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(15),
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: colors.QuantityButtonBackgroundColor,
    borderRadius: moderateScale(8),
    height: moderateScale(28),
    width: moderateScale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: colors.Neutrals100,
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(16),
    fontWeight: '500',
  },
  otherInput:{width: moderateScale(250)},
  loader:{ flex: 1, justifyContent: 'center', alignItems: 'center' },
  otherLabel: {
    marginTop: verticalScale(24),
    color: colors.Neutrals300,
    fontFamily: fonts.semiBold,
    fontSize: scaledFontSize(16),
    fontWeight: '600',
  },
  otherDetailsContainer: {
    backgroundColor: colors.white,
    paddingVertical: verticalScale(24),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(20),
    marginTop: verticalScale(12),
  },
  inputLabel: {
    marginTop: verticalScale(24),
    color: colors.Neutrals300,
    fontFamily: fonts.semiBold,
    fontSize: scaledFontSize(16),
    fontWeight: '600',
  },
  ownershipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(12),
    gap: moderateScale(16),
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
    borderColor: colors.ButtonColor,
  },
  genderText: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(14),
    fontWeight: '500',
  },
  ownershipTextSelected: {
    color: colors.ButtonColor,
  },
  buttonsContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingVertical: moderateScale(24),
    paddingHorizontal: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(36),
    gap: moderateScale(16),
  },
  otherButtonContainer: {
    flex: 0,
  },
  otherButton: {
    backgroundColor: colors.white,
    borderColor: colors.ButtonColor,
    borderWidth: 1,
    paddingHorizontal: moderateScale(40),
    paddingVertical: moderateScale(17),
  },
  otherButtonText: {
    color: colors.ButtonColor,
  },
  deleteButton: {
    backgroundColor: colors.white,
    borderColor: colors.error,
    borderWidth: 1,
    paddingHorizontal: moderateScale(40),
    paddingVertical: moderateScale(17),
  },
  deleteButtonText: {
    color: colors.error,
  },
  saveButtonContainer: {
    flex: 0,
  },
  saveButton: {
    paddingHorizontal: moderateScale(50),
    paddingVertical: moderateScale(17),
  },
});
