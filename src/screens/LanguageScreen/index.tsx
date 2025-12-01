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
import Loader from '../../components/Loader';
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

  const [deviceLanguage, setDeviceLanguage] = useState<string>('en');
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
  useEffect(() => {
    const locales = RNLocalize.getLocales();
    getSupportedLanguages();
    if (locales && locales.length > 0) {
      const detectedLang = locales[0].languageCode;
      const supportedLangs = languagesArray.map(l => l.id);
      const finalLang = supportedLangs.includes(detectedLang)
        ? detectedLang
        : 'en';
      setDeviceLanguage(finalLang);
    }
  }, []);

  const mergeLanguages = (apiResponse, localLanguages) => {
    return apiResponse.map(apiLang => {
      const local = localLanguages.find(l => l.id === apiLang.code);
      return {
        ...apiLang, // from API: code, name
        ...local, // from local: label, image
      };
    });
  };
  const getSupportedLanguages = async () => {
    setLoading(true);
    // const timeout = setTimeout(() => {
    //   setLoading(false); // stop loading if API doesn’t respond in 15s
    //   showToastable({ message: 'Network timeout', status: 'danger' });
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
      clearTimeout(timeout);
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

    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    try {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        //console.log('Location permission granted');
      } else {
        //console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }

    navigation.navigate(screenNames.Auth);
  };

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
    // <ScreenWrapper bgColor={colors.GradientColor}>
    //   <Loader visible={loading} />
    //   <FastImage
    //     source={Images.SplashGif}
    //     style={styles.video}
    //     resizeMode={FastImage.resizeMode.cover}
    //   />
    //   {/* <StatusBar barStyle="dark-content" backgroundColor={colors.Primary950} /> */}
    //   <LinearGradient
    //     style={styles.container}
    //     colors={[colors.white + '88', colors.transparent]}
    //   >
    //     {!loading && (
    //       <View style={styles.gridContainer}>
    //         <View>
    //           <CommonText style={styles.title} variant="title">
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

    //           <Animated.View
    //             style={{
    //               opacity: buttonAnimatedValue.interpolate({
    //                 inputRange: [0, 1],
    //                 outputRange: [0, 1],
    //               }),
    //               transform: [
    //                 {
    //                   translateY: buttonAnimatedValue.interpolate({
    //                     inputRange: [0, 1],
    //                     outputRange: [50, 0],
    //                   }),
    //                 },
    //               ],
    //             }}
    //           >
    //             <CommonButton
    //               title={t('continue')}
    //               disabled={!selectedLanguage}
    //               onPress={handleContinue}
    //               style={styles.continueBtn}
    //             />
    //           </Animated.View>
    //         </View>
    //       </View>
    //     )}
    //   </LinearGradient>
    // </ScreenWrapper>
    <ScreenWrapper bgColor={colors.GradientColor}>
      <LanguageSelector
        mode="onboarding"
        onContinue={handleOnboardingContinue}
      />
    </ScreenWrapper>
  );
};

export default LanguageScreen;
