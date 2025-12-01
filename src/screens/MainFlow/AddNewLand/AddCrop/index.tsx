import React, { useState } from 'react';
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
  getCropType,
  getCropTypeVariety,
  getCropTypeVarietySeeds,
  getLocationList,
  submitAddLandStep3,
} from '../../../../redux/slices/authSlice';
import CropForm from '../../../../components/CropForm';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'AddCrop'>;
type NewLandScreenRouteProp = RouteProp<AppStackParamList, 'AddCrop'>;

const AddCrop = () => {
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
  const { landDetails } = params;

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
    updated[activeDropdown.index][activeDropdown.field] = item.name;
    updated[activeDropdown.index][activeDropdown.field + 'ID'] = item.id;
    //console.log('updated------------  ', updated);

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

    // const timeout = setTimeout(() => {
    //   setLoading(false);
    //   showToastable({ message: 'Network timeout', status: 'danger' });
    // }, 15000);

    try {
      const response = await dispatch(
        getCropType({
          payload: { page: pageNumber, limit: 20 },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      // clearTimeout(timeout);
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

    // const timeout = setTimeout(() => {
    //   setLoading(false);
    //   showToastable({ message: 'Network timeout', status: 'danger' });
    // }, 15000);

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

      // clearTimeout(timeout);
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

    // const timeout = setTimeout(() => {
    //   setLoading(false);
    //   showToastable({ message: 'Network timeout', status: 'danger' });
    // }, 15000);

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

      // clearTimeout(timeout);
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
    if (loading) return; // prevent multiple triggers
    setLoading(true);

    // const timeout = setTimeout(() => {
    //   setLoading(false);
    //   showToastable({ message: 'Network timeout', status: 'danger' });
    // }, 15000);

    const mappedCrops = crops
      .filter(
        item =>
          item.area &&
          item.typeID &&
          item.varietyID &&
          item.seedID &&
          item.unit,
      )
      .map(item => ({
        totalLandUnderCultivation: parseFloat(item.area), // convert string to number
        unit: item.unit == 'Acres' ? 'acre' : 'hectare', // "Acres" → "acres"
        cropTypeId: item.typeID,
        cropVarietyId: item.varietyID,
        seedVarietyId: item.seedID,
      }));
    try {
      const response = await dispatch(
        submitAddLandStep3({
          payload: {
            cropData: mappedCrops,
            landId: landDetails?.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ).unwrap();

      // clearTimeout(timeout);
      setLoading(false);
      //console.log('response----------------', response);

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        navigation.goBack();
      }
    } catch (err: any) {
      //console.log('Kisani API Error:', err);

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
            {t('addCrop.addCrop')}
          </CommonText>
        </View>
      </ImageBackground>

      <CropForm
        landDetails={landDetails}
        landIdKey="id" // Identifies the correct key for this flow
        onSuccess={() => navigation.goBack()}
        alwaysShowSaveButton={false} // Only show save if crops exist
      />
    </ScreenWrapper>
  );
};

export default AddCrop;
