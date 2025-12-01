import { StyleSheet } from 'react-native';
import {
  moderateScale,
  scaledFontSize,
  scale,
  verticalScale,
} from '../../../utils/responsive';
import { colors } from '../../../themes/colors';
import { fonts } from '../../../themes/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuSection: {
    marginTop: moderateScale(60),
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(8),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(10),
  },
  additionalSection: {
    backgroundColor: colors.white,
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    borderWidth: moderateScale(1),
    borderColor: colors.Neutrals900,
    gap: moderateScale(10),
  },
  linkContainerTitle: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    fontSize: scaledFontSize(12),
    color: colors.Neutrals300,
  },
  additionalLinkItem: {
    paddingHorizontal: moderateScale(0),
    paddingVertical: moderateScale(0),
    borderWidth: moderateScale(0),
    gap: moderateScale(15),
  },
  logoutSection: {
    marginBottom: moderateScale(125),
  },
  progressHeader: {
    paddingBottom: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),

    height: moderateScale(249),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '92%',
    marginTop: verticalScale(-35),
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
    zIndex: 3,
    left: 0,
  },
  headerTitle: {
    fontSize: scaledFontSize(18),
    color: colors.Neutrals010,
    fontWeight: '700',
    fontFamily: fonts.semiBold,
  },
  keyboardAvoidingView: {},
  // FAQ styles
  title: {
    fontSize: scaledFontSize(20),
    fontWeight: '700',
    color: colors.DarkGray2,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    fontFamily: fonts.medium,
    flex: 1,
    color: colors.Neutrals100,
  },

  // FAQ styles
  faqContainer: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(21),
    padding: moderateScale(20),
    marginBottom: moderateScale(30),
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
  },
  // WebView styles
  webViewContainer: {
    flex: 1,
    marginHorizontal: moderateScale(16),
    padding: moderateScale(20),
    marginTop: moderateScale(21),
    marginBottom: moderateScale(30),
    backgroundColor: colors.white,
    borderRadius: moderateScale(24),
  },
  divider: {
    borderWidth: 0.5,
    borderColor: colors.Neutrals700 + '4D',
    marginVertical: 24,
  },

  container: {
    flex: 1,
    // padding: moderateScale(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: moderateScale(18),
    color: colors.black,
  },
  profileBox: {
    alignItems: 'center',
    // backgroundColor: colors.lightGreen,
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(20),
    marginBottom: verticalScale(16),
  },
  profileImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
  },
  name: {
    marginTop: verticalScale(8),
    fontFamily: fonts.semiBold,
    fontSize: moderateScale(16),
    // color: colors.n010,
  },
  titleText: {
    fontFamily: fonts.medium,
    fontWeight: '500',
    fontSize: scaledFontSize(14),
    color: colors.Neutrals500,
  },
  valueText: {
    fontFamily: fonts.medium,
    fontWeight: '500',
    fontSize: scaledFontSize(14),
    color: colors.Neutrals010,
  },
  // New common styles
  sectionContainer: {
    marginHorizontal: moderateScale(16),
    // marginTop: verticalScale(70), // This is specific to the first section, might not be common
  },
  iconAndTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  twoColumnWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    rowGap: verticalScale(16),
    marginTop: verticalScale(16),
  },
  halfWidthColumn: {
    width: '48%',
  },
  menuItemsWrapper: {
    gap: verticalScale(12),
    marginBottom: verticalScale(20),
  },
  deleteAccountBtn: {
    marginBottom: verticalScale(60),
    paddingVertical: verticalScale(18),
    paddingHorizontal: moderateScale(16),
    backgroundColor: colors.transparent,
    borderColor: colors.Neutrals900,
    borderWidth: 1,
    borderRadius: moderateScale(16),
    gap: moderateScale(16),
  },
  bottomGap:{ marginBottom: moderateScale(100) }
});
