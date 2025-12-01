import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { setLanguage } from '../redux/slices/languageSlice';
import { getLanguage } from '../redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../assets/images';
import { ToggleOn, ToggleOff } from '../assets/icons';
import Loader from './Loader';
import CommonText from './CommonText';
import CommonButton from './CommonButton';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../utils/responsive'; // Adjust path as needed
import { fonts } from '../themes/fonts';
import { colors } from '../themes/colors';

const { width } = Dimensions.get('window');
const cardMargin = scale(16);
const cardWidth = (width - cardMargin * 5) / 2;

interface LanguageSelectorProps {
  mode: 'onboarding' | 'settings'; // distinct modes
  onContinue: () => void; // Parent defines what happens next
  initialLanguage?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  mode,
  onContinue,
  initialLanguage,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [deviceLanguage, setDeviceLanguage] = useState<string>('en');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    initialLanguage || '',
  );
  const [languagesArray, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Animation Refs
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);
  const buttonAnimatedValue = useRef(new Animated.Value(0.5)).current;

  // --- Logic 1: Image Helper ---
  const getLanguageImage = (id: string) => {
    const map: Record<string, any> = {
      en: Images.English,
      hi: Images.Hindi,
      pa: Images.Punjabi,
      gu: Images.Gujarati,
      mr: Images.Marathi,
      te: Images.Telugu,
      or: Images.Odia,
    };
    return map[id] || null;
  };

  // --- Logic 2: Initialization & Fetching ---
  useEffect(() => {
    const locales = RNLocalize.getLocales();
    if (locales?.length > 0) setDeviceLanguage(locales[0].languageCode);

    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getLanguage({ payload: {}, headers: {} }),
      ).unwrap();
      console.log('response.data', response.data);
      if (response?.statusCode === 200) {
        setLanguages(response?.data?.languages || []);
      }
    } catch (err) {
      console.error('Language API error:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic 3: Animations ---
  useEffect(() => {
    if (languagesArray.length === 0) return;
    setAnimatedValues(languagesArray.map(() => new Animated.Value(0.5)));
  }, [languagesArray]);

  useEffect(() => {
    if (animatedValues.length === 0) return;
    const cardAnimations = animatedValues.map(
      anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }), // optimized
    );
    const buttonAnimation = Animated.timing(buttonAnimatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    });
    Animated.parallel([...cardAnimations, buttonAnimation]).start();
  }, [animatedValues]);

  // --- Logic 4: Selection Handler ---
  const handleSelect = (langCode: string) => {
    const supported = languagesArray.map(l => l.code);
    const final = supported.includes(langCode) ? langCode : 'en';
    setSelectedLanguage(final);

    // Immediate redux update (safe for both screens)
    i18n.changeLanguage(final);
    dispatch(setLanguage(final));
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader visible={loading} />

      {/* Conditionally render Splash Video only for Onboarding */}
      {mode === 'onboarding' && (
        <FastImage
          source={Images.SplashGif}
          style={styles.video}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}

      <LinearGradient
        style={styles.container}
        // Settings gets a simpler background, Onboarding gets the gradient overlay
        colors={
          mode === 'onboarding'
            ? [colors.white + '88', colors.transparent]
            : [colors.white, colors.white]
        }
      >
        <View style={styles.gridContainer}>
          <CommonText style={styles.title} variant="title">
            {t('mobileRegister.languageChoose')}
          </CommonText>

          <View style={styles.grid}>
            {languagesArray.map((lang, index) => {
              const translateY =
                animatedValues[index]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }) || 0;
              const opacity =
                animatedValues[index]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }) || 1;

              return (
                <Animated.View
                  key={lang.code}
                  style={[{ opacity, transform: [{ translateY }] }]}
                >
                  <TouchableOpacity
                    style={[
                      styles.langCard,
                      selectedLanguage === lang.code && styles.langCardSelected,
                    ]}
                    onPress={() => handleSelect(lang.code)}
                    activeOpacity={0.7}
                  >
                    {deviceLanguage === lang.code && (
                      <View style={styles.deviceLangTag}>
                        <CommonText style={styles.deviceLangText}>
                          {t('deviceLanguage')}
                        </CommonText>
                      </View>
                    )}
                    <View style={styles.langRow}>
                      {selectedLanguage === lang.code ? (
                        <ToggleOn width={scale(22)} height={scale(22)} />
                      ) : (
                        <ToggleOff width={scale(22)} height={scale(22)} />
                      )}
                      <CommonText style={styles.langLabel}>
                        {lang.name}
                      </CommonText>
                    </View>
                    <Image
                      source={getLanguageImage(lang.code)}
                      style={styles.langImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          <Animated.View
            style={{
              opacity: buttonAnimatedValue, // simplified interpolation
              transform: [
                {
                  translateY: buttonAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            }}
          >
            <CommonButton
              title={t('continue')}
              disabled={!selectedLanguage}
              onPress={onContinue}
              style={styles.continueBtn}
            />
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default LanguageSelector;

const styles = StyleSheet.create({
  // --- Layout Containers ---
  container: {
    flex: 1,
    // Background color is handled via props/logic, but alignment stays here
    justifyContent: 'center',
  },

  // --- Onboarding Specific ---
  video: {
    ...StyleSheet.absoluteFillObject,
    // This belongs here because the component conditionally renders the video
  },

  // --- Text & Headings ---
  title: {
    fontSize: scaledFontSize(24),
    fontWeight: '600',
    color: colors.Neutrals100, // or dynamic based on theme if needed
    fontFamily: fonts.semiBold,
    marginLeft: moderateScale(18),
    marginBottom: moderateScale(20),
  },

  // --- Grid & Cards ---
  gridContainer: {
    backgroundColor: colors.white,
    borderRadius: scale(32),
    paddingTop: verticalScale(30),
    marginHorizontal: moderateScale(16),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(16),
  },
  langCard: {
    width: cardWidth,
    height: verticalScale(94),
    borderWidth: scale(1),
    borderColor: colors.Neutrals900,
    borderRadius: scale(12),
    marginBottom: verticalScale(11),
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  langCardSelected: {
    borderColor: colors.ButtonColor,
    borderWidth: moderateScale(1.5),
  },

  // --- Card Internals ---
  langRow: {
    marginTop: verticalScale(20),
    flexDirection: 'row',
    marginLeft: moderateScale(10),
    alignItems: 'center',
  },
  langLabel: {
    fontSize: scaledFontSize(15),
    fontFamily: fonts.regular,
    fontWeight: '400',
    marginLeft: moderateScale(10),
  },
  langImage: {
    width: scale(70),
    height: scale(60),
    position: 'absolute',
    bottom: verticalScale(-5),
    right: scale(-5),
  },

  // --- Badges ---
  deviceLangTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.LanguageCardBackground,
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(6),
  },
  deviceLangText: {
    fontSize: scaledFontSize(10),
    color: colors.ButtonColor,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: fonts.medium,
  },

  // --- Button ---
  continueBtn: {
    borderRadius: scale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    marginBottom: verticalScale(28),
    top: moderateScale(10),
    width: '91%',
    alignSelf: 'center',
  },
});
