import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  CommonButton,
  CommonLoader,
  CommonText,
  GradientBackground,
  ScreenWrapper,
} from '../../../../../components';
import { moderateScale } from '../../../../../utils/responsive';
import {
  BackButton,
  Minus,
  MinusWithRed,
  Plus,
  PlusWithGreen,
} from '../../../../../assets/icons';
import { Images } from '../../../../../assets/images';
import { styles } from './style';
import { useTranslation } from 'react-i18next';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../../../../../themes/colors';
import contentService from '../../../../../services/contentService';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { resetAddLivestockState } from '../../../../../redux/slices/addLivestockSlice';
import { resetUpdateLivestockState } from '../../../../../redux/slices/updateLivestockSlice';
import { showToastable } from 'react-native-toastable';
import { screenNames } from '../../../../../navigation/screenNames';
import { IMAGE_BASE_URL } from '../../../../../utils/helperFunction';
import { SvgUri } from 'react-native-svg';
import CommonInventoryRender from '../../../../../components/CommonInventoryRender';

interface MachineryItem {
  id: string;
  name: string;
  quantity: number;
}

interface MachineryRouteParams {
  item?: {
    id: string;
    livestockTypeId: string;
    name: string;
    count: number;
    notes: string | null;
  };
}

type AddMachinaryScreenProp = RouteProp<AppStackParamList, 'AddMachinery'>;

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddMachinery'
>;

const AddMachinaryScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddMachinaryScreenProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { current: language } = useSelector(
    (state: RootState) => state.language,
  );
  const {
    loading: addLoading,
    error: addError,
    success: addSuccess,
  } = useSelector((state: RootState) => state.addLivestock);
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
  } = useSelector((state: RootState) => state.updateLivestock);

  const [machineryStock, setMachineryStock] = useState<MachineryItem[]>([]);
  const [cowDungAvailability, setCowDungAvailability] = useState(false);
  const [otherDetails, setOtherDetails] = useState<string[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [errorTypes, setErrorTypes] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableItem, setEditableItem] = useState<
    MachineryRouteParams['item'] | null
  >(null);

  const othersId = '1d34eabd-03b8-4873-93fc-f2ee8b215ff4'; // Hardcoded ID for 'Others'

  useEffect(() => {
    const fetchLivestockTypes = async () => {
      try {
        setLoadingTypes(true);
        const response = await contentService.getMachineryTypes();
        if (response.statusCode === 200 && response.data) {
          const initialMachinerystock = response.data.map(type => ({
            id: type.id,
            name: type.name,
            quantity: 0,
            imageUrl: type?.imageUrl,
          }));
          setMachineryStock(initialMachinerystock);
        } else {
          setErrorTypes(response.message || t('addMachinery.fetchError'));
        }
      } catch (err: any) {
        setErrorTypes(err.message || 'Failed to fetch livestock types');
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchLivestockTypes();
  }, [language]);

  useEffect(() => {
    if (route.params?.item) {
      setIsEditMode(true);
      setEditableItem(route.params.item);
      setCowDungAvailability(false); // Assuming cowDungAvailability is not part of individual livestock item

      if (route.params.item.name === t('machineryTypes.others')) {
        setOtherDetails(
          route.params.item.notes ? [route.params.item.notes] : [''],
        );
      } else {
        setMachineryStock(prev =>
          prev.map(item =>
            item.id === route.params!.item!.livestockTypeId
              ? { ...item, quantity: route.params!.item!.count }
              : item,
          ),
        );
      }
    }
  }, [route.params?.item]);

  useEffect(() => {
    if (addSuccess) {
      showToastable({
        message: t('addMachinery.addSuccess'),
        status: 'success',
      });
      dispatch(resetAddLivestockState());
      navigation.goBack();
    }
    if (addError) {
      showToastable({ message: addError, status: 'danger' });
      dispatch(resetAddLivestockState());
    }
  }, [addSuccess, addError, dispatch, navigation]);

  useEffect(() => {
    if (updateSuccess) {
      showToastable({
        message: t('addMachinery.updateSuccess'),
        status: 'success',
      });
      dispatch(resetUpdateLivestockState());
      navigation.goBack();
    }
    if (updateError) {
      showToastable({ message: updateError, status: 'danger' });
      dispatch(resetUpdateLivestockState());
    }
  }, [updateSuccess, updateError, dispatch, navigation]);

  const handleQuantityChange = (id: string, change: number) => {
    if (isEditMode && editableItem) {
      setEditableItem(prev => {
        if (!prev) return null;
        const newCount = Math.max(0, (prev.count || 0) + change);
        return { ...prev, count: newCount };
      });
    } else {
      setMachineryStock(
        machineryStock.map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item,
        ),
      );
    }
  };

  const handleAddOtherDetail = () => {
    setOtherDetails([...otherDetails, '']);
  };

  const handleOtherDetailChange = (text: string, index: number) => {
    const newOtherDetails = [...otherDetails];
    newOtherDetails[index] = text;
    setOtherDetails(newOtherDetails);
  };

  const handleRemoveOtherDetail = (index: number) => {
    const newOtherDetails = [...otherDetails];
    newOtherDetails.splice(index, 1);
    setOtherDetails(newOtherDetails);
  };

  const handleSave = () => {
    //console.log('machineryStock------- ', machineryStock);
    navigation.navigate(screenNames.AddMachineryDetails, {
      machineryList: machineryStock,
    });

    // if (isEditMode && editableItem) {
    //   const payload: any = {
    //     livestockRecordId: editableItem.id,
    //     cowDungAvailable: cowDungAvailability,
    //     notes: editableItem.notes,
    //   };

    //   if (editableItem.name === 'Others') {
    //     payload.livestockId = othersId;
    //     payload.notes = otherDetails[0] || '';
    //   } else {
    //     payload.livestockId = editableItem.livestockTypeId;
    //     payload.count = editableItem.count;
    //   }
    //   dispatch(updateLivestock(payload));
    // } else {
    //   const liveStockData = machineryStock
    //     .filter(item => item.id !== othersId && item.quantity > 0)
    //     .map(item => ({
    //       machineryStockId: item.id,
    //       count: item.quantity,
    //     }));

    //   const othersData = otherDetails
    //     .filter(note => note.trim() !== '')
    //     .map(note => ({
    //       livestockId: othersId,
    //       notes: note,
    //     }));

    //   const payload = {
    //     cowDungAvailable: cowDungAvailability,
    //     liveStockData: [...liveStockData, ...othersData],
    //   };

    //   dispatch(addLivestock(payload));
    // }
  };

  if (loadingTypes) {
    return (
      <ScreenWrapper bgColor={colors.transparent}>
        <ActivityIndicator color={colors.ButtonColor} style={styles.loader} />
      </ScreenWrapper>
    );
  }

  if (errorTypes) {
    return (
      <ScreenWrapper bgColor={colors.transparent}>
        <CommonText style={styles.errorText}>{errorTypes}</CommonText>
      </ScreenWrapper>
    );
  }

  const currentLoading = isEditMode ? updateLoading : addLoading;
  const currentError = isEditMode ? updateError : addError;

  const renderMachinery = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeftContainer}>
        {item?.imageUrl && (
          <View style={styles.itemIconContainer}>
            <SvgUri
              width={moderateScale(24)}
              height={moderateScale(24)}
              uri={IMAGE_BASE_URL + item?.imageUrl}
            />
          </View>
        )}
        <CommonText style={styles.itemName}>{item.name}</CommonText>
      </View>
      <View style={styles.itemRightContainer}>
        <TouchableOpacity
          onPress={() => handleQuantityChange(item.id, -1)}
          disabled={item.quantity === 0}
          style={styles.quantityButton}
          activeOpacity={0.8}
        >
          {item.quantity === 0 ? (
            <Minus height={moderateScale(28)} width={moderateScale(28)} />
          ) : (
            <MinusWithRed
              height={moderateScale(28)}
              width={moderateScale(28)}
            />
          )}
        </TouchableOpacity>
        <CommonText style={styles.quantityText}>{item.quantity}</CommonText>
        <TouchableOpacity
          onPress={() => handleQuantityChange(item.id, 1)}
          style={styles.quantityButton}
          activeOpacity={0.8}
        >
          {item.quantity === 0 ? (
            <Plus height={moderateScale(28)} width={moderateScale(28)} />
          ) : (
            <PlusWithGreen
              height={moderateScale(28)}
              width={moderateScale(28)}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenWrapper bgColor={colors.transparent}>
      {currentLoading && <CommonLoader visible={currentLoading} />}
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
            {isEditMode
              ? t('machineryDetails.addMachineryDetails')
              : t('machineryDetails.addMachineryDetails')}
          </CommonText>
        </View>
      </GradientBackground>
      <View style={styles.keyboardAvoidingView}>
        <FlatList
          ListFooterComponent={<View style={styles.footerStyle} />}
          showsVerticalScrollIndicator={false}
          // data={machineryStock.filter(item => item.id !== othersId)}
          data={[...machineryStock.filter(item => item.id !== othersId)]}
          keyExtractor={key => key.id}
          contentContainerStyle={styles.flatListContent}
          ListHeaderComponent={() => (
            <CommonText style={styles.listHeader}>
              {t('addMachinery.machineryInventory')}
            </CommonText>
          )}
          // renderItem={renderMachinery}
          renderItem={({ item }) => (
            <CommonInventoryRender
              item={item}
              onPressMinus={() => handleQuantityChange(item.id, -1)}
              onPressPlus={() => handleQuantityChange(item.id, 1)}
            />
          )}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.saveButtonContainer}>
          <CommonButton
            onPress={handleSave}
            style={styles.saveButton}
            title={t('continue')}
            disabled={
              !machineryStock.filter(item => item.quantity && item.quantity > 0)
                .length > 0 || currentLoading
            }
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddMachinaryScreen;
