import React, { useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import ProfileHeader from '../../../../components/ProfileHeader';
import ProfileMenuItem from '../../../../components/ProfileMenuItem';
import {
  About,
  ContactUs,
  DeleteAccount,
  Family,
  FAQ,
  Language,
  Livestock,
  LogOut,
  Machinery,
  PrivacyPolicy,
  TermsCondition,
  User,
  UserMyProfile,
  UserOrange,
  UserUnfilled,
  UserVerify,
} from '../../../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { screenNames } from '../../../../navigation/screenNames';
import { useDispatch, useSelector } from 'react-redux';
import { logout, fetchFarmerDetails } from '../../../../redux/slices/authSlice';
import { AppStackParamList } from '../../../../navigation/appNavigator';
import { CommonText } from '../../../../components';
import { styles } from './style';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../../redux/store';
import { IMAGE_BASE_URL } from '../../../../utils/helperFunction';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'Profile'>;

const ProfileDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { farmerDetails, accessToken } = useSelector(
    (state: RootState) => state.auth,
  );
  //console.log(farmerDetails);

  useEffect(() => {
    if (accessToken && !farmerDetails) {
      dispatch(
        fetchFarmerDetails({
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
    }
  }, [accessToken, farmerDetails, dispatch]);

  const handleLogout = () => {
    Alert.alert(
      t('profileScreen.logoutConfirmationTitle'),
      t('profileScreen.logoutConfirmationMessage'),
      [
        {
          text: t('home.cancel'),
          // style: 'cancel',
        },
        {
          text: t('profileScreen.logout'),
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.replace(screenNames.Auth);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => Alert.alert(t('profileScreen.alertDismissed')),
      },
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader
        name={farmerDetails?.data?.name || t('profileScreen.defaultFarmerName')}
        imageUri={farmerDetails?.data?.profilePhotoUrl}
        mainTitle={'Profile'}
      />

      <View style={styles.menuSection}>
        <ProfileMenuItem
          // label={t('profileScreen.familyInformation')}
          label={t('profileScreen.myProfile')}
          Icon={UserMyProfile}
          onPress={() => {
            navigation.navigate(screenNames.ProfileDetailsSubScreen);
          }}
        />

        <ProfileMenuItem
          label={t('profileScreen.changeLanguage')}
          onPress={() => {
            navigation.navigate(screenNames.ChangeLanguage);
          }}
          Icon={Language}
        />
        <View style={styles.additionalSection}>
          <CommonText style={styles.linkContainerTitle}>
            {t('profileScreen.additionalLinks')}
          </CommonText>
          <ProfileMenuItem
            onPress={() => {
              navigation.navigate(screenNames.AdditionalLinkScreen, {
                title: t('profileScreen.aboutUs'),
                slug: 'about_us',
              });
            }}
            style={styles.additionalLinkItem}
            label={t('profileScreen.aboutUs')}
            Icon={About}
          />
          <ProfileMenuItem
            onPress={() => {
              navigation.navigate(screenNames.AdditionalLinkScreen, {
                slug: 'terms_privacy_policy',
                title: t('profileScreen.privacyPolicy'),
              });
            }}
            style={styles.additionalLinkItem}
            label={t('profileScreen.privacyPolicy')}
            Icon={PrivacyPolicy}
          />
          <ProfileMenuItem
            style={styles.additionalLinkItem}
            label={t('profileScreen.termsAndConditions')}
            Icon={TermsCondition}
            onPress={() => {
              navigation.navigate(screenNames.AdditionalLinkScreen, {
                slug: 'terms_privacy_policy',
                title: t('profileScreen.termsAndConditions'),
              });
            }}
          />
          <ProfileMenuItem
            onPress={() => {
              navigation.navigate(screenNames.AdditionalLinkScreen, {
                title: t('profileScreen.faqsTitle'),
                slug: 'faqs',
              });
            }}
            style={styles.additionalLinkItem}
            label={t('profileScreen.faqs')}
            Icon={FAQ}
          />
        </View>
        <ProfileMenuItem
          label={t('profileScreen.contactUs')}
          Icon={ContactUs}
          onPress={() => {
            navigation.navigate(screenNames.AdditionalLinkScreen, {
              title: t('profileScreen.contactUs'),
              slug: 'contact_us',
            });
          }}
        />
        <ProfileMenuItem
          onPress={handleLogout}
          label={t('profileScreen.logout')}
          Icon={LogOut}
          style={styles.logoutSection}
        />
      </View>
    </ScrollView>
  );
};
export default ProfileDetailsScreen;
