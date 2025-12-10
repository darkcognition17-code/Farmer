import React from 'react';
import {
  ImageBackground,
  ImageStyle,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Images } from '../assets/images';
import CommonBackButton from './CommonBackButton'; // Import CommonBackButton
import { moderateScale } from '../utils/responsive';
import { colors } from '../themes/colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  showBackButton?: boolean; // New prop
  onBackPress?: () => void; // New prop
  backButtonStyles?: StyleProp<ViewStyle>; // Optional style for the back button container
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  imageStyle,
  showBackButton = false,
  onBackPress,
  backButtonStyles,
}) => {
  return (
    <ImageBackground
      source={Images.GrBg}
      style={style}
      imageStyle={imageStyle}
      resizeMode="cover"
    >
      {showBackButton && onBackPress && (
        <CommonBackButton
          onPress={onBackPress}
          style={backButtonStyles ?? styles.defaultBackButton}
        />
      )}
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  defaultBackButton: {
    borderRadius: moderateScale(9),
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    paddingLeft: moderateScale(12),
    paddingRight: moderateScale(14),
    position: 'absolute',
    left: moderateScale(20),
    top: moderateScale(55), // Default top position, adjust as needed or make prop
  },
});

export default GradientBackground;
