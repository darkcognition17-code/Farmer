import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  CommonButton,
  CommonText,
  ScreenWrapper,
  CommonLoader,
  GradientBackground,
} from '../../../../../components';
import { colors } from '../../../../../themes/colors';
import { moderateScale } from '../../../../../utils/responsive';
import { Images } from '../../../../../assets/images';
import { useTranslation } from 'react-i18next';
import { showToastable } from 'react-native-toastable';
import { BackButton } from '../../../../../assets/icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './style';
import { useDispatch } from 'react-redux';
import {
  updateFarmerProfile,
  updateLandDetails,
} from '../../../../../redux/slices/authSlice';
import AddressForm from '../../../../../components/AddressForm'; // The component you provided earlier
import { useAddressLogic } from '../../../../../hooks/useAddressLogic'; // The new hook
import { Buffer } from 'buffer';

const EditAddressDetails = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { farmerData, isFromLandEdit } = route.params as { farmerData: any };
  const dispatch = useDispatch<any>();
  const accessToken = Buffer.from(
    `${'mysecret'}:${'password'}`,
    'utf8',
  ).toString('base64');

  // 1. USE THE HOOK
  const { formState, data, ui, actions } = useAddressLogic(farmerData);

  const handleSave = async () => {
    // 2. CONSTRUCT PAYLOAD (Using state from hook)
    const {
      completeAddress,
      pincode,
      selectedStateObj,
      selectedDistrict,
      selectedMandal,
      selectedVillage,
      mandalText,
      villageText,
    } = formState;

    // Simple validation example
    if (!selectedStateObj?.id || !selectedDistrict?.id) {
      showToastable({
        message: t('common.fillAllRequiredFields'),
        status: 'danger',
      });
      return;
    }

    const formData = new FormData();
    formData.append('addressLine', completeAddress);
    formData.append('pincode', pincode);
    formData.append('stateId', selectedStateObj?.id);
    formData.append('districtId', selectedDistrict?.id);

    // Handle "Other" Logic
    if (selectedMandal?.name === 'Other') {
      formData.append('otherMandalName', mandalText);
    } else {
      formData.append('mandalId', selectedMandal?.id || '');
    }

    if (selectedVillage?.name === 'Other' || !selectedVillage?.id) {
      formData.append('otherVillageName', villageText);
    } else {
      formData.append('villageId', selectedVillage?.id);
    }

    // ... (Your existing JSON construction for updateLandDetails goes here) ...

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
        await dispatch(
          updateFarmerProfile({
            payload: formData,
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }),
        ).unwrap();
      }
      showToastable({
        message: t('editAddressDetails.updateSuccess'),
        status: 'success',
      });
      navigation.goBack();
    } catch (error: any) {
      showToastable({
        message: error?.message || t('editAddressDetails.updateError'),
        status: 'danger',
      });
    }
  };

  if (ui.loading && !ui.isLoadingMore) return <CommonLoader visible={true} />;

  return (
    <ScreenWrapper
      scrollable
      bgColor={colors.transparent}
      style={styles.screenWrapperContainer}
    >
      <GradientBackground
        style={styles.progressHeader}
        imageStyle={styles.imageBackgroundStyle}
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
      </GradientBackground>

      <View style={styles.contentContainer}>
        <CommonText style={styles.subHeaderTitle}>
          {t('addressDetailScreen.homeAddressDetails')}
        </CommonText>

        {/* 3. USE THE COMPONENT */}
        <AddressForm
          // State Binding
          address={formState.completeAddress}
          setAddress={formState.setCompleteAddress}
          pincode={formState.pincode}
          setPincode={formState.setPincode}
          selectedState={formState.selectedStateObj}
          setSelectedState={formState.setSelectedStateObj}
          selectedDistrict={formState.selectedDistrict}
          setSelectedDistrict={formState.setSelectedDistrict}
          selectedMandal={formState.selectedMandal}
          setSelectedMandal={formState.setSelectedMandal}
          selectedVillage={formState.selectedVillage}
          setSelectedVillage={formState.setSelectedVillage}
          mandalText={formState.mandalText}
          setMandalText={formState.setMandalText}
          villageText={formState.villageText}
          setVillageText={formState.setVillageText}
          // Data Binding
          // (Your AddressForm might need to be updated to accept these props directly
          //  if it relies on useLocationData internally, but passing them is cleaner)
          // For now, assuming AddressForm manages the Modals internally via the hook logic:
          isEditMode={true}
        />

        {/* Note: In a fully refactored AddressForm, you would pass the 'actions' 
            to trigger the API calls when modals open. */}

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
