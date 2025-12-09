import { StyleSheet } from 'react-native';
import { fonts } from '../../../../themes/fonts';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../../../../utils/responsive';
import { colors } from '../../../../themes/colors';

export const styles = StyleSheet.create({
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.black,
    fontFamily: fonts.bold,
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
  progressWrapper: {
    width: '92%',
    alignSelf: 'center',
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.error,
  },
});
