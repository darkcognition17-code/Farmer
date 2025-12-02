import React, { useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './style';
import { AppStackParamList } from '../../../../navigation/appNavigator';
import { CommonText, ScreenWrapper } from '../../../../components';
import ProfileProgressCard from '../../../../components/ProfileProgressCard';
import { Images } from '../../../../assets/images';
import { colors } from '../../../../themes/colors';
import { screenNames } from '../../../../navigation/screenNames';
import { useTranslation } from 'react-i18next';
import CropForm from '../../../../components/CropForm';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddNewLandStep3'
>;
type NewLandScreenRouteProp = RouteProp<AuthStackParamList, 'MobileOtp'>;

const AddNewLandStep3 = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const [crops, setCrops] = useState<any[]>([]);

  const { params } = useRoute<NewLandScreenRouteProp>();
  const { landDetails } = params;

  const isCropFilled = crop => {
    return (
      crop.area &&
      crop.area !== '' &&
      crop.type &&
      crop.type !== '' &&
      crop.typeID &&
      crop.typeID !== '' &&
      crop.variety &&
      crop.variety !== '' &&
      crop.varietyID &&
      crop.varietyID !== '' &&
      crop.seed &&
      crop.seed !== '' &&
      crop.seedID &&
      crop.seedID !== ''
    );
  };

  const calculateProgress = (currentStep: number, totalSteps: number = 3) => {
    let filled = 0.9;
    const totalFields = 1;

    if (crops.length > 0) {
      const hasAnyCropData = crops.some(isCropFilled);

      if (hasAnyCropData) {
        filled++;
      }
    }

    const stepProgress = filled / totalFields;
    const stepOffset = (currentStep - 1) / totalSteps;

    return stepOffset + stepProgress / totalSteps;
  };

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
        <View style={styles.progressWrapper}>
          <ProfileProgressCard
            progress={calculateProgress(3, 3)}
            title={t('addCrop.addCropDetails')}
            stepText={`(3/3 ${t('common.step')} )`}
            totalSteps={3}
            isFrom={t('addCrop.FormComplete')}
          />
        </View>
      </ImageBackground>

      {/* Reusable Form Logic */}
      <CropForm
        landDetails={landDetails}
        landIdKey="landId" // Identifies the correct key for this flow
        onSuccess={() => navigation.navigate(screenNames.HomeStack)}
        alwaysShowSaveButton={true} // Step 3 allows saving even with 0 crops
      />
    </ScreenWrapper>
  );
};

export default AddNewLandStep3;
