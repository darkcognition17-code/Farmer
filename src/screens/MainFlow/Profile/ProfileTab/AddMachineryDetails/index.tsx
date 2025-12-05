import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  CommonText,
  CommonButton,
  ScreenWrapper,
  CommonBottomSelectModal,
  CommonBackButton,
  GradientBackground,
} from '../../../../../components';
import MachineryFormCard from '../../../../../components/MachineryFormCard'; // Import the new component
import { useMachineryForm } from '../../../../../hooks/useMachineryForm'; // Import the new hook
import { colors } from '../../../../../themes/colors';
import { moderateScale } from '../../../../../utils/responsive';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../../../../../assets/images';
import apiClient from '../../../../../services/apiClient';
import { showToastable } from 'react-native-toastable';
import { useTranslation } from 'react-i18next';
import { screenNames } from '../../../../../navigation/screenNames';
import { styles } from './style'; // You will need to clean up the style file to remove unused classes

const repeatableTypes = [
  'tractor',
  'trolleys',
  'balers',
  'tube well pumps',
  'others',
];

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddMachineryDetails'
>;

const AddMachineryDetails = ({ route }: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);

  // Use the Custom Hook
  const {
    machineryData,
    setMachineryData,
    collapsedStates,
    setCollapsedStates,
    handleInputChange,
    handleQuantityChange,
    toggleCollapse,
  } = useMachineryForm([]);

  // Initialization Logic
  useEffect(() => {
    const machineryList = route?.params?.machineryList || [];
    if (machineryList) {
      const initialData = machineryList
        .filter((item: any) => item.quantity > 0)
        .flatMap((item: any) => {
          const name = item.name.toLowerCase();
          const isRepeatable = repeatableTypes.includes(name);

          // Standardize structure for the hook/card
          const baseItem = {
            machineryTypeId: item.id,
            name: item.name,
            brand: '',
            yearOfManufacture: null,
            horsepower: '',
            driveType: '',
            clutchType: '',
            powerSteering: null,
            modelNumber: null,
            mechanismType: '',
            size: '',
            capacity: '',
            otherText: '',
          };

          if (isRepeatable) {
            return Array.from({ length: item.quantity }).map((_, i) => ({
              ...baseItem,
              instanceNumber: i + 1,
              count: 1,
            }));
          } else {
            return [
              {
                ...baseItem,
                quantity: item.quantity,
                count: item.quantity,
              },
            ];
          }
        });

      setMachineryData(initialData);

      // Initialize Collapsed States
      const initialCollapsedStates: { [key: string]: boolean } = {};
      initialData.forEach((item: any, index: number) => {
        initialCollapsedStates[`${item.machineryTypeId}-${index}`] = false;
      });
      setCollapsedStates(initialCollapsedStates);
    }
  }, [route?.params?.machineryList, setMachineryData, setCollapsedStates]);

  const isContinueDisabled = () => {
    if (machineryData.length === 0) return true;

    const quantityOnlyTypes = ['Harvester', 'Raker', 'Slasher'];
    const isOnlyQuantityTypes = machineryData.every(item =>
      quantityOnlyTypes.includes(item.name),
    );

    if (isOnlyQuantityTypes) {
      return !machineryData.some(item => item.count > 0);
    }

    const isAnyFieldFilled = machineryData.some(
      instance =>
        instance.brand ||
        instance.horsepower ||
        instance.driveType ||
        instance.clutchType ||
        instance.size ||
        instance.capacity ||
        instance.otherText ||
        instance.yearOfManufacture ||
        instance.modelNumber ||
        instance.mechanismType,
    );

    return !isAnyFieldFilled;
  };

  const handleContinue = async () => {
    setLoading(true);
    // Transform Hook Data to API Payload
    const finalMachineryData = machineryData.map(item => {
      const apiItem: any = {
        machineryTypeId: item.machineryTypeId,
        count: item.count,
      };

      if (item.brand) apiItem.brand = item.brand;
      if (item.horsepower) apiItem.horsepower = item.horsepower;
      if (item.driveType) apiItem.driveType = item.driveType;
      if (item.clutchType) apiItem.clutchType = item.clutchType;
      if (item.powerSteering !== null && item.powerSteering !== '')
        apiItem.powerSteering =
          item.powerSteering === 'Yes' || item.powerSteering === true;
      if (item.mechanismType) apiItem.mechanismType = item.mechanismType;
      if (item.size) apiItem.size = item.size;
      if (item.capacity) apiItem.capacity = item.capacity;
      if (item.otherText) apiItem.otherText = item.otherText;

      // Handle Dates (The Card component returns Date objects usually)
      if (item.yearOfManufacture) {
        apiItem.yearOfManufacture = new Date(
          item.yearOfManufacture,
        ).getFullYear();
      }
      if (item.modelNumber) {
        // Assuming API expects string year or full date string
        apiItem.modelNumber = new Date(item.modelNumber)
          .getFullYear()
          .toString();
      }

      return apiItem;
    });

    const payload = { machineryData: finalMachineryData };

    try {
      await apiClient.post('/user/api/v1/farmers/machinery', payload);
      showToastable({
        message: t('machineryDetails.addSuccess'),
        status: 'success',
      });
      navigation.navigate(screenNames.MachineryDetails);
    } catch (error: any) {
      showToastable({
        message:
          error.response?.data?.message || t('machineryDetails.addError'),
        status: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bgColor={colors.transparent} scrollable>
      <GradientBackground style={styles.progressHeader}>
        <View style={styles.headerContainer}>
          <CommonBackButton
            onPress={() => navigation.goBack()}
            style={styles.bell}
          />
          <CommonText style={styles.headerTitle}>
            {t('machineryDetails.headerTitle')}
          </CommonText>
        </View>
      </GradientBackground>

      <FlatList
        data={machineryData}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
        keyExtractor={(item, index) => `${item.machineryTypeId}-${index}`}
        renderItem={({ item, index }) => (
          <MachineryFormCard
            item={item}
            index={index}
            isCollapsible={true}
            isCollapsed={collapsedStates[`${item.machineryTypeId}-${index}`]}
            onToggleCollapse={() =>
              toggleCollapse(`${item.machineryTypeId}-${index}`)
            }
            onChange={(field, value) => handleInputChange(index, field, value)}
            // onQuantityChange={change => handleQuantityChange(index, change)}
          />
        )}
      />

      <View style={styles.buttonsContainer}>
        <View style={styles.saveButtonContainer}>
          <CommonButton
            style={styles.saveButton}
            title={t('continue')}
            onPress={handleContinue}
            disabled={isContinueDisabled() || loading}
            // loading={loading}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddMachineryDetails;
