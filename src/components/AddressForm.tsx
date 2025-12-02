import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import CommonBottomSelectModal from './CommonBottomSelectModal';
import CommonInput from './CommonInput';
import CommonText from './CommonText';
import CommonDropdown from './CommonDropdown';
import {
  AddressGray,
  PincodeGray,
  DistrictGray,
  DownIcon,
  MandalGray,
  VillageGray,
  LocationGray,
  MapGray,
  DownBlack,
  Mandal,
  Village,
} from '../assets/icons'; // Adjust path
import { useLocationData } from '../hooks/useLocationData';
import { MOBILE_REGEX, NAME_REGEX } from '../utils/regex';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../utils/responsive';
import { colors } from '../themes/colors';
import { fonts } from '../themes/fonts';

interface AddressFormProps {
  // Form State
  address: string;
  setAddress: (val: string) => void;
  pincode: string;
  setPincode: (val: string) => void;

  // Selection State
  selectedState: any;
  setSelectedState: (val: any) => void;
  selectedDistrict: any;
  setSelectedDistrict: (val: any) => void;
  selectedMandal: any;
  setSelectedMandal: (val: any) => void;
  selectedVillage: any;
  setSelectedVillage: (val: any) => void;

  // Manual Inputs
  mandalText: string;
  setMandalText: (val: string) => void;
  villageText: string;
  setVillageText: (val: string) => void;

