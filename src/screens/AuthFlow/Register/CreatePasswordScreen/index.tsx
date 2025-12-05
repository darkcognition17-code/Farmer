import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import {
  moderateScale,
  scale,
  verticalScale,
} from '../../../../utils/responsive';
import { colors } from '../../../../themes/colors';
import CommonText from '../../../../components/CommonText';
import CommonInput from '../../../../components/CommonInput';
import CommonButton from '../../../../components/CommonButton';
import { Images } from '../../../../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import {
  BackButton,
  EyeClosed,
  EyeOpen,
  Lock,
  LockBlack,
} from '../../../../assets/icons';
import { styles } from './style';
import { useTranslation } from 'react-i18next';
import { AuthStackParamList } from '../../../../navigation/authNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { screenNames } from '../../../../navigation/screenNames';
import CommonModal from '../../../../components/CommonModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  checkUserExist,
  forgotResetPassword,
  registerUserName,
} from '../../../../redux/slices/authSlice';
import { CommonLoader, ScreenWrapper } from '../../../../components';
import { showToastable } from 'react-native-toastable';
import FastImage from 'react-native-fast-image';

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'CreatePasswordScreen'
>;

const CreatePasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { params } = useRoute();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { userName, from } = params;
  const tempToken = useSelector((state: RootState) => state.auth.tempToken);
  const [confirmError, setConfirmError] = useState('');

  const dispatch = useDispatch<AppDispatch>();

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

  useEffect(() => {
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      setConfirmError(t('createPasswordScreen.passwordMismatch'));
    } else {
      setConfirmError('');
    }
  }, [confirmPassword, password]);

  const handleContinue = async () => {
    if (password === confirmPassword) {
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
          registerUserName({
            payload: {
              password: password,
              username: userName,
              latitude: 12.9716,
              longitude: 77.5946,
            },
            headers: {
              deviceId: 'dddsdsdsdsdsdsdsxxxx',
              tempToken: tempToken,
              fcmToken: 'dddddxxxxxxx',
              deviceType: 'ios',
            },
          }),
        ).unwrap();
        //console.log('response------------>', response);

        setLoading(false);
        // clearTimeout(timeout);
        if (response.statusCode == 201) {
          setModalVisible(true);
        }
      } catch (err: any) {
        setLoading(false);
        // clearTimeout(timeout);
        const apiError = err?.response?.data;

        if (apiError?.errors?.length) {
          const firstError = apiError.errors[0];
          const message = Object.values(firstError.constraints).join(', ');

          showToastable({
            message: message,
            status: 'danger',
          });
        } else {
          showToastable({
            message: 'Something went wrong',
            status: 'danger',
          });
        }
      }
    } else {
      setLoading(false);
      // setError('Passwords do not match. Please re-enter your password.');
      showToastable({
        message: t('createPasswordScreen.passwordMismatch'),
        status: 'danger',
      });
    }
  };

  const handleSubmit = async () => {
    if (password === confirmPassword) {
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
          forgotResetPassword({
            payload: {
              newPassword: password,
            },
            headers: {
              deviceId: 'dddsdsdsdsdsdsdsxxxx',
              tempToken: tempToken,
            },
          }),
        ).unwrap();
        //console.log('response------------>', response);

        setLoading(false);
        // clearTimeout(timeout);
        if (response.statusCode == 200) {
          setModalVisible(true);
        }
      } catch (err: any) {
        setLoading(false);
        // clearTimeout(timeout);
        const apiError = error?.response?.data;

        if (apiError?.errors?.length) {
          const firstError = apiError.errors[0];
          const message = Object.values(firstError.constraints).join(', ');

          showToastable({
            message: message,
            status: 'danger',
          });
        } else {
          showToastable({
            message: 'Something went wrong',
            status: 'danger',
          });
        }
      }
    } else {
      setError('');
      setLoading(false);
    }
  };

  const handleModal = () => {
    // navigation.navigate(screenNames.Login);
    navigation.dispatch(
      CommonActions.reset({
        index: 0, // initial route index
        routes: [
          from === 'signup'
            ? { name: screenNames.ProfileStep1Screen } // the screen you want to navigate
            : { name: screenNames.Login }, // the screen you want to navigate
        ],
      }),
    );
    setModalVisible(false);
    setError('');
  };

  return (
    <ScreenWrapper scrollable={true}>
      <FastImage
        source={Images.SplashGif}
        style={styles.video}
        resizeMode={FastImage.resizeMode.cover}
      />
      <CommonLoader visible={loading} />

      <LinearGradient
        style={styles.linearGradient}
        colors={[colors.white, colors.black + '00']}
      >
        <View style={styles.backgroundGradient}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={
              params?.from !== 'forgot-password'
                ? [
                    {
                      top: 0,
                      right: 0,
                    },
                    styles.backButton,
                  ]
                : styles.backButton
            }
          >
            <BackButton
              width={scale(15)}
              height={scale(15)}
              style={styles.backButtonComponentStyle}
            />
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.container}>
              {params?.from !== 'forgot-password' && (
                <View style={styles.logoContainer}>
                  <Image
                    source={Images.AppLogo}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              )}

              {params?.from !== 'forgot-password' ? (
                <>
                  <CommonText style={styles.title}>
                    {t('createPasswordScreen.createPasswordTitle')}
                  </CommonText>
                  <CommonText style={styles.subtitle}>
                    {t('createPasswordScreen.passwordSubtitle')}
                  </CommonText>
                </>
              ) : (
                <>
                  <CommonText style={[styles.title, styles.resetPassword]}>
                    {t('createPasswordScreen.resetPasswordTitle')}
                  </CommonText>
                  <CommonText style={styles.subtitle}>
                    {t('createPasswordScreen.enterNewPassword')}
                  </CommonText>
                </>
              )}

              <CommonInput
                label={
                  params?.from !== 'forgot-password'
                    ? t('loginScreen.passwordLabel')
                    : t('resetPasswordScreen.passwordLabel')
                }
                placeholder={
                  params?.from !== 'forgot-password'
                    ? t('createPasswordScreen.createPasswordTitle')
                    : t('loginScreen.enterPasswordPlaceholder')
                }
                secureTextEntry={secureText}
                value={password}
                style={styles.input}
                onChangeText={setPassword}
                rightIcon={
                  <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                    <MyIcon
                      name={secureText ? 'eye-off' : 'eye'}
                      size={moderateScale(20)}
                    />
                  </TouchableOpacity>
                }
                leftIcon={
                  <Lock
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={moderateScale(18)}
                    color={colors.Neutrals700}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              {params?.from !== 'resetPass' && (
                <CommonText style={styles.hintText}>
                  {t('createPasswordScreen.passwordHint')}
                </CommonText>
              )}

              <CommonInput
                label={t('createPasswordScreen.confirmPasswordLabel')}
                placeholder={
                  params?.from !== 'forgot-password'
                    ? t('userNameRegister.reenterPasswordLabel')
                    : t('createPasswordScreen.confirmPasswordLabel')
                }
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={confirmError}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {!showConfirmPassword ? (
                      <EyeClosed
                        width={moderateScale(20)}
                        height={moderateScale(20)}
                      />
                    ) : (
                      <EyeOpen
                        width={moderateScale(20)}
                        height={moderateScale(20)}
                      />
                    )}
                  </TouchableOpacity>
                }
                leftIcon={
                  <Lock
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={moderateScale(18)}
                    color={colors.Neutrals700}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />

              <View style={styles.buttonContainer}>
                <CommonButton
                  title={
                    params?.from !== 'forgot-password'
                      ? t('createPasswordScreen.createPasswordTitle')
                      : t('common.submit')
                  }
                  style={styles.button}
                  onPress={
                    params?.from !== 'forgot-password'
                      ? handleContinue
                      : handleSubmit
                  }
                  disabled={!password || !confirmPassword || !!confirmError}
                />
              </View>
            </View>
          </ScrollView>
        </View>

        <CommonModal
          visible={isModalVisible}
          onClose={handleModal}
          title={t('createPasswordScreen.passwordUpdated')}
          message=""
        />
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default CreatePasswordScreen;
