import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { setLanguage } from '../../redux/slices/languageSlice';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { useNavigation } from '@react-navigation/native';
import { styles } from './style';
import { Images } from '../../assets/images';
import { ToggleOn, ToggleOff } from '../../assets/icons';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { screenNames } from '../../navigation/screenNames';
import { colors } from '../../themes/colors';
import { CommonButton, CommonText, ScreenWrapper } from '../../components';
import { scale } from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';
import { getLanguage } from '../../redux/slices/authSlice';
import { Buffer } from 'buffer'; // Available in React Native via polyfill

import axios from 'axios';
import Config from 'react-native-config';
import { endpoints } from '../../utils/endpoints';
import FastImage from 'react-native-fast-image';
import { showToastable } from 'react-native-toastable';
import LanguageSelector from '../../components/LanguageSelector';

type LanguageScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Language'
>;

const LanguageScreen = () => {
  const navigation = useNavigation<LanguageScreenNavigationProp>();
  const language = useSelector((state: RootState) => state.language.current);
  const { t, i18n } = useTranslation();

  // Specific Logic for Onboarding: Request Location -> Navigate Auth
  const handleOnboardingContinue = async () => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    try {
      const result = await request(permission);
      console.log('Permission result:', result);
    } catch (error) {
      console.error('Permission error:', error);
    }

    navigation.navigate(screenNames.Auth);
  };

  return (
    <ScreenWrapper bgColor={colors.GradientColor}>
      <LanguageSelector
        mode="onboarding"
        onContinue={handleOnboardingContinue}
      />
    </ScreenWrapper>
  );
};

export default LanguageScreen;
