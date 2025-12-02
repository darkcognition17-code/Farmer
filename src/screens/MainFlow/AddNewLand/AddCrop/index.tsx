import React, { useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './style';
import { AppStackParamList } from '../../../../navigation/appNavigator';
import { CommonText, ScreenWrapper } from '../../../../components';
import { Images } from '../../../../assets/images';
import { colors } from '../../../../themes/colors';
import { useTranslation } from 'react-i18next';
import CropForm from '../../../../components/CropForm';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'AddCrop'>;
type NewLandScreenRouteProp = RouteProp<AppStackParamList, 'AddCrop'>;

const AddCrop = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const { params } = useRoute<NewLandScreenRouteProp>();
  const { landDetails } = params;

  return (
    <ScreenWrapper
      bgColor={colors.transparent}
      scrollable
      style={styles.screenWrapper}
    >
      {/* Header Section */}
      <ImageBackground
        source={Images.GrBg}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          <CommonText style={styles.headerTitle}>
            {t('addCrop.addCrop')}
          </CommonText>
        </View>
      </ImageBackground>

      <CropForm
        landDetails={landDetails}
        landIdKey="id" // Identifies the correct key for this flow
        onSuccess={() => navigation.goBack()}
        alwaysShowSaveButton={false} // Only show save if crops exist
      />
    </ScreenWrapper>
  );
};

export default AddCrop;
