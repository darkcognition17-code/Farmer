import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, persistor, RootState } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './src/navigation';
import i18n from './src/localization/i18n';
import Toastable from 'react-native-toastable';
import { moderateScale } from './src/utils/responsive';
import NetStatus from './src/utils/netStatus';
import { Appearance, StyleSheet } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';

const SyncLanguage: React.FC = () => {
  const language = useSelector((state: RootState) => state.language.current);
  Appearance.setColorScheme('light'); // ✅ React Native 0.73+ only

  useEffect(() => {

    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return <Navigator />;
};

const App = () => {
  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <Provider store={store}>
        <PersistGate loading={false} persistor={persistor}>
          <NavigationContainer>
            <Toastable
              statusMap={{
                success: 'green',
                danger: 'red',
                warning: 'yellow',
                info: 'blue',
              }}
              position={'top'}
              duration={3000}
              offset={moderateScale(55)}
            />
            <SyncLanguage />
          </NavigationContainer>
        </PersistGate>
      </Provider>
      <NetStatus />
    </GestureHandlerRootView>

  );
};

export default App;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, }
})