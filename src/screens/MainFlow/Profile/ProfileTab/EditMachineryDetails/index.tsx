import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  CommonText,
  CommonButton,
  ScreenWrapper,
  GradientBackground,
} from '../../../../../components';
import MachineryFormCard from '../../../../../components/MachineryFormCard'; // Import
import { useMachineryForm } from '../../../../../hooks/useMachineryForm'; // Import
import { colors } from '../../../../../themes/colors';
import { moderateScale } from '../../../../../utils/responsive';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../../../../../assets/images';
import { showToastable } from 'react-native-toastable';
import { useDispatch, useSelector } from 'react-redux';
import { updateMachinery } from '../../../../../redux/slices/machinarySlice';
import { useTranslation } from 'react-i18next';
import { styles } from './style';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddMachineryDetails'
>;

const EditMachineryDetails = ({ route }: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.machineryStock);
  const accessToken = useSelector((state: any) => state.auth.accessToken);

  const [initialDataState, setInitialDataState] = useState<any>(null);

  // Use the Custom Hook
  const {
    machineryData,
    setMachineryData,
    handleInputChange,
    handleQuantityChange,
  } = useMachineryForm([]);

  // Initialization Logic
  useEffect(() => {
    if (route?.params?.item) {
      const item = route.params.item;
      // Format existing data to match component expectations
      const formattedItem = {
        ...item,
        instanceNumber: 1, // Edit usually implies singular focus
        // Ensure booleans are consistent for the UI
        powerSteering:
          item.powerSteering === true
            ? 'Yes'
            : item.powerSteering === false
              ? 'No'
              : item.powerSteering,
        // Ensure dates are parsed if they exist
        yearOfManufacture: item.yearOfManufacture
          ? new Date(item.yearOfManufacture.toString())
          : null,
      };

      // Handle Baler model date specifically if needed
      if (item.name.toLowerCase() === 'balers' && item.modelNumber) {
        // Assuming modelNumber comes as 'DD/MM/YYYY' or similar string
        const [day, month, year] = item.modelNumber.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        if (!isNaN(date.getTime())) {
          formattedItem.modelNumber = date;
        }
      }

      setMachineryData([formattedItem]);
      setInitialDataState(formattedItem);
    }
  }, [route?.params?.item, setMachineryData]);

  const isContinueDisabled = () => {
    if (machineryData.length === 0 || !initialDataState) return true;
    const currentItem = machineryData[0];

    // Compare basic fields
    const hasChanged =
      currentItem.brand !== initialDataState.brand ||
      currentItem.horsepower !== initialDataState.horsepower ||
      currentItem.driveType !== initialDataState.driveType ||
      currentItem.clutchType !== initialDataState.clutchType ||
      currentItem.mechanismType !== initialDataState.mechanismType ||
      currentItem.size !== initialDataState.size ||
      currentItem.capacity !== initialDataState.capacity ||
      currentItem.otherText !== initialDataState.otherText ||
      currentItem.count !== initialDataState.count;

    // Compare Dates (simplified)
    const initYear = initialDataState.yearOfManufacture
      ? new Date(initialDataState.yearOfManufacture).getFullYear()
      : null;
    const currYear = currentItem.yearOfManufacture
      ? new Date(currentItem.yearOfManufacture).getFullYear()
      : null;

    const hasDateChanged = initYear !== currYear;

    // Compare Power Steering (Boolean vs String logic)
    const initPS =
      initialDataState.powerSteering === true ||
      initialDataState.powerSteering === 'Yes';
    const currPS = currentItem.powerSteering === 'Yes';
    const hasPSChanged = initPS !== currPS;

    return !(hasChanged || hasDateChanged || hasPSChanged);
  };

  const handleContinue = async () => {
    const item = machineryData[0];

    const payload: any = {
      machineryRecordId: item.id, // ID from the original item object
      machineryTypeId: item.machineryTypeId,
      count: item.count,
    };

    if (item.brand) payload.brand = item.brand;
    if (item.horsepower) payload.horsepower = parseInt(item.horsepower, 10);
    if (item.driveType) payload.driveType = item.driveType;
    if (item.clutchType) payload.clutchType = item.clutchType;
    if (item.powerSteering)
      payload.powerSteering = item.powerSteering === 'Yes';
    if (item.mechanismType) payload.mechanismType = item.mechanismType;
    if (item.size) payload.size = parseInt(item.size, 10);
    if (item.capacity) payload.capacity = item.capacity;
    if (item.otherText) payload.otherText = item.otherText;

    if (item.yearOfManufacture) {
      payload.yearOfManufacture = new Date(
        item.yearOfManufacture,
      ).getFullYear();
    }
    if (item.modelNumber) {
      payload.modelNumber = new Date(item.modelNumber).toLocaleDateString();
    }

    try {
      const resultAction = await dispatch(
        updateMachinery({
          payload,
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      if (updateMachinery.fulfilled.match(resultAction)) {
        showToastable({
          message: resultAction?.payload?.message,
          status: 'success',
        });
        navigation.goBack();
      } else {
        showToastable({
          message:
            (resultAction.payload as string) ||
            t('machineryDetails.updateError'),
          status: 'danger',
        });
      }
    } catch (error: any) {
      showToastable({
        message: t('machineryDetails.unexpectedError'),
        status: 'danger',
      });
    }
  };

  return (
    <View style={styles.main}>
      <GradientBackground
        style={styles.progressHeader}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        backButtonStyles={styles.bell}
      >
        <View style={styles.headerContainer}>
          <CommonText style={styles.headerTitle}>
            {t('machineryDetails.headerTitle')}
          </CommonText>
        </View>
      </GradientBackground>

      <View style={styles.listContainer}>
        {machineryData.map((item, index) => (
          <MachineryFormCard
            key={`${item.machineryTypeId}-${index}`}
            item={item}
            index={index}
            isCollapsible={false} // Edit screen usually stays open
            onChange={(field, value) => handleInputChange(index, field, value)}
            onQuantityChange={change => handleQuantityChange(index, change)}
          />
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.saveButtonContainer}>
          <CommonButton
            style={styles.saveButton}
            title={t('profileScreen.saveButton')}
            onPress={handleContinue}
            disabled={isContinueDisabled() || loading}
            // loading={loading}
          />
        </View>
      </View>
    </View>
  );
};

export default EditMachineryDetails;
