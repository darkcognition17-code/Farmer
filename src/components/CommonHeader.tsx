import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, ImageStyle, TextStyle, Platform } from 'react-native';
import { GradientBackground, CommonText, CommonBackButton } from '.';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale, scaledFontSize } from '../utils/responsive';
import { colors } from '../themes/colors';
import { fonts } from '../themes/fonts';

interface CommonHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  gradientImageStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
  backButtonStyles?: StyleProp<ViewStyle>;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  children,
  containerStyle,
  gradientImageStyle,
  titleStyle,
  backButtonStyles,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <GradientBackground
      imageStyle={gradientImageStyle}
      style={[styles.gradientBackground, containerStyle]}
    >
      {showBackButton && (
        <CommonBackButton
          onPress={handleBackPress}
          style={[styles.backButton, backButtonStyles]}
        />
      )}
      {title && (
        <View style={styles.titleContainer}>
          <CommonText style={[styles.title, titleStyle]}>
            {title}
          </CommonText>
        </View>
      )}
      {children}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    paddingTop: verticalScale(Platform.OS === 'ios' ? 60 : 20),
    paddingBottom: moderateScale(20),
    alignItems: 'center',
    borderRadius: moderateScale(24),
  },
  backButton: {
    position: 'absolute',
    left: moderateScale(20),
    top: moderateScale(Platform.OS === 'ios' ? 55 : 25), // Adjust as needed
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    color: colors.Neutrals010,
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: scaledFontSize(18),
  },
});

export default CommonHeader;
