import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CommonOtpInput from '../../../../../components/CommonOtpInput';
import { screenNames } from '../../../../../navigation/screenNames';
import {
  CommonInput,
  CommonLoader,
  GradientBackground,
  ScreenWrapper,
} from '../../../../../components';
import { Clock } from '../../../../../assets/icons';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';
import { styles } from './style';
import { CommonButton, CommonText } from '../../../../../components';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../redux/store';
import {
  sendOtpSignup,
  setTokens,
  verifyOtp,
} from '../../../../../redux/slices/authSlice';

import LinearGradient from 'react-native-linear-gradient';
import CommonModal from '../../../../../components/CommonModal';
import Toast from 'react-native-simple-toast';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Clipboard from '@react-native-clipboard/clipboard';

import { Images } from '../../../../../assets/images';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'DeleteAccountOTP'
>;

const DeleteAccountOTP = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [isLoading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [isShowModalForLock, setShowModalForLock] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const formatMobileNumber = (number: string) => {
    if (number && number.length > 6) {
      return 'XXXXXX' + number.substring(6);
    }
    return number;
  };

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

  const [isModalVisible, setModalVisible] = useState(false);

  const handleOTPResend = async () => {
    try {
      setLoading(true);
      const timeout = setTimeout(() => {
        setLoading(false);
        Toast.show('Network timeout', Toast.SHORT);
      }, 15000);

      clearTimeout(timeout);
      setLoading(false);

      Toast.show('OTP resent successfully', Toast.SHORT);
    } catch (err: any) {
      //console.log('Resend OTP error:', err);

      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (otp.length === 6) {
      Alert.alert('Delete');
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

  return (
    <ScreenWrapper
      scrollable
      bgColor={colors.transparent}
      style={styles.screenWrapperContainer}
    >
      <CommonLoader visible={isLoading} />
      <GradientBackground
        imageStyle={styles.imageBackgroundStyle}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        backButtonStyles={styles.bell}
      >
        <View style={styles.headerContainer}>
          <CommonText style={styles.headerTitle}>{'Verify Your Identity'}</CommonText>
        </View>
      </GradientBackground>

      <View style={styles.backgroundGradient}>
        <View style={styles.container}>
          <CommonText variant="title" style={styles.title}>
            Verify Your Identity
          </CommonText>
          <CommonText variant="subtitle" style={styles.subTitle}>
            A verification code has been to your Email ID/phone number
          </CommonText>

          <CommonOtpInput
            length={6}
            onChangeOtp={setOtp}
            error={error}
            value={otp}
          />

          <View style={styles.timerContainer}>
            {timer !== 0 ? (
              <>
                <CommonText>{t('mobileOtp.resendIn')} </CommonText>
                <Clock width={20} height={20} />
                <CommonText style={styles.timerText}>
                  {'00:' + timer}
                </CommonText>
              </>
            ) : (
              !isShowModalForLock && (
                <>
                  <CommonText>{t('mobileOtp.didNotGetCode')} </CommonText>
                  <CommonText onPress={handleResend} style={styles.resendLink}>
                    {t('mobileOtp.resendLink')}
                  </CommonText>
                </>
              )
            )}
          </View>
          <CommonButton
            style={styles.continueButton}
            title={t('forgotPassword.getOtpButton')}
            onPress={handleContinue}
            disabled={otp.length != 6}
          />
        </View>
      </View>

      <CommonModal
        visible={isModalVisible}
        onClose={handleModal}
        title={t('verifiedSuccess.title')}
        message=""
      />
    </ScreenWrapper>
  );
};

export default DeleteAccountOTP;
