import { StyleSheet } from 'react-native';
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
  dateText: {
    marginTop: verticalScale(6),
    color: colors.Neutrals300,
    fontSize: moderateScale(12),
    fontFamily: fonts.regular,
    lineHeight: verticalScale(18),
  },
  bell: {
    borderRadius: moderateScale(14),
    backgroundColor: colors.white,
    padding: moderateScale(10),
    resizeMode: 'contain',
  },
  dateText2: {
    marginTop: moderateScale(21),
    marginBottom: moderateScale(10),
    color: colors.Neutrals100,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  headerContentSub: {
    marginTop: verticalScale(65),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  headerHeight: { height: verticalScale(346) },
  greeting: {
    fontSize: scaledFontSize(16),
    fontWeight: '700',
    fontFamily: fonts.bold,
    lineHeight: verticalScale(22),
    width: 300,
  },
  name: {
    fontWeight: '400',
    fontFamily: fonts.regular,
    fontSize: scaledFontSize(16),
    lineHeight: moderateScale(22),
  },
  landIconStyle: {
    height: moderateScale(64),
    width: moderateScale(64),
    marginBottom: verticalScale(16),
  },
  noWeatherImage: {
    height: moderateScale(64),
    width: moderateScale(64),
  },

  container: {
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: moderateScale(16),
  },
  weatherCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(16),
  },
  loader: {
    paddingVertical: moderateScale(50),
  },

  kisaniCard: {
    backgroundColor: colors.KisaniCardBg,
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: colors.KisaniCardBorder,
    paddingHorizontal: moderateScale(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: verticalScale(25),
    overflow: 'hidden',
  },
  elipse: {
    height: moderateScale(87),
    width: moderateScale(87),
    backgroundColor: colors.ElipseBg,
    borderRadius: moderateScale(44),
    position: 'absolute',
    bottom: moderateScale(-20),
    left: moderateScale(5),
  },
  kisaniLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kisaniAvatar: {
    width: moderateScale(80),
    height: verticalScale(80),
    resizeMode: 'cover',
    marginLeft: moderateScale(5),
    marginTop: verticalScale(15),
  },
  kisaniLabel: {
    color: colors.Neutrals100,
    fontSize: moderateScale(14),
    fontFamily: fonts.regular,
    lineHeight: verticalScale(20),
  },
  kisaniName: {
    color: colors.Neutrals100,
    fontSize: moderateScale(18),
    fontFamily: fonts.semiBold,
    lineHeight: verticalScale(24),
    marginTop: verticalScale(2),
  },
  kisaniActions: {
    flexDirection: 'row',
    gap: moderateScale(10),
    marginRight: moderateScale(10),
  },
  actionBtn: {
    padding: moderateScale(10),
    borderRadius: moderateScale(24),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(15),
  },
  sectionTitle: {
    fontSize: scaledFontSize(16),
    fontFamily: fonts.bold,
    lineHeight: verticalScale(22),
    fontWeight: '700',
  },
  seeAllContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  seeAll: {
    color: colors.SeeAllText,
    fontSize: scaledFontSize(14),
    fontFamily: fonts.medium,
    lineHeight: verticalScale(20),
    fontWeight: '500',
  },

  accuweather: {
    height: moderateScale(9),
    width: moderateScale(63),
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginTop: verticalScale(10),
  },
  screenWrapperContent: {
    flex: 1,
    paddingBottom: verticalScale(30),
  },
  headerImageStyle: {
    width: '100%',
    height: verticalScale(253),
    borderBottomRightRadius: moderateScale(24),
    borderBottomLeftRadius: moderateScale(24),
  },
  kisaniLeftContent: {
    marginLeft: moderateScale(10),
    width: 140,
  },
  landListStyle: {
    paddingTop: verticalScale(18),
  },

  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(24),
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
  },
  emptyListText: {
    fontSize: moderateScale(18),
    color: colors.Neutrals010,
    marginBottom: moderateScale(6),
    fontWeight: '600',
    fontFamily: fonts.semiBold,
  },
  emptyListSubText: {
    fontSize: moderateScale(12),
    color: colors.Neutrals500,
    fontWeight: '500',
    fontFamily: fonts.medium,
    // marginBottom: moderateScale(10),
  },

  bottomGap: {
    marginTop: verticalScale(100),
  },
});
