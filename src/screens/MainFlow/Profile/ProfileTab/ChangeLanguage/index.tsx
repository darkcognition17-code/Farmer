import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  Animated,
  ImageBackground,
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
import { ToggleOn, ToggleOff, BackButton } from '../../../../../assets/icons';
import { colors } from '../../../../../themes/colors';
import {
  CommonButton,
  CommonText,
  ScreenWrapper,
} from '../../../../../components';
import { moderateScale, scale } from '../../../../../utils/responsive';
import { getLanguage } from '../../../../../redux/slices/authSlice';
import Loader from '../../../../../components/Loader';

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

  const [deviceLanguage, setDeviceLanguage] = useState<string | undefined>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>();
  const [error, setError] = useState<Boolean>(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [languagesArray, setLanguages] = useState<[]>([]);
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);

  const buttonAnimatedValue = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (languagesArray.length > 0) {
      setAnimatedValues(languagesArray.map(() => new Animated.Value(0.5)));
    }
  }, [languagesArray]);

  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);

  const getLanguageImage = id => {
    switch (id) {
      case 'en':
        return Images.English;
      case 'hi':
        return Images.Hindi;
      case 'pa':
        return Images.Punjabi;
      case 'gu':
        return Images.Gujarati;
      case 'mr':
        return Images.Marathi;
      case 'te':
        return Images.Telugu;
      case 'or':
        return Images.Odia;
      default:
        return null; // or a default image
    }
  };

  useEffect(() => {
    if (animatedValues.length === 0) return;

    const cardAnimations = animatedValues.map(anim =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    );

    const buttonAnimation = Animated.timing(buttonAnimatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    });

    Animated.parallel([...cardAnimations, buttonAnimation]).start();
  }, [animatedValues]);

  const getLang = async () => {
    await getSupportedLanguages();
    const locales = RNLocalize.getLocales();
    const detectedLang = locales[0].languageCode;

    setDeviceLanguage(detectedLang);
  };

  useEffect(() => {
    getLang();
  }, []);

  const getSupportedLanguages = async () => {
    setLoading(true);
    // const timeout = setTimeout(() => {
    //   setLoading(false); // stop loading if API doesn’t respond in 15s
    //   showToastable({ message: t('common.networkTimeout'), status: 'danger' });
    // }, 15000);
    try {
      const response = await dispatch(
        getLanguage({
          payload: {},
          headers: {},
        }),
      ).unwrap();
      setLoading(false);
      // clearTimeout(timeout);
      //console.log('Langauges--------------->', response);

      if (response.statusCode == 200) {
        // const finalLanguages = mergeLanguages(
        //   response?.data?.languages,
        //   languages,
        // );

        setLanguages(response?.data?.languages);
        // navigation.navigate(screenNames.CreatePasswordScreen,{userName: userName});
      }
    } catch (err: any) {
      setLoading(false);
      // clearTimeout(timeout);
      // console.error('Langauage API error:', err);
    }
  };

  const handleLanguageSelect = (lang: string) => {
    const supportedLangs = languagesArray.map(l => l.code);
    const finalLang = supportedLangs.includes(lang) ? lang : 'en';
    setSelectedLanguage(finalLang);
    setError(false);
  };

  const handleContinue = async () => {
    if (!selectedLanguage) {
      setError(true);
      return;
    }
    setError(false);
    i18n.changeLanguage(selectedLanguage);
    dispatch(setLanguage(selectedLanguage));

    navigation.goBack();
  };

  // Specific Logic for Settings: Just Go Back
  const handleSettingsContinue = () => {
    navigation.goBack();
    // Or show a toast: showToastable({ message: 'Language updated!', status: 'success' });
  };

  return (
    // <ScreenWrapper bgColor={colors.transparent}>
    //   <Loader visible={loading} />
    //   <ImageBackground
    //     source={Images.GrBg}
    //     style={styles.progressHeader}
    //     resizeMode="cover"
    //   >
    //     <View style={styles.headerContainer}>
    //       <TouchableOpacity
    //         onPress={() => navigation.goBack()}
    //         activeOpacity={0.8}
    //         style={styles.bell}
    //       >
    //         <BackButton width={moderateScale(10)} height={moderateScale(15)} />
    //       </TouchableOpacity>
    //       <CommonText style={styles.headerTitle}>
    //         {t('profileScreen.changeLanguageTitle')}
    //       </CommonText>
    //     </View>
    //   </ImageBackground>
    //   <View style={styles.container}>
    //     {!loading && (
    //       <View style={styles.gridContainer}>
    //         <View>
    //           <CommonText style={styles.title}>
    //             {t('mobileRegister.languageChoose')}
    //           </CommonText>

    //           <View style={styles.grid}>
    //             {languagesArray.map((lang, index) => {
    //               const translateY =
    //                 animatedValues[index]?.interpolate({
    //                   inputRange: [0, 1],
    //                   outputRange: [50, 0],
    //                 }) || 0;

    //               const opacity =
    //                 animatedValues[index]?.interpolate({
    //                   inputRange: [0, 1],
    //                   outputRange: [0, 1],
    //                 }) || 1;

    //               return (
    //                 <Animated.View
    //                   key={lang.code}
    //                   style={[{ opacity, transform: [{ translateY }] }]}
    //                 >
    //                   <TouchableOpacity
    //                     style={[
    //                       styles.langCard,
    //                       selectedLanguage === lang.code &&
    //                         styles.langCardSelected,
    //                     ]}
    //                     onPress={() => handleLanguageSelect(lang.code)}
    //                     activeOpacity={0.7}
    //                   >
    //                     {deviceLanguage === lang.code && (
    //                       <View style={styles.deviceLangTag}>
    //                         <CommonText style={styles.deviceLangText}>
    //                           {t('deviceLanguage')}
    //                         </CommonText>
    //                       </View>
    //                     )}
    //                     <View style={styles.langRow}>
    //                       {selectedLanguage === lang.code ? (
    //                         <ToggleOn width={scale(22)} height={scale(22)} />
    //                       ) : (
    //                         <ToggleOff width={scale(22)} height={scale(22)} />
    //                       )}
    //                       <CommonText style={styles.langLabel}>
    //                         {lang.name}
    //                       </CommonText>
    //                     </View>
    //                     <Image
    //                       source={getLanguageImage(lang.code)}
    //                       style={styles.langImage}
    //                       resizeMode="contain"
    //                     />
    //                   </TouchableOpacity>
    //                 </Animated.View>
    //               );
    //             })}
    //           </View>
    //         </View>
    //       </View>
    //     )}
    //   </View>
    //   <Animated.View
    //     style={{
    //       opacity: buttonAnimatedValue.interpolate({
    //         inputRange: [0, 1],
    //         outputRange: [0, 1],
    //       }),
    //       transform: [
    //         {
    //           translateY: buttonAnimatedValue.interpolate({
    //             inputRange: [0, 1],
    //             outputRange: [50, 0],
    //           }),
    //         },
    //       ],
    //     }}
    //   >
    //     <CommonButton
    //       title={'Save'}
    //       disabled={!selectedLanguage}
    //       onPress={handleContinue}
    //       style={styles.continueBtn}
    //     />
    //   </Animated.View>
    // </ScreenWrapper>
    <ScreenWrapper bgColor={colors.white}>
      {/* Pass currentLang so it pre-selects the user's active choice */}
      <ImageBackground
        source={Images.GrBg}
        style={styles.progressHeader}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.bell}
          >
            <BackButton width={moderateScale(10)} height={moderateScale(15)} />
          </TouchableOpacity>
          <CommonText style={styles.headerTitle}>
            {t('profileScreen.changeLanguageTitle')}
          </CommonText>
        </View>
      </ImageBackground>
      <LanguageSelector
        mode="settings"
        initialLanguage={language}
        onContinue={handleSettingsContinue}
      />
    </ScreenWrapper>
  );
};

export default ChangeLanguageScreen;
