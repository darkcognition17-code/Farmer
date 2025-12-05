import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './style.js';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { AppStackParamList } from '../../../../../navigation/appNavigator.js';
import ScreenWrapper from '../../../../../components/ScreenWrapper';
import { colors } from '../../../../../themes/colors';
import CommonText from '../../../../../components/CommonText';
import { Images } from '../../../../../assets/images/index';
import {
  BackButton,
  DownBlack,
  UpBlack,
} from '../../../../../assets/icons/index';
import { moderateScale, verticalScale } from '../../../../../utils/responsive';
import CommonButton from '../../../../../components/CommonButton';
import { screenNames } from '../../../../../navigation/screenNames';
import { GradientBackground } from '../../../../../components';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'DeleteAccount'
>;

const DeletAccount = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScreenWrapper
      scrollable
      bgColor={colors.transparent}
      style={styles.screenWrapperContainer}
    >
      <GradientBackground imageStyle={styles.imageBackgroundStyle}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.bell}
          >
            <BackButton width={moderateScale(10)} height={moderateScale(15)} />
          </TouchableOpacity>
          <CommonText style={styles.headerTitle}>Delete Account</CommonText>
        </View>
      </GradientBackground>
      <View style={styles.scrollContainer}>
        <View>
          <CommonText style={styles.title}>
            Your account deletion request has been received.
          </CommonText>

          <CommonText style={styles.text}>
            As per our policy, the deletion will be processed within 7 to 30
            days from the date of request.
          </CommonText>
          <CommonText style={styles.text}>
            All your personal data and order history will be permanently deleted
            during this process.
          </CommonText>

          <CommonText style={styles.text}>
            If this request was made by mistake, you have up to 7 days to cancel
            it by logging into your account.
          </CommonText>

          <CommonText style={[styles.text, styles.bulletContainer]}>
            After deletion is complete:
          </CommonText>

          <View style={styles.bulletList}>
            <CommonText style={styles.bullet}>
              {'\u2022'} You may re-register using the same Phone number.
            </CommonText>
            <CommonText style={styles.bullet}>
              {'\u2022'} However, your previous data will not be restored, and
              your account will be treated as entirely new in our system.
            </CommonText>
          </View>

          <CommonText style={styles.text}>
            Also, note you will not be able to delete your account if your
            credit transactions are not sorted and cleared out with the Sellers.
          </CommonText>
        </View>
        <CommonButton
          onPress={() => navigation.navigate(screenNames.DeleteAccountOTP)}
          title="Yes, Delete My Account"
        />
      </View>
    </ScreenWrapper>
  );
};

export default DeletAccount;
