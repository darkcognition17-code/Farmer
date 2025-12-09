import { StyleSheet } from 'react-native';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';

export const styles = StyleSheet.create({
  main: { backgroundColor: colors.transparent, flex: 1 },
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
    // width: '92%',
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
  listContainer: { gap: 16, marginTop: 18, flex: 1 },
  buttonsContainer: {
    backgroundColor: colors.white,
    paddingVertical: moderateScale(24),
    paddingHorizontal: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(48),
  },

  saveButtonContainer: {
    width: '92%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  saveButton: {
    paddingVertical: moderateScale(17),
    marginBottom: 0,
  },
});
