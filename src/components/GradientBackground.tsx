import React from 'react';
import {
  ImageBackground,
  ImageStyle,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Images } from '../assets/images';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  imageStyle,
}) => {
  return (
    <ImageBackground
      source={Images.GrBg}
      style={style}
      imageStyle={imageStyle}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
};

export default GradientBackground;
