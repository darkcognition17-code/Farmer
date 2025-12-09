/* File associated with : LanguageScreen Styles
   Developed by : VP
   Date & time : Friday, 19 September 2025 07:30:00 UTC
*/

import { StyleSheet, Dimensions } from 'react-native';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';
import { fonts } from '../../../../../themes/fonts';
import { colors } from '../../../../../themes/colors';
const { width } = Dimensions.get('window');
const cardMargin = scale(15); // same as your grid padding
const cardWidth = (width - cardMargin * 5) / 2; // 2 per row (accounting for side paddings & spacing)

export const styles = StyleSheet.create({
  progressHeader: {
    paddingBottom: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '92%',
    marginTop: verticalScale(64),
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
});
