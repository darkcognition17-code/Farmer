import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import {
  CommonInput,
  CommonButton,
  CommonText,
  ScreenWrapper,
  CommonBottomSelectModal,
  CommonLoader,
  GradientBackground,
} from '../../../../../components';
import { colors } from '../../../../../themes/colors';
import { moderateScale, verticalScale } from '../../../../../utils/responsive';
import { Images } from '../../../../../assets/images';
import { useTranslation } from 'react-i18next';
import { showToastable } from 'react-native-toastable';
import {
  NameGray,
  MailGray,
  CallGray,
  EducationGray,
  ToggleOff,
  ToggleOn,
} from '../../../../../assets/icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { styles } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store';
import { updateFarmerProfile } from '../../../../../redux/slices/authSlice';
import CommonDropdown from '../../../../../components/CommonDropdown';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'EditAdditionalDetails'
>;

const EditAdditionalDetails = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { farmerData } = route.params as { farmerData: any };

  const [guardianName, setGuardianName] = useState('');
  const [alternateMobile, setAlternateMobile] = useState('');
  const [email, setEmail] = useState('');
  const [education, setEducation] = useState('');
  const [selectedGuardian, setSelectedGuardian] = useState('');
  const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, accessToken } = useSelector(
    (state: RootState) => state.auth,
  );
  const educationOptions = [
    { id: 'other', name: t('profileSetup.noFormalEducation') },
    { id: 'primary-school', name: t('profileSetup.primary') },
    { id: 'secondary-school', name: t('profileSetup.secondary') },
    { id: 'higher-secondary', name: t('profileSetup.higherSecondary') },
    { id: 'graduate', name: t('profileSetup.graduate') },
    { id: 'post-graduate', name: t('profileSetup.postGraduate') },
  ];

  useEffect(() => {
    if (farmerData) {
      setGuardianName(farmerData.guardianName || '');
      setSelectedGuardian(
        farmerData?.guardianType == 'father' ? 'Father' : 'Husband',
      );
      setAlternateMobile(farmerData.alternateMobile || '');
      setEmail(farmerData.email || '');

      // setEducation(farmerData.education || '');

      const matched = educationOptions.find(
        item => item.id === farmerData.education,
      );

      setEducation(matched || { id: '', name: '' });
    }
  }, [farmerData]);

  if (loading) {
    return <CommonLoader visible={true} />;
  }

  const handleSave = () => {
    if (
      !guardianName.trim() ||
      !alternateMobile.trim() ||
      !email.trim() ||
      !education?.name.trim()
    ) {
      showToastable({
        message: t('common.fillAllRequiredFields'),
        status: 'danger',
      });
      return;
    }

    const formData = new FormData();
    formData.append('guardianName', guardianName);
    formData.append('alternateMobile', alternateMobile);
    formData.append('email', email);
    formData.append('education', education.id);
    formData.append('guardianType', selectedGuardian);
    //console.log('current-----------------  ', formData);

    dispatch(
      updateFarmerProfile({
        payload: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }),
    )
      .unwrap()
      .then(() => {
        showToastable({
          message: t('editAdditionalDetails.updateSuccess'),
          status: 'success',
        });
        navigation.goBack();
      })
      .catch(error => {
        showToastable({
          message: error || t('editAdditionalDetails.updateError'),
          status: 'danger',
        });
      });
  };

  return (
    <ScreenWrapper
      scrollable
      bgColor={colors.transparent}
      style={styles.screenWrapperContainer}
    >
      <GradientBackground
        onBackPress={() => navigation.goBack()}
        style={styles.progressHeader}
        imageStyle={styles.imageBackgroundStyle}
        backButtonStyles={styles.bell}
        showBackButton={true}
      >
        <View style={styles.headerContainer}>
          <CommonText style={styles.headerTitle}>
            {t('editAdditionalDetails.headerTitle')}
          </CommonText>
        </View>
      </GradientBackground>
      <View style={styles.contentContainer}>
        {/* Guardian Name */}
        <CommonText style={styles.subHeaderTitle}>
          {t('profileSetup.additionalContactDetails')}
        </CommonText>
        <View>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedGuardian('Father')}
              style={styles.genderLabel}
            >
              {selectedGuardian === 'Father' ? (
                <ToggleOn
                  height={moderateScale(24)}
                  width={moderateScale(24)}
                />
              ) : (
                <ToggleOff
                  height={moderateScale(24)}
                  width={moderateScale(24)}
                />
              )}
              <CommonText>{t('profileSetup.fatherName')}</CommonText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedGuardian('Husband')}
              style={styles.genderLabel}
            >
              {selectedGuardian === 'Husband' ? (
                <ToggleOn
                  height={moderateScale(24)}
                  width={moderateScale(24)}
                />
              ) : (
                <ToggleOff
                  height={moderateScale(24)}
                  width={moderateScale(24)}
                />
              )}
              <CommonText>{t('profileSetup.husbandName')}</CommonText>
            </TouchableOpacity>
          </View>
          <CommonInput
            containerStyle={styles.inputContainer}
            style={styles.inputField}
            placeholder={t('profileSetup.enterFatherName')}
            value={guardianName}
            onChangeText={setGuardianName}
            leftIcon={
              <NameGray
                height={moderateScale(24)}
                width={moderateScale(24)}
                style={styles.userOrangeIcon}
              />
            }
          />
        </View>

        {/* Alternate Mobile */}
        <CommonText style={styles.label}>
          {t('profileSetup.alternateMobileNumber')}
        </CommonText>
        <CommonInput
          containerStyle={styles.inputContainer}
          style={styles.inputField}
          placeholder={t('mobileRegister.mobileNumberPlaceholder')}
          value={alternateMobile}
          onChangeText={setAlternateMobile}
          keyboardType="phone-pad"
          leftIcon={
            <CallGray
              height={moderateScale(24)}
              width={moderateScale(24)}
              style={styles.userOrangeIcon}
            />
          }
        />

        {/* Email */}
        <CommonText style={styles.label}>
          {t('profileSetup.emailId')}
        </CommonText>
        <CommonInput
          containerStyle={styles.inputContainer}
          style={styles.inputField}
          placeholder={t('profileSetup.enterEmailId')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          leftIcon={
            <MailGray
              height={moderateScale(24)}
              width={moderateScale(24)}
              style={styles.userOrangeIcon}
            />
          }
        />

        {/* Highest Education */}
        <CommonText style={styles.label}>
          {t('profileSetup.highestEducation')}
        </CommonText>
        <CommonDropdown
          textStyle={{
            color: education.name ? colors.black : colors.Neutrals500,
          }}
          label={education.name || t('profileSetup.selectEducationLevel')}
          LeftIcon={EducationGray}
          onPress={() => setIsEducationModalVisible(true)}
        />

        <CommonBottomSelectModal
          isVisible={isEducationModalVisible}
          onClose={() => setIsEducationModalVisible(false)}
          data={educationOptions}
          onSelect={option => {
            setEducation(option);
            setIsEducationModalVisible(false);
          }}
          title={t('profileSetup.selectEducationLevel')}
        />

        {/* Save Button */}
        <View style={styles.buttonWrapper}>
          <CommonButton
            style={styles.saveButton}
            title={t('editProfile.saveDetails')}
            onPress={handleSave}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};
export default EditAdditionalDetails;
