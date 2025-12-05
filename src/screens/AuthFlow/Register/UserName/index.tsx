import React, { useState } from 'react';
import { Image, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { InfoIcon, ProfileSelectTab } from '../../../../assets/icons';
import { moderateScale, scale } from '../../../../utils/responsive';
import { colors } from '../../../../themes/colors';
import {
  CommonButton,
  CommonInput,
  CommonLoader,
  CommonText,
  ScreenWrapper,
} from '../../../../components';
import { styles } from './style';
import { screenNames } from '../../../../navigation/screenNames';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../../navigation/authNavigator';
import { Images } from '../../../../assets/images';
import Tooltip, { Placement } from 'react-native-tooltip-2';
import { USERNAME_REGEX } from '../../../../utils/regex';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../redux/store';
import { checkUserExist } from '../../../../redux/slices/authSlice';

import { Buffer } from 'buffer'; // Available in React Native via polyfill
import { showToastable } from 'react-native-toastable';
import FastImage from 'react-native-fast-image';

type NavigationRouteProp = RouteProp<AuthStackParamList, 'UserNameRegister'>;
type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'UserNameRegister'
>;

const UserNameRegister = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { params } = useRoute<NavigationRouteProp>();
  const { from } = params;

  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toolTipInfoVisible, setInfoToolTipVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleUserName = async () => {
    setLoading(true);
    // const timeout = setTimeout(() => {
    //   setLoading(false); // stop loading if API doesn’t respond in 15s
    //   showToastable({ message: t('common.networkTimeout'), status: 'danger' });
    // }, 15000);
    try {
      const tokenBasic = Buffer.from(
        `${'mysecret'}:${'password'}`,
        'utf8',
      ).toString('base64');
      const response = await dispatch(
        checkUserExist({
          payload: {
            role: 'farmer',
            username: userName,
          },
          headers: {
            Authorization: `Basic ${tokenBasic}`,
          },
        }),
      ).unwrap();
      setLoading(false);
      // clearTimeout(timeout);
      //console.log('Responce=============', response);

      if (response.statusCode == 200) {
        if (response.data.exists) {
          showToastable({
            message: t('userVerifiedFailed.error'),
            status: 'danger',
          });
        } else {
          navigation.navigate(screenNames.CreatePasswordScreen, {
            userName: userName,
            from,
          });
        }
      }
    } catch (err: any) {
      //console.log(err);
      setLoading(false);
      // clearTimeout(timeout);
      // console.error('OTP API error:', err);
    }
  };

  return (
    <ScreenWrapper scrollable={true}>
      <CommonLoader visible={loading} />
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
          <View style={styles.container}>
            <Image source={Images.AppLogo} style={styles.appLogo} />

            <CommonText variant="title" style={styles.title}>
              {t('userNameRegister.createUserIdTitle')}
            </CommonText>
            <CommonText variant="subtitle">
              {t('userNameRegister.userIdPasswordDescription')}
            </CommonText>

            <View style={styles.labelContainer}>
              <CommonText variant="label">
                {t('loginScreen.userIdLabel')}
              </CommonText>
              <Tooltip
                isVisible={toolTipInfoVisible}
                backgroundColor={colors.black + '66'}
                content={
                  <CommonText style={styles.tooltipContent}>
                    {t('signup.usernameCreateInfo')}
                  </CommonText>
                }
                contentStyle={styles.tooltipStyle}
                placement="top"
                onClose={() => setInfoToolTipVisible(false)}
              >
                {/* Important: Tooltip wraps the icon directly */}
                <View style={styles.infoIconContainer}>
                  <InfoIcon
                    width={scale(16)}
                    height={scale(16)}
                    style={styles.infoIcon}
                    onPress={() => setInfoToolTipVisible(true)}
                  />
                </View>
              </Tooltip>
            </View>
            <CommonInput
              style={styles.inputContainer}
              placeholder={t('loginScreen.enterUserIdPlaceholder')}
              leftIcon={
                <View style={styles.flagAndCode}>
                  <ProfileSelectTab style={styles.flagIcon} />
                </View>
              }
              value={userName}
              allowedCharsRegex={USERNAME_REGEX}
              maxLength={50}
              onChangeText={setUserName}
              error={error}
            />

            <CommonButton
              style={styles.continueButton}
              disabled={userName.length <= 3}
              title={t('continue')}
              onPress={handleUserName}
            />
          </View>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};
export default UserNameRegister;
