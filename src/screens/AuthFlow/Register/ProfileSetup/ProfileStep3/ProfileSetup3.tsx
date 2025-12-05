import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  PermissionsAndroid,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {
  CommonButton,
  CommonInput,
  CommonLoader,
  CommonText,
  ImagePickerModal,
  ScreenWrapper,
  GradientBackground,
} from '../../../../../components';
import CommonDropdown from '../../../../../components/CommonDropdown';
import ProfileProgressCard from '../../../../../components/ProfileProgressCard';
import CommonBottomSelectModal from '../../../../../components/CommonBottomSelectModal';
import {
  launchImageLibrary,
  launchCamera,
  ImageLibraryOptions,
  CameraOptions,
} from 'react-native-image-picker';
import { Images } from '../../../../../assets/images';
import {
  DownIcon,
  ProfileSelectTab,
  EditPencilIcon,
  PhoneIcon,
  MailIcon,
  EducationIcon,
  UserUnfilled,
  ToggleOn,
  ToggleOff,
  EmailGray,
} from '../../../../../assets/icons';
import { colors } from '../../../../../themes/colors';

import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';

import { styles } from './style';
import { screenNames } from '../../../../../navigation/screenNames';
import { useTranslation } from 'react-i18next';
import { requestMediaPermission } from '../../../../../utils/helperFunction';

import Tooltip from 'react-native-tooltip-2';
import { InfoIcon } from '../../../../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../../../../navigation/authNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { submitProfileStep1 } from '../../../../../redux/slices/authSlice';
import { showToastable } from 'react-native-toastable';

import {
  MOBILE_NUMBER_REGEX,
  MOBILE_REGEX,
  NAME_REGEX,
  USERNAME_REGEX,
} from '../../../../../utils/regex';

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'ProfileSetupStep3'
>;

