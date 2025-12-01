import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import CommonButton from './CommonButton';
import { moderateScale } from '../utils/responsive';
import { colors } from '../themes/colors';
import CommonText from './CommonText';

interface LockedAccountModalProps {
  visible: boolean;
  reason: string;
  onClose: () => void; // ✅ new prop for close handler
}

const LockedAccountModal: React.FC<LockedAccountModalProps> = ({
  visible,
  reason,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose} // ✅ support Android back press
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <CommonText style={styles.title}>OTP Verification Failed</CommonText>

          {/* Circle alert icon */}
          <View style={styles.iconCircle}>
            <CommonText style={styles.iconText}>!</CommonText>
          </View>

          <CommonText style={styles.message}>{reason}</CommonText>

          <CommonButton
            title="Okay"
            style={styles.buttonStyle}
            onPress={onClose} // ✅ bind the onClose prop
          />
        </View>
      </View>
    </Modal>
  );
};

export default LockedAccountModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.black + '66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle:{ marginTop: moderateScale(10), top: moderateScale(30) },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 30,
    width: '85%',
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.Neutrals010,
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: colors.LoackedIcon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  iconText: {
    fontSize: 32,
    color: colors.LoackedIcon,
    fontWeight: '600',
    marginTop: -4,
  },
  message: {
    fontSize: 14,
    color: colors.DarkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
});
