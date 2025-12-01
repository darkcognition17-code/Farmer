import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { fonts } from '../themes/fonts';
import CommonText from './CommonText';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../utils/responsive';
import { colors } from '../themes/colors';

interface ProfileCompletionCardProps {
  progress?: number; // percentage value (0–100)
  onPress?: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  progress = 40,
  onPress,
}) => {
  const radius = 20;
  const strokeWidth = 4;
  const size = radius * 2;
  const circumference = 2 * Math.PI * radius;

  const animatedValue = useRef(new Animated.Value(0)).current;

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      {/* Progress Circle */}
      <View
        style={[styles.circleContainer,{
          width: size + strokeWidth,
          height: size + strokeWidth,
          
        }]}
      >
        <Svg
          width={size + strokeWidth}
          height={size + strokeWidth}
          viewBox={`0 0 ${size + strokeWidth} ${size + strokeWidth}`}
        >
          {/* Background Circle */}
          <Circle
            stroke={colors.Neutrals100 + '40'}
            fill="none"
            cx={(size + strokeWidth) / 2}
            cy={(size + strokeWidth) / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />

          {/* Foreground (Animated) Circle */}
          <AnimatedCircle
            stroke={colors.Neutrals100}
            fill="none"
            cx={(size + strokeWidth) / 2}
            cy={(size + strokeWidth) / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset as unknown as number}
            strokeLinecap="round"
            // 👇 Add rotation to start from top (12 o’clock)
            transform={`rotate(-90 ${(size + strokeWidth) / 2} ${
              (size + strokeWidth) / 2
            })`}
          />
        </Svg>

        {/* Percentage Text */}
        <Animated.Text style={styles.percentageText}>
          {Math.round(progress)}%
        </Animated.Text>
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <CommonText style={styles.title}>
          Please complete your profile details
        </CommonText>
        <View>
          <CommonText style={styles.link}>Click here to complete</CommonText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileCompletionCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white + '4D',
    borderColor: colors.white + 'A6',
    borderWidth: 1,
    paddingHorizontal: moderateScale(16),
    width: '100%',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(20),
    marginTop: verticalScale(19),
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: moderateScale(12),
    backgroundColor: colors.transparent,
  },
  title: {
    fontSize: scaledFontSize(14),
    color: colors.Neutrals100,
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
  link: {
    fontSize: scaledFontSize(10),
    fontWeight: '500',
    color: colors.Neutrals300,
    marginTop: verticalScale(2),
    fontFamily: fonts.medium,
  },
  percentageText: {
    position: 'absolute',
    fontSize: scaledFontSize(10),
    color: colors.Neutrals100,
    fontWeight: '500',
  },
});
