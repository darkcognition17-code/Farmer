import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375; // iPhone X width
const guidelineBaseHeight = 812; // iPhone X height

export const scale = (size: number): number =>
  (width / guidelineBaseWidth) * size;

export const verticalScale = (size: number): number =>
  (height / guidelineBaseHeight) * size;

export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;

export const scaledFontSize = (size: number): number => {
  const newSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
