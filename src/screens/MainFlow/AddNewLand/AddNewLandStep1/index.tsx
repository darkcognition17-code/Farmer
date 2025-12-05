import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Text as RNText,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  CommonButton,
  CommonInput,
  CommonText,
  ScreenWrapper,
  CommonBottomSelectModal,
  CommonLoader,
  GradientBackground,
} from '../../../../components';
import ProfileProgressCard from '../../../../components/ProfileProgressCard';
import { Images } from '../../../../assets/images';
import { styles } from './style';
import { moderateScale, verticalScale } from '../../../../utils/responsive';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../../navigation/appNavigator';
import { useTranslation } from 'react-i18next';
import {
  BackButton,
  DownIcon,
  Land,
  TickFilled,
} from '../../../../assets/icons';
import { screenNames } from '../../../../navigation/screenNames';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { showToastable } from 'react-native-toastable';
import {
  submitAddLand,
  submitProfileStep1,
} from '../../../../redux/slices/authSlice';

import { MOBILE_REGEX } from '../../../../utils/regex';
import LandFormBody from '../../../../components/LandFormBody';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddNewLandStep1'
>;

const AddNewLandStep1 = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const [landName, setLandName] = useState<string>('');
  const [ownership, setOwnership] = useState<'own' | 'leased' | null>(null);
  const [areaValue, setAreaValue] = useState('');
  const [areaUnit, setAreaUnit] = useState<any>(null);
  const [ownLandValue, setOwnLandValue] = useState<string>('');
  const [ownLandUnit, setOwnLandUnit] = useState<string>('');
  const [leasedLandValue, setLeasedLandValue] = useState<string>('');
  const [leasedLandUnit, setLeasedLandUnit] = useState<string>('');
  const [isOwnUnitModalVisible, setIsOwnUnitModalVisible] = useState(false);
  const [isLeasedUnitModalVisible, setIsLeasedUnitModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const units = [
    { name: 'Acres', key: 'acre' },
    { name: 'Hectares', key: 'hectare' },
  ];

  const handleNext = () => {
    navigation.navigate(screenNames.AddNewLandStep2, {
      PayloadStep1: {
        landName,
        landType: ownership,
        area: areaValue,
        areaUnit: areaUnit?.key,
      },
    });
  };

  const calculateProgress = () => {
    let filled = 0;
    const totalFields = 3;

    if (landName) filled++;
    if (ownership) filled++;
    if (ownership === 'leased') {
      if (leasedLandValue && leasedLandUnit) filled++;
    } else {
      if (ownLandValue && ownLandUnit) filled++;
    }

    // per-step % normalized across total 3 steps
    return filled / totalFields / 3; // 0.0 → 0.33 per step
  };

  const isValid = landName && ownership && areaValue && areaUnit;

  return (
    <ScreenWrapper scrollable style={styles.screenWrapper}>
      <GradientBackground style={styles.progressHeader}>
        <CommonLoader visible={loading} />
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.bell}
          >
            <BackButton width={moderateScale(10)} height={moderateScale(15)} />
          </TouchableOpacity>
          <CommonText style={styles.headerTitle}>
            {t('addNewLand.title')}
          </CommonText>
        </View>

        <View style={styles.progressContent}>
          <ProfileProgressCard
            progress={calculateProgress()}
            title={t('addNewLand.addLandDetails')}
            stepText={`(1/3 ${t('common.step')} )`}
            totalSteps={3}
            currentStep={1}
            isFrom={t('addCrop.FormComplete')}
          />
        </View>
      </GradientBackground>

      {/* <View style={styles.scrollViewContent}>
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
                setLeasedLandUnit('');
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
                setOwnLandUnit('');
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

          <View style={styles.spacer} />
        </View>
      </View> */}
      <View style={styles.scrollViewContent}>
        <LandFormBody
          landName={landName}
          setLandName={setLandName}
          ownership={ownership}
          setOwnership={setOwnership}
          areaValue={areaValue}
          setAreaValue={setAreaValue}
          areaUnit={areaUnit}
          setAreaUnit={setAreaUnit}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CommonButton
          title={t('common.next')}
          style={styles.continueButton}
          disabled={!isValid}
          onPress={handleNext}
        />
      </View>
      {/* <CommonBottomSelectModal
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
        mode="document"
        title={t('addNewLand.selectUnit')}
        data={units}
        onSelect={item => {
          setLeasedLandUnit(item);
          setIsLeasedUnitModalVisible(false);
        }}
        onClose={() => setIsLeasedUnitModalVisible(false)}
      /> */}
    </ScreenWrapper>
  );
};

export default AddNewLandStep1;
