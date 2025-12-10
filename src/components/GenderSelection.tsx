import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import CommonText from './CommonText';
import GenderButton from './GenderButton';
import { Female, FemaleInBlack, Male, MaleInBlack } from '../assets/icons';
import { verticalScale } from '../utils/responsive';

interface GenderSelectionProps {
  gender: string;
  onGenderChange: (gender: string) => void;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const GenderSelection: React.FC<GenderSelectionProps> = ({
  gender,
  onGenderChange,
  labelStyle,
  containerStyle,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <CommonText style={labelStyle}>{t('profileSetup.gender')}</CommonText>
      <View style={[styles.genderContainer, containerStyle]}>
        <GenderButton
          label={t('profileSetup.male')}
          Icon={MaleInBlack}
          SelctedIcon={Male}
          onPress={() => onGenderChange('Male')}
          isSelected={gender === 'Male'}
        />
        <GenderButton
          label={t('profileSetup.female')}
          Icon={FemaleInBlack}
          SelctedIcon={Female}
          onPress={() => onGenderChange('Female')}
          isSelected={gender === 'Female'}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default GenderSelection;