  // Configuration
  isEditMode?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  setAddress,
  pincode,
  setPincode,
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  selectedMandal,
  setSelectedMandal,
  selectedVillage,
  setSelectedVillage,
  mandalText,
  setMandalText,
  villageText,
  setVillageText,
  isEditMode = false,
}) => {
  const { t } = useTranslation();
  const [showState, setShowState] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  const [showMandal, setShowMandal] = useState(false);
  const [showVillage, setShowVillage] = useState(false);

  const loc = useLocationData();

  // Debounce Search
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (showState)
        loc.fetchLocationData('state', '', loc.searchQuery, 1, false);
      else if (showDistrict)
        loc.fetchLocationData(
          'district',
          selectedState?.id,
          loc.searchQuery,
          1,
          false,
        );
      else if (showMandal)
        loc.fetchLocationData(
          'city',
          selectedDistrict?.id,
          loc.searchQuery,
          1,
          false,
        );
      else if (showVillage)
        loc.fetchLocationData(
          'village',
          selectedMandal?.id,
          loc.searchQuery,
          1,
          false,
        );
    }, 500);
    return () => clearTimeout(debounce);
  }, [loc.searchQuery, showState, showDistrict, showMandal, showVillage]);

  // Dynamic Icons based on Design (Edit screen had specific icons)
  const Icons = {
    Address: isEditMode ? (
      <LocationGray width={moderateScale(24)} height={moderateScale(24)} />
    ) : (
      <AddressGray
        width={moderateScale(24)}
        height={moderateScale(24)}
        style={styles.inputIcon}
      />
    ),
    Pincode: (
      <PincodeGray
        width={moderateScale(24)}
        height={moderateScale(24)}
        style={!isEditMode && styles.inputIcon}
      />
    ),
    StateLeft: isEditMode ? MapGray : DistrictGray,
    DistLeft: isEditMode ? MapGray : DistrictGray,
    MandalLeft: isEditMode ? MapGray : MandalGray,
    VillageLeft: isEditMode ? VillageGray : VillageGray,
    DropdownRight: isEditMode ? DownBlack : DownIcon,
    MandalManual: isEditMode ? (
      <View style={{ top: 5 }}>
        <Mandal width={24} height={24} />
      </View>
    ) : (
      <MandalGray width={24} height={24} style={styles.dropdownIcon} />
    ),
    VillageManual: isEditMode ? (
      <Village width={24} height={24} />
    ) : (
      <VillageGray width={24} height={24} style={styles.dropdownIcon} />
    ),
  };

  return (
    <View>
      {/* Address */}
      {/* Note: Edit screen had a label inside CommonInput for address, usually screens handle labels differently. 
          Here we standardize to use external labels or the component's internal structure. 
          Assuming standardized approach: */}
      {!isEditMode && (
        <CommonText style={styles.label}>
          {t('profileSetup.completeAddress')}
        </CommonText>
      )}

      <CommonInput
        label={isEditMode ? t('profileSetup.completeAddress') : undefined} // Edit screen passed label to input
        required
        placeholder={
          isEditMode
            ? t('addressDetailScreen.enterAddressPlaceholder')
            : t('profileSetup.enterCompleteAddress')
        }
        leftIcon={Icons.Address}
        value={address}
        onChangeText={setAddress}
        multiline
        style={isEditMode ? styles.inputFieldEdit : styles.inputContainer}
        containerStyle={isEditMode ? styles.addressInputContainer : undefined}
      />

      {/* Pincode */}
      <CommonText style={styles.label}>
        {t('profileSetup.pincode')}{' '}
        <CommonText style={styles.required}>*</CommonText>
      </CommonText>
      <CommonInput
        maxLength={6}
        placeholder={
          isEditMode
            ? t('addressDetailScreen.enterPincodePlaceholder')
            : t('profileSetup.enterPincode')
        }
        leftIcon={Icons.Pincode}
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
        allowedCharsRegex={MOBILE_REGEX}
        style={isEditMode ? styles.inputFieldEdit : styles.inputContainer}
      />

      {/* State */}
      <CommonText style={styles.label}>
        {t('profileSetup.state')}{' '}
        <CommonText style={styles.required}>*</CommonText>
      </CommonText>
      <CommonDropdown
        label={
          selectedState?.name || t('addressDetailScreen.selectStatePlaceholder')
        }
        LeftIcon={Icons.StateLeft}
        RightIcon={Icons.DropdownRight}
        onPress={() => {
          loc.resetData();
          setShowState(true);
        }}
      />

      {/* District */}
      <CommonText style={styles.label}>
        {t('profileSetup.district')}{' '}
        <CommonText style={styles.required}>*</CommonText>
      </CommonText>
      <CommonDropdown
        label={
          selectedDistrict?.name ||
          t('addressDetailScreen.selectDistrictPlaceholder')
        }
        LeftIcon={Icons.DistLeft}
        RightIcon={Icons.DropdownRight}
        disabled={!selectedState?.name}
        onPress={() => {
          loc.resetData();
          setShowDistrict(true);
        }}
      />

      {/* Mandal */}
      <CommonText style={styles.label}>
        {t('profileSetup.mandal')}{' '}
        <CommonText style={styles.required}>*</CommonText>
      </CommonText>
      <CommonDropdown
        label={
          selectedMandal?.name ||
          t('addressDetailScreen.selectMandalPlaceholder')
        }
        LeftIcon={Icons.MandalLeft}
        RightIcon={Icons.DropdownRight}
        disabled={!selectedDistrict?.name}
        onPress={() => {
          loc.resetData();
          setShowMandal(true);
        }}
      />
      {selectedMandal?.name === 'Other' && (
        <CommonInput
          placeholder={t('profileSetup.enterMandalName')}
          leftIcon={Icons.MandalManual}
          value={mandalText}
          onChangeText={setMandalText}
          style={isEditMode ? styles.inputContainer : styles.inputContainer}
        />
      )}

      {/* Village */}
      <CommonText style={styles.label}>
        {t('profileSetup.village')}{' '}
        <CommonText style={styles.required}>*</CommonText>
      </CommonText>
      <CommonDropdown
        label={
          selectedVillage?.name ||
          (selectedMandal?.name === 'Other' && 'Other') ||
          t('addressDetailScreen.selectVillagePlaceholder')
        }
        LeftIcon={Icons.VillageLeft}
        RightIcon={Icons.DropdownRight}
        disabled={!selectedMandal?.name || selectedMandal?.name === 'Other'}
        onPress={() => {
          loc.resetData();
          setShowVillage(true);
        }}
      />
      {(selectedVillage?.name === 'Other' ||
        selectedMandal?.name === 'Other') && (
        <CommonInput
          placeholder={t('profileSetup.enterVillage')}
          leftIcon={Icons.VillageManual}
          value={villageText}
          onChangeText={setVillageText}
          style={styles.inputContainer}
          allowedCharsRegex={NAME_REGEX}
        />
      )}

      {/* --- Modals --- */}
      <CommonBottomSelectModal
        isVisible={showState}
        title={t('addressDetailScreen.selectStatePlaceholder')}
        data={loc.dataList}
        showSearchBar
        onSearch={loc.setSearchQuery}
        searchValue={loc.searchQuery}
        onSelect={item => {
          setSelectedState(item);
          // Clear downstream
          setSelectedDistrict(null);
          setSelectedMandal(null);
          setSelectedVillage(null);
          setShowState(false);
        }}
        onClose={() => setShowState(false)}
        onEndReached={() =>
          loc.fetchLocationData('state', '', loc.searchQuery, loc.page, true)
        }
        hasMore={loc.hasMore}
        isLoadingMore={loc.isLoadingMore}
      />

      <CommonBottomSelectModal
        isVisible={showDistrict}
        title={t('addressDetailScreen.selectDistrictPlaceholder')}
        data={loc.dataList}
        showSearchBar
        onSearch={loc.setSearchQuery}
        searchValue={loc.searchQuery}
        onSelect={item => {
          setSelectedDistrict(item);
          setSelectedMandal(null);
          setSelectedVillage(null);
          setShowDistrict(false);
        }}
        onClose={() => setShowDistrict(false)}
        onEndReached={() =>
          loc.fetchLocationData(
            'district',
            selectedState?.id,
            loc.searchQuery,
            loc.page,
            true,
          )
        }
        hasMore={loc.hasMore}
        isLoadingMore={loc.isLoadingMore}
      />

      <CommonBottomSelectModal
        isVisible={showMandal}
        title={t('addressDetailScreen.selectMandalPlaceholder')}
        data={loc.dataList}
        showSearchBar
        onSearch={loc.setSearchQuery}
        searchValue={loc.searchQuery}
        onSelect={item => {
          setSelectedMandal(item);
          setSelectedVillage(null);
          setMandalText('');
          setShowMandal(false);
        }}
        onClose={() => setShowMandal(false)}
        onEndReached={() =>
          loc.fetchLocationData(
            'city',
            selectedDistrict?.id,
            loc.searchQuery,
            loc.page,
            true,
          )
        }
        hasMore={loc.hasMore}
        isLoadingMore={loc.isLoadingMore}
      />

      <CommonBottomSelectModal
        isVisible={showVillage}
        title={t('addressDetailScreen.selectVillagePlaceholder')}
        data={loc.dataList}
        showSearchBar
        onSearch={loc.setSearchQuery}
        searchValue={loc.searchQuery}
        onSelect={item => {
          setSelectedVillage(item);
          setVillageText('');
          setShowVillage(false);
        }}
        onClose={() => setShowVillage(false)}
        onEndReached={() =>
          loc.fetchLocationData(
            'village',
            selectedMandal?.id,
            loc.searchQuery,
            loc.page,
            true,
          )
        }
        hasMore={loc.hasMore}
        isLoadingMore={loc.isLoadingMore}
      />
    </View>
  );
};

export default AddressForm;

const styles = StyleSheet.create({
  label: {
    fontSize: scaledFontSize(14),
    fontWeight: '500',
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: moderateScale(10),
    marginBottom: moderateScale(8),
  },
  required: {
    color: colors.error,
    fontSize: scaledFontSize(15),
  },
  inputIcon: { top: moderateScale(7) },
  dropdownIcon: { top: moderateScale(5) },

  // Standard input style (from AddNewLand)
  inputContainer: {
    paddingVertical: verticalScale(14),
    fontSize: scaledFontSize(14),
    marginTop: verticalScale(15),
    height: moderateScale(56),
  },

  // Edit style (from EditAddressDetails)
  inputFieldEdit: {
    paddingVertical: moderateScale(17),
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(16),
    color: colors.Neutrals010,
    borderRadius: moderateScale(12),
  },
  addressInputContainer: {
    marginBottom: verticalScale(20),
  },
});
