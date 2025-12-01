import React, { useState, useEffect } from 'react';
import { View, ImageBackground, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './style';
import { AppStackParamList } from '../../../../navigation/appNavigator';
import CommonDropdown from '../../../../components/CommonDropdown';
import ProfileProgressCard from '../../../../components/ProfileProgressCard';
import { screenNames } from '../../../../navigation/screenNames';
import {
  CommonButton,
  CommonInput,
  CommonText,
  ScreenWrapper,
  CommonBottomSelectModal,
} from '../../../../components';
import { Images } from '../../../../assets/images';
import {
  Address,
  AddressGray,
  BackButton,
  DistrictGray,
  DownIcon,
  Location,
  Mandal,
  MandalGray,
  Pincode,
  PincodeGray,
  State,
  Village,
  VillageGray,
} from '../../../../assets/icons';
import { moderateScale } from '../../../../utils/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  getLocationList,
  submitAddLand,
} from '../../../../redux/slices/authSlice';
import { Buffer } from 'buffer';
import Loader from '../../../../components/Loader';
import { showToastable } from 'react-native-toastable';
import { MOBILE_REGEX, NAME_REGEX } from '../../../../utils/regex';
import { AuthStackParamList } from '../../../../navigation/authNavigator';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddNewLandStep2'
>;
type AddLandScreenRouteProp = RouteProp<AuthStackParamList, 'Addland2'>;

