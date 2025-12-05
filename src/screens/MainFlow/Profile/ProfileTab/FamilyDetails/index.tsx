import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  CommonButton,
  CommonInput,
  CommonText,
  ScreenWrapper,
  CommonLoader,
  GradientBackground,
} from '../../../../../components';
import { moderateScale } from '../../../../../utils/responsive';
import { BackButton, UserUnfilledGray } from '../../../../../assets/icons';
import { Images } from '../../../../../assets/images';
import { styles } from './style';
import { useTranslation } from 'react-i18next';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import {
  fetchFamilyMembers,
  updateFamilyMembers,
} from '../../../../../redux/slices/authSlice';
import { showToastable } from 'react-native-toastable';
import { MOBILE_REGEX } from '../../../../../utils/regex';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'FamilyDetails'
>;

const FamilyDetails = () => {
  const navigation = useNavigation<NavigationProp>();
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [total, setTotal] = useState();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { familyMembers, loading, accessToken } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (accessToken) {
      dispatch(
        fetchFamilyMembers({
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    setTotal(Number(children) + Number(adults));
  }, [adults, children]);

  useEffect(() => {
    if (familyMembers && familyMembers.data) {
      setAdults(String(familyMembers.data.adults));
      setChildren(String(familyMembers.data.children));
    }
  }, [familyMembers]);

  const handleSave = () => {
    if (!adults.trim() || !children.trim()) {
      Alert.alert(t('common.fillAllRequiredFields'));
      return;
    }

    dispatch(
      updateFamilyMembers({
        payload: {
          adults: Number(adults),
          children: Number(children),
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    )
      .unwrap()
      .then(res => {
        showToastable({ message: res?.message, status: 'success' });
        navigation.goBack();
      })
      .catch(error => {
        showToastable({ message: error?.message, status: 'success' });

        // Alert.alert(t('familyMemberDetails.saveError'), error);
      });
  };

  if (loading) {
    return <CommonLoader visible={true} />;
  }

  return (
    <ScreenWrapper
      headerTitle={t('familyMemberDetails.headerTitle')}
      showBackButton
      gradientHeader
    >
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
            {t('familyMemberDetails.headerTitle')}
          </CommonText>
        </View>
      </GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Total Adults */}
          <CommonText style={styles.label}>
            {t('familyMemberDetails.totalAdults')}{' '}
            <CommonText style={styles.required}>*</CommonText>
          </CommonText>
          <CommonInput
            style={styles.inputField}
            placeholder={t('familyMemberDetails.enterNumberOfAdults')}
            value={adults}
            onChangeText={setAdults}
            keyboardType="number-pad"
            allowedCharsRegex={MOBILE_REGEX}
            maxLength={3}
            leftIcon={
              <UserUnfilledGray
                height={moderateScale(24)}
                width={moderateScale(24)}
              />
            }
          />

          {/* Total Children */}
          <CommonText style={styles.label}>
            {t('familyMemberDetails.totalChildren')}{' '}
            <CommonText style={styles.required}>*</CommonText>
          </CommonText>
          <CommonInput
            style={styles.inputField}
            placeholder={t('familyMemberDetails.enterNumberOfChildren')}
            value={children}
            onChangeText={setChildren}
            keyboardType="number-pad"
            maxLength={3}
            allowedCharsRegex={MOBILE_REGEX}
            leftIcon={
              <UserUnfilledGray
                height={moderateScale(24)}
                width={moderateScale(24)}
              />
            }
          />

          <CommonText style={styles.label}>
            {t('familyMemberDetails.totalFamilyMembers')}:{' '}
          </CommonText>
          <CommonText style={styles.label}>{total}</CommonText>

          {/* Save Button */}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CommonButton
            style={styles.saveButton}
            title={t('profileScreen.saveButton')}
            onPress={handleSave}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default FamilyDetails;
