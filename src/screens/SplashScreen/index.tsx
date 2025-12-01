import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { screenNames } from '../../navigation/screenNames';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Images } from '../../assets/images';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../themes/colors';
import { BlurView } from '@react-native-community/blur';
import { useTranslation } from 'react-i18next';
import { fonts } from '../../themes/fonts';
import FastImage from 'react-native-fast-image';
import { RightArrow } from '../../assets/icons';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width * 0.9;
const SLIDER_HEIGHT = verticalScale(58);
const KNOB_SIZE = scale(45);

const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const language = useSelector((state: RootState) => state.language.current);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const translateX = new Animated.Value(0);
  const arrowTranslateX = useRef(new Animated.Value(scale(-10))).current;
  const arrowOpacity = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const isHydrated = useSelector((s: any) => s._persist?.rehydrated);
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(arrowTranslateX, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(arrowOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1000),
        Animated.parallel([
          Animated.timing(arrowTranslateX, {
            toValue: scale(10),
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(arrowOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(arrowTranslateX, {
          toValue: scale(-10),
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  const goNext = () => {
    // if (!isHydrated) return;
    if (!language) {
      setTimeout(() => {
        navigation.replace(screenNames.Language);
      }, 700);
    } else if (!accessToken) {
      setTimeout(() => {
        navigation.replace(screenNames.Auth);
      }, 700);
    } else {
      //console.log('call-------------------');

      setTimeout(() => {
        navigation.replace(screenNames.App);
      }, 1000);
    }
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate(event => {
      const newX = Math.min(
        Math.max(0, event.translationX),
        SLIDER_WIDTH - KNOB_SIZE,
      );
      translateX.setValue(newX);
    })
    .onEnd(() => {
      translateX.stopAnimation(value => {
        if (value > SLIDER_WIDTH - KNOB_SIZE - scale(20)) {
          if (!isHydrated) {
            //console.log('Redux not hydrated yet');
            return;
          }
          goNext();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      });
    });

  // Interpolated progress fill
  const progressWidth = translateX.interpolate({
    inputRange: [0, SLIDER_WIDTH - KNOB_SIZE],
    outputRange: [KNOB_SIZE, SLIDER_WIDTH],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FastImage
        source={Images.SplashGif}
        style={styles.video}
        resizeMode={FastImage.resizeMode.cover}
      />

      {/* Overlay content */}
      <View style={styles.overlay}>
        <LinearGradient
          colors={[
            colors.white,
            colors.white + 'EE',
            colors.white + '55',
            colors.white + '00',
          ]}
          style={styles.gradient}
        >
          <Image source={Images.AppLogo} style={styles.appLogo} />
        </LinearGradient>

        {/* Swipe to Get Started */}
        <View style={styles.sliderContainer}>
          {/* <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          /> */}

          {/* Label */}
          <CommonText style={styles.sliderLabel}>
            {t('splash.getStarted')}
          </CommonText>

          {/* Knob */}
          <GestureDetector gesture={swipeGesture}>
            <Animated.View
              style={[styles.knob, { transform: [{ translateX: translateX }] }]}
            >
              <Animated.View
                style={[
                  {
                    opacity: arrowOpacity,
                    transform: [{ translateX: arrowTranslateX }],
                  },
                ]}
              >
                <RightArrow height={14} width={14} />
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </View>
  );
};

import { styles } from './style';
import { CommonText } from '../../components';

export default SplashScreen;