const AddNewLandStep2 = () => {
  const navigation = useNavigation<NavigationProp>();

  const { t } = useTranslation();

  const [completeAddress, setCompleteAddress] = useState('');

  const [pincode, setPincode] = useState('');

  const [village, setVillage] = useState('');
  const [mandal, setMandal] = useState('');

  const [showState, setShowState] = useState(false);

  const [selectState, setSelectState] = useState<any>(null);

  const [showDistrictModal, setShowDistrictModal] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedVillage, setSelectedVillage] = useState<any>(null);

  const [showMandal, setshowMandal] = useState(false);
  const [showVillage, setShowVillage] = useState(false);

  const [selectedMandal, setSelectedMandal] = useState<any>(null);

  const [isFormValid, setIsFormValid] = useState(false);

  const [stateArray, setStateArray] = useState<any>([]);

  const [districtArray, setDistrictArray] = useState<any>([]);

  const [mondalArray, setMondalArray] = useState<any>([]);

  const [villageArray, setVillageArray] = useState<any>([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: RootState) => state.auth.accessToken);
  const { params } = useRoute<AddLandScreenRouteProp>();
  const { PayloadStep1 } = params;

  const validateForm = () => {
    let isValid = true;

    if (!completeAddress.trim()) return false;
    if (!pincode.trim() || !/^[0-9]{6}$/.test(pincode)) return false;
    if (!selectState) return false;
    if (!selectedDistrict) return false;

    // --- CASE 1: Mandal = Other ---
    if (selectedMandal?.name === 'Other' && selectedMandal) {
      // Village is auto-set to Other → no input required
      return true;
    } else if (selectedMandal?.name != 'Other' && !selectedMandal) {
      return false;
    }

    // --- CASE 2: Mandal != Other ---
    if (!selectedVillage) return false;
    // if village = Other → village text must be entered
    else if (selectedVillage?.name === 'Other' && !village.trim()) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [
    completeAddress,

    pincode,

    selectState,

    selectedDistrict,

    selectedMandal,

    selectedVillage,
  ]);

  const handleContinue = () => {
    if (validateForm()) {
      handleAddNewLandStep2();

      // navigation?.navigate(screenNames.AddNewLandStep3);
    }
  };

  useEffect(() => {
    if (!showState && !showDistrictModal && !showMandal && !showVillage) return;

    const currentType = showState
      ? 'state'
      : showDistrictModal
        ? 'district'
        : showMandal
          ? 'city'
          : showVillage
            ? 'village'
            : '';

    const currentParentId = showState
      ? ''
      : showDistrictModal
        ? selectState?.id
        : showMandal
          ? selectedDistrict?.id
          : showVillage
            ? selectedMandal?.id
            : '';

    const debounce = setTimeout(() => {
      // If search query is empty, and there's no selected parent (e.g., initial state fetch)
      // or if search query is not empty and has changed,
      // reset pagination and fetch new data.
      if (
        (searchQuery === '' && page === 1 && currentType) ||
        (searchQuery !== '' && currentType)
      ) {
        resetPagination();
        getLocationData(1, false, currentType, currentParentId, searchQuery);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [
    searchQuery,
    showState,
    showDistrictModal,
    showMandal,
    showVillage,
    selectState?.id,
    selectedDistrict?.id,
    selectedMandal?.id,
  ]);
  const handleAddNewLandStep2 = async () => {
    try {
      setLoading(true);

      // const timeout = setTimeout(() => {
      //   setLoading(false);

      //   showToastable({ message: 'Network timeout', status: 'danger' });
      // }, 15000);

      // const response = await dispatch(verifyOtp({ otp: '123456', tempToken: tempToken,deviceId : "fff" })).unwrap(); // ✅ unwrap to get API response directly

      let payload: any = {
        addressLine: completeAddress,
        stateId: selectState?.id,
        districtId: selectedDistrict?.id,
        pincode: pincode,
        ...PayloadStep1,
      };
      //console.log('payload-----------', payload);

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
        submitAddLand({
          payload,
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

        navigation.navigate(screenNames.AddNewLandStep3, {
          landDetails: response?.data,
        });
      }

      setLoading(false);
    } catch (err: any) {
      // showToastable({ message: err, status: 'danger' });

      setLoading(false);
    }
  };

  const resetPagination = () => {
    setPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
  };

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
    const tokenBasic = Buffer.from(
      `${'mysecret'}:${'password'}`,
      'utf8',
    ).toString('base64');

    try {
      const response = await dispatch(
        getLocationList({
          payload: {
            page: pageNumber,
            limit: 10,
            type: type,
            parentId: parentId,
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
        const newData = response?.data || []; // adjust key based on your API response
        const locationSetter =
          type === 'state'
            ? setStateArray
            : type === 'district'
              ? setDistrictArray
              : type === 'village'
                ? setVillageArray
                : setMondalArray;
        locationSetter(prev => (append ? [...prev, ...newData] : newData));
        setPage(response?.nextPage);
        setHasMore(response?.nextPage !== -1);

        const newItem = {
          id: '',
          name: 'Other',
          parentId: '',
          type: 'village',
        };

        const newItemMandal = {
          id: '',
          name: 'Other',
          parentId: '',
          type: 'city',
        };
        if (!append) {
          setVillageArray(prev => [...prev, newItem]);
          setMondalArray(prev => [...prev, newItemMandal]);
        }
      }
    } catch (err: any) {
      if (pageNumber > 1) {
        setIsLoadingMore(false);
      } else {
        setLoading(false);
      }
      //console.log('Kisani API Error:', err);
    }
  };

  const calculateProgress = (currentStep: number, totalSteps: number = 3) => {
    let filled = 0;
    const totalFields = 6;

    if (completeAddress) filled++;
    if (pincode && /^\d{6}$/.test(pincode)) filled++;
    if (selectState) filled++;
    if (selectedDistrict) filled++;
    if (selectedMandal) {
      if (selectedMandal.name === 'Other') {
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

  return (
    <ScreenWrapper scrollable style={styles.screenWrapper}>
      <Loader visible={loading} />
      <ImageBackground
        source={Images.GrBg}
        imageStyle={styles.imageBackground}
        style={styles.progressHeader}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          {/* <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.bell}
          >
            <BackButton width={moderateScale(10)} height={moderateScale(15)} />
          </TouchableOpacity> */}
          <CommonText style={styles.headerTitle}>
            {t('addNewLand.title')}
          </CommonText>
        </View>
        <View style={styles.progressContent}>
          <ProfileProgressCard
            progress={calculateProgress(2, 3)}
            title={t('addNewLand.addLandDetails')}
            stepText={`(2/3 ${t('common.step')} )`}
            totalSteps={3}
            isFrom={t('addCrop.FormComplete')}
          />
        </View>
      </ImageBackground>

      <View style={styles.formContainer}>
        <CommonText style={styles.sectionTitle}>
          {t('addNewLand.landLocationDetails')}
        </CommonText>

        <CommonInput
          keyboardType="default"
          label={t('profileSetup.completeAddress')}
          required
          placeholder={t('profileSetup.enterCompleteAddress')}
          leftIcon={
            <AddressGray
              width={moderateScale(24)}
              height={moderateScale(24)}
              style={styles.inputIcon}
            />
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
              width={moderateScale(24)}
              height={moderateScale(24)}
              style={styles.inputIcon}
            />
          }
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
          style={styles.inputContainer}
          allowedCharsRegex={MOBILE_REGEX}
        />

        <CommonText style={styles.label}>
          {t('profileSetup.state')}
          <CommonText style={styles.required}>*</CommonText>
        </CommonText>

        <CommonDropdown
          label={
            selectState?.name || t('addressDetailScreen.selectStatePlaceholder')
          }
          LeftIcon={DistrictGray}
          RightIcon={DownIcon}
          onPress={() => {
            resetPagination();
            setStateArray([]);
            setSearchQuery(''); // Reset search query on dropdown press
            setShowState(true);
          }}
        />

        <CommonText style={styles.label}>
          {t('profileSetup.district')}
          <CommonText style={styles.required}>*</CommonText>
        </CommonText>

        <CommonDropdown
          label={
            selectedDistrict?.name ||
            t('addressDetailScreen.selectDistrictPlaceholder')
          }
          LeftIcon={DistrictGray}
          RightIcon={DownIcon}
          disabled={!selectState?.name}
          onPress={() => {
            resetPagination();
            setDistrictArray([]);
            setSearchQuery('');
            setShowDistrictModal(true);
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
            resetPagination();
            setMondalArray([]);
            setSearchQuery('');
            setshowMandal(true);
          }}
        />

        {selectedMandal?.name == 'Other' && (
          <CommonInput
            keyboardType="default"
            placeholder={t('profileSetup.enterMandalName')}
            leftIcon={
              <MandalGray
                width={moderateScale(24)}
                height={moderateScale(24)}
                style={styles.dropdownIcon}
              />
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
            resetPagination();
            setVillageArray([]);
            setSearchQuery('');
            setShowVillage(true);
          }}
        />
        {(selectedVillage?.name === 'Other' ||
          selectedMandal?.name === 'Other') && (
          <CommonInput
            keyboardType="default"
            placeholder={t('profileSetup.enterVillage')}
            leftIcon={
              <VillageGray
                width={moderateScale(24)}
                height={moderateScale(24)}
                style={styles.dropdownIcon}
              />
            }
            value={village}
            onChangeText={setVillage}
            style={styles.inputContainer}
            allowedCharsRegex={NAME_REGEX}
          />
        )}
      </View>

      <View style={styles.buttonWrapper}>
        <CommonButton
          title={t('common.saveContinue')}
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={!isFormValid}
        />
      </View>

      <CommonBottomSelectModal
        isVisible={showState}
        title={t('addressDetailScreen.selectStatePlaceholder')}
        subDetails=""
        data={stateArray}
        mode="document"
        showSearchBar={true}
        onSearch={setSearchQuery}
        searchValue={searchQuery}
        onSelect={item => {
          setSelectState(item);
          setDistrictArray([]); // ⛔ stop old data flash
          setSelectedDistrict(null);
          setSelectedMandal(null);
          setVillage('');
          setSearchQuery(''); // must set AFTER closing
          setShowState(false);
        }}
        onClose={() => setShowState(false)}
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
        data={districtArray}
        mode="document"
        showSearchBar={true}
        onSearch={setSearchQuery}
        searchValue={searchQuery}
        onSelect={item => {
          setSelectedDistrict(item);
          setMondalArray([]); // ⛔ clear to avoid UI flash
          setSelectedMandal(null);
          setVillage('');
          setSearchQuery('');
          setShowDistrictModal(false);
        }}
        onClose={() => setShowDistrictModal(false)}
        onEndReached={() =>
          getLocationData(page, true, 'district', selectState?.id, searchQuery)
        }
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />

      <CommonBottomSelectModal
        isVisible={showMandal}
        title={t('addressDetailScreen.selectMandalPlaceholder')}
        subDetails=""
        data={mondalArray}
        mode="document"
        showSearchBar={true}
        onSearch={setSearchQuery}
        searchValue={searchQuery}
        onSelect={item => {
          setSelectedMandal(item);
          setVillageArray([]); // ⛔ clear to avoid showing old list
          setSelectedVillage(null);
          setVillage('');
          setSearchQuery('');
          setshowMandal(false);
        }}
        onClose={() => setshowMandal(false)}
        onEndReached={() =>
          getLocationData(page, true, 'city', selectedDistrict?.id, searchQuery)
        }
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />

      <CommonBottomSelectModal
        isVisible={showVillage}
        title={t('addressDetailScreen.selectVillagePlaceholder')}
        subDetails=""
        data={villageArray}
        mode="document"
        showSearchBar={true}
        onSearch={setSearchQuery}
        searchValue={searchQuery}
        onSelect={item => {
          setSelectedVillage(item);
          setShowVillage(false);
          setSearchQuery('');
          //console.log(selectedVillage?.name);
        }}
        onClose={() => setShowVillage(false)}
        onEndReached={() =>
          getLocationData(
            page,
            true,
            'village',
            selectedMandal?.id,
            searchQuery,
          )
        }
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />
    </ScreenWrapper>
  );
};

export default AddNewLandStep2;
