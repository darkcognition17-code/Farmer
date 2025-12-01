import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ImageBackground, Text } from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  CommonButton,
  CommonInput,
  CommonText,
  ScreenWrapper,
  CommonBottomSelectModal,
} from '../../../../components';
import { Images } from '../../../../assets/images';
import { styles } from './style';
import { moderateScale } from '../../../../utils/responsive';
import { AppStackParamList } from '../../../../navigation/appNavigator';
import { useTranslation } from 'react-i18next';
import {
  BackButton,
  DownIcon,
  Land,
  TickFilled,
} from '../../../../assets/icons';
import { screenNames } from '../../../../navigation/screenNames';
import Loader from '../../../../components/Loader';
import { MOBILE_REGEX } from '../../../../utils/regex';
import { updateLandDetails } from '../../../../redux/slices/authSlice';
import { showToastable } from 'react-native-toastable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'EditLand'>;
type RouteProps = RouteProp<AppStackParamList, 'EditLand'>;

const EditLand = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const landDetails = route.params?.landDetails;

  const units = [
    { name: 'Acres', key: 'acre' },
    { name: 'Hectares', key: 'hectare' },
  ];

  const [loading, setLoading] = useState(false);
  const [landName, setLandName] = useState('');
  const [ownership, setOwnership] = useState<'own' | 'leased' | null>(null);
  const [ownLandValue, setOwnLandValue] = useState('');
  const [ownLandUnit, setOwnLandUnit] = useState<{
    name: string;
    key: string;
  } | null>(null);
  const [leasedLandValue, setLeasedLandValue] = useState('');
  const [leasedLandUnit, setLeasedLandUnit] = useState<{
    name: string;
    key: string;
  } | null>(null);
  const [isOwnUnitModalVisible, setIsOwnUnitModalVisible] = useState(false);
  const [isLeasedUnitModalVisible, setIsLeasedUnitModalVisible] =
    useState(false);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch<AppDispatch>();

  // Prefill form from route params
  useEffect(() => {
    if (landDetails) {
      setLandName(landDetails.landName || '');
      setOwnership(landDetails.landType || null);

      if (landDetails.landType === 'own') {
        setOwnLandValue(landDetails.area?.toString() || '');
        setOwnLandUnit(units.find(u => u.key === landDetails.areaUnit) || null);
      } else if (landDetails.landType === 'leased') {
        setLeasedLandValue(landDetails.area?.toString() || '');
        setLeasedLandUnit(
          units.find(u => u.key === landDetails.areaUnit) || null,
        );
      }
    }
  }, [landDetails]);

  const handleNext = async () => {
    const jsonData = {
      landName: landName,
      landType: ownership,
      area: ownership == 'own' ? ownLandValue : leasedLandValue,
      areaUnit: ownership == 'own' ? ownLandUnit.key : leasedLandUnit.key,
    };

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
      setLoading(false);
      showToastable({
        message: t('editAddressDetails.updateSuccess'),
        status: 'success',
      });

      navigation.goBack();
    } catch (error: any) {
      setLoading(false);
      //console.log('Update Address Error:', error);
      showToastable({
        message: error?.message || t('editAddressDetails.updateError'),
        status: 'danger',
      });
    }
  };

  return (
    <ScreenWrapper scrollable style={styles.screenWrapper}>
      <ImageBackground
        source={Images.GrBg}
        style={styles.progressHeader}
        resizeMode="cover"
      >
        <Loader visible={loading} />
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
      </ImageBackground>

      <View style={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <CommonText style={styles.subHeader}>
            {t('addNewLand.title')}
          </CommonText>

          <CommonInput
            style={styles.inputStyle}
            placeholder={t('addNewLand.enterLandName')}
            leftIcon={
              <Land height={moderateScale(24)} width={moderateScale(24)} />
            }
            value={landName}
            onChangeText={setLandName}
          />

          <View style={styles.divider} />

          <CommonText style={styles.subHeader}>
            {t('addNewLand.landDetails')}
          </CommonText>
          <CommonText style={styles.inputLabel}>
            {t('addNewLand.selectLandOwnership')}{' '}
            <CommonText style={styles.requiredAsterisk}>*</CommonText>
          </CommonText>

          <View style={styles.ownershipContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setLeasedLandUnit(null);
                setLeasedLandValue('');
                setOwnership('own');
              }}
              style={[
                styles.genderOption,
                ownership === 'own' && styles.genderOptionSelected,
              ]}
            >
              <CommonText
                style={[
                  styles.genderText,
                  ownership === 'own' && styles.ownershipTextSelected,
                ]}
              >
                {t('addNewLand.own')}
              </CommonText>
              {ownership === 'own' && (
                <TickFilled
                  height={moderateScale(21)}
                  width={moderateScale(21)}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setOwnLandUnit(null);
                setOwnLandValue('');
                setOwnership('leased');
              }}
              style={[
                styles.genderOption,
                ownership === 'leased' && styles.genderOptionSelected,
              ]}
            >
              <CommonText
                style={[
                  styles.genderText,
                  ownership === 'leased' && styles.ownershipTextSelected,
                ]}
              >
                {t('home.leased')}
              </CommonText>
              {ownership === 'leased' && (
                <TickFilled
                  height={moderateScale(21)}
                  width={moderateScale(21)}
                />
              )}
            </TouchableOpacity>
          </View>

          {ownership === 'own' && (
            <>
              <CommonText style={[styles.inputLabel, styles.ownLandLabel]}>
                {t('addNewLand.ownLand')}{' '}
                <CommonText style={styles.requiredAsterisk}>*</CommonText>
              </CommonText>
              <View style={styles.landInputContainer}>
                <CommonInput
                  containerStyle={styles.landValueInput}
                  style={styles.inputStyle}
                  placeholder={t('common.enterValue')}
                  value={ownLandValue}
                  onChangeText={setOwnLandValue}
                  keyboardType="numeric"
                  allowedCharsRegex={MOBILE_REGEX}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.dropdownContainer}
                  onPress={() => setIsOwnUnitModalVisible(true)}
                >
                  <CommonText style={styles.dropdownText}>
                    {ownLandUnit?.name || t('common.unit')}
                  </CommonText>
                  <DownIcon
                    height={moderateScale(16)}
                    width={moderateScale(16)}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          {ownership === 'leased' && (
            <>
              <CommonText style={[styles.inputLabel, styles.leasedLandLabel]}>
                {t('addNewLand.leasedLand')}{' '}
                <CommonText style={styles.requiredAsterisk}>*</CommonText>
              </CommonText>
              <View style={styles.landInputContainerWithMargin}>
                <CommonInput
                  containerStyle={styles.landValueInput}
                  style={styles.inputStyle}
                  placeholder={t('common.enterValue')}
                  value={leasedLandValue}
                  onChangeText={setLeasedLandValue}
                  keyboardType="numeric"
                  allowedCharsRegex={MOBILE_REGEX}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.dropdownContainer}
                  onPress={() => setIsLeasedUnitModalVisible(true)}
                >
                  <CommonText style={styles.dropdownText}>
                    {leasedLandUnit?.name || t('common.unit')}
                  </CommonText>
                  <DownIcon
                    height={moderateScale(16)}
                    width={moderateScale(16)}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <CommonButton
          title={t('common.update')}
          style={styles.continueButton}
          disabled={
            !landName ||
            !ownership ||
            !(
              (ownLandValue && ownLandUnit?.name) ||
              (leasedLandValue && leasedLandUnit?.name)
            )
          }
          onPress={handleNext}
        />
      </View>

      <CommonBottomSelectModal
        isVisible={isOwnUnitModalVisible}
        title={t('addNewLand.selectUnit')}
        data={units}
        onSelect={item => {
          setOwnLandUnit(item);
          setIsOwnUnitModalVisible(false);
        }}
        onClose={() => setIsOwnUnitModalVisible(false)}
      />

      <CommonBottomSelectModal
        isVisible={isLeasedUnitModalVisible}
        title={t('addNewLand.selectUnit')}
        data={units}
        onSelect={item => {
          setLeasedLandUnit(item);
          setIsLeasedUnitModalVisible(false);
        }}
        onClose={() => setIsLeasedUnitModalVisible(false)}
      />
    </ScreenWrapper>
  );
};

export default EditLand;
