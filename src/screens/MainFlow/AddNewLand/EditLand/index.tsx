import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';

import {
  CommonButton,
  ScreenWrapper,
  CommonText,
  CommonLoader,
  GradientBackground,
} from '../../../../components';
import LandFormBody from '../../../../components/LandFormBody'; // Shared Component
import { Images } from '../../../../assets/images';
import { styles } from './style'; // Similar wrapper styles
import { updateLandDetails } from '../../../../redux/slices/authSlice';
import { showToastable } from 'react-native-toastable';
import { RootState } from '../../../../redux/store';
import { BackButton } from '../../../../assets/icons';
import { moderateScale } from '../../../../utils/responsive';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

const EditLandScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute<any>();
  const { landDetails } = route.params || {};
  const token = useSelector((state: RootState) => state.auth.accessToken);
  console.log('landDetails', landDetails?.area);

  // Initialize state with existing data
  const [landName, setLandName] = useState(landDetails?.landName || '');
  const [ownership, setOwnership] = useState(landDetails?.landType || null);
  const [areaValue, setAreaValue] = useState(landDetails?.area || '');
  const [areaUnitState, setAreaUnitState] = useState(
    landDetails?.areaUnit
      ? {
          name:
            landDetails.areaUnit.charAt(0).toUpperCase() +
            landDetails.areaUnit.slice(1),
          key: landDetails.areaUnit,
        }
      : null,
  );
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    // Dispatch Update API Action
    // await dispatch(updateLandDetails({ ... }));
    const jsonData = {
      landName: landName,
      landType: ownership,
      area: Number(areaValue),
      areaUnit: areaUnitState?.key,
    };
    console.log('jsonData', jsonData);

    let cleanJson = Object.fromEntries(
      Object.entries(jsonData).filter(([_, v]) => v !== undefined),
    );

    setLoading(true);

    try {
      global.landId = landDetails?.id;
      const response = await dispatch(
        updateLandDetails({
          payload: cleanJson,
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data',
          },
        }),
      ).unwrap();
      console.log('response------', response);
      setLoading(false);
      showToastable({
        message: t('editAddressDetails.updateSuccess'),
        status: 'success',
      });

      navigation.goBack();
    } catch (error: any) {
      console.log('response------', error);
      setLoading(false);
      //console.log('Update Address Error:', error);
      showToastable({
        message: error?.message || t('editAddressDetails.updateError'),
        status: 'danger',
      });
    }
    setLoading(false);
    navigation.goBack();
  };

  const isValid = landName && ownership && areaValue && areaUnitState;

  return (
    <ScreenWrapper scrollable style={styles.screenWrapper}>
      <CommonLoader visible={loading} />

      {/* Standard Header (Simpler than Onboarding) */}
      <GradientBackground style={styles.progressHeader}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.bell}
          >
            <BackButton width={moderateScale(10)} height={moderateScale(15)} />
          </TouchableOpacity>
          <CommonText style={styles.headerTitle}>
            {t('addNewLand.editLand')}
          </CommonText>
        </View>
      </GradientBackground>

      <View style={styles.scrollViewContent}>
        {/* Reuse the exact same form UI */}
        <LandFormBody
          landName={landName}
          setLandName={setLandName}
          ownership={ownership}
          setOwnership={setOwnership}
          areaValue={areaValue.toString()}
          setAreaValue={setAreaValue}
          areaUnit={areaUnitState}
          setAreaUnit={setAreaUnitState}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <CommonButton
          title={t('profileSetup.saved')} // Different button text
          style={styles.continueButton}
          disabled={!isValid}
          onPress={handleUpdate}
        />
      </View>
    </ScreenWrapper>
  );
};

export default EditLandScreen;
