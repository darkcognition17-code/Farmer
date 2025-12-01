import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { styles } from './style';
import { Images } from '../../../assets/images';
import Geolocation from 'react-native-geolocation-service';
import { screenNames } from '../../../navigation/screenNames';

// ✅ react-native-permissions
import {
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import { Location, LocationDeny } from '../../../assets/icons';
import { moderateScale } from '../../../utils/responsive';
import { CommonText, ScreenWrapper } from '../../../components'; // Import ScreenWrapper
import { useNavigation } from '@react-navigation/native';

// Define navigation stack type
type RootStackParamList = {
  Location: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Location'>;

const LocationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [permissionStatus, setPermissionStatus] = useState<string>('UNKNOWN');

  // Permission key based on platform
  const permission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  // 🔍 Check permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const result = await check(permission);
      setPermissionStatus(result);
    } catch (error) {
      console.error('Check permission error:', error);
    }
  };

  // Handle permission request
  const handleLocationPermission = async () => {
    try {
      if (permissionStatus === RESULTS.BLOCKED) {
        // Open settings if permanently denied
        openSettings();
        return;
      } else if (Platform.OS === 'android') {
        // Ask for permission on Android
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: t('home.locationPermissionTitle'),
            message: t('locationPermission.androidRequestMessage'),
            buttonNeutral: t('home.askMeLater'),
            buttonNegative: t('home.cancel'),
            buttonPositive: t('home.ok'),
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert(
            t('locationPermission.permissionDeniedTitle'),
            t('locationPermission.locationAccessDeniedMessage'),
          );
        }
      } else {
        // Request permission on iOS
        const status = await Geolocation.requestAuthorization('whenInUse');
        if (status === 'granted') {
          getCurrentLocation();
        } else {
          Alert.alert(
            t('locationPermission.permissionDeniedTitle'),
            t('locationPermission.locationAccessDeniedMessage'),
          );
        }
      }
      navigation.navigate(screenNames.MobileRegister);
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert(t('locationPermission.locationErrorTitle'), error.message);
    }
  };

  // Get current user location
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        //console.log('User location:', position); // ✅ Navigate to Login after successful location fetch
        navigation.navigate(screenNames.MobileRegister);
      },
      error => {
        console.error('Location error:', error);
        Alert.alert(t('locationPermission.locationErrorTitle'), error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  // 🎯 Conditional UI helpers
  const getTitle = () => {
    if (permissionStatus === RESULTS.BLOCKED)
      return t('locationPermission.permissionNeededTitle');
    return t('locationPermission.accessDeviceLocationTitle');
  };

  const getImage = () => {
    if (permissionStatus === RESULTS.BLOCKED) return 1;
    return 2;
  };

  const getSubtitle = () => {
    if (permissionStatus === RESULTS.BLOCKED)
      return t('locationPermission.blockedSubtitle');
    return t('locationPermission.accessLocationSubtitle');
  };

  const getButtonLabel = () => {
    if (permissionStatus === RESULTS.BLOCKED)
      return t('locationPermission.openSettingsButton');
    return t('locationPermission.allowButton');
  };

  return (
    <ScreenWrapper>
      {/* Logo */}
      <Image source={Images.AppLogo} style={styles.logo} resizeMode="contain" />

      {/* Location Icon */}
      <View style={styles.messageContainer}>
        {getImage() == 2 ? (
          <Location
            style={styles.icon}
            width={moderateScale(64)}
            height={moderateScale(64)}
          />
        ) : (
          <LocationDeny
            style={styles.icon}
            width={moderateScale(64)}
            height={moderateScale(64)}
          />
        )}

        {/* Title */}
        <CommonText style={styles.title}>{getTitle()}</CommonText>

        {/* Subtitle */}
        <CommonText style={styles.subtitle}>{getSubtitle()}</CommonText>
      </View>

      {/* Allow/Open Settings Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLocationPermission}
      >
        <CommonText style={styles.buttonText}>{getButtonLabel()}</CommonText>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default LocationScreen;
