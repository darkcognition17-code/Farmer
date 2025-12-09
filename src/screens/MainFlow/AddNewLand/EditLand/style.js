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
    borderBottomLeftRadius: moderateScale(24),
    borderRightLeftRadius: moderateScale(24),
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

  scrollViewContent: {
    paddingBottom: moderateScale(80),
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
});
