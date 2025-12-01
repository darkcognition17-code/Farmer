import React, { ReactNode } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { fonts } from '../themes/fonts';
import { colors } from '../themes/colors';
import { Upload } from '../assets/icons';
import { moderateScale } from '../utils/responsive';
import CommonText from './CommonText';

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  Icon1?: ReactNode;
  title1?: String;
  Icon2?: ReactNode;
  title2?: String;
  cancelable?: Boolean;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onCameraPress,
  onGalleryPress,
  Icon1,
  title1,
  Icon2,
  title2,
  cancelable = true,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.bottomModal}
      backdropTransitionOutTiming={0}
    >
      <View style={styles.modalContent}>
        <View style={styles.handleBar} />
        <View style={styles.buttonsContainer}>
          {/* Take Photo */}
          <TouchableOpacity style={styles.optionButton} onPress={onCameraPress}>
            {Icon1 ? Icon1 : <Upload width={22} height={22} />}
            <CommonText style={styles.optionText}>
              {title1 ? title1 : 'Take Photo'}
            </CommonText>
          </TouchableOpacity>

          {/* Choose from Gallery */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={onGalleryPress}
          >
            {Icon2 ? Icon2 : <Upload width={22} height={22} />}
            <CommonText style={styles.optionText}>
              {title2 ? title2 : 'Choose from Gallery'}
            </CommonText>
          </TouchableOpacity>

          {/* Cancel */}
          {cancelable ? (
            <TouchableOpacity
              style={[styles.optionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <CommonText style={[styles.optionText, styles.cancelText]}>
                Cancel
              </CommonText>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(24),
    gap: 10,
    paddingHorizontal: 16,
    margin: moderateScale(12),
    marginBottom: moderateScale(15),
  },
  handleBar: {
    width: 48,
    height: 6,
    backgroundColor: colors.Neutrals100,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 12,
  },
  buttonsContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.black + '1A',
    marginBottom: 32,
    overflow: 'hidden',
    padding: 16,
    gap: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 14,
    // paddingHorizontal: 24,
  },
  optionText: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.medium,
    marginLeft: 12,
  },
  cancelButton: {
    borderTopWidth: 1,
    borderColor: colors.Neutrals900,
  },
  cancelText: {
    color: colors.error,
    marginLeft: 0,
  },
});
