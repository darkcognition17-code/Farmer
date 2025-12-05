import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CommonOtpInput from '../../../../components/CommonOtpInput';
import { screenNames } from '../../../../navigation/screenNames';
import { colors } from '../../../../themes/colors';
import {
  CommonBackButton,
  CommonInput,
  CommonLoader,
  ScreenWrapper,
} from '../../../../components';
import { Clock } from '../../../../assets/icons';
import {
  moderateScale,
  scale,
  verticalScale,
} from '../../../../utils/responsive';
import { styles } from './style';
import { CommonButton, CommonText } from '../../../../components';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../redux/store';
import {
  sendOtpSignup,
  setTokens,
  verifyOtp,
} from '../../../../redux/slices/authSlice';

import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../../../navigation/authNavigator';
import LinearGradient from 'react-native-linear-gradient';
import CommonModal from '../../../../components/CommonModal';
import Toast from 'react-native-simple-toast';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Clipboard from '@react-native-clipboard/clipboard';

import { Images } from '../../../../assets/images';
import { showToastable } from 'react-native-toastable';
import FastImage from 'react-native-fast-image';
import LockedAccountModal from '../../../../components/LockedAccountModal';

type OTPScreenRouteProp = RouteProp<AuthStackParamList, 'MobileOtp'>;
type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'MobileOtp'
>;

