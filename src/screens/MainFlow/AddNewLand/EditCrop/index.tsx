import React, { useEffect, useEffectEvent, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Text,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './style';
import { AppStackParamList } from '../../../../navigation/appNavigator';
import {
  CommonText,
  CommonButton,
  CommonInput,
  ScreenWrapper,
  CommonBottomSelectModal,
} from '../../../../components';
import ProfileProgressCard from '../../../../components/ProfileProgressCard';
import { Images } from '../../../../assets/images';
import { colors } from '../../../../themes/colors';
import { screenNames } from '../../../../navigation/screenNames';
import { DownIcon } from '../../../../assets/icons';
import CommonDropdown from '../../../../components/CommonDropdown';
import { moderateScale, verticalScale } from '../../../../utils/responsive';
import { fonts } from '../../../../themes/fonts';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { showToastable } from 'react-native-toastable';
import {
  deleteLandCrop,
  getCropType,
  getCropTypeVariety,
  getCropTypeVarietySeeds,
  getLocationList,
  submitAddLandStep3,
  updateCrops,
} from '../../../../redux/slices/authSlice';
import CropForm from '../../../../components/CropForm';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddNewLandStep3'
>;
type NewLandScreenRouteProp = RouteProp<AuthStackParamList, 'MobileOtp'>;

const EditCrop = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const [crops, setCrops] = useState<any[]>([]);
  const [cropsIDS, setCropsWithID] = useState<any[]>([]);

  const [activeDropdown, setActiveDropdown] = useState<{
    index: number | null;
    field: string | null;
  }>({ index: null, field: null });

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data for dropdowns
  const unitOptions = [
    { name: 'Acres', key: 'acre' },
    { name: 'Hectares', key: 'hectare' },
  ];
  const [cropTypeOptions, setCropTypeOptions] = useState([]);
  const [varietyOptions, setVarietyOptions] = useState([]);
  const [seedOptions, SetSeedOptions] = useState([]);

  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const { params } = useRoute<NewLandScreenRouteProp>();
  const { landDetails, cropDetails } = params;
  //console.log('cropDetails----------------', cropDetails);

  const handleAddCrop = () => {
    setCrops(prev => [
      ...prev,
      { area: '', unit: 'Acres', type: '', variety: '', seed: '' },
    ]);
  };

  const handleClearCrop = (index: number) => {
    const updated = crops.filter((_, i) => i !== index);
    setCrops(updated);
  };

  useEffect(() => {
    if (cropDetails) {
      const formattedCrop = {
        area: cropDetails.totalPlantedArea?.toString() ?? '',
        unit: cropDetails.unit === 'acre' ? 'Acres' : 'Hectare',

        type: cropDetails.cropType || '',
        typeID: cropDetails.cropTypeId || '',

        variety: cropDetails.cropVariety || '',
        varietyID: cropDetails.cropVarietyId || '',

        seed: cropDetails.seedVariety || '',
        seedID: cropDetails.seedVarietyId || '',
      };

      setCrops([formattedCrop]);
    }
  }, [cropDetails]);

  const openDropdown = (index: number, field: string) => {
    //console.log('index=======', index);
    //console.log('field=======', field);

    setActiveDropdown({ index, field });
    if (field == 'type') {
      getCroptype();
    } else if (field == 'variety') {
      CropTypeVariety();
    } else if (field == 'seed') {
      CropTypeVarietySeeds();
    } else {
      setModalVisible(true);
    }
  };

  const handleSelect = (item: any) => {
    if (activeDropdown.index === null || !activeDropdown.field) return;

    const updated = [...crops];

    const field = activeDropdown.field;

    // Set the selected value
    updated[activeDropdown.index][field] = item.name;
    updated[activeDropdown.index][field + 'ID'] = item.id;

    // Reset dependent fields
    if (field === 'type') {
      updated[activeDropdown.index].variety = '';
      updated[activeDropdown.index].varietyID = '';
      updated[activeDropdown.index].seed = '';
      updated[activeDropdown.index].seedID = '';
    } else if (field === 'variety') {
      updated[activeDropdown.index].seed = '';
      updated[activeDropdown.index].seedID = '';
    }

    setCrops(updated);
    setModalVisible(false);
  };

  const getDropdownOptions = () => {
    switch (activeDropdown.field) {
      case 'unit':
        return unitOptions;
      case 'type':
        return cropTypeOptions;
      case 'variety':
        return varietyOptions;
      case 'seed':
        return seedOptions;
      default:
        return [];
    }
  };

  const getCroptype = async (
    pageNumber = 1,
    append = false,
    type = '',
    parentId = '',
  ) => {
    if (loading) return; // prevent multiple triggers
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      showToastable({ message: 'Network timeout', status: 'danger' });
    }, 15000);

    try {
      const response = await dispatch(
        getCropType({
          payload: { page: pageNumber, limit: 20 },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);

      if (response?.statusCode === 200) {
        const newData = response?.data || []; // adjust key based on your API response
        //console.log(newData);

        setCropTypeOptions(newData);
        setModalVisible(true);
      }
    } catch (err: any) {
      clearTimeout(timeout);
      setLoading(false);
      //console.log('Kisani API Error:', err);
    }
  };

  const CropTypeVariety = async (
    pageNumber = 1,
    append = false,
    type = '',
    parentId = '',
  ) => {
    if (loading) return; // prevent multiple triggers
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      showToastable({ message: 'Network timeout', status: 'danger' });
    }, 15000);

    try {
      const response = await dispatch(
        getCropTypeVariety({
          payload: {
            page: pageNumber,
            limit: 20,
            cropTypeId: crops[crops.length - 1]?.typeID,
          },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);

      if (response?.statusCode === 200) {
        const newData = response?.data || []; // adjust key based on your API response
        //console.log(newData);

        setVarietyOptions(newData);
        setModalVisible(true);
      }
    } catch (err: any) {
      clearTimeout(timeout);
      setLoading(false);
      //console.log('Kisani API Error:', err);
    }
  };

  const CropTypeVarietySeeds = async (
    pageNumber = 1,
    append = false,
    type = '',
    parentId = '',
  ) => {
    if (loading) return; // prevent multiple triggers
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      showToastable({ message: 'Network timeout', status: 'danger' });
    }, 15000);

    try {
      const response = await dispatch(
        getCropTypeVarietySeeds({
          payload: {
            page: pageNumber,
            limit: 20,
            cropTypeId: crops[crops.length - 1]?.typeID,
            cropVarietyId: crops[crops.length - 1]?.varietyID,
          },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);

      if (response?.statusCode === 200) {
        const newData = response?.data || []; // adjust key based on your API response
        //console.log(newData);

        SetSeedOptions(newData);
        setModalVisible(true);
      }
    } catch (err: any) {
      clearTimeout(timeout);
      setLoading(false);
      //console.log('Kisani API Error:', err);
    }
  };

  const SubmitStep3 = async () => {
    if (loading) return;
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      showToastable({ message: 'Network timeout', status: 'danger' });
    }, 15000);

    // Take the first filled crop (or adjust if multiple)
    const crop = crops.find(
      item =>
        item.area && item.unit && item.typeID && item.varietyID && item.seedID,
    );

    if (!crop) {
      showToastable({ message: 'Please fill crop details', status: 'danger' });
      setLoading(false);
      return;
    }
    global.cropId = cropDetails.id;
    try {
      const response = await dispatch(
        updateCrops({
          payload: {
            totalLandUnderCultivation: Number(crop.area),
            unit: crop.unit === 'Acres' ? 'acre' : 'hectare',
            cropTypeId: crop.typeID,
            cropVarietyId: crop.varietyID,
            seedVarietyId: crop.seedID,
          }, // ✅ direct payload like adults/children example
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        navigation.goBack();
      }
    } catch (err) {
      clearTimeout(timeout);
      setLoading(false);
      //console.log('Kisani API Error:', err);
    }
  };

  const deleteCrop = async () => {
    if (loading) return; // prevent multiple triggers
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      showToastable({ message: 'Network timeout', status: 'danger' });
    }, 15000);

    try {
      const response = await dispatch(
        deleteLandCrop({
          payload: { id: cropDetails.id },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);

      if (response?.statusCode === 200) {
        navigation.goBack();
      }
    } catch (err: any) {
      clearTimeout(timeout);
      setLoading(false);
      //console.log('Kisani API Error:', err);
    }
  };

  const isCropFilled = crop => {
    return (
      crop.area &&
      crop.area !== '' &&
      crop.type &&
      crop.type !== '' &&
      crop.typeID &&
      crop.typeID !== '' &&
      crop.variety &&
      crop.variety !== '' &&
      crop.varietyID &&
      crop.varietyID !== '' &&
      crop.seed &&
      crop.seed !== '' &&
      crop.seedID &&
      crop.seedID !== ''
    );
  };

  const calculateProgress = (currentStep: number, totalSteps: number = 3) => {
    let filled = 0.9;
    const totalFields = 1;

    if (crops.length > 0) {
      const hasAnyCropData = crops.some(isCropFilled);

      if (hasAnyCropData) {
        filled++;
      }
    }

    const stepProgress = filled / totalFields;
    const stepOffset = (currentStep - 1) / totalSteps;

    return stepOffset + stepProgress / totalSteps;
  };

  // 1. Prepare Initial Data for the Form
  const initialCrops = useMemo(() => {
    if (!cropDetails) return [];
    return [
      {
        area: cropDetails.totalPlantedArea?.toString() ?? '',
        unit: cropDetails.unit === 'acre' ? 'Acres' : 'Hectare',
        type: cropDetails.cropType || '',
        typeID: cropDetails.cropTypeId || '',
        variety: cropDetails.cropVariety || '',
        varietyID: cropDetails.cropVarietyId || '',
        seed: cropDetails.seedVariety || '',
        seedID: cropDetails.seedVarietyId || '',
      },
    ];
  }, [cropDetails]);

  // 2. Define Custom Submit Logic (Update API)
  const handleUpdateCrop = async (crops: any[]) => {
    if (loading) return;
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
      showToastable({ message: 'Network timeout', status: 'danger' });
    }, 15000);

    const crop = crops[0]; // Edit mode implies single crop
    if (!crop || !crop.area) {
      setLoading(false);
      return;
    }

    try {
      global.cropId = cropDetails.id; // Maintain legacy behavior if needed

      const response = await dispatch(
        updateCrops({
          payload: {
            totalLandUnderCultivation: Number(crop.area),
            unit: crop.unit === 'Acres' ? 'acre' : 'hectare',
            cropTypeId: crop.typeID,
            cropVarietyId: crop.varietyID,
            seedVarietyId: crop.seedID,
          },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        navigation.goBack();
      }
    } catch (err) {
      clearTimeout(timeout);
      setLoading(false);
      //console.log('Update Error:', err);
    }
  };

  // 3. Define Custom Delete Logic
  const handleDeleteCrop = async () => {
    if (loading) return;
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 15000);

    try {
      const response = await dispatch(
        deleteLandCrop({
          payload: { id: cropDetails.id },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);
      if (response?.statusCode === 200) {
        navigation.goBack();
      }
    } catch (err) {
      clearTimeout(timeout);
      setLoading(false);
      //console.log('Delete Error:', err);
    }
  };

  return (
    <ScreenWrapper
      bgColor={colors.transparent}
      scrollable
      style={styles.screenWrapper}
    >
      {/* Header Section */}
      <ImageBackground
        source={Images.GrBg}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          <CommonText style={styles.headerTitle}>
            {t('addCrop.editCrop')}
          </CommonText>
        </View>
      </ImageBackground>

      {/* <View style={styles.formContainer}>
        <View style={styles.farmInfoContainer}>
          <CommonText style={styles.farmName}>
            {landDetails.landName}
          </CommonText>
          <CommonText style={styles.acresText}>
            <CommonText style={styles.acresTextValue}>
              {`${landDetails.area} ${
                landDetails.areaUnit == 'acre' ? 'Acres' : 'Hectare'
              } `}
            </CommonText>
            {landDetails.landType ?? ''}
          </CommonText>
        </View>
        <View style={styles.formContent}>
          <CommonText style={styles.sectionTitle}>
            {t('addCrop.cropDetails')}
          </CommonText>

          {crops.map((crop, index) => (
            <View key={index} style={styles.cropCard}>
              <View style={styles.cropHeader}>
                <CommonText style={styles.cropTitle}>
                  {t('addCrop.crop')}
                  {index + 1}
                </CommonText>
                <TouchableOpacity onPress={() => deleteCrop()}>
                  <CommonText style={styles.clearText}>
                    {t('addCrop.clear')}
                  </CommonText>
                </TouchableOpacity>
              </View>
              <CommonText style={styles.inputLabel}>
                {t('addCrop.totalArea')}{' '}
                <CommonText style={styles.requiredAsterisk}>*</CommonText>
              </CommonText>
              <View style={styles.cropInputContainer}>
                <CommonInput
                  borderColor={colors.Neutrals700}
                  placeholder={t('addCrop.enterArea')}
                  style={styles.areaInput}
                  value={crop.area}
                  onChangeText={text => {
                    const updated = [...crops];
                    updated[index].area = text;
                    setCrops(updated);
                  }}
                  containerStyle={styles.areaInputContainer}
                  keyboardType="numeric"
                />


                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.dropdownContainer}
                  onPress={() => openDropdown(index, 'unit')}
                >
                  <CommonText style={styles.dropdownText}>
                    {crop.unit || t('home.acres')}
                  </CommonText>
                  <DownIcon
                    height={moderateScale(16)}
                    width={moderateScale(16)}
                  />
                </TouchableOpacity>
              </View>
              <CommonText style={styles.inputLabel}>
                {t('addCrop.cropType')}{' '}
                <CommonText style={styles.requiredAsterisk}>*</CommonText>
              </CommonText>
              <CommonDropdown
                RightIcon={DownIcon}
                label={crop.type || t('addCrop.selectCropZone')}
                onPress={() => openDropdown(index, 'type')}
              />
              <CommonText style={styles.inputLabel}>
                {t('addCrop.cropVariety')}{' '}
                <CommonText style={styles.requiredAsterisk}>*</CommonText>
              </CommonText>
              <CommonDropdown
                RightIcon={DownIcon}
                label={crop.variety || t('addCrop.selectCropVariety')}
                onPress={() => openDropdown(index, 'variety')}
              />
              <CommonText style={styles.inputLabel}>
                {t('addCrop.seedVariety')}{' '}
                <CommonText style={styles.requiredAsterisk}>*</CommonText>
              </CommonText>
              <CommonDropdown
                RightIcon={DownIcon}
                label={crop.seed || t('addCrop.selectSeedVariety')}
                onPress={() => openDropdown(index, 'seed')}
              />
            </View>
          ))}

   
        </View>
      </View>


      <View style={styles.saveButtonWrapper}>
        <CommonButton
          title={t('profileScreen.saveButton')}
          onPress={() =>
            crops.length > 0
              ? SubmitStep3()
              : navigation.navigate(screenNames.HomeStack)
          }
          style={styles.saveButton}
        />
      </View>


      <CommonBottomSelectModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelect}
        title={t('addCrop.selectOption')}
        data={getDropdownOptions()}
        mode="document"
      /> */}

      <CropForm
        landDetails={landDetails}
        onSuccess={() => navigation.navigate(screenNames.HomeStack)}
        // Edit Mode Specifics
        initialCrops={initialCrops}
        onSubmitOverride={handleUpdateCrop}
        onDeleteOverride={handleDeleteCrop}
        hideAddButton={true} // Edit mode only allows editing the current crop
        saveButtonTitle={t('profileScreen.saveButton')}
      />
    </ScreenWrapper>
  );
};

export default EditCrop;
