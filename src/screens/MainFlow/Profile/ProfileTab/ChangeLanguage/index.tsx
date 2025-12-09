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
import { AppDispatch, RootState } from '../../../../../redux/store';
import { setLanguage } from '../../../../../redux/slices/languageSlice';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { styles } from './style';
import { Images } from '../../../../../assets/images';
import { ToggleOn, ToggleOff } from '../../../../../assets/icons';
import { colors } from '../../../../../themes/colors';
import {
  CommonButton,
  CommonText,
  GradientBackground,
  ScreenWrapper,
} from '../../../../../components';
import { moderateScale, scale } from '../../../../../utils/responsive';
import { getLanguage } from '../../../../../redux/slices/authSlice';

import { showToastable } from 'react-native-toastable';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import LanguageSelector from '../../../../../components/LanguageSelector';

type LanguageScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ChnageLanguage'
>;

const ChangeLanguageScreen = () => {
  const navigation = useNavigation<LanguageScreenNavigationProp>();
  const language = useSelector((state: RootState) => state.language.current);
  const { t, i18n } = useTranslation();

  // Specific Logic for Settings: Just Go Back
  const handleSettingsContinue = () => {
    navigation.goBack();
    // Or show a toast: showToastable({ message: 'Language updated!', status: 'success' });
  };

  return (
    <ScreenWrapper bgColor={colors.white}>
      {/* Pass currentLang so it pre-selects the user's active choice */}
      <GradientBackground
        style={styles.progressHeader}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        backButtonStyles={styles.bell}
      >
        <View style={styles.headerContainer}>
          <CommonText style={styles.headerTitle}>
            {t('profileScreen.changeLanguageTitle')}
          </CommonText>
        </View>
      </GradientBackground>
      <LanguageSelector
        mode="settings"
        initialLanguage={language}
        onContinue={handleSettingsContinue}
      />
    </ScreenWrapper>
  );
};

export default ChangeLanguageScreen;
