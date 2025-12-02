import React, { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './style';
import { AppStackParamList } from '../../../../navigation/appNavigator';
import { CommonText, ScreenWrapper } from '../../../../components';
import { Images } from '../../../../assets/images';
import { colors } from '../../../../themes/colors';
import { screenNames } from '../../../../navigation/screenNames';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { showToastable } from 'react-native-toastable';
import {
  deleteLandCrop,
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

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const { params } = useRoute<NewLandScreenRouteProp>();
  const { landDetails, cropDetails } = params;
  //console.log('cropDetails----------------', cropDetails);

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
