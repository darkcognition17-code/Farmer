import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  CommonButton,
  CommonLoader,
  CommonText,
  ImagePickerModal,
  ScreenWrapper,
} from '../../../../../components';
import { moderateScale } from '../../../../../utils/responsive';
import {
  BackButton,
  DustbinModal,
  DustbinRed,
  EditModalPencil,
  EditPencilIcon,
  Livestock,
  User,
} from '../../../../../assets/icons';
import { Images } from '../../../../../assets/images';
import { styles } from './style';
import { useTranslation } from 'react-i18next';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from '../../../../../themes/colors';
import { screenNames } from '../../../../../navigation/screenNames';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLivestock,
  deleteLivestock,
} from '../../../../../redux/slices/livestockSlice'; // Import deleteLivestock thunk
import {
  updateLivestock,
  resetUpdateLivestockState,
} from '../../../../../redux/slices/updateLivestockSlice';
import { showToastable } from 'react-native-toastable';

import { AppDispatch, RootState } from '../../../../../redux/store';
import { SvgUri } from 'react-native-svg';
import { IMAGE_BASE_URL } from '../../../../../utils/helperFunction';
import ColoredSvg from '../../../../../components/ColoredSvg';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'LiveStockDetails'
>;

const LiveStockDetails = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: livestockData,
    loading,
    loadingMore,
    error,
  } = useSelector((state: RootState) => state.livestock);
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
  } = useSelector((state: RootState) => state.updateLivestock);
  const { current: language } = useSelector(
    (state: RootState) => state.language,
  );
  const [page, setPage] = useState(1);
  const [editModal, setEditModal] = useState(false);
  const [sentItem, setSentItem] = useState({});

  const [isFetching, setIsFetching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFetching(true);
      dispatch(fetchLivestock({ page: 1, limit: 10 })).finally(() => {
        setIsFetching(false);
      });
    }, [dispatch, language]),
  );

  const handleLoadMore = () => {
    if (
      livestockData &&
      livestockData.data.pagination.page <
        livestockData.data.pagination.totalPages &&
      !loadingMore
    ) {
      const nextPage = page + 1;
      dispatch(fetchLivestock({ page: nextPage, limit: 10 }));
      setPage(nextPage);
    }
  };

  const handleAdd = () => {
    navigation.navigate(screenNames.AddLiveStockScreen);
  };

  const handleDelete = (item: any) => {
    if (item) {
      Alert.alert(
        t('liveStockDetails.deleteConfirmationTitle'),
        t('liveStockDetails.deleteConfirmationMessage'),
        [
          { text: t('home.cancel'), style: 'cancel' },
          {
            text: t('liveStockDetails.delete'),
            onPress: async () => {
              // Make onPress async
              const resultAction = await dispatch(deleteLivestock(item.id));
              //console.log('resultAction', resultAction);

              if (deleteLivestock.fulfilled.match(resultAction)) {
                showToastable({
                  message: resultAction?.payload?.message, // Use translation key
                  status: 'success',
                });
                dispatch(fetchLivestock({ page: 1, limit: 10 })); // Refresh the list
              } else if (deleteLivestock.rejected.match(resultAction)) {
                showToastable({
                  message:
                    (resultAction.payload as string) ||
                    t('liveStockDetails.deleteError'), // Use translation key
                  status: 'danger',
                });
              }
            },
            style: 'destructive',
          },
        ],
      );
    }
  };

  const renderUserLiveStock = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => {
          setEditModal(true);
          setSentItem(item);
        }}
        activeOpacity={0.8}
        style={styles.editButton}
      >
        <EditPencilIcon height={moderateScale(16)} width={moderateScale(16)} />
      </TouchableOpacity>
      <ImagePickerModal
        visible={editModal}
        cancelable={false}
        title1={t('liveStockDetails.editDetails')}
        Icon1={
          <EditModalPencil
            width={moderateScale(24)}
            height={moderateScale(24)}
          />
        }
        onCameraPress={() => {
          navigation.navigate(screenNames.AddLiveStockScreen, {
            item: sentItem,
          });
          setEditModal(false);
        }}
        title2={t('liveStockDetails.delete')}
        Icon2={
          <DustbinModal width={moderateScale(24)} height={moderateScale(24)} />
        }
        onGalleryPress={() => {
          handleDelete(sentItem);
          setEditModal(false);
        }}
        onClose={() => setEditModal(false)}
      />
      <View style={styles.itemHeader}>
        {item?.imageUrl && (
          <View style={styles.itemIconContainer}>
            <ColoredSvg
              uri={IMAGE_BASE_URL + item?.imageUrl}
              color={colors.LiveStockName}
              size={moderateScale(21)}
            />
          </View>
        )}
        <CommonText style={styles.itemName}>{item.name}</CommonText>
      </View>
      <View style={styles.itemDetailsContainer}>
        {item.name === t('machineryTypes.others') ? (
          <CommonText style={styles.quantityText}>{item.notes}</CommonText>
        ) : (
          <>
            <CommonText style={styles.totalText}>
              {t('liveStockDetails.total')}
            </CommonText>
            <CommonText style={styles.quantityText}>
              {item.count} {item.name}
            </CommonText>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.main}>
      {isFetching && <CommonLoader visible={isFetching} />}
      <ImageBackground
        source={Images.GrBg}
        style={styles.progressHeader}
        resizeMode="cover"
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
            {t('profileScreen.livestockDetails')}
          </CommonText>
        </View>
      </ImageBackground>
      <View style={styles.keyboardAvoidingView}>
        {error && <CommonText>{error}</CommonText>}
        {livestockData && (
          <FlatList
            ListHeaderComponent={() =>
              livestockData?.data?.livestock.length > 0 ? (
                <View style={styles.listHeaderContainer}>
                  <CommonText variant="title" style={styles.cowDungTitle}>
                    {t('liveStockDetails.cowDungAvailable')}
                  </CommonText>
                  <CommonText
                    variant="subtitle"
                    style={
                      livestockData?.data?.cowDungAvailable
                        ? {
                            marginBottom: 0,
                            color: colors.SelectedGenderColor,
                            fontSize: 16,
                            marginLeft: 10,
                          }
                        : {
                            marginBottom: 0,
                            color: colors.error,
                            fontSize: 16,
                            marginLeft: 10,
                          }
                    }
                  >
                    {livestockData.data.cowDungAvailable
                      ? t('machineryDetails.yes')
                      : t('machineryDetails.no')}
                  </CommonText>
                </View>
              ) : (
                <View></View>
              )
            }
            showsVerticalScrollIndicator={false}
            data={livestockData?.data?.livestock}
            keyExtractor={key => key.id}
            contentContainerStyle={styles.flatlistContent}
            renderItem={renderUserLiveStock}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )}
        {livestockData?.data.livestock.length > 0 && (
          <TouchableOpacity
            style={[styles.addCropButton, styles.addButton]}
            onPress={handleAdd}
          >
            <CommonText style={styles.addCropText}>
              {t('liveStockDetails.addLivestock')}
            </CommonText>
          </TouchableOpacity>
        )}

        {!loading && livestockData?.data?.livestock.length == 0 && (
          <View style={styles.emptyCard}>
            <Livestock height={moderateScale(74)} width={moderateScale(74)} />
            <CommonText style={styles.emptyTitle}>
              {t('liveStockDetails.noLivestock')}
            </CommonText>
            <CommonText style={styles.emptySubTitle}>
              {t('liveStockDetails.addFirstLivestock')}
            </CommonText>
            <TouchableOpacity style={styles.addCropButton} onPress={handleAdd}>
              <CommonText style={styles.addCropText}>
                {t('liveStockDetails.addLivestock')}
              </CommonText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default LiveStockDetails;
