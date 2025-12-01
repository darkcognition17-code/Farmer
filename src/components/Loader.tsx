// Loader.tsx
import React from 'react';
import { View, Modal, Image, StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';
import { Images } from '../assets/images';
import CommonText from './CommonText';
import FastImage from 'react-native-fast-image';
import { colors } from '../themes/colors';

interface LoaderProps {
  visible: boolean;
}

const Loader: React.FC<LoaderProps> = ({ visible }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <View style={styles.loadingView}>
          {/* <Image
          source={Images.Loading2}
          style={styles.gif}
          resizeMode="contain"
        /> */}
          <FastImage
            source={Images.Loading}
            style={styles.gif}
            resizeMode={FastImage.resizeMode.cover}
          />
          {/* <CommonText>Loading</CommonText> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black + '4d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(20),
    backgroundColor: colors.white,
  },
  gif: {
    width: moderateScale(105),
    height: moderateScale(105),
  },
});

export default Loader;
