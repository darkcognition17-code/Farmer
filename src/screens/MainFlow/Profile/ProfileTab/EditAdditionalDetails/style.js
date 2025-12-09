import { StyleSheet } from 'react-native';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';

export const styles = StyleSheet.create({
  screenWrapperContainer: {
    flex: 1,
  },

  imageBackgroundStyle: {
    width: '100%',
    height: verticalScale(200),
    borderBottomRightRadius: moderateScale(24),
    borderBottomLeftRadius: moderateScale(24),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '92%',
    marginTop: verticalScale(60),
  },
  headerTitle: {
    fontSize: scaledFontSize(18),
    color: colors.Neutrals010,
    fontWeight: '700',
    fontFamily: fonts.bold,
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
  userOrangeIcon: {
    marginLeft: moderateScale(4),
  },
  progressHeader: {
    paddingBottom: moderateScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(24),
  },
  subHeaderTitle: {
    fontSize: scaledFontSize(18),
    color: colors.Neutrals010,
    fontWeight: '600',
    marginBottom: verticalScale(18),
    fontFamily: fonts.semiBold,
  },
  inputContainer: { marginBottom: verticalScale(16) },
  contentContainer: {
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(16),
    marginVertical: moderateScale(28),
    paddingVertical: moderateScale(24),
    paddingHorizontal: moderateScale(20),
    flex: 1,
    borderRadius: moderateScale(24),
  },

  genderLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    width: '50%',
  },
  genderContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },

  inputField: {
    paddingVertical: moderateScale(17),
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(16),
    color: colors.Neutrals010,
    borderRadius: moderateScale(12),
  },

  label: {
    marginBottom: moderateScale(8),
    fontSize: scaledFontSize(14),
    color: colors.Neutrals100,
  },
  buttonWrapper: {
    // marginTop: moderateScale(24),
    flex: 1,
    justifyContent: 'flex-end',
  },
  saveButton: {
    paddingVertical: moderateScale(17),
    borderRadius: moderateScale(12),
    marginBottom: 0,
  },
});
