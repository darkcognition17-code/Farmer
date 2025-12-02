import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import CommonInput from './CommonInput'; // Adjust path
import CommonText from './CommonText'; // Adjust path
import CommonBottomSelectModal from './CommonBottomSelectModal'; // Adjust path
import { Land, TickFilled, DownIcon } from '../assets/icons'; // Adjust path
import { useTranslation } from 'react-i18next';
import { MOBILE_REGEX } from '../utils/regex';
import { StyleSheet } from 'react-native';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../utils/responsive'; // Adjust path
import { colors } from '../themes/colors';
import { fonts } from '../themes/fonts';

interface UnitType {
  name: string;
  key: string;
}

interface LandFormBodyProps {
  landName: string;
  setLandName: (text: string) => void;
  ownership: 'own' | 'leased' | null;
  setOwnership: (type: 'own' | 'leased' | null) => void;
  areaValue: string;
  setAreaValue: (text: string) => void;
  areaUnit: UnitType | null;
  setAreaUnit: (unit: UnitType) => void;
}

const LandFormBody: React.FC<LandFormBodyProps> = ({
  landName,
  setLandName,
  ownership,
  setOwnership,
  areaValue,
  setAreaValue,
  areaUnit,
  setAreaUnit,
}) => {
  const { t } = useTranslation();
  const [isUnitModalVisible, setIsUnitModalVisible] = useState(false);

  const units = [
    { name: 'Acres', key: 'acre' },
    { name: 'Hectares', key: 'hectare' },
  ];

  // Helper to reset area fields when switching ownership
  const handleOwnershipChange = (type: 'own' | 'leased') => {
    if (ownership !== type) {
      setOwnership(type);
      setAreaValue('');
      setAreaUnit(null as any);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <CommonText style={styles.subHeader}>{t('addNewLand.title')}</CommonText>

      {/* Land Name Input */}
      <CommonInput
        style={styles.inputStyle}
        placeholder={t('addNewLand.enterLandName')}
        leftIcon={<Land height={moderateScale(24)} width={moderateScale(24)} />}
        value={landName}
        onChangeText={setLandName}
      />

      <View style={styles.divider} />

      {/* Ownership Selection */}
      <CommonText style={styles.subHeader}>
        {t('addNewLand.landDetails')}
      </CommonText>
      <CommonText style={styles.inputLabel}>
        {t('addNewLand.selectLandOwnership')}{' '}
        <CommonText style={styles.requiredAsterisk}>*</CommonText>
      </CommonText>

      <View style={styles.ownershipContainer}>
        {/* Own Option */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleOwnershipChange('own')}
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
            <TickFilled height={moderateScale(21)} width={moderateScale(21)} />
          )}
        </TouchableOpacity>

        {/* Leased Option */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleOwnershipChange('leased')}
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
            <TickFilled height={moderateScale(21)} width={moderateScale(21)} />
          )}
        </TouchableOpacity>
      </View>

      {/* Area & Unit Inputs (Conditional) */}
      {ownership && (
        <>
          <CommonText style={[styles.inputLabel, styles.marginTop16]}>
            {ownership === 'own'
              ? t('addNewLand.ownLand')
              : t('addNewLand.leasedLand')}{' '}
            <CommonText style={styles.requiredAsterisk}>*</CommonText>
          </CommonText>

          <View style={styles.landInputContainer}>
            {/* Area Value */}
            <CommonInput
              containerStyle={styles.landValueInput}
              style={styles.inputStyle}
              placeholder={t('common.enterValue')}
              value={areaValue}
              onChangeText={setAreaValue}
              keyboardType="numeric"
              allowedCharsRegex={MOBILE_REGEX}
            />

            {/* Unit Dropdown Trigger */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.dropdownContainer}
              onPress={() => setIsUnitModalVisible(true)}
            >
              <CommonText style={styles.dropdownText}>
                {areaUnit?.name || t('common.unit')}
              </CommonText>
              <DownIcon height={moderateScale(16)} width={moderateScale(16)} />
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.spacer} />

      {/* Unit Selection Modal */}
      <CommonBottomSelectModal
        isVisible={isUnitModalVisible}
        title={t('addNewLand.selectUnit')}
        data={units}
        onSelect={item => {
          setAreaUnit(item);
          setIsUnitModalVisible(false);
        }}
        onClose={() => setIsUnitModalVisible(false)}
      />
    </View>
  );
};

export default LandFormBody;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: moderateScale(16),
  },
  subHeader: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: moderateScale(16),
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.Neutrals010,
  },
  inputStyle: {
    paddingVertical: verticalScale(17),
    marginBottom: 0,
  },
  divider: {
    height: verticalScale(0),
    borderWidth: 0.8,
    borderColor: colors.Neutrals900,
    marginVertical: verticalScale(5),
  },
  inputLabel: {
    marginTop: moderateScale(6),
    fontSize: moderateScale(14),
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.Neutrals100,
  },
  requiredAsterisk: {
    color: colors.error,
    fontSize: 16,
  },
  ownershipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(8),
  },
  genderOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.ButtonDisableColor,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  genderOptionSelected: {
    borderColor: colors.Secondary,
  },
  genderText: {
    fontSize: scaledFontSize(14),
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.DarkGray,
  },
  ownershipTextSelected: {
    color: colors.Secondary,
  },
  marginTop16: {
    marginTop: moderateScale(16),
  },
  landInputContainer: {
    flexDirection: 'row',
    marginTop: moderateScale(8),
    width: '100%',
    alignItems: 'center',
  },
  landValueInput: {
    flex: 1,
    marginRight: moderateScale(8),
    marginBottom: 0,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(17),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.Neutrals900,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    width: moderateScale(120),
  },
  dropdownText: {
    fontSize: scaledFontSize(14),
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.Neutrals500,
  },
  spacer: {
    height: moderateScale(24),
  },
});
