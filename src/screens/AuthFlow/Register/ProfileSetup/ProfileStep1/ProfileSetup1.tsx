import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Button,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  CommonButton,
  CommonInput,
  CommonLoader,
  CommonText,
  GradientBackground,
  ScreenWrapper,
} from '../../../../../components';
import CommonDropdown from '../../../../../components/CommonDropdown';
import {
  BackSideUpload,
  Document,
  DownIcon,
  FrontSideUpload,
  IDNumber,
  KishaniDidi,
  Female,
  FemaleInBlack,
  Male,
  MaleInBlack,
  ProfileSelectTab,
  UserUnfilled,
  Calender,
  CloseButton,
  CloseImage,
  UserUnfilledGray,
} from '../../../../../assets/icons';
import { colors } from '../../../../../themes/colors';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';
import KisaniDidiModal from '../../../../../components/CommonBottomSelectModal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ProfileProgressCard from '../../../../../components/ProfileProgressCard';
import { Images } from '../../../../../assets/images';
import { Text } from 'react-native-gesture-handler';
import CommonBottomSelectModal from '../../../../../components/CommonBottomSelectModal';
import { useTranslation } from 'react-i18next';
import GenderButton from '../../../../../components/GenderButton';
import DatePicker from 'react-native-date-picker';
import { fonts } from '../../../../../themes/fonts';
import EncryptionService, {
  extractCardDetails,
  requestMediaPermission,
} from '../../../../../utils/helperFunction';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../../../../navigation/authNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { screenNames } from '../../../../../navigation/screenNames';
import ImagePickerModal from '../../../../../components/ImagePikerModal';
import { styles } from './style';
import { showToastable } from 'react-native-toastable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import {
  getKisaniDidiList,
  submitProfileStep1,
} from '../../../../../redux/slices/authSlice';
const SECRET_KEY = 'my_super_secret_key_123!';
import { Buffer } from 'buffer';

interface KisaniItem {
  id: string;
  name: string;
  phone: string;
  location: string;
}

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'ProfileSetupStep1'
>;

