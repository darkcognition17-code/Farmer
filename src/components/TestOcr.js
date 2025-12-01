import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
  NativeModules,
  Platform,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import i18n from '../localization/i18n';
import { colors } from '../themes/colors';

const { OCRModule, OCRModuleAndroid } = NativeModules;

// Helper: Extract IDs from OCR text
const extractIDsFromText = text => {
  const upperText = text.toUpperCase();

  // Voter ID (EPIC)
  const voterIDs =
    upperText.match(/\b[A-Z]{3}[0-9]{7}\b|\b[A-Z]{2}[0-9]{8}[A-Z]?\b/g) || [];

  // Driver License
  const driverLicenses =
    upperText.match(/\b[A-Z]{2}[0-9]{2}\s?[0-9]{11}\b/g) || [];

  // Kisan Card / Farmer ID (8-16 digits)
  const kisanIDs =
    upperText
      .match(/\b(?!1800|91|\\+91)\d{8,16}\b/g)
      ?.filter(id => !id.startsWith('1800') && !id.startsWith('91')) || [];
  return { voterIDs, driverLicenses, kisanIDs };
};

// OCR recognition function
export const recognizeText = async imageUri => {
  try {
    const cleanUri = imageUri.replace('file://', '');
    let text = '';
    if (Platform.OS === 'android') {
      try {
        let resultAndroid = await TextRecognition.recognize(
          'file://' + cleanUri,
        );
        text = resultAndroid.text;
        //console.log(text);
      } catch (e) {
        console.error(i18n.t('ocr.textRecognitionFailed'), e);
        return [];
      }
    } else {
      text = await OCRModule.recognizeText(cleanUri);
    }
    return text;
  } catch (error) {
    //console.log(i18n.t('ocr.ocrError'), error);
    throw error;
  }
};

const OCRModal = ({ visible, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedIDs, setExtractedIDs] = useState({
    voterIDs: [],
    driverLicenses: [],
    kisanIDs: [],
  });

  // Take photo with camera and crop
  const takePhoto = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        width: 800,
        height: 600,
        cropping: false,
        compressImageQuality: 0.8,
        includeBase64: false,
        mediaType: 'photo',
      });
      //console.log('image--------------   ', image);

      if (image && image.path) {
        setImageUri(image.path);
        setSelectedImage({ uri: image.path });
        setRecognizedText('');
        setExtractedIDs({ voterIDs: [], driverLicenses: [], kisanIDs: [] });
      }
    } catch (error) {
      //console.log('Camera Error:', error);
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert(i18n.t('common.error'), i18n.t('ocr.failedToTakePhoto'));
      }
    }
  };

  // Select image from gallery and crop
  const selectFromGallery = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 800,
        height: 600,
        cropping: false,
        compressImageQuality: 0.8,
        includeBase64: false,
        mediaType: 'photo',
      });
      //console.log('image--------------   ', image);

      if (image && image.path) {
        setImageUri(image.path);
        setSelectedImage({ uri: image.path });
        setRecognizedText('');
        setExtractedIDs({ voterIDs: [], driverLicenses: [], kisanIDs: [] });
      }
    } catch (error) {
      //console.log('Gallery Error:', error);
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert(i18n.t('common.error'), i18n.t('ocr.failedToSelectImage'));
      }
    }
  };

  // Perform OCR and extract IDs
  const performOCR = async () => {
    if (!imageUri) {
      Alert.alert(i18n.t('common.error'), i18n.t('ocr.pleaseSelectImageFirst'));
      return;
    }

    setLoading(true);
    try {
      const text = await recognizeText(imageUri);
      const displayText = text || i18n.t('ocr.noTextDetected');
      setRecognizedText(displayText);

      // Extract IDs
      const ids = extractIDsFromText(displayText);
      setExtractedIDs(ids);
    } catch (error) {
      //console.log(i18n.t('ocr.ocrError'), error);
      Alert.alert(
        i18n.t('ocr.ocrErrorTitle'),
        i18n.t('ocr.failedToRecognizeText'),
      );
      setRecognizedText(i18n.t('ocr.errorRecognizingText'));
      setExtractedIDs({ voterIDs: [], driverLicenses: [], kisanIDs: [] });
    } finally {
      setLoading(false);
    }
  };

  // Clear all selections and text
  const clearAll = () => {
    setSelectedImage(null);
    setImageUri(null);
    setRecognizedText('');
    setExtractedIDs({ voterIDs: [], driverLicenses: [], kisanIDs: [] });
    setLoading(false);
  };

  // Close modal
  const handleClose = () => {
    clearAll();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{i18n.t('ocr.title')}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Image Selection Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>{i18n.t('ocr.takePhoto')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={selectFromGallery}>
              <Text style={styles.buttonText}>
                {i18n.t('ocr.chooseFromGallery')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selected Image Preview */}
          {selectedImage && (
            <View style={styles.imageContainer}>
              <Text style={styles.sectionTitle}>
                {i18n.t('ocr.selectedImage')}
              </Text>
              <Image source={selectedImage} style={styles.previewImage} />

              <TouchableOpacity
                style={[styles.button, styles.ocrButton]}
                onPress={performOCR}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.buttonText}>
                    {i18n.t('ocr.recognizeTextButton')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Recognized Text */}
          {recognizedText ? (
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>
                {i18n.t('ocr.recognizedText')}
              </Text>
              <ScrollView style={styles.textScrollView}>
                <Text style={styles.recognizedText}>{recognizedText}</Text>
              </ScrollView>

              {/* Extracted IDs */}
              {(extractedIDs.voterIDs.length ||
                extractedIDs.driverLicenses.length ||
                extractedIDs.kisanIDs.length) && (
                <View style={styles.extractedId}>
                  <Text style={styles.sectionTitle}>
                    {i18n.t('ocr.extractedIDs')}
                  </Text>
                  {extractedIDs.voterIDs.length > 0 && (
                    <Text>
                      {i18n.t('ocr.voterID')} {extractedIDs.voterIDs.join(', ')}
                    </Text>
                  )}
                  {extractedIDs.driverLicenses.length > 0 && (
                    <Text>
                      {i18n.t('ocr.driverLicense')}{' '}
                      {extractedIDs.driverLicenses.join(', ')}
                    </Text>
                  )}
                  {extractedIDs.kisanIDs.length > 0 && (
                    <Text>Kisan ID: {extractedIDs.kisanIDs.join(', ')}</Text>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={[styles.button, styles.copyButton]}
                onPress={() => {
                  Alert.alert(
                    i18n.t('common.copied'),
                    i18n.t('common.textCopiedToClipboard'),
                  );
                }}
              >
                <Text style={styles.buttonText}>📋 Copy Text</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Clear Button */}
          {(selectedImage || recognizedText) && (
            <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
              <Text style={styles.clearButtonText}>🗑️ Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default OCRModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  extractedId: { marginTop: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.LightBorder,
    paddingBottom: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.DarkGray },
  closeButton: { padding: 5 },
  closeText: { fontSize: 20, color: colors.MediumGray2 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.ActivityIndicatorColor,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 150,
  },
  ocrButton: { backgroundColor: '#34C759', marginTop: 10 },
  copyButton: { backgroundColor: '#5856D6', marginTop: 10 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  imageContainer: { marginBottom: 20, alignItems: 'center' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.DarkGray,
    alignSelf: 'flex-start',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.LightBorder,
  },
  textContainer: { marginBottom: 20 },
  textScrollView: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: colors.LightBorder,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  recognizedText: { fontSize: 14, lineHeight: 20, color: colors.DarkGray },
  clearButton: {
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