const ProfileSetupStep3 = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [relationType, setRelationType] = useState<'father' | 'husband'>(
    'father',
  );
  const [relationName, setRelationName] = useState('');
  const [alternateMobile, setAlternateMobile] = useState('');
  const [email, setEmail] = useState('');
  const [education, setEducation] = useState<string | null>(null);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [toolTipInfoVisible, setInfoToolTipVisible] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  // Education options (you can replace with dynamic data)
  const educationOptions = [
    { id: 'other', name: t('profileSetup.noFormalEducation') },
    { id: 'primary-school', name: t('profileSetup.primary') },
    { id: 'secondary-school', name: t('profileSetup.secondary') },
    { id: 'higher-secondary', name: t('profileSetup.higherSecondary') },
    { id: 'graduate', name: t('profileSetup.graduate') },
    { id: 'post-graduate', name: t('profileSetup.postGraduate') },
  ];
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const openPickerOptions = () => {
    setModalVisible(true);
  };

  const pickFromGallery = async () => {
    // const hasPermission = await requestMediaPermission();
    // if (!hasPermission) {
    //   //console.log(hasPermission);
    //   return;
    // }

    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri || null);
      setModalVisible(false);
    }
  };

  const captureFromCamera = async () => {
    // const hasPermission = await requestMediaPermission();
    // if (!hasPermission) {
    //   //console.log(hasPermission);
    //   return;
    // }

    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'front',
    });
    if (result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri || null);
      setModalVisible(false);
    }
  };

  const onSubmit = () => {
    // Basic validation
    // if (!relationName.trim()) {
    //   Alert.alert(
    //     t('profileSetup.validation'),
    //     t('profileSetup.fatherHusbandNameRequired'),
    //   );
    //   return;
    // }
    // You can add more validations (phone format, email regex etc.)

    // Prepare payload and submit
    // const payload = {
    //   relationType,
    //   relationName,
    //   alternateMobile,
    //   email,
    //   education,
    //   photoUri,
    // };

    // //console.log('Submit payload', payload);
    // Alert.alert(
    //   t('profileSetup.saved'),
    //   t('profileSetup.profileSavedSuccessfully'),
    // );
    // navigation.navigate(screenNames.App);
    handleProfileSetup2();
  };

  const handleProfileSetup2 = async () => {
    try {
      setLoading(true);
      // const timeout = setTimeout(() => {
      //   setLoading(false);
      //   showToastable({ message: 'Network timeout', status: 'danger' });
      // }, 15000);
      const formData = new FormData();
      formData.append('education', education?.id ?? '');
      formData.append('step', 3);
      formData.append('alternateMobile', alternateMobile);
      formData.append('email', email);
      formData.append('guardianName', relationName);
      formData.append('guardianType', relationType);

      // Handle file upload
      if (photoUri) {
        formData.append('file', {
          uri:
            Platform.OS === 'ios' ? photoUri.replace('file://', '') : photoUri,
          name: 'document.jpg',
          type: 'image/jpeg', // or 'application/pdf' etc.
        });
      }

      const response = await dispatch(
        submitProfileStep1({
          payload: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }),
      ).unwrap();
      //console.log('response----------------', response);

      // clearTimeout(timeout);
      setLoading(false);
      if (response?.statusCode == 200) {
        setLoading(false);
        navigation.navigate(screenNames.App);
      }
      setLoading(false);
    } catch (err: any) {
      //console.log('err----------------', err);

      showToastable({ message: err, status: 'danger' });

      setLoading(false);
    }
  };

  const calculateProgress = (currentStep: number, totalSteps: number = 3) => {
    let filled = 0;
    const totalFields = 5;

    if (photoUri?.length > 0) filled++;
    if (relationName?.length > 0) filled++;
    if (alternateMobile.length == 10) filled++;
    if (!emailRegex.test(email)) filled++;

    // internal progress (0 → 1)
    const stepProgress = filled / totalFields;

    // add step offset (each step covers 1 / totalSteps of total progress)
    const stepOffset = (currentStep - 1) / totalSteps;

    // total global progress
    return stepOffset + stepProgress / totalSteps;
  };

  return (
    <ScreenWrapper scrollable={true} style={styles.screenWrapper}>
      <CommonLoader visible={loading} />
      <GradientBackground style={styles.headerBackground}>
        <CommonText style={styles.headerTitle} variant="title">
          {t('contactDetailScreen.header')}
        </CommonText>

        <View style={styles.progressWrapper}>
          <ProfileProgressCard
            progress={calculateProgress(3, 3)}
            title={t('profileSetup.addAddressDetails')}
            stepText={t('profileSetup.step3')}
            totalSteps={3}
            currentStep={3}
            isFrom={t('profileSetup.complete')}
          />
        </View>
      </GradientBackground>

      <View style={styles.container}>
        {/* Upload Photo Card */}
        <View style={[styles.card, styles.header]}>
          <View style={styles.photoContainer}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderCircle}>
                <UserUnfilled
                  width={moderateScale(32)}
                  height={moderateScale(32)}
                />
              </View>
            )}

            <TouchableOpacity
              onPress={openPickerOptions}
              activeOpacity={0.8}
              style={[
                styles.editIconWrapper,
                {
                  backgroundColor: photoUri
                    ? colors.ButtonColor
                    : colors.Primary010,
                },
              ]}
            >
              <EditPencilIcon
                width={moderateScale(16)}
                height={moderateScale(16)}
              />
            </TouchableOpacity>
          </View>

          <CommonText style={styles.uploadText}>
            {photoUri
              ? t('profileSetup.changeProfilePhoto')
              : t('profileSetup.uploadProfilePhoto')}
          </CommonText>
        </View>
        <ImagePickerModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onCameraPress={captureFromCamera}
          onGalleryPress={pickFromGallery}
        />

        <View style={styles.card}>
          <CommonText style={styles.additionalContactDetails}>
            {t('profileSetup.additionalContactDetails')}
          </CommonText>
          <View style={styles.card2}>
            <View style={styles.radioRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.radioOption}
                onPress={() => {
                  setRelationName('');
                  setRelationType('father');
                }}
              >
                {relationType === 'father' ? <ToggleOn /> : <ToggleOff />}
                <CommonText style={styles.radioLabel}>
                  {t('profileSetup.fatherName')}
                </CommonText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.radioOption2}
                onPress={() => {
                  setRelationName('');

                  setRelationType('husband');
                }}
              >
                {relationType === 'husband' ? <ToggleOn /> : <ToggleOff />}
                <CommonText style={styles.radioLabel}>
                  {t('profileSetup.husbandName')}
                </CommonText>
              </TouchableOpacity>
            </View>
            <CommonText style={styles.inputLabel}>
              {relationType === 'father'
                ? t('profileSetup.fatherName')
                : t('profileSetup.husbandName')}
            </CommonText>

            <CommonInput
              keyboardType="default"
              placeholder={`${t('profileSetup.enter')} ${
                relationType === 'father'
                  ? t('profileSetup.fatherName')
                  : t('profileSetup.husbandName')
              }`}
              value={relationName}
              maxLength={40}
              onChangeText={setRelationName}
              allowedCharsRegex={NAME_REGEX}
              leftIcon={
                <UserUnfilled
                  width={moderateScale(24)}
                  height={moderateScale(24)}
                />
              }
              style={styles.input}
            />
            <View style={styles.labelContainer}>
              <CommonText style={styles.inputLabel}>
                {t('profileSetup.alternateMobileNumber')}
              </CommonText>
              <Tooltip
                isVisible={toolTipInfoVisible}
                backgroundColor={colors.black + '66'}
                content={
                  <CommonText style={styles.tooltipContent}>
                    {t('profileSetup.mobileDetails')}
                  </CommonText>
                }
                contentStyle={styles.tooltipStyle}
                placement="top"
                onClose={() => setInfoToolTipVisible(false)}
              >
                <InfoIcon
                  width={scale(16)}
                  height={scale(16)}
                  style={styles.infoIcon}
                  onPress={() => setInfoToolTipVisible(true)}
                />
              </Tooltip>
            </View>
            <CommonInput
              maxLength={10}
              placeholder={t('mobileRegister.mobileNumberPlaceholder')}
              value={alternateMobile}
              onChangeText={setAlternateMobile}
              keyboardType="phone-pad"
              allowedCharsRegex={MOBILE_REGEX}
              leftIcon={
                <PhoneIcon
                  width={moderateScale(24)}
                  height={moderateScale(24)}
                />
              }
              style={styles.input}
            />
            <CommonText style={styles.inputLabel}>
              {t('profileSetup.emailId')}
            </CommonText>
            <CommonInput
              placeholder={t('profileSetup.enterEmailId')}
              value={email}
              // onChangeText={setEmail}
              keyboardType="email-address"
              error={emailError}
              onChangeText={text => {
                setEmail(text);

                // Live validation
                if (text.length === 0) {
                  setEmailError('');
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
                  setEmailError(t('profileSetup.enterValidEmail'));
                } else {
                  setEmailError('');
                }
              }}
              leftIcon={
                <EmailGray
                  width={moderateScale(24)}
                  height={moderateScale(24)}
                />
              }
              style={styles.input}
            />
          </View>

          <CommonText style={styles.additionalContactDetails}>
            {t('profileSetup.educationDetails')}
          </CommonText>
          <View style={styles.footerContainer}>
            <CommonText style={styles.inputLabel}>
              {t('profileSetup.highestEducation')}
            </CommonText>
            <TouchableOpacity
              style={styles.educationContainer}
              onPress={() => setShowEducationModal(true)}
            >
              <CommonDropdown
                label={
                  education?.name ?? t('profileSetup.selectEducationLevel')
                }
                LeftIcon={EducationIcon}
                RightIcon={DownIcon}
                onPress={() => setShowEducationModal(true)}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.submitWrapper}>
          <CommonButton
            title={t('common.submit')}
            style={styles.submitButton}
            onPress={onSubmit}
            disabled={
              !(
                photoUri &&
                relationName.trim().length > 0 &&
                alternateMobile.length === 10 &&
                emailRegex.test(email) &&
                education
              )
            }
          />
        </View>
        <View style={styles.bottomGap} />
      </View>

      <CommonBottomSelectModal
        isVisible={showEducationModal}
        title={t('profileSetup.educationDetails')}
        data={educationOptions}
        mode="document"
        onSelect={(item: any) => {
          setEducation(item);
          setShowEducationModal(false);
        }}
        onClose={() => setShowEducationModal(false)}
      />
    </ScreenWrapper>
  );
};

export default ProfileSetupStep3;