const ProfileSetupStep1 = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const todayDate = new Date();
  const eighteenYearsAgo = new Date(
    todayDate.getFullYear() - 18,
    todayDate.getMonth(),
    todayDate.getDate(),
  );

  // State to hold form data
  const [idNumber, setIdNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState(''); // Default to Male based on screenshot
  const [showKisanModal, setShowKisanModal] = useState(false);
  const [selectedKisani, setSelectedKisani] = useState<KisaniItem | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<KisaniItem | null>(
    null,
  );
  const [frontImageUri, setFrontImageUri] = useState(null);
  const [backImageUri, setBackImageUri] = useState(null);
  const [imageType, setImageType] = useState('front');
  const [showDocument, setShowDocument] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  // const [date, setDate] = useState(eighteenYearsAgo);
  const [date, setDate] = useState<Date | null>(null);

  const [show, setShow] = useState(false);
  const [partAOcr, setPart_A_OCR] = useState({});
  const [partBOcr, setPart_B_OCR] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [kisaniList, setKisaniList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const progressPercent = 20;
  const token = useSelector((state: RootState) => state?.auth?.accessToken);

  const handleContinue = () => {
    // Handle form submission/navigation
    // navigation.navigate(screenNames.ProfileStep2Screen);
    handleProfileSetup1();
  };

  useEffect(() => {
    setIdNumber(partAOcr?.idNumber);
    // setFullName(partAOcr?.name);
    //console.log('details============>', partAOcr);
  }, [partAOcr, partBOcr]);

  useEffect(() => {
    if (showKisanModal) {
      getKisaniDidiListAPI(1, false);
    }
  }, [showKisanModal]);

  // 👉 Calculate max date (today - 18 years)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );

  // Format as DD/MM/YYYY
  const formatDate = date => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openPickerOptions = type => {
    setImageType(type);
    setModalVisible(true);
  };

  const getKisaniDidiListAPI = async (pageNumber = 1, append = false) => {
    // if (loading) return; // prevent multiple triggers
    setLoading(true);

    // const timeout = setTimeout(() => {
    //   setLoading(false);
    //   showToastable({ message: 'Network timeout', status: 'danger' });
    // }, 15000);

    try {
      const response = await dispatch(
        getKisaniDidiList({
          payload: { page: pageNumber, limit: 10 },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      // clearTimeout(timeout);
      setLoading(false);

      if (response?.statusCode == 200) {
        const newData = response?.data || []; // adjust key based on your API response
        // setKisaniList(prev => (append ? [...prev, ...newData] : newData));
        //console.log('newData--------------  ', newData);

        // check if more data available
        if (newData.length < 10) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setKisaniList(newData);
      }
    } catch (err: any) {
      // clearTimeout(timeout);
      setLoading(false);
      //console.log('Kisani API Error:', err);
    }
  };
  const handleProfileSetup1 = async () => {
    try {
      setLoading(true);
      // const timeout = setTimeout(() => {
      //   setLoading(false);
      //   showToastable({ message: 'Network timeout', status: 'danger' });
      // }, 15000);
      // const response = await dispatch(verifyOtp({ otp: '123456', tempToken: tempToken,deviceId : "fff" })).unwrap(); // ✅ unwrap to get API response directly
      const response = await dispatch(
        submitProfileStep1({
          payload: {
            step: '1',
            supervisorStaffId: selectedKisani?.id,
            documentType: selectedDocument?.detail, //voter_id,ration_card,driver_license,kisaan_card
            encryptedDocumentNumber: idNumber, //EncryptionService.encrypt(idNumber),
            fullName: fullName,
            gender: gender,
            dob: date?.toISOString()?.split('T')[0],
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ).unwrap();
      //console.log('response----c----------  ', response);
      // clearTimeout(timeout);
      setLoading(false);
      if (response?.statusCode == 200) {
        setLoading(false);
        navigation.navigate(screenNames.ProfileStep2Screen);
      }
      setLoading(false);
    } catch (err: any) {
      showToastable({ message: err, status: 'danger' });

      setLoading(false);
    }
  };

  const pickFromGallery = async () => {
    // const hasPermission = await requestMediaPermission();
    // if (!hasPermission) {
    //   //console.log(hasPermission);
    //   return;
    // }
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      if (imageType === 'front') {
        setFrontImageUri(result.assets[0].uri || null);
        try {
          const details = await extractCardDetails(
            selectedDocument.name,
            result.assets[0].uri,
            'A',
          );
          //console.log('Extracted Detailsxxxxxx:', details);
          setPart_A_OCR(details);
        } catch (err) {
          console.error(err);
        }
      } else {
        setBackImageUri(result.assets[0].uri || null);
        try {
          const details = await extractCardDetails(
            selectedDocument.name,
            result.assets[0].uri,
            'A',
          );
          //console.log('Extracted Details:', details);
          setPart_B_OCR(details);
        } catch (err) {
          console.error(err);
        }
      }
      setModalVisible(false);
    }
  };

  // For Voter ID
  // extractCardDetails('voter');

  // // For Ration Card
  // extractCardDetails('ration');

  // // For Farmer Card
  // extractCardDetails('farmer');

  // // For Driving Licence
  // extractCardDetails('dl');

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
      if (imageType === 'front') {
        setFrontImageUri(result.assets[0].uri || null);
        let details = await extractCardDetails(
          selectedDocument.name,
          result.assets[0].uri,
          'A',
        );
        setPart_A_OCR(details);
      } else {
        setBackImageUri(result.assets[0].uri || null);
        let details = extractCardDetails(
          selectedDocument.name,
          result.assets[0].uri,
          'B',
        );
        setPart_B_OCR(details);
      }
      setModalVisible(false);
    }
  };

  const isFormValid = () => {
    if (!selectedDocument) return false;
    if (!idNumber || idNumber.length < 4) return false; // adjust min length
    if (!fullName || fullName.trim().length < 3) return false;
    if (!gender) return false;
    if (!date) return false;

    // Check age >= 18
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    if (age < 18) return false;

    // if (!frontImageUri || !backImageUri) return false;
    if (!frontImageUri) return false;

    return true;
  };

  const calculateProgress = () => {
    //  let filled = 0;
    // const totalFields = 6; // total fields we consider for progress

    // if (selectedKisani) filled++;
    if (
      selectedDocument &&
      idNumber &&
      fullName &&
      gender &&
      date &&
      frontImageUri
    ) {
      return 0.33;
    }
    return 0;
  };

  return (
    <ScreenWrapper
      bgColor={colors.transparent}
      scrollable={true}
      style={styles.screenWrapper}
    >
      {/* Top Linear Gradient Section (Progress Bar) */}
      {/* Progress Bar and Text */}
      <CommonLoader visible={loading} />
      <GradientBackground style={styles.progressHeader}>
        {/* Optional overlay for clarity */}
        {/* <View style={styles.overlay} /> */}
        <CommonText style={styles.headerTitle}>
          {t('contactDetailScreen.header')}
        </CommonText>
        {/* Progress Card */}
        <View style={styles.progressContent}>
          <ProfileProgressCard
            progress={calculateProgress()}
            title={t('profileSetup.addBasicDetails')}
            stepText={t('profileSetup.step1')}
            totalSteps={3}
            isFrom={t('profileSetup.complete')}
          />
        </View>
      </GradientBackground>
      <View>
        <View style={styles.contentContainer}>
          {/* My Kisani Didi Dropdown */}
          <CommonText style={styles.sectionTitle} variant="body">
            {t('profileSetup.myKisaniDidi')}
          </CommonText>

          <CommonDropdown
            label={selectedKisani?.name ?? t('profileSetup.selectKisaniDidi')}
            LeftIcon={KishaniDidi}
            RightIcon={DownIcon}
            textStyle={{
              color: selectedKisani?.name ? colors.black : colors.gray,
            }}
            onPress={() => {
              setShowKisanModal(true);
            }}
          />

          {/* Profile Verification Section */}
          <CommonText style={styles.sectionTitle} variant="body">
            <CommonText style={styles.boldText}>
              {t('profileSetup.profileVerification')}
            </CommonText>
            <CommonText style={styles.requiredAsterisk}>*</CommonText>
          </CommonText>
          <CommonText style={styles.verificationHint} variant="body">
            {t('profileSetup.kycHint')}
          </CommonText>
          <CommonDropdown
            label={selectedDocument?.name ?? t('profileSetup.selectDocument')}
            LeftIcon={Document}
            RightIcon={DownIcon}
            onPress={() => setShowDocument(true)}
            textStyle={{
              color: selectedDocument?.name ? colors.black : colors.gray,
            }}
          />
          {selectedDocument?.name && (
            <View style={styles.fileUploadsContainer}>
              <TouchableOpacity onPress={() => openPickerOptions('front')}>
                {frontImageUri ? (
                  <>
                    <Image
                      source={{ uri: frontImageUri }}
                      style={styles.uploadedImage}
                    />
                    <CloseImage
                      height={moderateScale(26)}
                      width={moderateScale(26)}
                      style={styles.documentImagePlaceholder}
                      onPress={() => {
                        setFrontImageUri(null);
                        setPart_A_OCR({});
                        setPart_B_OCR({});
                      }}
                    />
                  </>
                ) : (
                  <FrontSideUpload width={scale(168)} height={scale(120)} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openPickerOptions('back')}>
                {backImageUri ? (
                  <>
                    <Image
                      source={{ uri: backImageUri }}
                      style={styles.uploadedImage}
                    />
                    <CloseImage
                      height={moderateScale(26)}
                      width={moderateScale(26)}
                      style={styles.documentImagePlaceholder}
                      onPress={() => {
                        setBackImageUri(null);
                      }}
                    />
                  </>
                ) : (
                  <BackSideUpload width={scale(168)} height={scale(120)} />
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ID Number Input */}
          <CommonText style={styles.inputLabel} variant="body">
            {t('profileSetup.idNumber')}
            <CommonText style={styles.requiredAsterisk}>*</CommonText>
          </CommonText>

          <CommonInput
            style={styles.inputContainer}
            placeholder={t('profileSetup.enterIdNumber')}
            leftIcon={
              <View style={styles.userName}>
                <IDNumber
                  height={moderateScale(24)}
                  width={moderateScale(24)}
                />
              </View>
            }
            value={idNumber}
            onChangeText={setIdNumber}
          />
        </View>
      </View>
      {/* Farmer Details Section */}
      <View style={styles.farmerDetailsContainer}>
        <CommonText style={[styles.boldText, styles.farmerDetailsTitle]}>
          {t('profileSetup.farmerDetails')}
        </CommonText>

        {/* Full Name Input */}
        <View style={styles.nameInputContainer}>
          <CommonText
            style={[styles.inputLabel, styles.fullNameLabel]}
            variant="body"
          >
            {t('profileSetup.fullName')}
            <CommonText style={styles.requiredAsterisk}>*</CommonText>
          </CommonText>
          <CommonInput
            style={styles.inputContainer}
            placeholder={t('profileSetup.enterFullName')}
            leftIcon={
              <View style={styles.userName}>
                <UserUnfilledGray
                  height={moderateScale(24)}
                  width={moderateScale(24)}
                />
              </View>
            }
            value={fullName}
            onChangeText={setFullName}
          />

          {/* Gender Selector */}
          <CommonText
            style={[styles.inputLabel, styles.genderLabel]}
            variant="body"
          >
            {t('profileSetup.gender')}
          </CommonText>
          {/* <GenderSelector gender={gender} setGender={setGender} /> */}
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
          {/* Date of Birth Input */}
          <CommonText style={styles.inputLabel} variant="body">
            {t('profileSetup.dateOfBirth')}
          </CommonText>
          <CommonDropdown
            label={date ? formatDate(date) : t('profileSetup.dateFormat')}
            LeftIcon={Calender}
            onPress={() => setShow(true)}
          />

          {/* The button is placed outside contentContainer but within ScreenWrapper's scrolling area */}
          <View style={styles.buttonWrapper}>
            <CommonButton
              style={styles.continueButton}
              disabled={!isFormValid()}
              title={t('continue')}
              onPress={handleContinue}
            />
          </View>
          <View style={styles.bottomGap} />
        </View>
        {/* --- KISAN MODAL --- */}
        {/* <KisaniDidiModal
        isVisible={showKisanModal}
        onClose={() => setShowKisanModal(false)}
        onSelect={() => {}}
      /> */}

        <ImagePickerModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onCameraPress={captureFromCamera}
          onGalleryPress={pickFromGallery}
        />
        <CommonBottomSelectModal
          isVisible={showKisanModal}
          title={t('profileSetup.selectKisaniDidi')}
          subDetails="hello"
          showSearchBar={false}
          data={kisaniList}
          mode="kisaniDidi"
          onSelect={item => {
            //console.log('Selected:', item);
            setSelectedKisani(item);
            setShowKisanModal(false);
          }}
          onClose={() => setShowKisanModal(false)}
        />

        <CommonBottomSelectModal
          isVisible={showDocument}
          title={t('profileSetup.selectDocument')}
          data={[
            {
              id: 1,
              name: t('profileSetup.voterId'),
              detail: 'voter_id',
            },
            {
              id: 2,
              name: t('profileSetup.driverLicense'),
              detail: 'ration_card',
            },
            {
              id: 3,
              name: t('profileSetup.kisanCard'),
              detail: 'driver_license',
            },
            {
              id: 4,
              name: t('profileSetup.rationCard'),
              detail: 'kisaan_card',
            },
          ]}
          mode="document"
          subDetails={t('profileSetup.kycHint')}
          onSelect={item => {
            //console.log('Selected:', item);
            setSelectedDocument(item);
            setShowDocument(false);
          }}
          onClose={() => setShowDocument(false)}
        />
      </View>
      {show && (
        <DatePicker
          modal
          mode="date"
          open={show}
          date={date ?? eighteenYearsAgo}
          maximumDate={maxDate} // 👈 restrict selection
          onConfirm={selectedDate => {
            setShow(false);
            setDate(selectedDate);
          }}
          onCancel={() => setShow(false)}
        />
      )}
    </ScreenWrapper>
  );
};
export default ProfileSetupStep1;
