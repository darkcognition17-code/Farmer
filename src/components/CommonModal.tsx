import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { colors } from '../themes/colors';

import { moderateScale, scale } from '../utils/responsive';
import CommonButton from './CommonButton';
import CommonText from './CommonText';
import { Images } from '../assets/images';
import { ModalIcon } from '../assets/icons';

interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const CommonModal: React.FC<CommonModalProps> = ({
  visible,
  onClose,
  title,
  message,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, onClose, fadeAnim]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <ModalIcon width={scale(64)} height={scale(64)} />
          </Animated.View>
          <CommonText variant="title" style={styles.modalTitle}>
            {title}
          </CommonText>
          <CommonText variant="subtitle" style={styles.modalText}>
            {message}
          </CommonText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',

  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    padding: moderateScale(35),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: colors.Primary,
    width: '100%',
  },
});

export default CommonModal;
