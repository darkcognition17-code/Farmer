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
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.black + '66',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
    padding: moderateScale(16),
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: moderateScale(12),
  },
  kisaniItem: {
    borderWidth: 1,
    borderColor: colors.Neutrals700,
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  documentImagePlaceholder: {
    position: 'absolute',
    top: 0,
    right: moderateScale(5),
    borderRadius: moderateScale(8),
    backgroundColor: colors.error,
  },
  kisaniName: {
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
  docItem: {
    paddingVertical: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.Neutrals700,
  },
  progressHeader: {
    paddingBottom: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: moderateScale(24),
  },
  progressContent: {
    width: '92%',
    alignSelf: 'center',
  },
  progressText: {
    fontSize: scaledFontSize(20),
    color: colors.Neutrals100,
  },
  progressPercent: {
    fontSize: scaledFontSize(18),
    fontWeight: 'bold',
  },
  progressStepsText: {
    fontSize: scaledFontSize(14),
    color: colors.Neutrals300,
  },
  addDetailsText: {
    fontSize: scaledFontSize(14),
    color: colors.Neutrals300,
    marginTop: 5,
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 5, // Thinner bar
    backgroundColor: colors.ButtonDisableColor,
    borderRadius: 2.5,
    overflow: 'hidden',
  },

  // --- General Content Styles ---
  contentContainer: {
    paddingHorizontal: moderateScale(16),
    // paddingBottom: 20, // Padding before the final button area
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: moderateScale(14),
    color: colors.Neutrals100,
    fontWeight: '500',
  },
  subHeader: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.DarkGray,
  },
  boldText: {
    fontWeight: '600',
    fontSize: scaledFontSize(18),
  },
  farmerDetailsTitle: {
    backgroundColor: colors.ProfilesetupCardTitle,
    color: colors.Secondary,
    padding: moderateScale(16),
    fontWeight: '600',
    fontSize: scaledFontSize(14),
  },
  requiredAsterisk: {
    color: colors.error,
    fontSize: 16,
  },
  inputLabel: {
    marginBottom: 8,
    marginTop: moderateScale(10),
    fontSize: moderateScale(14),
    color: colors.Neutrals100,
    fontWeight: '500',
  },
  inputStyle: {
    height: 50,
    borderRadius: 8,
    borderColor: colors.ButtonDisableColor,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  // --- Dropdown Styles ---

  dropdownText: {
    fontSize: 16,
    color: colors.DarkGray,
  },

  documentDropdown: {
    marginBottom: 15,
  },
  verificationHint: {
    marginBottom: 15,
    fontFamily: fonts.regular,
    color: colors.Neutrals300,
    fontSize: scaledFontSize(14),
  },
  // --- File Upload Styles ---
  fileUploadsContainer: {
    marginTop: moderateScale(12),
    // marginBottom: moderateScale(10),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  fileUploadTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
    marginBottom: 5,
  },

  fileUploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.MediumGray,
    textAlign: 'center',
  },

  // --- Gender Selector Styles ---
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  genderFemaleOption: {
    justifyContent: 'space-between', // Default alignment
  },

  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.DarkGray,
  },
  genderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  // --- Button Styles ---
  buttonWrapper: {
    // paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: verticalScale(10),
    // Optional: Add shadow/elevation to make the button look floating if needed
  },
  continueButton: {
    height: 55,
    borderRadius: 10, // Match the button shape in the image
    backgroundColor: colors.ButtonColor, // Primary orange color
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white + '26', // optional fade for better contrast
  },
  inputContainer: {
    paddingLeft: scale(40),
    paddingVertical: verticalScale(16),
    fontSize: scaledFontSize(14),
  },
  userName: {
    // gap: moderateScale(2),
    flexDirection: 'row',
  },
  flagIcon: {
    // height: verticalScale(12),
    // width: scale(12),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  uploadedImage: {
    width: scale(168),
    height: scale(120),
    borderRadius: moderateScale(8),
  },
  screenWrapper: {
    flex: 1,
  },
  headerTitle: {
    marginTop: verticalScale(52),
    marginBottom: verticalScale(4),
    fontSize: moderateScale(18),
    color: colors.black,
  },
  farmerDetailsContainer: {
    backgroundColor: colors.white,
    // width: '100%',
    // paddingHorizontal: moderateScale(16),
    marginHorizontal: moderateScale(16),
    // paddingTop: moderateScale(30),
    borderRadius: moderateScale(14),
    borderWidth: 0.1,
  },
  nameInputContainer: {
    marginHorizontal: moderateScale(16),
  },
  fullNameLabel: {
    marginTop: verticalScale(20),
  },
  genderLabel: {
    marginTop: verticalScale(0),
  },
  bottomGap: { paddingBottom: moderateScale(50) },
});
