import { showToastable } from 'react-native-toastable';
import authService from '../../../../../services/authService';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  CommonButton,
  CommonText,
  GradientBackground,
  ScreenWrapper,
  CommonBackButton,
  CommonDetailsCard,
} from '../../../../../components';
import { moderateScale, scaledFontSize } from '../../../../../utils/responsive';
import {
  DustbinModal,
  EditModalPencil,
  Livestock,
  Machinery,
  User,
} from '../../../../../assets/icons';
import { Images } from '../../../../../assets/images';
import { styles } from './style';
import { useTranslation } from 'react-i18next';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { colors } from '../../../../../themes/colors';
import { screenNames } from '../../../../../navigation/screenNames';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMachinery } from '../../../../../redux/slices/machinarySlice';

import { AppDispatch, RootState } from '../../../../../redux/store';
import { IMAGE_BASE_URL } from '../../../../../utils/helperFunction';
import { fonts } from '../../../../../themes/fonts';
import ColoredSvg from '../../../../../components/ColoredSvg';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'MachineryDetails'
>;

const MachineryDetails = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();
  const {
    data: machinaryData,
    loading,
    loadingMore,
    error,
  } = useSelector((state: RootState) => state.machineryStock);
  const { current: language } = useSelector(
    (state: RootState) => state.language,
  );
  const [page, setPage] = useState(1);
  const [editModal, setEditModal] = useState(false);
  const [sentItem, setSentItem] = useState<any>({});

  useEffect(() => {
    if (isFocused) {
      dispatch(fetchMachinery({ page: 1, limit: 10 }));
    }
  }, [dispatch, language, isFocused]);

  const handleLoadMore = () => {
    if (
      machinaryData &&
      machinaryData.data.pagination.page <
        machinaryData.data.pagination.totalPages &&
      !loadingMore
    ) {
      const nextPage = page + 1;
      dispatch(fetchMachinery({ page: nextPage, limit: 10 }));
      setPage(nextPage);
    }
  };

  const onRefresh = useCallback(() => {
    setPage(1);
    dispatch(fetchMachinery({ page: 1, limit: 10 }));
  }, [dispatch, language]);

  const handleAdd = () => {
    navigation.navigate(screenNames.AddMachineryScreen);
  };

  const handleDeleteMachinery = async (item: any) => { // Modified to accept item
    setEditModal(false);
    try {
      if (item && item.id) {
        let response = await authService.deleteMachinery(item.id);
        //console.log('response---------------->. ', response);

        showToastable({
          message: response.message,
          status: 'success',
        });
        dispatch(fetchMachinery({ page: 1, limit: 10 }));
      } else {
        showToastable({
          message: t('machineryDetails.deleteError'),
          status: 'danger',
        });
      }
    } catch (err: any) {
      showToastable({
        message: err.message || t('machineryDetails.deleteError'),
        status: 'danger',
      });
    }
  };

  const renderMachineryItemDetails = (item: any) => {
    const type = item.name.toLowerCase();

    switch (type) {
      case 'tractor':
        return (
          <>
            <View style={styles.detailItem}>
              <DetailRow
                label={t('machineryDetails.driverTypeLabel')}
                value={item.driveType}
                itemName={item.name}
              />
            </View>
            <View style={styles.detailItem}>
              <DetailRow
                label={t('machineryDetails.hpLabel')}
                value={item.horsepower}
                itemName={item.name}
              />
            </View>
            <View style={styles.detailItem}>
              <DetailRow
                label={t('machineryDetails.clutchLabel')}
                value={
                  item.clutchType === 'Hydraulic'
                    ? t('machineryDetails.clutchHydraulic')
                    : t('machineryDetails.clutchManual')
                }
                itemName={item.name}
              />
            </View>
            <View style={styles.detailItem}>
              <DetailRow
                label={t('machineryDetails.powerSteeringLabel')}
                value={
                  item.powerSteering
                    ? t('machineryDetails.yes')
                    : t('machineryDetails.no')
                }
                itemName={item.name}
              />
            </View>
          </>
        );
      case 'balers':
        return (
          <View style={styles.detailItem}>
            <DetailRow
              label={t('machineryDetails.modelLabel')}
              value={item.modelNumber}
              itemName={item.name}
            />
          </View>
        );
      case 'trolleys':
        return (
          <>
            <View style={styles.detailItem}>
              <DetailRow
                label={t('machineryDetails.trolleyTypeLabel')}
                value={
                  item.mechanismType === 'Hydraulic'
                    ? t('machineryDetails.clutchHydraulic')
                    : t('machineryDetails.clutchManual')
                }
                itemName={item.name}
              />
            </View>
            <View style={styles.detailItem}>
              <DetailRow
                label={t('machineryDetails.sizeLabel')}
                value={item.size}
                itemName={item.name}
              />
            </View>
          </>
        );
      case 'tube well pumps':
        return (
          <View style={styles.detailItem}>
            <DetailRow
              label={t('machineryDetails.capacityLabel')}
              value={item.capacity}
              itemName={item.name}
            />
          </View>
        );
      case 'others':
        return (
          <View style={styles.detailItem}>
            <DetailRow value={item.otherText} itemName={item.name} />
          </View>
        );
      default:
        return (
          <CommonText style={styles.quantityText}>
            {t('addMachineryDetails.quantityPrefix')}
            {item.count}
          </CommonText>
        );
    }
  };
  const DetailRow = ({
    label,
    value,
    itemName,
  }: {
    label?: string;
    value: any;
    itemName: string;
  }) => {
    const type = itemName.toLowerCase();
    const isExcluded =
      type === 'harvester' ||
      type === 'slasher' ||
      type === 'raker' ||
      type === 'others';

    return (
      <View style={isExcluded ? styles.detailRow : styles.detailColumn}>
        {label && <CommonText style={styles.detailLabel}>{label}</CommonText>}
        <CommonText style={styles.detailValue}>{value}</CommonText>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator color={colors.ButtonColor} style={styles.loader} />
    );
  };

  const handleEdit = (item: any) => { // Modified to accept item
    navigation.navigate(screenNames.EditMachinery, {
      item: item,
    });
    setEditModal(false);
  };

  const renderMachineryList = ({ item }) => {
    const machineryNameDisplay =
      item.name.toLowerCase() === 'tractor' ? (
        <>
          {`${item.brand} ${item.name} `}
          <CommonText style={styles.modelTitle}>
            {`(${item.yearOfManufacture}${t('machineryDetails.modelText')}`}{' '}
          </CommonText>
        </>
      ) : (
        item.name
      );

    return (
      <CommonDetailsCard
        item={item}
        onEditPress={handleEdit}
        onDeletePress={handleDeleteMachinery}
        imageUrl={item?.imageUrl}
        itemName={machineryNameDisplay}
        renderDetails={renderMachineryItemDetails}
        editModalVisible={editModal}
        setEditModalVisible={setEditModal}
        setSentItem={setSentItem}
        type="machinery"
      />
    );
  };

  return (
    <View style={styles.main}>
      <GradientBackground style={styles.progressHeader}>
        <View style={styles.headerContainer}>
          <CommonBackButton
            onPress={() => navigation.goBack()}
            style={styles.bell}
          />
          <CommonText style={styles.headerTitle}>
            {t('profileScreen.machineryDetails')}
          </CommonText>
        </View>
      </GradientBackground>
      <View style={styles.keyboardAvoidingView}>
        {error && <CommonText>{error}</CommonText>}
        {machinaryData && (
          <FlatList
            showsVerticalScrollIndicator={false}
            // data={machinaryData?.data.machinery}
            data={[...machinaryData?.data.machinery].sort((a, b) =>
              a.name.localeCompare(b.name),
            )}
            keyExtractor={key => key.id}
            contentContainerStyle={styles.flatlistContent}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
            renderItem={renderMachineryList}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        )}
        {machinaryData?.data?.machinery?.length > 0 && (
          <TouchableOpacity
            style={[styles.addCropButton, styles.addButton]}
            onPress={handleAdd}
          >
            <CommonText style={styles.addCropText}>
              {t('machineryDetails.addMachinery')}
            </CommonText>
          </TouchableOpacity>
        )}

        {!loading && machinaryData?.data.machinery.length == 0 && (
          <View style={styles.emptyCard}>
            <Machinery height={moderateScale(74)} width={moderateScale(74)} />

            <CommonText style={styles.emptyTitle}>
              {t('machineryDetails.noMachinery')}
            </CommonText>

            <CommonText style={styles.emptySubTitle}>
              {t('machineryDetails.addFirstMachinery')}
            </CommonText>

            <TouchableOpacity style={styles.addCropButton} onPress={handleAdd}>
              <CommonText style={styles.addCropText}>
                {t('machineryDetails.addMachinery')}
              </CommonText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default MachineryDetails;
