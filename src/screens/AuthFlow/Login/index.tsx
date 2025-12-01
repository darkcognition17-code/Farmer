import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../utils/responsive';
import { colors } from '../../../themes/colors';
import CommonText from '../../../components/CommonText';
import CommonButton from '../../../components/CommonButton';
import CommonInput from '../../../components/CommonInput';
import { Images } from '../../../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import {
  EyeClosed,
  EyeOpen,
  Lock,
  LockBlack,
  ProfileSelectTab,
} from '../../../assets/icons';
import { screenNames } from '../../../navigation/screenNames';
import { styles } from './style';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import {
  loginWithCredentialsUser,
  logout,
  sendOtpSignup,
  setTokens,
} from '../../../redux/slices/authSlice';
import { ScreenWrapper } from '../../../components';
import { showToastable } from 'react-native-toastable';
import FastImage from 'react-native-fast-image';
import Loader from '../../../components/Loader';
import { MOBILE_NUMBER_REGEX } from '../../../utils/regex';

const LoginScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'otp' | 'userpass'>('otp');
  const [mobile, setMobile] = useState('');
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const handleGetOtp = () => {
    if (selectedTab === 'otp') {
      handleOTP();
    } else {
      handleWithCredentials();
    }
  };

  useEffect(() => {
    if (mobile.length > 0 && mobile.length < 10) {
      setError(t('mobileRegister.invalidMobileNumber')); // or a custom message
    } else {
      setError('');
    }
  }, [mobile]);

  // useEffect(() => {
  //   dispatch(logout());
  // }, []);

  const handleOTP = async () => {
    if (mobile.length == 10) {
      setLoading(true);
      // const timeout = setTimeout(() => {
      //   setLoading(false); // stop loading if API doesn’t respond in 15s
      //   showToastable({ message: t('common.networkTimeout'), status: 'danger' });
      // }, 15000);
      try {
        const response = await dispatch(
          sendOtpSignup({
            phoneNumber: mobile,
            role: 'farmer',
            type: 'login',
          }),
        ).unwrap(); // ✅ unwrap to get API response directly
        setLoading(false);
        // clearTimeout(timeout);
        //console.log('response Login', response);

        if (response.statusCode == 200) {
          navigation.navigate(screenNames.MobileOtp, {
            mobile: mobile.toString(),
            from: 'login',
            tempToken: response.data.token,
          });
          // dispatch(
          //   setTokens({
          //     accessToken: response.data.token ?? '',
          //     refreshToken: response.data.token ?? '',
          //   }),
          // );
        }
      } catch (err: any) {
        setLoading(false);
        // clearTimeout(timeout);
      }
    }
  };

  const handleWithCredentials = async () => {
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
        loginWithCredentialsUser({
          payload: {
            username: userId,
            role: 'farmer',
            password: password,
          },
          headers: {
            deviceId: 'dddsdsdsdsdsdsds',
            deviceType: 'android',
          },
        }),
      ).unwrap();
      setLoading(false);
      // clearTimeout(timeout);
      //console.log('response Login', response);

      if (response.statusCode == 200) {
        (setTokens({
          accessToken: response.data.tokens.accessToken ?? '',
          refreshToken: response.data.tokens.refreshToken ?? '',
        }),
          navigation.navigate(screenNames.App));

        // dispatch(
        //   setTokens({
        //     accessToken: response.data.token ?? '',
        //     refreshToken: response.data.token ?? '',
        //   }),
        // );
      }
    } catch (err: any) {
      setLoading(false);
      // clearTimeout(timeout);
    }
  };

  const MyIcon = ({ name, size = moderateScale(20) }) => {
    switch (name) {
      case 'lock':
        return <LockBlack width={size} height={size} />;
      case 'eye':
        return <EyeOpen width={size} height={size} />;
      case 'eye-off':
        return <EyeClosed width={size} height={size} />;
      default:
        return <View />;
    }
  };

  const handleForgotPass = () => {
    navigation.navigate(screenNames.MobileRegister, {
      from: 'forgotPass',
    });
  };

  const handleForgotUser = () => {
    navigation.navigate(screenNames.MobileRegister, {
      from: 'forgotUser',
    });
  };

  return (
    // <View style={styles.safeArea}>
    <ScreenWrapper scrollable={true}>
      <FastImage
        source={Images.SplashGif}
        style={styles.video}
        resizeMode={FastImage.resizeMode.cover}
      />
      <Loader visible={loading} />

      <LinearGradient
        style={styles.linearGradient}
        colors={[colors.white, colors.black + '00']}
      >
        <View style={styles.backgroundGradient}>
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.logoContainer}>
                <Image
                  source={Images.AppLogo}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === 'otp' && styles.activeTab,
                  ]}
                  onPress={() => setSelectedTab('otp')}
                >
                  <CommonText
                    style={[
                      styles.tabText,
                      selectedTab === 'otp' && styles.activeTabText,
                    ]}
                  >
                    {t('loginScreen.loginWithOtpTab')}
                  </CommonText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === 'userpass' && styles.activeTab,
                  ]}
                  onPress={() => setSelectedTab('userpass')}
                >
                  <CommonText
                    style={[
                      styles.tabText,
                      selectedTab === 'userpass' && styles.activeTabText,
                    ]}
                  >
                    {t('loginScreen.userIdAndPasswordTab')}
                  </CommonText>
                </TouchableOpacity>
              </View>

              {selectedTab === 'otp' ? (
                <>
                  <CommonText variant="label">
                    {t('loginScreen.otpSubtitle')}
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
                    allowedCharsRegex={MOBILE_NUMBER_REGEX}
                  />
                </>
              ) : (
                <View>
                  <CommonInput
                    style={styles.inputContainer2}
                    placeholder={t('loginScreen.enterUserIdPlaceholder')}
                    leftIcon={
                      <View style={styles.userName}>
                        <ProfileSelectTab style={styles.flagIcon} />
                      </View>
                    }
                    value={userId}
                    onChangeText={setUserId}
                  />
                  <TouchableOpacity onPress={handleForgotUser}>
                    <CommonText style={styles.forgotPass} variant="link">
                      {t('loginScreen.forgotUserid')}
                    </CommonText>
                  </TouchableOpacity>

                  <CommonInput
                    placeholder={t('loginScreen.enterPasswordPlaceholder')}
                    secureTextEntry={secureText}
                    value={password}
                    style={styles.passwordInputContainer}
                    onChangeText={setPassword}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setSecureText(!secureText)}
                      >
                        <MyIcon
                          name={secureText ? 'eye-off' : 'eye'}
                          size={moderateScale(20)}
                        />
                      </TouchableOpacity>
                    }
                    leftIcon={
                      <Lock
                        name="lock"
                        size={moderateScale(18)}
                        color={colors.Neutrals700}
                      />
                    }
                  />
                  <View style={styles.forgotPassContainer}>
                    <TouchableOpacity onPress={handleForgotPass}>
                      <CommonText style={styles.forgotPass} variant="link">
                        {t('forgotPassword.setupAccount')}
                      </CommonText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <CommonButton
                title={
                  selectedTab === 'otp'
                    ? t('mobileRegister.verify')
                    : t('mobileRegister.loginLink')
                }
                style={styles.loginButton}
                onPress={handleGetOtp}
                disabled={
                  selectedTab === 'otp'
                    ? mobile.length !== 10
                    : userId.length === 0 || password.length === 0
                }
              />

              <View style={styles.footer}>
                <CommonText variant="body">
                  {t('loginScreen.dontHaveAccountText')}{' '}
                </CommonText>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(screenNames.MobileRegister)
                  }
                >
                  <CommonText style={styles.signUpText}>
                    {t('loginScreen.signUpLink')}
                  </CommonText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default LoginScreen;
