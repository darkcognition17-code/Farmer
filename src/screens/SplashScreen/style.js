import { StyleSheet, Dimensions } from 'react-native';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../utils/responsive';
import { colors } from '../../themes/colors';
import { fonts } from '../../themes/fonts';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width * 0.9;
const SLIDER_HEIGHT = verticalScale(58);
const KNOB_SIZE = scale(45);

export const styles = StyleSheet.create({
  container: { flex: 1 },
  video: { ...StyleSheet.absoluteFillObject },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    alignItems: 'center',
    height: '35%',
  },
  appLogo: {
    height: scale(74),
    width: scale(74),
    marginTop: verticalScale(60),
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    borderRadius: moderateScale(10),
    backgroundColor: colors.white + '22',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: verticalScale(80),
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: SLIDER_HEIGHT / 2,
  },
  sliderLabel: {
    position: 'absolute',
    alignSelf: 'center',
    color: colors.white,
    fontSize: scaledFontSize(16),
    fontFamily: fonts.medium,
    fontWeight: '500',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: moderateScale(10),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    left: moderateScale(10),
  },
  knobArrow: {
    fontSize: scaledFontSize(20),
    fontWeight: 'bold',
    color: colors.ButtonColor,
    alignSelf: 'center',
    textAlignVertical: 'center',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black, // optional: dark background while loading
  },
});
