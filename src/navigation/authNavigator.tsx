import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  LoginScreen,
  MobileOtp,
  MobileRegister,
  UsernameRegister,
  CreatePasswordScreen,
  ProfileSetupStep1,
  ProfileSetupStep2,
  ProfileSetupStep3,
} from '../screens';
import { screenNames } from './screenNames';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  LocationPermission: undefined;
  MobileRegister: { from: string };
  MobileOtp: {
    mobile: string;
    from: string;
  };
  UserNameRegister: undefined;
  VerifiedSuccess: undefined;
  UserVerifiedSuccess: undefined;
  CreatePasswordScreen: {
    userName: string;
  };
  PayloadStep1:any;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  // State to hold the initial route name, determined by permission status.
  // It's undefined initially to allow the permission check to complete before rendering the navigator.
  const [initialRoute, setInitialRoute] = useState<
    keyof AuthStackParamList | undefined
  >(undefined);

  // useEffect(() => {
  //   // Asynchronously checks the current status of location permissions.
  //   // This is crucial for deciding whether to show the location permission screen or proceed.
  //   const checkLocationPermission = async () => {
  //     // Determine the correct permission type based on the platform (Android or iOS).
  //     const permission =
  //       Platform.OS === 'android'
  //         ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  //         : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  //     try {
  //       const result = await check(permission);
  //       // If permission is granted, set the initial route to MobileRegister to skip the permission screen.
  //       if (result === RESULTS.GRANTED) {
  //         // setInitialRoute(screenNames.Auth);
  //         // setInitialRoute(screenNames.MobileRegister);
  //         setInitialRoute(screenNames.ProfileStep3Screen);
  //       } else {
  //         // If permission is not granted, set the initial route to LocationPermission to prompt the user.
  //         // setInitialRoute(screenNames.MobileRegister);
  //         setInitialRoute(screenNames.MobileRegister);
  //       }
  //     } catch (error) {
  //       // Log any errors during permission check and default to showing the permission screen.
  //       console.error('Error checking location permission:', error);
  //       // setInitialRoute(screenNames.MobileRegister); // Fallback in case of error
  //       setInitialRoute(screenNames.MobileRegister);
  //     }
  //   };

  //   checkLocationPermission();
  // }, []); // Empty dependency array ensures this effect runs only once on mount

  // Render nothing or a loading indicator until the initial route is determined.
  // if (initialRoute === undefined) {
  //   return null; // Or a loading spinner to indicate that permissions are being checked
  // }

  return (
    <Stack.Navigator
      initialRouteName={screenNames.MobileRegister}
      screenOptions={{ headerShown: false }}
    >
            <Stack.Screen
        name={screenNames.MobileRegister}
        component={MobileRegister}
      />
      <Stack.Screen name={screenNames.Login} component={LoginScreen} />
      {/* <Stack.Screen
        name={screenNames.LocationPermission}
        component={LocationScreen}
      /> */}

      <Stack.Screen name={screenNames.MobileOtp} component={MobileOtp} />
      <Stack.Screen
        name={screenNames.UserNameRegister}
        component={UsernameRegister}
      />

      <Stack.Screen
        name={screenNames.CreatePasswordScreen}
        component={CreatePasswordScreen}
      />
      <Stack.Screen
        name={screenNames.ProfileStep1Screen}
        component={ProfileSetupStep1}
      />
      <Stack.Screen
        name={screenNames.ProfileStep2Screen}
        component={ProfileSetupStep2}
      />
      <Stack.Screen
        name={screenNames.ProfileStep3Screen}
        component={ProfileSetupStep3}
      />

      
    </Stack.Navigator>
  );
};

export default AuthNavigator;
