import React from 'react';
import { Text, View, Platform, StyleSheet } from 'react-native';
import useNetInfo from './netInfo';
import { colors } from '../themes/colors';
// import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale } from './responsive';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

const NetStatus = () => {
  const [netConnected, toggleNetState] = useNetInfo();
  // const insets = SafeAreaInsetsContext();
  // let toastHeight = Math.max(insets.bottom, 16);
  const text = netConnected ? 'online' : 'Offline';
  return toggleNetState ? (
    <View
      style={[
        styles.statusContainer,
        { backgroundColor: netConnected ? colors.green : colors.OrangeRed },
      ]}
    >
      <CommonText style={styles.statusText}>{text}</CommonText>
    </View>
  ) : null;
};

export default NetStatus;

const styles = StyleSheet.create({
  statusContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: moderateScale(25),
    marginBottom: Platform.OS == 'ios' ? moderateScale(30) : 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  statusText: {
    color: colors.white,
    fontSize: moderateScale(14),
  },
});
