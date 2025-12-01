import { StyleSheet } from 'react-native';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';

export const styles = StyleSheet.create({
  progressHeader: {
    paddingBottom: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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
  keyboardAvoidingView: {},
  // FAQ styles
  container: {},
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
  answerText: {
    fontSize: moderateScale(14),
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.InactiveText,
    marginTop: moderateScale(8),
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
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    borderWidth: 0.5,
    borderColor: colors.Neutrals700 + '4D',
    marginVertical: 24,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: moderateScale(15),
  },
});
