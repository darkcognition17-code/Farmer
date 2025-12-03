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
  landCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(14),
    padding: moderateScale(16),
    marginBottom: verticalScale(30),
    marginLeft: moderateScale(16),
  },
  landThumb: {
    width: moderateScale(98),
    height: moderateScale(98),
    resizeMode: 'center',
    borderRadius: moderateScale(16),
    position: 'absolute',
    top: moderateScale(-15),
    left: moderateScale(-15),
  },
  landContent: {
    flex: 1,
    marginLeft: moderateScale(90),
  },
  landTitle: {
    fontSize: scaledFontSize(18),
    fontWeight: '700',
    fontFamily: fonts.bold,
    lineHeight: verticalScale(24),
  },
  cropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(8),
    gap: moderateScale(8),
  },
  leaf: {
    padding: moderateScale(8),
    borderRadius: moderateScale(14),
    backgroundColor: colors.LeafBg,
  },
  cropCount: {
    color: colors.CropCountGreen,
    fontWeight: '700',
  },
  noCount: { color: colors.Secondary },
  landFooter: {
    marginTop: moderateScale(25),
    marginBottom: moderateScale(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: moderateScale(8),
    backgroundColor: colors.LandFooterBg,
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(11),
  },
  ownedLabel: {
    color: colors.OwnedLabelText + 'E5',
    fontWeight: '400',
    fontFamily: fonts.regular,
    lineHeight: verticalScale(18),
    fontSize: scaledFontSize(12),
  },
  acres: {
    fontWeight: '700',
    fontFamily: fonts.bold,
    lineHeight: verticalScale(20),
    fontSize: scaledFontSize(15),
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
