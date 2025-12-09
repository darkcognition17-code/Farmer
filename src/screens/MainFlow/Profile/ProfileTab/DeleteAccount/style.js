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
    height: verticalScale(170),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: moderateScale(24),
    borderBottomLeftRadius: moderateScale(24),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // width: '92%',
    marginTop: verticalScale(65),
  },
  bell: {
    borderRadius: moderateScale(9),
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    paddingLeft: moderateScale(12),
    paddingRight: moderateScale(14),
    position: 'absolute',
    left: 14,
  },
  bulletContainer: { marginTop: 8 },
  headerTitle: {
    fontSize: scaledFontSize(18),
    color: colors.Neutrals010,
    fontWeight: '700',
    fontFamily: fonts.bold,
    textAlignVertical: 'center',
  },

  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: colors.white,
    marginTop: 30,
    marginHorizontal: 16,
    borderRadius: 24,
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  title: {
    fontSize: scaledFontSize(18),
    fontWeight: '700',
    color: colors.Neutrals100,
    marginBottom: 10,
  },
  text: {
    fontSize: scaledFontSize(14),
    color: colors.Neutrals300,
    marginBottom: 10,
  },
  bulletList: {
    marginLeft: 10,
    marginBottom: 10,
  },
  bullet: {
    fontSize: 14,
    color: colors.Neutrals300,
    lineHeight: 20,
  },
});
