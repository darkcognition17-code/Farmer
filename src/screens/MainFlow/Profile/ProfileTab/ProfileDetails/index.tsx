import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  CommonText,
  ProfileInfoCard,
  CommonLoader,
} from '../../../../../components';
import ProfileMenuItem from '../../../../../components/ProfileMenuItem';
import { screenNames } from '../../../../../navigation/screenNames';
import {
  BackButton,
  CallGray,
  DobGray,
  DustbinEmpty,
  DustbinRed,
  EducationGray,
  Family,
  FamilyGray,
  GenderGray,
  Livestock,
  LocationGray,
  Machinery,
  MailGray,
  MapGray,
  NameGray,
  PincodeGray,
  VillageGray,
} from '../../../../../assets/icons';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../../../../../utils/responsive';
import { colors } from '../../../../../themes/colors';
import { fonts } from '../../../../../themes/fonts';
import { IMAGE_BASE_URL } from '../../../../../utils/helperFunction';
import ProfileHeader from '../../../../../components/ProfileHeader';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { fetchViewProfile } from '../../../../../redux/slices/authSlice';
import { getLocationList } from '../../../../../redux/slices/authSlice'; // Import getLocationList thunk
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { Buffer } from 'buffer';
import { styles } from './style';

type ProfileDetailsNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ProfileDetailsScreen'
>;

const ProfileDetailsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ProfileDetailsNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { viewProfileData, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // 👇 Refresh logic here
      dispatch(fetchViewProfile({}));
    }
  }, [isFocused, dispatch]);

  if (loading || !viewProfileData) {
    return <CommonLoader visible={true} />;
  }

  const farmerData = viewProfileData.data;

  //console.log('farmerData?.dob', viewProfileData.data);

  const formatDate = date => {
    const [year, month, day] = date?.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}

      <ProfileHeader
        name={farmerData?.name || 'N/A'}
        imageUri={viewProfileData?.data?.profilePhotoUrl}
        isShowBackButton={true}
        navigation={navigation}
        mainTitle={t('contactDetailScreen.header')}
        onBackPress={() => navigation.goBack()}
      />

      <View
        style={[styles.sectionContainer, styles.sectionContainerExtraStyling]}
      >
        {/* Personal Information */}
        <ProfileInfoCard
          title={t('profileDetailsScreen.personalInformation')}
          onEdit={() =>
            navigation.navigate(screenNames.EditProfileScreen, {
              farmerData: farmerData,
            })
          }
        >
          <View style={styles.iconAndTitleRow}>
            <NameGray
              style={styles.iconOffset}
              height={moderateScale(20)}
              width={moderateScale(20)}
            />

            <CommonText style={styles.titleText}>
              {t('profileSetup.fullName')}
            </CommonText>
          </View>
          <CommonText style={styles.valueText}>
            {farmerData?.name || 'N/A'}
          </CommonText>
          <View style={styles.twoColumnWrapper}>
            <View style={styles.halfWidthColumn}>
              <View style={styles.iconAndTitleRow}>
                <GenderGray
                  style={styles.iconOffset}
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />

                <CommonText style={styles.titleText}>
                  {t('profileSetup.gender')}
                </CommonText>
              </View>
              <CommonText style={styles.valueText}>
                {farmerData?.gender || 'N/A'}
              </CommonText>
            </View>
            <View style={styles.halfWidthColumn}>
              <View style={styles.iconAndTitleRow}>
                <DobGray
                  style={styles.iconOffset}
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />

                <CommonText style={styles.titleText}>
                  {t('profileDetailsScreen.dobLabel')}
                </CommonText>
              </View>
              {farmerData?.dob && (
                <CommonText style={styles.valueText}>
                  {formatDate(farmerData?.dob) || 'N/A'}
                </CommonText>
              )}
            </View>
          </View>
        </ProfileInfoCard>

        {/* Address Details */}
        <ProfileInfoCard
          title={t('profileDetailsScreen.addressDetails')}
          onEdit={() =>
            navigation.navigate(screenNames.EditAddressDetails, {
              farmerData: farmerData,
            })
          }
        >
          {/* Assuming address details are nested or available directly */}
          <View style={styles.iconAndTitleRow}>
            <LocationGray
              style={styles.iconOffset}
              height={moderateScale(20)}
              width={moderateScale(20)}
            />

            <CommonText style={styles.titleText}>
              {t('profileSetup.completeAddress')}
            </CommonText>
          </View>
          <CommonText style={styles.valueText}>
            {farmerData?.addressLine || 'N/A'}
          </CommonText>
          <View style={styles.twoColumnWrapper}>
            <View style={styles.halfWidthColumn}>
              <View style={styles.iconAndTitleRow}>
                <MapGray
                  style={styles.iconOffset}
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />

                <CommonText style={styles.titleText}>
                  {t('profileSetup.state')}
                </CommonText>
              </View>
              <CommonText style={styles.valueText}>
                {farmerData?.state || 'N/A'}
              </CommonText>
            </View>
            <View style={styles.halfWidthColumn}>
              <View style={styles.iconAndTitleRow}>
                <FamilyGray
                  style={styles.iconOffset}
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />

                <CommonText style={styles.titleText}>
                  {t('profileSetup.mandal')}
                </CommonText>
              </View>
              <CommonText style={styles.valueText}>
                {farmerData?.mandal || farmerData?.otherMandalName || 'N/A'}
              </CommonText>
            </View>

            <View style={styles.halfWidthColumn}>
              <View style={styles.iconAndTitleRow}>
                <MapGray
                  style={styles.iconOffset}
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />
                <CommonText style={styles.titleText}>
                  {t('profileSetup.district')}
                </CommonText>
              </View>
              <CommonText style={styles.valueText}>
                {farmerData?.district || 'N/A'}
              </CommonText>
            </View>
            <View style={styles.halfWidthColumn}>
              <View style={styles.iconAndTitleRow}>
                <VillageGray
                  style={styles.iconOffset}
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />

                <CommonText style={styles.titleText}>
                  {t('profileSetup.village')}
                </CommonText>
              </View>
              <CommonText style={styles.valueText}>
                {farmerData?.village || farmerData?.otherVillageName || 'N/A'}
              </CommonText>
            </View>
            <View style={styles.halfWidthColumn}>
              <View style={styles.iconAndTitleRow}>
                <PincodeGray
                  style={styles.iconOffset}
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />

                <CommonText style={styles.titleText}>
                  {t('profileSetup.pincode')}
                </CommonText>
              </View>
              <CommonText style={styles.valueText}>
                {farmerData?.pincode || 'N/A'}
              </CommonText>
            </View>
          </View>
        </ProfileInfoCard>

        {/* Additional Details */}
        <ProfileInfoCard
          title={t('profileSetup.additionalContactDetails')}
          onEdit={() => {
            navigation.navigate(screenNames.EditAdditionalDetails, {
              farmerData: farmerData,
            });
          }}
        >
          <View style={styles.iconAndTitleRow}>
            <NameGray
              style={styles.iconOffset}
              height={moderateScale(20)}
              width={moderateScale(20)}
            />

            <CommonText style={styles.titleText}>
              {farmerData?.guardianType?.toLowerCase() == 'husband'
                ? t('profileSetup.husbandName')
                : t('profileSetup.fatherName')}
            </CommonText>
          </View>
          <CommonText style={styles.valueText}>
            {farmerData?.guardianName || 'N/A'}
          </CommonText>
          <View style={styles.twoColumnWrapper}>
            <View style={styles.halfWidthColumn}>
              <View style={styles.iconAndTitleRow}>
                <CallGray
                  style={styles.iconOffset}
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />

                <CommonText style={styles.titleText}>
                  {t('profileSetup.alternateMobileNumber')}
                </CommonText>
              </View>
              <CommonText style={styles.valueText}>
                {farmerData?.alternateMobile || 'N/A'}
              </CommonText>
            </View>
            <View style={styles.halfWidthColumn}>
              <View style={styles.iconAndTitleRow}>
                <MailGray
                  style={styles.iconOffset}
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />

                <CommonText style={styles.titleText}>
                  {t('profileSetup.emailId')}
                </CommonText>
              </View>
              <CommonText style={styles.valueText}>
                {farmerData?.email || 'N/A'}
              </CommonText>
            </View>
            <View style={styles.halfWidthColumn}>
              <View style={styles.iconAndTitleRow}>
                <EducationGray
                  style={styles.iconOffset}
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />

                <CommonText style={styles.titleText}>
                  {t('profileSetup.highestEducation')}
                </CommonText>
              </View>
              <CommonText style={styles.valueText}>
                {farmerData?.education || 'N/A'}
              </CommonText>
            </View>
          </View>
        </ProfileInfoCard>

        {/* Menu Items */}
        <View style={styles.menuItemsWrapper}>
          <ProfileMenuItem
            label={t('profileScreen.familyInformation')}
            onPress={() => navigation.navigate(screenNames.FamilyDetailsScreen)}
            Icon={Family}
          />
          <ProfileMenuItem
            label={t('profileScreen.livestockDetails')}
            onPress={() =>
              navigation.navigate(screenNames.LivestockDetailsScreen)
            }
            Icon={Livestock}
          />
          <ProfileMenuItem
            label={t('profileScreen.machineryDetails')}
            onPress={() => navigation.navigate(screenNames.MachineryDetails)}
            Icon={Machinery}
          />
        </View>
        <ProfileMenuItem
          label={t('profileScreen.deleteAccount')}
          onPress={() => {}} //console.log('Delete account')}
          Icon={DustbinEmpty}
          style={styles.deleteAccountBtn}
          color="red"
        />
      </View>
    </ScrollView>
  );
};

export default ProfileDetailsScreen;
