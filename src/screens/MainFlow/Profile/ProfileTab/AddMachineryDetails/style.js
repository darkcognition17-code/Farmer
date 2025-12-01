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
    borderRadius: moderateScale(24),
  },
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
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: moderateScale(16),
  },
  header: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: verticalScale(10),
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(24),
    marginHorizontal: verticalScale(16),
  },
  dateFieldContainer: { flex: 1 },
  inputContainerStyle: {
    marginBottom: 0,
  },
  inputStyle: {
    paddingVertical: verticalScale(18),
    paddingHorizontal: moderateScale(14),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commonMargin: { marginBottom: verticalScale(16) },
  sectionTitle: {
    fontWeight: '600',
    fontFamily: fonts.semiBold,
    fontSize: scaledFontSize(18),
    color: colors.Neutrals010,
  },
  fieldRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    rowGap: moderateScale(16),
  },
  fieldCol: {
    width: '48%',
  },
  label: {
    fontWeight: '500',
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(14),
    color: colors.Neutrals100,
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    marginTop: verticalScale(4),
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: colors.Neutrals700,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(13),
    paddingHorizontal: verticalScale(16),
    width: '48%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedToggle: {
    borderColor: colors.ButtonColor,
    color: colors.ButtonColor,
  },
  toggleText: {
    color: colors.Neutrals010,
    fontWeight: '500',
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(14),
  },
  listContainer: { gap: 16, marginTop: 18 },
  quantityText: {
    // marginTop: verticalScale(6),
    fontWeight: '500',
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(14),
    color: colors.Neutrals300,
  },
  otherInput: { height: verticalScale(80) },
  buttonsContainer: {
    backgroundColor: colors.white,
    paddingVertical: moderateScale(24),
    paddingHorizontal: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(48),
  },
  nonRepeatableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButtonContainer: {
    flex: 1,
    width: '92%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  saveButton: {
    paddingVertical: moderateScale(17),
    marginBottom: 0,
  },
});
