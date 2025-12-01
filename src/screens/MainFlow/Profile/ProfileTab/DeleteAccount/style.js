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

  contentContainer: {
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(16),
    padding: moderateScale(20),
    borderRadius: moderateScale(24),
    gap: verticalScale(12),
  },
  containerTitle: {
    fontSize: scaledFontSize(24),
    color: colors.Neutrals010,
    fontWeight: '600',
    fontFamily: fonts.semiBold,
    textAlign: 'left',
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

  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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

  deleteButton: {
    backgroundColor: colors.ButtonColor,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: moderateScale(25),
    marginBottom: moderateScale(25),
  },
  profileImage: {
    width: moderateScale(96),
    height: moderateScale(96),
    borderRadius: moderateScale(12),
  },
  cameraIcon: {
    position: 'absolute',
    bottom: moderateScale(-10),
    right: moderateScale(100),
    backgroundColor: colors.Secondary,
    borderColor: colors.white,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(20),
    padding: moderateScale(6),
  },
  userOrangeIcon: {
    marginLeft: moderateScale(5),
  },
  label: {
    marginBottom: moderateScale(8),
    fontSize: scaledFontSize(14),
    color: colors.Neutrals100,
  },
  inputField: {
    paddingVertical: moderateScale(17),
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(16),
    color: colors.Neutrals010,
  },
  mobileInputField: {
    paddingVertical: moderateScale(17),
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(16),
    color: colors.Neutrals010,
    paddingLeft: moderateScale(94),
  },
  indianFlagIcon: {
    marginLeft: moderateScale(5),
  },
  buttonWrapper: {
    marginTop: moderateScale(30),
  },
  saveButton: {
    paddingVertical: moderateScale(17),
  },
});
