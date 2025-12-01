import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import {
  CommonInput,
  CommonButton,
  CommonText,
  ScreenWrapper,
  CommonLoader, // Import CommonLoader
} from '../../../../../components';
import { colors } from '../../../../../themes/colors';
import { moderateScale, verticalScale } from '../../../../../utils/responsive';
import { Images } from '../../../../../assets/images';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import { showToastable } from 'react-native-toastable';
import {
  BackButton,
  Calender,
  CalenderBlack,
  DobGray,
  DownBlack,
  Female,
  FemaleInBlack,
  IndianFlagWithNumer,
  Male,
  MaleInBlack,
  NameGray,
  UserMyProfile,
  UserOrange,
  UserUnfilled,
  UserUnfilledGray,
  WhiteCamera,
} from '../../../../../assets/icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { styles } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store'; // Import AppDispatch
import { updateFarmerProfile } from '../../../../../redux/slices/authSlice'; // Import updateFarmerProfile
import { IMAGE_BASE_URL } from '../../../../../utils/helperFunction';
import GenderButton from '../../../../../components/GenderButton';
import CommonDropdown from '../../../../../components/CommonDropdown';
import DatePicker from 'react-native-date-picker';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'EditProfile'
>;

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { farmerData } = route.params as { farmerData: any };

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState(''); // New state for date of birth
  const [profileUri, setProfileUri] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date()); // State for the date picker

  const dispatch = useDispatch<AppDispatch>(); // Initialize dispatch
  const { loading, accessToken } = useSelector(
    (state: RootState) => state.auth,
  ); // Get loading and accessToken
  const todayDate = new Date();

  const eighteenYearsAgo = new Date(
    todayDate.getFullYear() - 18,
    todayDate.getMonth(),
    todayDate.getDate(),
  );
  useEffect(() => {
    // Set default date to 18 years ago
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 18);
    setDate(defaultDate);
  }, []);
  //console.log('profileUri', profileUri);
  //console.log('farmerData.profilePhotoUrl', farmerData.profilePhotoUrl);

  useEffect(() => {
    if (farmerData) {
      //console.log('farmerData.dob', farmerData.dob);

      setFullName(farmerData.name || '');
      setGender(farmerData.gender || '');
      setMobile(farmerData.phoneNumber || '');
      setDob(formatDate(farmerData.dob) || ''); // Set dob from farmerData
      setProfileUri(
        farmerData.profilePhotoUrl
          ? IMAGE_BASE_URL + farmerData.profilePhotoUrl
          : '',
      );
    }
  }, [farmerData]);

  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      //console.log('result.assets[0].uri', result.assets[0].uri);
      setProfileUri(result.assets[0].uri);
    } else {
      showToastable({
        message: t('editProfile.noImageSelected'),
        status: 'warning',
      });
    }
  };

  const ddmmyyyyToIso = (input: string): string | null => {
    // allow separators: / or - or .
    const m = input.trim().match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
    if (!m) return null;
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const year = parseInt(m[3], 10);
    // Basic validation
    if (year < 1000 || month < 1 || month > 12 || day < 1) return null;
    // days in month check (accounts for leap year)
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return null;
    const mm = month.toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const formatDate = input => {
    const date = new Date(input); // convert string to Date
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSave = () => {
    if (!fullName.trim() || !gender.trim() || !dob.trim()) {
      showToastable({
        message: t('editProfile.allFieldsRequired'),
        status: 'danger',
      });
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('gender', gender);
    formData.append('dob', ddmmyyyyToIso(dob));

    if (profileUri && profileUri.startsWith('file://')) {
      formData.append('file', {
        uri:
          Platform.OS === 'ios'
            ? profileUri.replace('file://', '')
            : profileUri,
        name: 'document.jpg',
        type: 'image/jpeg', // or 'application/pdf' etc.
      });
    }
    //console.log('fData', formData);

    dispatch(
      updateFarmerProfile({
        payload: formData,
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    )
      .unwrap()
      .then(() => {
        showToastable({
          message: t('editProfile.profileUpdatedSuccessfully'),
          status: 'success',
        });
        navigation.goBack();
      })
      .catch(error => {
        showToastable({
          message: error,
          status: 'danger',
        });
      });
  };

  const onDateConfirm = selectedDate => {
    setShowDatePicker(false);
    setDate(selectedDate);
    // Format the date to YYYY-MM-DD
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    setDob(`${day}/${month}/${year}`);
  };

  if (loading) {
    return <CommonLoader visible={true} />;
  }

  return (
    <ScreenWrapper
      scrollable
      bgColor={colors.transparent}
      style={styles.screenWrapperContainer}
    >
      <ImageBackground
        source={Images.GrBg}
        style={styles.progressHeader}
        imageStyle={styles.imageBackgroundStyle}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.bell}
          >
            <BackButton width={moderateScale(10)} height={moderateScale(15)} />
          </TouchableOpacity>
          <CommonText style={styles.headerTitle}>
            {t('editProfile.headerTitle')}
          </CommonText>
        </View>
      </ImageBackground>
      <View style={styles.contentContainer}>
        <View style={styles.profileSection}>
          <Image
            source={
              profileUri
                ? profileUri.startsWith('file') // local image
                  ? { uri: profileUri }
                  : { uri: profileUri } // backend full URL
                : Images.placeHolder
            }
            resizeMode="cover"
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIcon} onPress={openGallery}>
            <WhiteCamera height={moderateScale(15)} width={moderateScale(15)} />
          </TouchableOpacity>
        </View>

        {/* Full Name */}
        <CommonText style={styles.label}>
          {t('profileSetup.fullName')}
        </CommonText>
        <CommonInput
          containerStyle={styles.nameInput}
          style={styles.inputField}
          placeholder={t('editProfile.enterYourName')}
          value={fullName}
          onChangeText={setFullName}
          leftIcon={
            <NameGray
              height={moderateScale(24)}
              width={moderateScale(24)}
              style={styles.userOrangeIcon}
            />
          }
        />

        {/* Email ID */}
        {/* Gender Selector */}
        <CommonText style={styles.label} variant="body">
          {t('profileSetup.gender')}
        </CommonText>

        <View style={styles.genderContainer}>
          <GenderButton
            label={t('profileSetup.male')}
            Icon={MaleInBlack}
            SelctedIcon={Male}
            onPress={() => setGender('Male')}
            isSelected={gender === 'Male'}
          />
          <GenderButton
            label={t('profileSetup.female')}
            Icon={FemaleInBlack}
            SelctedIcon={Female}
            onPress={() => setGender('Female')}
            isSelected={gender === 'Female'}
          />
        </View>

        <CommonText style={[styles.label, styles.commonMargin]}>
          {t('profileSetup.dateOfBirth')}
        </CommonText>
        <CommonDropdown
          textStyle={{
            color: dob ? colors.black : colors.Neutrals500,
          }}
          label={dob || t('editProfile.selectDate')}
          LeftIcon={Calender}
          onPress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DatePicker
            modal
            open={true}
            date={date}
            mode="date"
            maximumDate={eighteenYearsAgo}
            onConfirm={onDateConfirm}
            onCancel={() => setShowDatePicker(false)}
          />
        )}

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

export default EditProfileScreen;
