import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import {
  CommonInput,
  CommonButton,
  CommonText,
  ScreenWrapper,
  CommonBottomSelectModal,
  CommonLoader,
} from '../../../../../components';
import { colors } from '../../../../../themes/colors';
import { moderateScale, verticalScale } from '../../../../../utils/responsive';
import { Images } from '../../../../../assets/images';
import { useTranslation } from 'react-i18next';
import { showToastable } from 'react-native-toastable';
import {
  BackButton,
  LocationGray,
  PincodeGray,
  MapGray,
  VillageGray,
  DownBlack,
  Mandal,
  Village,
} from '../../../../../assets/icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { styles } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store';
import {
  getLocationList,
  updateFarmerProfile,
} from '../../../../../redux/slices/authSlice';
import CommonDropdown from '../../../../../components/CommonDropdown';
import { Buffer } from 'buffer';
import { MOBILE_REGEX } from '../../../../../utils/regex';
import { updateLandDetails } from '../../../../../redux/slices/authSlice';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'EditAddressDetails'
>;

const EditAddressDetails = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { farmerData, isFromLandEdit } = route.params as { farmerData: any };

  const [completeAddress, setCompleteAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [mandal, setMandal] = useState('');
  const [village, setVillage] = useState('');

  const [isStateModalVisible, setIsStateModalVisible] = useState(false);
  const [isDistrictModalVisible, setIsDistrictModalVisible] = useState(false);
  const [isMandalModalVisible, setIsMandalModalVisible] = useState(false);
  const [isVillageModalVisible, setIsVillageModalVisible] = useState(false);

  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [mandalOptions, setMandalOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState<any>(null);
  const [selectedStateObj, setSelectStateObj] = useState<any>({});
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedMandal, setSelectedMandal] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [showState, setShowState] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);

  const [showMandal, setshowMandal] = useState(false);
  const [showVillage, setShowVillage] = useState(false);
  const [loadingIndicator, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateArray, setStateArray] = useState<any>([]);
  const [districtArray, setDistrictArray] = useState<any>([]);
  const [mondalArray, setMondalArray] = useState<any>([]);
  const [villageArray, setVillageArray] = useState<any>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const accessToken = Buffer.from(
    `${'mysecret'}:${'password'}`,
    'utf8',
  ).toString('base64');

  useEffect(() => {
    if (farmerData) {
      //console.log('farmerData', farmerData);

      setCompleteAddress(
        farmerData.addressLine || farmerData.completeAddress || '',
      );
      setPincode(farmerData.pincode || '');
      setState(farmerData.state || '');
      setSelectStateObj({ id: farmerData.stateId, name: farmerData.state });
      setSelectedDistrict({
        id: farmerData.districtId,
        name: farmerData.district,
      });
      setSelectedVillage({
        id: farmerData?.villageId ?? '',
        name: farmerData?.village ?? 'Other',
      });
      setSelectedMandal({
        id: farmerData?.mandalId ?? '',
        name: farmerData?.mandal ?? 'Other',
      });
      setDistrict(farmerData.district || '');
      setMandal(farmerData?.otherMandalName || '');
      setVillage(farmerData?.otherVillageName || '');
    }
  }, [farmerData]);

  useEffect(() => {
    // stop API when no modal opened
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
        ? selectedStateObj?.id
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
    }, 450);

    return () => clearTimeout(debounce);
  }, [
    searchQuery,
    showState,
    showDistrictModal,
    showMandal,
    showVillage,
    selectedStateObj?.id,
    selectedDistrict?.id,
    selectedMandal?.id,
  ]);

  useEffect(() => {
    //console.log('village-----------', village);
  }, [village]);

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
        const newData = response?.data || [];
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
          type: t('profileSetup.village'),
        };
        if (!append) {
          setVillageArray(prev => [...prev, newItem]);
          setMondalArray(prev => [...prev, newItem]);
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

  const handleSave = async () => {
    // Validate required fields

    // if (
    //   !completeAddress.trim() ||
    //   !pincode.trim() ||
    //   !selectedStateObj?.id ||
    //   !selectedDistrict?.id ||
    //   !selectedMandal?.name ||
    //   !selectedVillage?.name
    // ) {
    //   showToastable({
    //     message: t('common.fillAllRequiredFields'),
    //     status: 'danger',
    //   });
    //   return;
    // }

    // // Optional: pincode validation
    // if (!/^\d{6}$/.test(pincode)) {
    //   showToastable({
    //     message: t('common.invalidPincode'),
    //     status: 'danger',
    //   });
    //   return;
    // }

    const formData = new FormData();
    formData.append('addressLine', completeAddress);
    formData.append('pincode', pincode);
    formData.append('stateId', selectedStateObj?.id);
    formData.append('districtId', selectedDistrict?.id);
    if (selectedMandal?.name == 'Other') {
      formData.append(
        'otherMandalName',
        selectedMandal?.name == 'Other' ? mandal : '',
      );
    } else {
      formData.append('mandalId', selectedMandal?.id || '');
    }
    if (
      selectedMandal?.name === 'Other' ||
      selectedVillage?.name === 'Other' ||
      !selectedVillage?.id
    ) {
      formData.append('otherVillageName', village); // use typed input
    } else {
      formData.append('villageId', selectedVillage?.id);
    }

    const jsonData = {
      completeAddress: completeAddress,
      pincode: pincode,
      stateId: selectedStateObj?.id,
      districtId: selectedDistrict?.id,
      mandalId:
        selectedMandal?.name !== 'Other' ? selectedMandal?.id : undefined,
      otherMandalName: selectedMandal?.name === 'Other' ? mandal : undefined,

      villageId:
        selectedVillage?.name !== 'Other' && selectedVillage?.id
          ? selectedVillage?.id
          : undefined,

      otherVillageName:
        selectedVillage?.name === 'Other' || !selectedVillage?.id
          ? village
          : undefined,
    };

    let cleanJson = Object.fromEntries(
      Object.entries(jsonData).filter(([_, v]) => v !== undefined),
    );
    //console.log('cleanJson------------>', cleanJson);

    setLoading(true);

    try {
      if (isFromLandEdit) {
        globalThis.landId = farmerData?.id;
        const response = await dispatch(
          updateLandDetails({
            payload: cleanJson,
            headers: {
              Authorization: `Bearer ${accessToken}`,
              // 'Content-Type': 'multipart/form-data',
            },
          }),
        ).unwrap();
        //console.log('Param------------------------', formData);

        //console.log('response------------------------', response);
      } else {
        const response = await dispatch(
          updateFarmerProfile({
            payload: formData,
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }),
        ).unwrap();
      }
      setLoading(false);

      showToastable({
        message: t('editAddressDetails.updateSuccess'),
        status: 'success',
      });

      navigation.goBack();
    } catch (error: any) {
      setLoading(false);
      //console.log('Update Address Error:', error);
      showToastable({
        message: error?.message || t('editAddressDetails.updateError'),
        status: 'danger',
      });
    }
  };

  const resetPagination = () => {
    setPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
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
            {t('editAddressDetails.headerTitle')}
          </CommonText>
        </View>
      </ImageBackground>
      <View style={styles.contentContainer}>
        <CommonText style={styles.subHeaderTitle}>
          {t('addressDetailScreen.homeAddressDetails')}
        </CommonText>

        <CommonInput
          multiline
          required={true}
          label={t('profileSetup.completeAddress')}
          containerStyle={styles.addressInputContainer}
          style={styles.inputField}
          placeholder={t('addressDetailScreen.enterAddressPlaceholder')}
          value={completeAddress}
          onChangeText={setCompleteAddress}
          leftIcon={
            <LocationGray
              height={moderateScale(24)}
              width={moderateScale(24)}
              style={styles.userOrangeIcon}
            />
          }
        />

        <CommonInput
          required={true}
          label={t('profileSetup.pincode')}
          containerStyle={styles.addressInputContainer}
          style={styles.inputField}
          placeholder={t('addressDetailScreen.enterPincodePlaceholder')}
          value={pincode}
          onChangeText={setPincode}
          allowedCharsRegex={MOBILE_REGEX}
          keyboardType="number-pad"
          maxLength={6}
          leftIcon={
            <PincodeGray
              height={moderateScale(24)}
              width={moderateScale(24)}
              style={styles.userOrangeIcon}
            />
          }
        />

        {/* State Dropdown */}
        <CommonText style={styles.label}>
          {t('profileSetup.state')}{' '}
          <CommonText style={styles.required}>*</CommonText>
        </CommonText>
        <CommonDropdown
          RightIcon={DownBlack}
          textStyle={{
            color: state ? colors.black : colors.Neutrals500,
          }}
          label={
            selectedStateObj?.name ||
            t('addressDetailScreen.selectStatePlaceholder')
          }
          LeftIcon={MapGray}
          onPress={() => {
            setSearchQuery(''); // Reset search query on dropdown press
            resetPagination();
            setStateArray([]);
            setShowState(true);
          }}
        />
        <CommonBottomSelectModal
          isVisible={showState}
          onClose={() => setShowState(false)}
          data={stateArray}
          onSelect={option => {
            //console.log(option);

            setSelectStateObj(option);
            setDistrict('');
            setSelectedDistrict(null);
            setMandal('');
            setSelectedMandal(null);
            setSelectedVillage(null);
            setSearchQuery('');
            setDistrictArray([]); // stop UI flashing
            setshowMandal(false);
            setShowVillage(false);
            setVillage('');
            setShowState(false);
          }}
          title={t('addressDetailScreen.selectStatePlaceholder')}
          onEndReached={() =>
            getLocationData(page, true, 'state', '', searchQuery)
          }
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          showSearchBar={true}
          onSearch={setSearchQuery}
          searchValue={searchQuery}
          placeHolderSearch={t('addressDetailScreen.searchStatePlaceholder')}
        />

        {/* District Dropdown */}
        <CommonText style={styles.label}>
          {t('profileSetup.district')}{' '}
          <CommonText style={styles.required}>*</CommonText>
        </CommonText>
        <CommonDropdown
          RightIcon={DownBlack}
          textStyle={{
            color: district ? colors.black : colors.Neutrals500,
          }}
          label={
            selectedDistrict?.name ||
            t('addressDetailScreen.selectDistrictPlaceholder')
          }
          LeftIcon={MapGray}
          onPress={() => {
            setSearchQuery(''); // Reset search query on dropdown press
            resetPagination();
            setDistrictArray([]);
            setShowDistrictModal(true);
          }}
          disabled={!selectedStateObj?.name} // Disable if no state is selected
        />
        <CommonBottomSelectModal
          isVisible={showDistrictModal}
          onClose={() => setIsDistrictModalVisible(false)}
          data={districtArray}
          onSelect={option => {
            setSelectedDistrict(option);
            setDistrict(option.name);
            setSelectedMandal(null);
            setSelectedVillage(null);
            setMandal('');
            setVillage('');
            setSearchQuery('');
            setMondalArray([]); // clear to avoid old flash
            setVillageArray([]);
            setShowDistrictModal(false);
          }}
          title={t('addressDetailScreen.selectDistrictPlaceholder')}
          onEndReached={() =>
            getLocationData(
              page,
              true,
              'district',
              selectedStateObj?.id,
              searchQuery,
            )
          }
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          showSearchBar={true}
          onSearch={setSearchQuery}
          searchValue={searchQuery}
          placeHolderSearch={t('addressDetailScreen.searchDistrictPlaceholder')}
        />

        {/* Mandal Dropdown */}
        <CommonText style={styles.label}>
          {t('profileSetup.mandal')}{' '}
          <CommonText style={styles.required}>*</CommonText>
        </CommonText>
        <CommonDropdown
          RightIcon={DownBlack}
          textStyle={{
            color: mandal ? colors.black : colors.Neutrals500,
          }}
          label={
            selectedMandal?.name ||
            t('addressDetailScreen.selectMandalPlaceholder')
          }
          LeftIcon={MapGray}
          onPress={() => {
            setSearchQuery(''); // Reset search query on dropdown press
            resetPagination();
            setMondalArray([]);
            setshowMandal(true);
          }}
          disabled={!selectedDistrict?.name} // Disable if no district is selected
        />

        {selectedMandal?.name == 'Other' && (
          <CommonInput
            placeholder={t('profileSetup.enterMandalName')}
            leftIcon={
              <View style={styles.userName}>
                <Mandal width={moderateScale(24)} height={moderateScale(24)} />
              </View>
            }
            value={mandal}
            onChangeText={setMandal}
            style={styles.inputContainer}
          />
        )}
        <CommonBottomSelectModal
          isVisible={showMandal}
          onClose={() => setIsMandalModalVisible(false)}
          data={mondalArray}
          onSelect={option => {
            setSelectedMandal(option);
            //console.log(selectedMandal?.name);
            setMandal('');
            // reset village
            setVillage('');
            if (selectedMandal?.name != 'Other') {
              setSelectedVillage(null);
            }
            setshowMandal(false);
            setSearchQuery('');
            setVillageArray([]); // prevent showing old villages
          }}
          title={t('addressDetailScreen.selectMandalPlaceholder')}
          onEndReached={() =>
            getLocationData(
              page,
              true,
              'city',
              selectedDistrict?.id,
              searchQuery,
            )
          }
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          showSearchBar={true}
          onSearch={setSearchQuery}
          searchValue={searchQuery}
          placeHolderSearch={t('addressDetailScreen.searchMandalPlaceholder')}
        />

        {/* Village Dropdown */}
        <CommonText style={styles.label}>
          {t('profileSetup.village')}{' '}
          <CommonText style={styles.required}>*</CommonText>
        </CommonText>
        <CommonDropdown
          RightIcon={DownBlack}
          textStyle={{
            color: village ? colors.black : colors.Neutrals500,
          }}
          label={
            selectedVillage?.name ||
            (selectedMandal?.name === 'Other' && 'Other') ||
            t('addressDetailScreen.selectVillagePlaceholder')
          }
          LeftIcon={VillageGray}
          onPress={() => {
            setSearchQuery(''); // Reset search query on dropdown press
            resetPagination();
            setVillageArray([]);
            setShowVillage(true);
          }}
          disabled={selectedMandal?.name == 'Other'} // Disable if no mandal is selected
        />

        {(selectedVillage?.name === 'Other' ||
          selectedMandal?.name === 'Other') && (
          <CommonInput
            placeholder={t('profileSetup.enterVillage')}
            leftIcon={
              <Village width={moderateScale(24)} height={moderateScale(24)} />
            }
            value={village}
            onChangeText={setVillage}
            style={styles.inputContainer}
          />
        )}
        <CommonBottomSelectModal
          isVisible={showVillage}
          onClose={() => setShowVillage(false)}
          data={villageArray}
          onSelect={option => {
            setSelectedVillage(option);
            setSearchQuery('');
            setShowVillage(false);
          }}
          title={t('addressDetailScreen.selectVillagePlaceholder')}
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
          showSearchBar={true}
          onSearch={setSearchQuery}
          searchValue={searchQuery}
          placeHolderSearch={t('addressDetailScreen.searchVillagePlaceholder')}
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

export default EditAddressDetails;
