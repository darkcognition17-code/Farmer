import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  CommonButton,
  CommonInput,
  CommonLoader,
  CommonText,
  GradientBackground,
  ScreenWrapper,
} from '../../../../../components';
import { moderateScale } from '../../../../../utils/responsive';
import {
  BackButton,
  DustbinRed,
  Minus,
  MinusWithRed,
  PlusWithGreen,
  TickFilled,
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
import {
  addLivestock,
  resetAddLivestockState,
} from '../../../../../redux/slices/addLivestockSlice';
import { resetUpdateLivestockState } from '../../../../../redux/slices/updateLivestockSlice';
import { showToastable } from 'react-native-toastable';
import { SvgUri } from 'react-native-svg';
import { IMAGE_BASE_URL } from '../../../../../utils/helperFunction';
import { endpoints } from '../../../../../utils/endpoints';
import { screenNames } from '../../../../../navigation/screenNames';
import CommonInventoryRender from '../../../../../components/CommonInventoryRender';

interface LivestockItem {
  id: string;
  name: string;
  quantity: number;
}

interface LivestockRouteParams {
  item?: {
    id: string;
    livestockTypeId: string;
    name: string;
    count: number;
    notes: string | null;
  };
}

type AddLiveStockRouteProp = RouteProp<AppStackParamList, 'AddLiveStock'>;

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddLiveStock'
>;

const AddLiveStock = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddLiveStockRouteProp>();
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
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [livestock, setLivestock] = useState<LivestockItem[]>([]);
  const [cowDungAvailability, setCowDungAvailability] = useState(false);
  const [otherDetails, setOtherDetails] = useState<string[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [errorTypes, setErrorTypes] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableItem, setEditableItem] = useState<
    LivestockRouteParams['item'] | null
  >(null);

  const othersId = '1d34eabd-03b8-4873-93fc-f2ee8b215ff4';

  useEffect(() => {
    const fetchLivestockTypes = async () => {
      try {
        setLoadingTypes(true);
        const response = await contentService.getLivestockTypes();
        if (response.statusCode === 200 && response.data) {
          const initialLivestock = response.data.map(type => ({
            id: type.id,
            name: type.name,
            quantity: 0,
            imageUrl: type.imageUrl,
          }));
          setLivestock(initialLivestock);
        } else {
          setErrorTypes(
            response.message || t('liveStockDetails.failedToFetchTypes'),
          );
        }
      } catch (err: any) {
        setErrorTypes(err.message || t('liveStockDetails.failedToFetchTypes'));
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

      if (route.params.item.name === 'Others') {
        setOtherDetails(
          route.params.item.notes ? [route.params.item.notes] : [''],
        );
      } else {
        setLivestock(prev =>
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
    //console.log('addSuccess.  ', addSuccess);

    if (addSuccess?.payload?.statusCode == 201) {
      showToastable({
        message: addSuccess?.payload?.message,
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
    if (updateSuccess?.payload?.statusCode == 200) {
      //console.log('up', updateSuccess);

      showToastable({
        message: updateSuccess.payload.message,
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
      setLivestock(
        livestock.map(item =>
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

  const handleSave = async () => {
    if (isEditMode && editableItem) {
      const payload: any = {
        livestockRecordId: editableItem.id,
        cowDungAvailable: cowDungAvailability,
        notes: editableItem.notes,
      };

      if (editableItem.name === 'Others') {
        payload.livestockId = othersId;
        payload.notes = otherDetails[0] || '';
      } else {
        payload.livestockId = editableItem.livestockTypeId;

        payload.count = editableItem.count;
      }
      //console.log('payload-------->.  ', payload);

      try {
        const response = await fetch(
          `https://kisaniurja-dev-api.appskeeper.in/${endpoints.user.livestock}`, // <-- Replace with your actual endpoint
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          },
        );
        //console.log('response-------->.  ', response);

        const result = await response.json();
        if (result.statusCode == 200) {
          showToastable({
            message: result?.message,
            status: 'success',
          });

          navigation.replace(screenNames.LivestockDetailsScreen);
        }

        if (!response.ok) {
          //console.log('PATCH Error Response:', result);
          throw new Error(result?.message || 'Something went wrong');
        }

        // showToastable({
        //   message: result?.message || "Updated successfully",
        //   status: "success",
        // });

        // navigation.goBack();
      } catch (error: any) {
        //console.log('PATCH API Error => ', error);
        // showToastable({
        //   message: error.message,
        //   status: "error",
        // });
      }
      // dispatch(updateLivestock({ payload, headers: { Authorization: `Bearer ${accessToken}`, language: "en" } }));
    } else {
      const liveStockData = livestock
        .filter(item => item.id !== othersId && item.quantity > 0)
        .map(item => ({
          livestockId: item.id,
          count: item.quantity,
        }));

      const othersData = otherDetails
        .filter(note => note.trim() !== '')
        .map(note => ({
          livestockId: othersId,
          notes: note,
        }));

      const payload = {
        cowDungAvailable: cowDungAvailability,
        liveStockData: [...liveStockData, ...othersData],
      };
      //console.log('payload-------->.  ', payload);

      dispatch(
        addLivestock({
          data: payload,
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
    }
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
              ? t('liveStockDetails.editTitle')
              : t('profileScreen.livestockDetails')}
          </CommonText>
        </View>
      </GradientBackground>
      <View style={styles.keyboardAvoidingView}>
        {isEditMode && editableItem ? (
          <View>
            <View style={styles.itemContainer}>
              <View style={styles.itemLeftContainer}>
                {editableItem?.imageUrl && (
                  <View style={styles.itemIconContainer}>
                    <SvgUri
                      height={moderateScale(21)}
                      width={moderateScale(21)}
                      uri={IMAGE_BASE_URL + editableItem?.imageUrl}
                    />
                  </View>
                )}
                <CommonText style={styles.itemName}>
                  {editableItem.name}
                </CommonText>
              </View>
              {editableItem.name === 'Others' ? (
                <View style={styles.itemRightContainer}>
                  <CommonInput
                    multiline
                    style={styles.otherInput}
                    placeholder={t('liveStockDetails.addDetails')}
                    value={otherDetails[0] || ''}
                    onChangeText={text => setOtherDetails([text])}
                  />
                </View>
              ) : (
                <View style={styles.itemRightContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      handleQuantityChange(editableItem.livestockTypeId, -1)
                    }
                    disabled={editableItem.count === 0}
                    style={styles.quantityButton}
                    activeOpacity={0.8}
                  >
                    {editableItem.count === 0 ? (
                      <Minus
                        height={moderateScale(28)}
                        width={moderateScale(28)}
                      />
                    ) : (
                      <MinusWithRed
                        height={moderateScale(28)}
                        width={moderateScale(28)}
                      />
                    )}
                  </TouchableOpacity>
                  <CommonText style={styles.quantityText}>
                    {editableItem.count}
                  </CommonText>
                  <TouchableOpacity
                    onPress={() =>
                      handleQuantityChange(editableItem.livestockTypeId, 1)
                    }
                    style={styles.quantityButton}
                    activeOpacity={0.8}
                  >
                    <PlusWithGreen
                      height={moderateScale(28)}
                      width={moderateScale(28)}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ) : (
          <FlatList
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            data={livestock.filter(item => item.id !== othersId)}
            keyExtractor={key => key.id}
            contentContainerStyle={styles.flatListContent}
            // renderItem={renderLiveStock}
            renderItem={({ item }) => (
              <CommonInventoryRender
                item={item}
                onPressMinus={() => handleQuantityChange(item.id, -1)}
                onPressPlus={() => handleQuantityChange(item.id, 1)}
              />
            )}
          />
        )}

        {!isEditMode && otherDetails.length > 0 && (
          <View>
            <CommonText style={styles.otherLabel}>
              {t('liveStockDetails.otherDetails')}
            </CommonText>
            <View style={styles.otherDetailsContainer}>
              {otherDetails.map((detail, index) => (
                <CommonInput
                  key={index}
                  multiline
                  placeholder={t('liveStockDetails.addDetails')}
                  value={detail}
                  onChangeText={text => handleOtherDetailChange(text, index)}
                  containerStyle={{
                    marginBottom:
                      index === otherDetails.length - 1 ? 0 : moderateScale(20),
                  }}
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => handleRemoveOtherDetail(index)}
                    >
                      <DustbinRed />
                    </TouchableOpacity>
                  }
                />
              ))}
            </View>
          </View>
        )}

        <CommonText style={styles.inputLabel}>
          {t('liveStockDetails.cowDungAvailable')}
        </CommonText>
        <View style={styles.ownershipContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setCowDungAvailability(true)}
            style={[
              styles.genderOption,
              cowDungAvailability === true && styles.genderOptionSelected,
            ]}
          >
            <CommonText
              style={[
                styles.genderText,
                cowDungAvailability === true && styles.ownershipTextSelected,
              ]}
            >
              {t('machineryDetails.yes')}
            </CommonText>
            {cowDungAvailability === true && (
              <TickFilled
                height={moderateScale(21)}
                width={moderateScale(21)}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setCowDungAvailability(false)}
            style={[
              styles.genderOption,
              cowDungAvailability === false && styles.genderOptionSelected,
            ]}
          >
            <CommonText
              style={[
                styles.genderText,
                cowDungAvailability === false && styles.ownershipTextSelected,
              ]}
            >
              {t('machineryDetails.no')}
            </CommonText>
            {cowDungAvailability === false && (
              <TickFilled
                height={moderateScale(21)}
                width={moderateScale(21)}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        {!isEditMode && (
          <View style={styles.otherButtonContainer}>
            <CommonButton
              onPress={handleAddOtherDetail}
              disabled={
                otherDetails.length > 0 &&
                otherDetails[otherDetails.length - 1].trim() === ''
              }
              textStyle={styles.otherButtonText}
              style={styles.otherButton}
              title={t('liveStockDetails.addOther')}
            />
          </View>
        )}

        <View style={styles.saveButtonContainer}>
          <CommonButton
            onPress={handleSave}
            style={[
              styles.saveButton,
              isEditMode && { paddingHorizontal: moderateScale(50) },
            ]}
            title={
              isEditMode ? t('common.update') : t('profileScreen.saveButton')
            }
            disabled={currentLoading}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddLiveStock;
