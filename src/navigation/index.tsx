import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LanguageScreen, SplashScreen } from '../screens';

import AuthNavigator from './authNavigator';
import AppNavigator from './appNavigator';
import { screenNames } from './screenNames';

export type RootStackParamList = {
  Splash: undefined;
  Language: undefined;
  Auth: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={screenNames.Splash}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={screenNames.Splash} component={SplashScreen} />
      <Stack.Screen name={screenNames.Language} component={LanguageScreen} />
      <Stack.Screen name={screenNames.Auth} component={AuthNavigator} />
      <Stack.Screen name={screenNames.App} component={AppNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
