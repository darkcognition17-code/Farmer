import { StyleSheet } from 'react-native';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';

export const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { flex: 1, textAlign: 'center', marginTop: 50 },
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
  keyboardAvoidingView: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
  },
  flatListContent: {
    gap: moderateScale(6),
    marginTop: moderateScale(16),
  },

  listHeader: {
    fontSize: scaledFontSize(16),
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.Neutrals300,
    marginBottom: 8,
  },

  buttonsContainer: {
    paddingVertical: moderateScale(24),

    alignItems: 'center',
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  saveButtonContainer: {
    // paddingVertical: 20,
    flex: 0,
    width: '90%',
    alignSelf: 'center',
  },
  saveButton: {
    paddingHorizontal: moderateScale(86),
    paddingVertical: moderateScale(17),
    marginBottom: 0,
  },

  footerStyle: { marginBottom: verticalScale(41) },
});
