import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  CommonButton,
  CommonInput,
  CommonText,
  ScreenWrapper,
} from '../../../../../components';
import ProfileProgressCard from '../../../../../components/ProfileProgressCard';
import CommonDropdown from '../../../../../components/CommonDropdown';
import { Images } from '../../../../../assets/images';
import { colors } from '../../../../../themes/colors';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';
import {
  Location,
  DownIcon,
  Pincode,
  Village,
  Mandal,
  State,
  Address,
  AddressGray,
  PincodeGray,
  DistrictGray,
  MandalGray,
  VillageGray,
} from '../../../../../assets/icons';
import { useTranslation } from 'react-i18next';
import CommonBottomSelectModal from '../../../../../components/CommonBottomSelectModal';
import { styles } from './style';
import { t } from 'i18next';
import { screenNames } from '../../../../../navigation/screenNames';
import { showToastable } from 'react-native-toastable';
import {
  getKisaniDidiList,
  getLocationList,
  submitProfileStep1,
} from '../../../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { Buffer } from 'buffer';
import Loader from '../../../../../components/Loader';
import {
  MOBILE_REGEX,
  PASSWORD_HAS_SPECIAL_CHAR_REGEX,
} from '../../../../../utils/regex';

const ProfileSetupStep2 = ({ navigation }: any) => {
  const [completeAddress, setCompleteAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [district, setDistrict] = useState('');
  const [mandal, setMandal] = useState('');
  const [village, setVillage] = useState('');
  const [showState, setShowState] = useState(false);
  const [selectedStateObj, setSelectStateObj] = useState<any>({});
  const [stateArray, setStateArray] = useState<any>([]);
  const [districtArray, setDistrictArray] = useState<any>([]);
  const [mondalArray, setMondalArray] = useState<any>([]);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [showMandal, setshowMandal] = useState(false);
  const [showVillage, setShowVillage] = useState(false);
  const [selectedMandal, setSelectedMandal] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const progressPercent = 20;
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [selectedVillage, setSelectedVillage] = useState<any>(null);
  const [villageArray, setVillageArray] = useState<any>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleContinue = () => {
    //console.log({
    // step: '2',
    // addressLine: completeAddress,
    // stateId: selectedStateObj?.id,
    // districtId: selectedDistrict?.id,
    // mandalId: selectedMandal?.name == 'Other' ? '' : selectedMandal?.id,
    // otherMandalName: selectedMandal?.name == 'Other' ? mandal : '',
    // villageId: selectedVillage?.name == 'Other' ? '' : selectedVillage?.id,
    // otherVillageName: selectedVillage?.name == 'Other' ? village : '',
    // pincode: pincode,
    // });

    handleProfileSetup2();
  };

  // ✅ FIXED: Only trigger search when user types (not on modal open)
  useEffect(() => {
    // Don't search if query is empty or too short
    const debounce = setTimeout(() => {
      let type = '';
      let parentId = '';

      if (showState) {
        type = 'state';
      } else if (showDistrictModal) {
        type = 'district';
        parentId = selectedStateObj.id;
      } else if (showMandal) {
        type = 'city';
        parentId = selectedDistrict.id;
      } else if (showVillage) {
        type = 'village';
        parentId = selectedMandal.id;
      }

      if (type && (searchQuery === '' || searchQuery.length >= 3)) {
        resetPagination(); // Reset pagination when search query changes
        // Clear previous data before fetching new results based on search
        if (type === 'state') setStateArray([]);
        else if (type === 'district') setDistrictArray([]);
        else if (type === 'city') setMondalArray([]);
        else if (type === 'village') setVillageArray([]);

        getLocationData(1, false, type, parentId, searchQuery);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery, showState, showDistrictModal, showMandal, showVillage]);

  const validateForm = () => {
    let isValid = true;

    if (!completeAddress.trim()) return false;
    if (!pincode.trim() || !/^[0-9]{6}$/.test(pincode)) return false;
    if (!selectedStateObj) return false;
    if (!selectedDistrict) return false;
    if (!selectedMandal) return false;

    // --- CASE 1: Mandal = Other ---
    if (selectedMandal?.name === 'Other') {
      // Village is auto-set to Other → no input required
      return true;
    }

    // --- CASE 2: Mandal != Other ---
    if (!selectedVillage) return false;

    // if village = Other → village text must be entered
    if (selectedVillage?.name === 'Other' && !village.trim()) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [
    completeAddress,
    pincode,
    selectedStateObj,
    selectedDistrict,
    selectedMandal,
    selectedVillage,
  ]);

  // ✅ FIXED: Clear arrays and load data only once
  const openModal = async type => {
    setSearchQuery('');
    resetPagination();

    // ✅ Clear the specific array BEFORE opening modal
    if (type === 'state') {
      setStateArray([]);
    } else if (type === 'district') {
      setDistrictArray([]);
    } else if (type === 'city') {
      setMondalArray([]);
    } else if (type === 'village') {
      setVillageArray([]);
    }

    // Fetch data FIRST
    await getLocationData(
      1,
      false,
      type,
      type === 'district'
        ? selectedStateObj.id
        : type === 'city'
          ? selectedDistrict.id
          : type === 'village'
            ? selectedMandal.id
            : '',
      '',
    );

    // Then open only the requested modal
    setShowState(type === 'state');
    setShowDistrictModal(type === 'district');
    setshowMandal(type === 'city');
    setShowVillage(type === 'village');
  };

  const resetPagination = () => {
    setPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
  };

  // ✅ FIXED: Proper data fetching
  const getLocationData = async (
    pageNumber = 1,
    append = false,
    type = '',
    parentId = '',
    search = '',
  ) => {
    if (isLoadingMore || !hasMore) return;
    if (pageNumber > 1) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }

    const tokenBasic = Buffer.from(`mysecret:password`, 'utf8').toString(
      'base64',
    );

    try {
      const response = await dispatch(
        getLocationList({
          payload: {
            page: pageNumber,
            limit: 10,
            type,
            parentId,
            name: search,
          },
          headers: { Authorization: `Basic ${tokenBasic}` },
        }),
      ).unwrap();

      if (pageNumber > 1) {
        setIsLoadingMore(false);
      } else {
        setLoading(false);
      }

      if (response?.statusCode === 200) {
        const newData = response?.data || [];

        // ✅ Determine which setter to use
        const setter =
          type === 'state'
            ? setStateArray
            : type === 'district'
              ? setDistrictArray
              : type === 'village'
                ? setVillageArray
                : setMondalArray;

        // ✅ Add "Other" option only for Mandal and Village
        let finalData = newData;
        if ((type === 'city' || type === 'village') && !append) {
          finalData = [
            ...newData,
            {
              id: '',
              name: 'Other',
              parentId,
              type,
            },
          ];
        }

        setter(prev => (append ? [...prev, ...finalData] : finalData));
        setPage(response?.nextPage);
        setHasMore(response?.nextPage !== -1);
      }
    } catch (error) {
      if (pageNumber > 1) {
        setIsLoadingMore(false);
      } else {
        setLoading(false);
      }
      //console.log('Location Error:', error);
    }
  };

  const calculateProgress = (currentStep: number, totalSteps: number = 3) => {
    let filled = 0;
    const totalFields = 6;

    if (completeAddress) filled++;
    if (pincode && /^\d{6}$/.test(pincode)) filled++;
    if (selectedStateObj?.name) filled++;
    if (selectedDistrict) filled++;
    if (selectedMandal) {
      if (selectedMandal.name == 'Other') {
        if (village) filled++;
      } else {
        filled++;
      }
    }
    if (village) filled++;

    // internal progress (0 → 1)
    const stepProgress = filled / totalFields;

    // add step offset (each step covers 1 / totalSteps of total progress)
    const stepOffset = (currentStep - 1) / totalSteps;

    // total global progress
    return stepOffset + stepProgress / totalSteps;
  };

  const handleProfileSetup2 = async () => {
    try {
      setLoading(true);

      let payload: any = {
        step: '2',
        addressLine: completeAddress,
        stateId: selectedStateObj?.id,
        districtId: selectedDistrict?.id,
        pincode: pincode,
      };

      // 🔥 Mandal handling
      if (selectedMandal?.name === 'Other') {
        payload.otherMandalName = mandal;
      } else {
        payload.mandalId = selectedMandal?.id;
      }

      // 🔥 Village handling
      if (selectedMandal?.name === 'Other') {
        payload.otherVillageName = village;
      } else {
        payload.villageId = selectedVillage?.id;
      }

      const response = await dispatch(
        submitProfileStep1({
          payload,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ).unwrap();
      //console.log('response----------------', response);

      if (response?.statusCode == 200) {
        setLoading(false);
        navigation.navigate(screenNames.ProfileStep3Screen);
      }
      setLoading(false);
    } catch (err: any) {
      // showToastable({ message: err, status: 'danger' });
      //console.log(err);

      showToastable({
        message: err?.message || 'Something went wrong',
        status: 'danger',
      });

      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable style={styles.screenWrapper}>
      <Loader visible={loading} />
      <ImageBackground
        source={Images.GrBg}
        imageStyle={styles.imageBackground}
        style={styles.progressHeader}
        resizeMode="cover"
      >
        <CommonText style={styles.headerTitle}>
          {t('contactDetailScreen.header')}
        </CommonText>

        <View style={styles.progressContent}>
          <ProfileProgressCard
            progress={calculateProgress(2, 3)}
            title={t('profileSetup.addAddressDetails')}
            stepText={t('profileSetup.step2')}
            totalSteps={3}
            currentStep={2}
            isFrom={t('profileSetup.complete')}
          />
        </View>
      </ImageBackground>
      <View style={styles.formContainer}>
        <CommonText style={styles.sectionTitle}>
          {t('profileSetup.homeAddressDetails')}
        </CommonText>

        <CommonInput
          label={t('profileSetup.completeAddress')}
          required
          placeholder={t('profileSetup.enterCompleteAddress')}
          leftIcon={
            <View style={styles.userName}>
              <AddressGray
                width={moderateScale(24)}
                height={moderateScale(24)}
              />
            </View>
          }
          value={completeAddress}
          onChangeText={setCompleteAddress}
          style={styles.inputContainer}
          multiline
        />
        <CommonText style={styles.label}>
          {t('profileSetup.pincode')}
          <CommonText style={styles.required}>*</CommonText>
        </CommonText>

        <CommonInput
          maxLength={6}
          placeholder={t('profileSetup.enterPincode')}
          leftIcon={
            <PincodeGray
              style={styles.pincodeIcon}
              width={moderateScale(24)}
              height={moderateScale(24)}
            />
          }
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
          allowedCharsRegex={MOBILE_REGEX}
          style={styles.inputContainer}
        />
        <CommonText style={styles.label}>
          {t('profileSetup.state')}
          <CommonText style={styles.required}>*</CommonText>
        </CommonText>

        <CommonDropdown
          label={
            selectedStateObj?.name ??
            t('addressDetailScreen.selectStatePlaceholder')
          }
          LeftIcon={DistrictGray}
          RightIcon={DownIcon}
          onPress={() => {
            setSearchQuery('');
            openModal('state');
          }}
        />
        <CommonText style={styles.label}>
          {t('profileSetup.district')}
          <CommonText style={styles.required}>*</CommonText>
        </CommonText>

        <CommonDropdown
          label={
            selectedDistrict?.name ??
            t('addressDetailScreen.selectDistrictPlaceholder')
          }
          LeftIcon={DistrictGray}
          RightIcon={DownIcon}
          disabled={!selectedStateObj?.name}
          onPress={() => {
            if (!selectedStateObj?.id) return;
            setSearchQuery('');
            openModal('district');
          }}
        />
        <CommonText style={styles.label}>
          {t('profileSetup.mandal')}
          <CommonText style={styles.required}>*</CommonText>
        </CommonText>

        <CommonDropdown
          label={
            selectedMandal?.name ||
            t('addressDetailScreen.selectMandalPlaceholder')
          }
          LeftIcon={MandalGray}
          RightIcon={DownIcon}
          disabled={!selectedDistrict?.name}
          onPress={() => {
            if (!selectedDistrict?.id) return;
            setSearchQuery('');
            openModal('city');
          }}
        />

        {selectedMandal?.name == 'Other' && (
          <CommonInput
            placeholder={t('profileSetup.enterMandalName')}
            leftIcon={
              <View style={styles.userName}>
                <MandalGray
                  width={moderateScale(24)}
                  height={moderateScale(24)}
                />
              </View>
            }
            value={mandal}
            onChangeText={setMandal}
            style={styles.inputContainer}
          />
        )}
        <CommonText style={styles.label}>
          {t('profileSetup.village')}
          <CommonText style={styles.required}>*</CommonText>
        </CommonText>
        <CommonDropdown
          label={
            selectedVillage?.name ||
            (selectedMandal?.name === 'Other' && 'Other') ||
            t('addressDetailScreen.selectVillagePlaceholder')
          }
          LeftIcon={VillageGray}
          RightIcon={DownIcon}
          disabled={selectedMandal?.name === 'Other' || !selectedMandal?.name}
          onPress={() => {
            if (selectedMandal?.name === 'Other') return;
            setSearchQuery('');
            openModal('village');
          }}
        />
        {selectedVillage?.name == 'Other' ||
          (selectedMandal?.name === 'Other' && (
            <CommonInput
              placeholder={t('profileSetup.enterVillage')}
              leftIcon={
                <VillageGray
                  width={moderateScale(24)}
                  height={moderateScale(24)}
                />
              }
              value={village}
              onChangeText={setVillage}
              style={styles.inputContainer}
            />
          ))}
      </View>
      <View style={styles.buttonWrapper}>
        <CommonButton
          title={t('continue')}
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={!isFormValid}
        />
      </View>
      <View style={styles.bottomGap} />
      <CommonBottomSelectModal
        isVisible={showState}
        title={t('addressDetailScreen.selectStatePlaceholder')}
        subDetails=""
        data={stateArray}
        placeHolderSearch="Search State"
        mode="document"
        showSearchBar={true}
        onSearch={setSearchQuery}
        searchValue={searchQuery}
        onSelect={item => {
          //console.log(item);
          setSelectStateObj(item);
          setDistrict('');
          setSelectedDistrict(null);
          setDistrictArray([]);
          setMandal('');
          setSelectedMandal(null);
          setMondalArray([]);
          setVillage('');
          setSelectedVillage(null);
          setVillageArray([]);
          setSearchQuery('');
          setShowState(false);
        }}
        onClose={() => {
          setSearchQuery('');
          setShowState(false);
        }}
        onEndReached={() =>
          getLocationData(page, true, 'state', '', searchQuery)
        }
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />
      <CommonBottomSelectModal
        isVisible={showDistrictModal}
        title={t('addressDetailScreen.selectDistrictPlaceholder')}
        subDetails=""
        placeHolderSearch="Search District"
        data={districtArray}
        mode="document"
        showSearchBar={true}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        onSelect={item => {
          setSelectedDistrict(item);
          setDistrict(item.name);
          setMandal('');
          setSelectedMandal(null);
          setMondalArray([]);
          setVillage('');
          setSelectedVillage(null);
          setVillageArray([]);
          setSearchQuery('');
          setShowDistrictModal(false);
        }}
        onClose={() => {
          setSearchQuery('');
          setShowDistrictModal(false);
        }}
        onEndReached={() =>
          getLocationData(
            page,
            true,
            'district',
            selectedStateObj.id,
            searchQuery,
          )
        }
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />
      <CommonBottomSelectModal
        isVisible={showMandal}
        title={t('addressDetailScreen.selectMandalPlaceholder')}
        subDetails=""
        placeHolderSearch="Search Mandal"
        data={mondalArray}
        mode="document"
        searchValue={searchQuery}
        showSearchBar={true}
        onSearch={setSearchQuery}
        onSelect={item => {
          setSelectedMandal(item);
          setMandal('');
          setVillage('');
          setSelectedVillage(null);
          setVillageArray([]);
          setshowMandal(false);
          setSearchQuery('');
        }}
        onClose={() => {
          setSearchQuery('');
          setshowMandal(false);
        }}
        onEndReached={() =>
          getLocationData(page, true, 'city', selectedDistrict.id, searchQuery)
        }
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />
      <CommonBottomSelectModal
        isVisible={showVillage}
        title={t('addressDetailScreen.selectVillagePlaceholder')}
        placeHolderSearch="Search Village"
        subDetails=""
        data={villageArray}
        mode="document"
        showSearchBar={true}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        onSelect={item => {
          setSelectedVillage(item);
          setShowVillage(false);
          setSearchQuery('');
        }}
        onClose={() => {
          setSearchQuery('');
          setShowVillage(false);
        }}
        onEndReached={() =>
          getLocationData(page, true, 'village', selectedMandal.id, searchQuery)
        }
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />
      {/* </View> */}
    </ScreenWrapper>
  );
};

export default ProfileSetupStep2;
