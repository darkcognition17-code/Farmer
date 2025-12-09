import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../../themes/colors';
import { fonts } from '../../../themes/fonts';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../../../utils/responsive';

export const styles = StyleSheet.create({
  headerContent: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(16),
  },
  headerContentSub: {
    marginTop: verticalScale(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bell: {
    borderRadius: moderateScale(9),
    backgroundColor: colors.white,
    position: 'absolute',
    alignItems: 'center',
    left: moderateScale(0),
    top: moderateScale(-5),
    paddingVertical: moderateScale(10),
    paddingLeft: moderateScale(12),
    paddingRight: moderateScale(14),
  },
  name: {
    fontWeight: '700',
    fontFamily: fonts.bold,
    fontSize: scaledFontSize(16),
    lineHeight: moderateScale(24),
    color: colors.Neutrals010,
    textAlign: 'center',
  },
  container: {
    width: '100%',
    paddingHorizontal: moderateScale(16),
    marginTop: verticalScale(30),
  },

  addCrop: {
    padding: moderateScale(19),
    position: 'absolute',
    backgroundColor: colors.ButtonColor,
    borderRadius: moderateScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    top: Dimensions.get('window').height - verticalScale(75),
    right: moderateScale(16),
    zIndex: 1,
    shadowColor: colors.black + '3D',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 12,
  },

  headerImageStyle: {
    width: '100%',
    borderBottomRightRadius: moderateScale(24),
    borderBottomLeftRadius: moderateScale(24),
    height: verticalScale(253),
  },
  landListStyle: {
    paddingTop: verticalScale(18),
  },
});
