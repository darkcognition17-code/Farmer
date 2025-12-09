import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  main: { backgroundColor: colors.transparent, flex: 1 },
  loader: { marginVertical: 20 },
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
  flatlistContent: {
    gap: moderateScale(12),
    marginVertical: moderateScale(20),
    paddingHorizontal: moderateScale(16),
  },
  modelTitle: {
    color: colors.Neutrals500,
    fontFamily: fonts.semiBold,
    fontSize: scaledFontSize(14),
    fontWeight: '600',
  },
  detailItem: {
    width: '48%',
  },
  quantityText: {
    color: colors.Neutrals100,
    fontFamily: fonts.bold,
    fontSize: scaledFontSize(14),
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(20),
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    margin: moderateScale(16),
    height: moderateScale(height - 200),
  },
  flexWrap: { flexWrap: 'wrap' },
  trolleyStyling: { maxHeight: 50 },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: scaledFontSize(16),
    color: colors.black,
    marginTop: moderateScale(16),
  },
  emptySubTitle: {
    fontFamily: fonts.regular,
    fontSize: scaledFontSize(12),
    color: colors.gray,
    textAlign: 'center',
    marginTop: moderateScale(8),
  },
  addCropButton: {
    backgroundColor: colors.ButtonColor + '1A',
    paddingVertical: moderateScale(12),
    marginTop: moderateScale(12),
    paddingHorizontal: moderateScale(24),
    borderRadius: moderateScale(8),
    borderColor: colors.ButtonColor,
    borderWidth: 1,
  },
  addCropText: {
    color: colors.Neutrals010,
    fontFamily: fonts.bold,
    fontSize: scaledFontSize(14),
  },
  addButton: {
    alignSelf: 'center',
    marginVertical: moderateScale(30),
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailColumn: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '400',
    fontFamily: fonts.regular,
    fontSize: scaledFontSize(12),
    color: colors.OwnedLabelText + 'E5',
  },
  detailValue: {
    fontWeight: '700',
    fontFamily: fonts.bold,
    fontSize: scaledFontSize(14),
    color: colors.Neutrals100,
  },
});
