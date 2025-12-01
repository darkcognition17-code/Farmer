import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationState } from '@react-navigation/native';

import {
  HomeScreen,
  UserDetailScreen,
  MyRegisterLand,
  AddNewLandStep1,
  AddNewLandStep2,
  AddNewLandStep3,
  EditProfileScreen,
  FamilyDetails,
  LiveStockDetails,
  AddLiveStock,
  AdditionalLinks,
  ChangeLanguage,
  DeleteAccount,
  DeleteAccountOTP,
  MachineryDetails,
  AddMachineryDetails,
  AddMachinery,
  EditMachinery,
} from '../screens';
import { screenNames } from './screenNames';
import BottomTabBavigation from '../navigation/BottomTabBavigation'; // your custom tab
import ProfileDetailsSubScreen from '../screens/MainFlow/Profile/ProfileTab/ProfileDetails';
import LandDetails from '../screens/MainFlow/LandDetails';
import EditAdditionalDetails from '../screens/MainFlow/Profile/ProfileTab/EditAdditionalDetails';
import EditAddressDetails from '../screens/MainFlow/Profile/ProfileTab/EditAddressDetails';
import EditCrop from '../screens/MainFlow/AddNewLand/EditCrop';
import EditLand from '../screens/MainFlow/AddNewLand/EditLand';
import AddCrop from '../screens/MainFlow/AddNewLand/AddCrop';

export type AppStackParamList = {
  Home: undefined;
  UserDetails: undefined;
  AddressDetails: undefined;
  ContactDetails: undefined;
  Weather: undefined;
  Profile: undefined;
  MyRegisterLand: undefined;
  AddNewLandStep1: undefined;
  AddNewLandStep2: undefined;
  AddNewLandStep3: undefined;
  EditProfile: undefined;
  ChnageLanguage: undefined;
  FamilyDetails: undefined;
  LiveStockDetails: undefined;
  AddLiveStock: undefined;
  AdditionalLinks: undefined;
  DeleteAccount: undefined;
  DeleteAccountOTP: undefined;
  MachineryDetails: undefined;
  AddMachineryDetails: undefined;
  AddMachinery: undefined;
  EditMachinery: undefined;
  AddCrop: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator();

// Stack for Home tab
const HomeStack = (props: any) => {
  const currentRouteName = useNavigationState(state => {
    const appRoute = state.routes.find(r => r.name === screenNames.App);
    if (appRoute?.state) {
      // Function to get active route recursively
      const getActiveRouteName = (navState: any) => {
        const route = navState.routes[navState.index || 0];
        if (route.state) return getActiveRouteName(route.state);
        return route.name;
      };
      return getActiveRouteName(appRoute.state) || screenNames.HomeStack;
    }
    return screenNames.HomeStack;
  });
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={tabProps => (
        <BottomTabBavigation
          {...props}
          {...tabProps} // gives navigation & state
          currentRouteName={currentRouteName}
        />
      )}
    >
      <Tab.Screen name={screenNames.Home} component={HomeScreen} />
      <Tab.Screen name={screenNames.UserDetails} component={UserDetailScreen} />
    </Tab.Navigator>
  );
};

// Main AppNavigator with custom BottomTabBavigation
const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={screenNames.HomeStack} component={HomeStack} />
      <Stack.Screen
        name={screenNames.MyRegisterLand}
        component={MyRegisterLand}
      />
      <Stack.Screen
        name={screenNames.AddNewLandStep1}
        component={AddNewLandStep1}
      />
      <Stack.Screen
        name={screenNames.AddNewLandStep2}
        component={AddNewLandStep2}
      />
      <Stack.Screen
        name={screenNames.AddNewLandStep3}
        component={AddNewLandStep3}
      />

      <Stack.Screen
        name={screenNames.EditProfileScreen}
        component={EditProfileScreen}
      />
      <Stack.Screen
        name={screenNames.FamilyDetailsScreen}
        component={FamilyDetails}
      />
      <Stack.Screen
        name={screenNames.ChangeLanguage}
        component={ChangeLanguage}
      />
      <Stack.Screen
        name={screenNames.LivestockDetailsScreen}
        component={LiveStockDetails}
      />
      <Stack.Screen
        name={screenNames.AddLiveStockScreen}
        component={AddLiveStock}
      />
      <Stack.Screen
        name={screenNames.MachineryDetails}
        component={MachineryDetails}
      />

      <Stack.Screen
        name={screenNames.AddMachineryDetails}
        component={AddMachineryDetails}
      />
      <Stack.Screen
        name={screenNames.AddMachineryScreen}
        component={AddMachinery}
      />
      <Stack.Screen
        name={screenNames.EditMachinery}
        component={EditMachinery}
      />
      <Stack.Screen
        name={screenNames.AdditionalLinkScreen}
        component={AdditionalLinks}
      />
      <Stack.Screen
        name={screenNames.DeleteAccount}
        component={DeleteAccount}
      />
      <Stack.Screen
        name={screenNames.DeleteAccountOTP}
        component={DeleteAccountOTP}
      />
      <Stack.Screen
        name={screenNames.ProfileDetailsSubScreen}
        component={ProfileDetailsSubScreen}
      />

      <Stack.Screen name={screenNames.LandDetails} component={LandDetails} />

      <Stack.Screen
        name={screenNames.EditAdditionalDetails}
        component={EditAdditionalDetails}
      />
      <Stack.Screen
        name={screenNames.EditAddressDetails}
        component={EditAddressDetails}
      />
      <Stack.Screen name={screenNames.EditCrop} component={EditCrop} />
      <Stack.Screen name={screenNames.EditLand} component={EditLand} />
      <Stack.Screen name={screenNames.AddCrop} component={AddCrop} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
