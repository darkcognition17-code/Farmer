import { StyleSheet } from 'react-native';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';

export const styles = StyleSheet.create({
  headerBackground: {
    paddingBottom: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: moderateScale(24),
    backgroundColor: colors.CardContainer,
  },
  imageBackground: {
    resizeMode: 'cover',
    height: moderateScale(220),
  },
  headerTitle: {
    marginTop: verticalScale(52),
    marginBottom: verticalScale(4),
    fontSize: moderateScale(18),
    color: colors.black,
  },
  header: {
    alignItems: 'center',
    paddingBottom: moderateScale(20),
  },
  progressWrapper: {
    width: '92%',
    alignSelf: 'center',
  },
  additionalContactDetails: {
    backgroundColor: colors.ProfilesetupCardTitle,
    color: colors.Secondary,
    padding: moderateScale(16),
    fontWeight: '600',
    fontSize: scaledFontSize(14),
  },
  container: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
    // paddingBottom: moderateScale(40),
    backgroundColor: colors.CardContainer,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    // paddingTop: moderateScale(18),
    // paddingHorizontal: moderateScale(16),
    marginBottom: moderateScale(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  card2: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    paddingTop: moderateScale(18),
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateScale(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  infoIcon: { resizeMode: 'contain' },

  photoContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(60),
    backgroundColor: colors.ButtonColor + '1A',
  },
  profileImage: {
    borderRadius: moderateScale(60),
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderCircle: {
    borderColor: colors.black,
    borderWidth: moderateScale(2),
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    padding: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(60),
  },
  editIconWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(18),

    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: moderateScale(10),
    fontSize: moderateScale(14),
    color: colors.MediumGray2,
  },

  radioRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: moderateScale(5),
    paddingRight: moderateScale(60),
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOption2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: moderateScale(14),
  },

  radioSelected: {
    backgroundColor: colors.ButtonColor,
    borderColor: colors.ButtonColor,
  },
  radioLabel: {
    fontSize: moderateScale(12),
    marginLeft: moderateScale(5),
    color: colors.Neutrals100,
  },
  inputLabel: {
    fontSize: moderateScale(13),
    color: colors.Neutrals100,
    marginBottom: moderateScale(6),
    marginTop: moderateScale(8),
  },
  input: {
    // width: '100%',
    // marginBottom: moderateScale(8),
    paddingVertical: moderateScale(15),
  },
  submitWrapper: {
    marginTop: moderateScale(24),
    marginBottom: moderateScale(20),
  },
  submitButton: {
    height: moderateScale(56),
    borderRadius: moderateScale(12),
    backgroundColor: colors.ButtonColor,
  },
  footerContainer: {
    backgroundColor: colors.white,
    paddingTop: moderateScale(18),
    paddingHorizontal: moderateScale(16),
    width: '100%',
    borderBottomLeftRadius: moderateScale(10),
    borderBottomRightRadius: moderateScale(10),
  },
  educationContainer: { paddingBottom: moderateScale(20) },
  screenWrapper: {
    flex: 1,
  },
  imageBackground: {
    resizeMode: 'cover',
    height: moderateScale(220),
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  tooltipContent: {
    color: colors.white,
    padding: moderateScale(6),
  },
  tooltipStyle: {
    backgroundColor: colors.black,
    borderRadius: moderateScale(6),
    padding: moderateScale(8),
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  bottomGap: { paddingBottom: moderateScale(50) },
});