const MobileOtp = () => {
  const navigation = useNavigation<NavigationProp>();
  const { params } = useRoute<OTPScreenRouteProp>();
  const { mobile, from, tempToken } = params;

  const formatMobileNumber = (number: string) => {
    if (number && number.length > 6) {
      return 'XXXXXX' + number.substring(6);
    }
    return number;
  };
  const { t } = useTranslation();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [isLoading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [isShowModalForLock, setShowModalForLock] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   const requestNotificationPermission = async () => {
  //     if (Platform.OS === 'android') {
  //       const permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;

  //       try {
  //         const result = await check(permission);
  //         if (result === RESULTS.DENIED) {
  //           await request(permission);
  //         }
  //       } catch (error) {
  //         setLoading(false);
  //         // console.error(
  //         //   'Error checking or requesting notification permission:',
  //         //   error,
  //         // );
  //       }
  //     }
  //   };

  //   requestNotificationPermission();
  // }, []);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // ⏱️ 1 second per tick

    return () => clearInterval(interval);
  }, [timer]); // 👈 empty dependency array

  useEffect(() => {
    error && Toast.show(t('mobileOtp.invalidOtpMessage'), Toast.SHORT);
  }, [error]);

  const [isModalVisible, setModalVisible] = useState(false);

  const handleOTPResend = async () => {
    try {
      setLoading(true);
      // const timeout = setTimeout(() => {
      //   setLoading(false);
      //   Toast.show('Network timeout', Toast.SHORT);
      // }, 15000);

      const responseAction = await dispatch(
        sendOtpSignup({
          phoneNumber: mobile,
          role: 'farmer',
          type: from,
        }),
      );

      // clearTimeout(timeout);
      setLoading(false);

      const response = responseAction?.payload ?? responseAction;
      //console.log('Resend OTP response:', response);

      if (response?.statusCode === 200) {
        Toast.show('OTP resent successfully', Toast.SHORT);
      } else {
        Toast.show('Failed to resend OTP', Toast.SHORT);
      }
    } catch (err: any) {
      //console.log('Resend OTP error:', err);

      const message =
        typeof err === 'string'
          ? err
          : err?.message || err?.error || JSON.stringify(err);

      if (
        message.includes('Try again in') ||
        message.includes('Please try again in')
      ) {
        setBlockReason(message);
        setTimeout(() => setShowModalForLock(true), 500);
      }

      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (otp.length === 6) {
      try {
        setLoading(true);
        // const response = await dispatch(verifyOtp({ otp: '123456', tempToken: tempToken,deviceId : "fff" })).unwrap(); // ✅ unwrap to get API response directly
        const response = await dispatch(
          verifyOtp({
            payload: {
              otp: otp,
            },
            headers: {
              deviceId: 'dddsdsdsdsdsdsds',
              tempToken: tempToken,
            },
          }),
        ).unwrap();
        if (response.statusCode == 200) {
          setLoading(false);
          // navigation.navigate(screenNames.VerifiedSuccess, { from });
          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);
            //console.log('response------------> ', response);

            if (from == 'login') {
              dispatch(
                setTokens({
                  accessToken: response.data.tokens.accessToken ?? '',
                  refreshToken: response.data.tokens.refreshToken ?? '',
                }),
              );
              navigation.navigate(screenNames.App);
            } else {
              if (from == 'forgot-password') {
                navigation.navigate(screenNames.CreatePasswordScreen, {
                  from: 'forgot-password',
                });
              } else if (from == 'forgot-user-id') {
                setUserId(response.data.username);
                navigation.navigate(screenNames.Login, {
                  userId: response.data.username,
                });
              } else {
                navigation.navigate(screenNames.UserNameRegister, {
                  from: 'signup',
                });
              }
            }
          }, 1800);
          setLoading(false);
        } else {
          //console.log('responce------', response);
          setLoading(false);
        }
      } catch (err: any) {
        //console.log('err------', err);

        if (
          err.includes('Try again in') ||
          err.includes('Please try again in')
        ) {
          setBlockReason(err);
          setTimeout(() => {
            setShowModalForLock(true);
          }, 500);
        }

        setLoading(false);
      }
    } else {
      setLoading(false);
      setError(t('mobileOtp.invalidOtpMessage'));
    }
  };

  const handleResend = () => {
    //console.log('Resend OTP to:', mobile);
    setOtp('');
    setError('');
    setTimer(30);
    handleOTPResend();
  };

  const handleModal = () => {
    setModalVisible(false);
    setOtp('');
    setError('');
  };

  const copyToClipboard = () => {
    Clipboard.setString(userId);
  };

  return (
    <ScreenWrapper scrollable={true}>
      <CommonLoader visible={isLoading} />
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
          <CommonBackButton
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            width={moderateScale(15)}
            height={moderateScale(15)}
            iconStyle={styles.backButtonComponent}
          />

          <View style={styles.container}>
            {from !== 'forgotpassword' && (
              <Image source={Images.AppLogo} style={styles.appLogo} />
            )}
            <CommonText variant="title" style={styles.title}>
              {t('mobileOtp.otpVerificationTitle')}
            </CommonText>
            <CommonText variant="subtitle">
              {t('mobileOtp.otpSentDescription')} +91{' '}
              <CommonText style={styles.mobile}>
                {formatMobileNumber(mobile)}
              </CommonText>
            </CommonText>

            <CommonText variant="label">{t('mobileOtp.otpLabel')}</CommonText>
            <CommonOtpInput
              length={6}
              onChangeOtp={setOtp}
              error={error}
              value={otp}
            />

            <View
              style={[
                styles.timerContainer,
                from == 'forgotpassword' && styles.forgotPassword,
              ]}
            >
              {timer !== 0 ? (
                <>
                  <CommonText>{t('mobileOtp.resendIn')} </CommonText>
                  <Clock width={20} height={20} />
                  <CommonText style={styles.timer}>{'00:' + timer}</CommonText>
                </>
              ) : (
                !isShowModalForLock && (
                  <>
                    <CommonText>{t('mobileOtp.didNotGetCode')} </CommonText>
                    <CommonText
                      onPress={handleResend}
                      style={styles.resendLink}
                    >
                      {t('mobileOtp.resendLink')}
                    </CommonText>
                  </>
                )
              )}
            </View>

            <CommonButton
              style={[
                styles.continueButton,
                from == 'forgotpassword' && styles.forgotPasswordExtrStyling,
              ]}
              title={t('forgotPassword.getOtpButton')}
              onPress={handleContinue}
              disabled={otp.length != 6}
            />
          </View>
        </View>
      </LinearGradient>
      <CommonModal
        visible={isModalVisible}
        onClose={handleModal}
        title={t('verifiedSuccess.title')}
        message=""
      />
      <LockedAccountModal
        visible={isShowModalForLock}
        reason={blockReason}
        onClose={() => setShowModalForLock(false)}
      />
    </ScreenWrapper>
  );
};

export default MobileOtp;
