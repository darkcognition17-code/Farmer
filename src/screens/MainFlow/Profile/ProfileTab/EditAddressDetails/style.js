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
  progressHeader: {
    paddingBottom: moderateScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(24),
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
    fontFamily: fonts.bold,
  },
  subHeaderTitle: {
    fontSize: scaledFontSize(18),
    color: colors.Neutrals010,
    fontWeight: '600',
    fontFamily: fonts.semiBold,
    marginBottom: verticalScale(24),
  },
  contentContainer: {
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(16),
    marginVertical: moderateScale(28),
    paddingVertical: moderateScale(24),
    paddingHorizontal: moderateScale(20),
    flex: 1,
    borderRadius: moderateScale(24),
  },

});
