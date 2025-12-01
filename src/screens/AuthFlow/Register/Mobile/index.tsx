import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import {
  User,
  Lock,
  EyeOpen,
  EyeClosed,
  TickOn,
  BackButton,
} from '../../../../assets/icons';
import { moderateScale, scale } from '../../../../utils/responsive';
import { colors } from '../../../../themes/colors';
import {
  CommonButton,
  CommonInput,
  CommonText,
  ScreenWrapper,
} from '../../../../components';
import { styles } from './style';
import { screenNames } from '../../../../navigation/screenNames';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../../navigation/authNavigator';
import { Images } from '../../../../assets/images';
import {
  logout,
  sendOtpSignup,
  setTokens,
} from '../../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../redux/store';
import Loader from '../../../../components/Loader';
import { MOBILE_REGEX } from '../../../../utils/regex';
import { showToastable } from 'react-native-toastable';
import FastImage from 'react-native-fast-image';

type MobileRegisterRouteProp = RouteProp<AuthStackParamList, 'MobileOtp'>;
type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'MobileRegister'
>;

const MobileRegister = () => {
  const navigation = useNavigation<NavigationProp>();
  const { params } = useRoute<MobileRegisterRouteProp>();

  const { t } = useTranslation();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureText, setSecureText] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (mobile.length > 0 && mobile.length < 10) {
      setError(t('mobileRegister.invalidMobileNumber')); // or a custom message
    } else {
      setError('');
    }
  }, [mobile]);

  const handleOTP = async () => {
    if (isFormValid) {
      setLoading(true);
      // const timeout = setTimeout(() => {
      //   setLoading(false); // stop loading if API doesn’t respond in 15s
      //   showToastable({
      //     message: t('common.networkTimeout'),
      //     status: 'danger',
      //   });
      // }, 15000);
      try {
        const response = await dispatch(
          sendOtpSignup({
            phoneNumber: mobile,
            role: 'farmer',
            type: 'signup',
          }),
        ).unwrap(); // ✅ unwrap to get API response directly
        setLoading(false);
        // clearTimeout(timeout);
        if (response.statusCode == 200 && response.data?.token) {
          // dispatch(
          //   setTokens({
          //     accessToken: response.data.token ?? '',
          //     refreshToken: response.data.token ?? '',
          //   }),
          // );
          navigation.navigate(screenNames.MobileOtp, {
            mobile: mobile.toString(),
            from: 'signup',
            tempToken: response.data.token,
          });
        }
      } catch (err: any) {
        setLoading(false);
        // clearTimeout(timeout);
        // console.error('OTP API error:', err);
      }
    }
  };

  const forgotOTP = async () => {
    if (isFormValid) {
      setLoading(true);
      // const timeout = setTimeout(() => {
      //   setLoading(false); // stop loading if API doesn’t respond in 15s
      //   showToastable({
      //     message: t('common.networkTimeout'),
      //     status: 'danger',
      //   });
      // }, 15000);
      try {
        const response = await dispatch(
          sendOtpSignup({
            phoneNumber: mobile,
            role: 'farmer',
            type:
              params?.from === 'forgotUser'
                ? 'forgot-user-id'
                : 'forgot-password',
          }),
        ).unwrap(); // ✅ unwrap to get API response directly
        setLoading(false);
        // clearTimeout(timeout);
        if (response.statusCode == 200 && response.data?.token) {
          // dispatch(
          //   setTokens({
          //     accessToken: response.data.token ?? '',
          //     refreshToken: response.data.token ?? '',
          //   }),
          // );
          navigation.navigate(screenNames.MobileOtp, {
            mobile: mobile.toString(),
            from:
              params?.from === 'forgotUser'
                ? 'forgot-user-id'
                : 'forgot-password',
            tempToken: response.data.token,
          });
        }
      } catch (err: any) {
        setLoading(false);
        // clearTimeout(timeout);
        // console.error('OTP API error:', err);
      }
    }
  };

  // useEffect(() => {
  //   dispatch(logout());
  // }, []);

  const isFormValid = mobile.length === 10;

  return (
    <ScreenWrapper scrollable={true}>
      <Loader visible={loading} />
      <FastImage
        source={Images.SplashGif}
        style={styles.video}
        resizeMode={FastImage.resizeMode.cover}
      />

      <LinearGradient
        style={styles.linearGradient}
        colors={[colors.white, colors.black + '00']}
      >
        <View style={styles.backgroundGradient}>
          {(params?.from === 'forgotPass' || params?.from === 'forgotUser') && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <BackButton
                width={scale(15)}
                height={scale(15)}
                style={styles.backButtonComponent}
              />
            </TouchableOpacity>
          )}
          <View style={styles.container}>
            {params?.from &&
            (params?.from === 'forgotPass' || params?.from === 'forgotUser') ? (
              <>
                <CommonText variant="title" style={styles.title}>
                  {params?.from === 'forgotUser'
                    ? t('loginScreen.forgotUserid')
                    : t('forgotPassword.setupAccount')}
                </CommonText>
                <CommonText style={styles.subtitle} variant="subtitle">
                  {t('mobileRegister.enterMobileNumberDescription')}
                </CommonText>

                <CommonInput
                  style={styles.inputContainer}
                  keyboardType="phone-pad"
                  placeholder={t('mobileRegister.mobileNumberPlaceholder')}
                  leftIcon={
                    <View
                      style={[
                        styles.flagAndCode,
                        params?.from &&
                          params?.from === 'forgotPass' &&
                          styles.forgotPassFlagStyle,
                      ]}
                    >
                      <CommonText style={styles.countryCode}>
                        {t('loginScreen.countryCode')}
                      </CommonText>
                    </View>
                  }
                  value={mobile}
                  minLength={10}
                  maxLength={10}
                  onChangeText={setMobile}
                  error={error}
                  label={t('mobileRegister.mobileNumberLabel')}
                />
              </>
            ) : (
              <>
                <View style={styles.logoContainer}>
                  <Image
                    source={Images.AppLogo}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <CommonText variant="title" style={styles.title}>
                  {t('mobileRegister.setupAccount')}
                </CommonText>
                <CommonText style={styles.subtitle} variant="subtitle">
                  {t('mobileRegister.enterMobileNumberDescription')}
                </CommonText>

                <CommonInput
                  style={styles.inputContainer}
                  keyboardType="phone-pad"
                  placeholder={t('mobileRegister.mobileNumberPlaceholder')}
                  leftIcon={
                    <View style={styles.flagAndCode}>
                      <CommonText style={styles.countryCode}>
                        {t('loginScreen.countryCode')}
                      </CommonText>
                    </View>
                  }
                  value={mobile}
                  minLength={10}
                  maxLength={10}
                  onChangeText={setMobile}
                  error={error}
                  allowedCharsRegex={MOBILE_REGEX}
                  label={t('mobileRegister.mobileNumberLabel')}
                  required
                />
              </>
            )}

            <CommonButton
              style={styles.continueButton}
              disabled={mobile.length != 10}
              title={
                params?.from && params?.from === 'forgotPass'
                  ? t('mobileRegister.verify')
                  : t('mobileRegister.verify')
              }
              onPress={
                params?.from &&
                (params?.from === 'forgotPass' || params?.from === 'forgotUser')
                  ? forgotOTP
                  : handleOTP
              }
            />
            {params?.from && params?.from === 'forgotPass' ? null : (
              <View style={styles.signUpContainer}>
                <CommonText variant="body">
                  {t('mobileRegister.alreadyHaveAccount')}{' '}
                </CommonText>
                <TouchableOpacity
                  onPress={() =>
                    navigation.replace(screenNames.Login, {
                      mode: 'login',
                    })
                  }
                >
                  <CommonText variant="link">
                    {t('mobileRegister.loginLink')}
                  </CommonText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};
export default MobileRegister;
