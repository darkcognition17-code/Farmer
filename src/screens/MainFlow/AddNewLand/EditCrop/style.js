import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../../../../utils/responsive';
import { colors } from '../../../../themes/colors';
import { StyleSheet } from 'react-native';
import { fonts } from '../../../../themes/fonts';

export const styles = StyleSheet.create({
  headerBackground: {
    paddingBottom: moderateScale(20),
    alignItems: 'center',
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    overflow: 'hidden',
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.error,
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.black,
    fontFamily: fonts.bold,
  },
  headerContainer: {
    marginTop: verticalScale(60),
    marginBottom: verticalScale(16),
  },
});
