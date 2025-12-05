import React, { useMemo, useState } from 'react';
import { View } from 'react-native';

import {
  CommonButton,
  CommonText,
  ScreenWrapper,
  CommonLoader,
  GradientBackground,
} from '../../../../components';
import { Images } from '../../../../assets/images';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { submitAddLand } from '../../../../redux/slices/authSlice';
import { AuthStackParamList } from '../../../../navigation/authNavigator';
import AddressForm from '../../../../components/AddressForm';
import { useAddressLogic } from '../../../../hooks/useAddressLogic'; // Make sure this path is correct
import { useTranslation } from 'react-i18next';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../../navigation/appNavigator';
import ProfileProgressCard from '../../../../components/ProfileProgressCard';
import { styles } from './style';
import { screenNames } from '../../../../navigation/screenNames';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddNewLandStep2'
>;
type AddLandScreenRouteProp = RouteProp<AuthStackParamList, 'Addland2'>;

const AddNewLandStep2 = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { params } = useRoute<AddLandScreenRouteProp>();
  const { PayloadStep1 } = params;
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // 1. Initialize the Hook
  const { formState, ui } = useAddressLogic(null);

  // 2. Destructure State with CORRECT names
  const {
    completeAddress, // Hook returns this, NOT addressLine
    setCompleteAddress,
    pincode,
    setPincode,
    selectedStateObj, // Hook returns this, NOT selectedState
    setSelectedStateObj,
    selectedDistrict,
    setSelectedDistrict,
    selectedMandal,
    setSelectedMandal,
    selectedVillage,
    setSelectedVillage,
    mandalText,
    setMandalText,
    villageText,
    setVillageText,
  } = formState;

  // Local loading state for submission
  const [submitting, setSubmitting] = useState(false);

  // 3. Validation Logic
  const isFormValid = useMemo(() => {
    // FIX: Check completeAddress (not addressLine)
    if (!completeAddress || !completeAddress.trim()) return false;

    if (!pincode || !pincode.trim() || !/^[0-9]{6}$/.test(pincode))
      return false;
    if (!selectedStateObj) return false;
    if (!selectedDistrict) return false;

    // Mandal Validation
    if (!selectedMandal) return false;

    if (selectedMandal.name === 'Other') {
      return true; // Usually implies manual entry is allowed/handled elsewhere
    }

    // Village Validation
    if (!selectedVillage) return false;

    if (
      selectedVillage.name === 'Other' &&
      (!villageText || !villageText.trim())
    ) {
      return false;
    }

    return true;
  }, [
    completeAddress,
    pincode,
    selectedStateObj,
    selectedDistrict,
    selectedMandal,
    selectedVillage,
    villageText,
  ]);

  // 4. Progress Calculation
  const calculateProgress = (currentStep: number, totalSteps: number = 3) => {
    let filled = 0;
    const totalFields = 6;

    if (completeAddress) filled++;
    if (pincode && /^\d{6}$/.test(pincode)) filled++;
    if (selectedStateObj) filled++;
    if (selectedDistrict) filled++;

    if (selectedMandal) {
      if (selectedMandal.name === 'Other') {
        if (villageText) filled++;
      } else {
        filled++;
      }
    }
    if (selectedVillage || villageText) filled++;

    const stepProgress = filled / totalFields;
    const stepOffset = (currentStep - 1) / totalSteps;
    return stepOffset + stepProgress / totalSteps;
  };

  // 5. Submission Handler
  const handleContinue = async () => {
    if (!isFormValid) return;

    try {
      setSubmitting(true);

      let payload: any = {
        addressLine: completeAddress, // API likely expects 'addressLine', map it here
        stateId: selectedStateObj?.id,
        districtId: selectedDistrict?.id,
        pincode: pincode,
        ...PayloadStep1,
      };

      // Mandal Logic
      if (selectedMandal?.name === 'Other') {
        payload.otherMandalName = mandalText;
        payload.otherVillageName = villageText;
      } else {
        payload.mandalId = selectedMandal?.id;

        // Village Logic
        if (selectedVillage?.name === 'Other') {
          payload.otherVillageName = villageText;
        } else {
          payload.villageId = selectedVillage?.id;
        }
      }

      const response = await dispatch(
        submitAddLand({
          payload,
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      if (response?.statusCode == 200) {
        navigation.navigate(screenNames.AddNewLandStep3, {
          landDetails: response?.data,
        });
      }
    } catch (err: any) {
      console.error(err);
      // Optional: showToastable({ message: err.message, status: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenWrapper scrollable style={styles.screenWrapper}>
      <CommonLoader visible={submitting || (ui.loading && !ui.isLoadingMore)} />

      <GradientBackground
        imageStyle={styles.imageBackground}
        style={styles.progressHeader}
      >
        <View style={styles.headerContainer}>
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
      </GradientBackground>

      <View style={styles.formContainer}>
        <CommonText style={styles.sectionTitle}>
          {t('addNewLand.landLocationDetails')}
        </CommonText>

        {/* AddressForm uses its own internal logic (useLocationData) for fetching lists,
            so we only need to pass the State and Setters from our hook.
        */}
        <AddressForm
          // Map 'completeAddress' from hook to 'address' prop in component
          address={completeAddress}
          setAddress={setCompleteAddress}
          pincode={pincode}
          setPincode={setPincode}
          // Map 'selectedStateObj' from hook to 'selectedState' prop
          selectedState={selectedStateObj}
          setSelectedState={setSelectedStateObj}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedMandal={selectedMandal}
          setSelectedMandal={setSelectedMandal}
          selectedVillage={selectedVillage}
          setSelectedVillage={setSelectedVillage}
          mandalText={mandalText}
          setMandalText={setMandalText}
          villageText={villageText}
          setVillageText={setVillageText}
          isEditMode={false}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <CommonButton
          title={t('common.saveContinue')}
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={!isFormValid}
        />
      </View>
    </ScreenWrapper>
  );
};

export default AddNewLandStep2;
