import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';
import CommonBottomSelectModal from './CommonBottomSelectModal';
import CommonDropdown from './CommonDropdown';
import CommonInput from './CommonInput';
import CommonText from './CommonText';
import {
  Machinery,
  HPIcon,
  Driver,
  DownIcon,
  Clutch,
  PowerSteering,
  Calender,
  CalenderBlack,
  Cart,
  TickFilled,
  DownBlack,
  Minus,
  MinusWithRed,
  Plus,
  PlusWithGreen,
} from '../assets/icons'; // Adjust path
import { colors } from '../themes/colors';
import { fonts } from '../themes/fonts';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../utils/responsive';
import { MOBILE_REGEX } from '../utils/regex';

interface MachineryFormCardProps {
  item: any;
  index: number;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onChange: (field: string, value: any) => void;
  onQuantityChange?: (change: number) => void;
}

const MachineryFormCard: React.FC<MachineryFormCardProps> = ({
  item,
  index,
  isCollapsible = false,
  isCollapsed = false,
  onToggleCollapse,
  onChange,
  onQuantityChange,
}) => {
  const { t } = useTranslation();

  // Local state for modals to avoid prop drilling from parent
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    data: any[];
    field: string;
  }>({ visible: false, title: '', data: [], field: '' });

  const [datePickerConfig, setDatePickerConfig] = useState<{
    visible: boolean;
    field: string;
  }>({ visible: false, field: '' });

  const type = item.name.toLowerCase();

  // Helper to open dropdowns
  const openSelectModal = (title: string, data: any[], field: string) => {
    setModalConfig({ visible: true, title, data, field });
  };

  const handleSelect = (selectedItem: any) => {
    // For Yes/No or specific ID mapping, you might need conditional logic here
    const value =
      selectedItem.id === 'Yes'
        ? 'Yes'
        : selectedItem.id === 'No'
          ? 'No'
          : selectedItem.name || selectedItem.id;
    onChange(modalConfig.field, value);
    setModalConfig({ ...modalConfig, visible: false });
  };

  const renderHeader = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={!isCollapsible}
      onPress={onToggleCollapse}
      style={[
        styles.sectionHeader,
        (!isCollapsed || !isCollapsible) && styles.commonMargin,
      ]}
    >
      <CommonText style={styles.sectionTitle}>
        {item.name} {item.instanceNumber ? `(${item.instanceNumber})` : ''}
      </CommonText>
      {isCollapsible && (
        <DownBlack
          height={moderateScale(24)}
          width={moderateScale(24)}
          style={isCollapsed && { transform: [{ rotate: '180deg' }] }}
        />
      )}
    </TouchableOpacity>
  );

  const renderDateField = (
    field: string,
    label: string,
    icon: any = Calender,
  ) => {
    // Handle display value
    let displayValue = t('machineryDetails.yearPlaceholder');
    const dateVal =
      field === 'yearOfManufacture' ? item.yearOfManufacture : item.modelNumber;

    if (dateVal) {
      // If it's a full date string/object
      const d = new Date(dateVal);
      // Basic check if date is valid
      if (!isNaN(d.getTime())) {
        displayValue =
          field === 'modelNumber'
            ? d.toLocaleDateString()
            : d.getFullYear().toString();
      } else if (typeof dateVal === 'string' || typeof dateVal === 'number') {
        // If it's stored directly as "2023" or similar
        displayValue = dateVal.toString();
      }
    }

    return (
      <View style={styles.dateFieldContainer}>
        <CommonText style={styles.label}>{label}</CommonText>
        <CommonDropdown
          textStyle={{ color: dateVal ? colors.black : colors.Neutrals500 }}
          label={displayValue}
          LeftIcon={icon}
          onPress={() => setDatePickerConfig({ visible: true, field })}
        />
      </View>
    );
  };

  // --- Content Renderers ---

  const renderTractorFields = () => (
    <View style={styles.fieldRow}>
      <View style={styles.fieldCol}>
        <CommonInput
          leftIcon={
            <Machinery height={moderateScale(24)} width={moderateScale(24)} />
          }
          label={t('machineryDetails.brandLabel')}
          placeholder={t('addMachineryDetails.brandPlaceholder')}
          containerStyle={styles.inputContainer}
          style={styles.input}
          value={item.brand}
          onChangeText={text => onChange('brand', text)}
        />
      </View>
      <View style={styles.fieldCol}>
        {renderDateField('yearOfManufacture', t('machineryDetails.yearLabel'))}
      </View>
      <View style={styles.fieldCol}>
        <CommonInput
          keyboardType="numeric"
          containerStyle={styles.inputContainer}
          leftIcon={
            <HPIcon height={moderateScale(24)} width={moderateScale(24)} />
          }
          label={t('machineryDetails.hpLabel')}
          placeholder={t('machineryDetails.hpPlaceholder')}
          style={styles.input}
          maxLength={4}
          allowedCharsRegex={MOBILE_REGEX}
          value={item.horsepower ? item.horsepower.toString() : ''}
          onChangeText={text => onChange('horsepower', text)}
        />
      </View>
      <View style={styles.fieldCol}>
        <CommonText style={styles.label}>
          {t('machineryDetails.driverTypeLabel')}
        </CommonText>
        <CommonDropdown
          LeftIcon={Driver}
          RightIcon={DownIcon}
          label={item.driveType || t('addMachineryDetails.brandPlaceholder')}
          textWidth={moderateScale(60)}
          onPress={() =>
            openSelectModal(
              t('machineryDetails.selectDriveType'),
              [
                { id: '2WD', name: t('machineryDetails.driveType2WD') },
                { id: '4WD', name: t('machineryDetails.driveType4WD') },
              ],
              'driveType',
            )
          }
        />
      </View>
      <View style={styles.fieldCol}>
        <CommonText style={styles.label}>
          {t('machineryDetails.clutchLabel')}
        </CommonText>
        <CommonDropdown
          LeftIcon={Clutch}
          RightIcon={DownIcon}
          label={item.clutchType || t('addMachineryDetails.brandPlaceholder')}
          textWidth={moderateScale(60)}
          onPress={() =>
            openSelectModal(
              t('machineryDetails.selectClutchType'),
              [
                {
                  id: 'Hydraulic',
                  name: t('machineryDetails.clutchHydraulic'),
                },
                { id: 'Manual', name: t('machineryDetails.clutchManual') },
              ],
              'clutchType',
            )
          }
        />
      </View>
      <View style={styles.fieldCol}>
        <CommonText style={styles.label}>
          {t('machineryDetails.powerSteeringLabel')}
        </CommonText>
        <CommonDropdown
          LeftIcon={PowerSteering}
          RightIcon={DownIcon}
          label={
            item.powerSteering === 'Yes' || item.powerSteering === true
              ? t('machineryDetails.yes')
              : item.powerSteering === 'No' || item.powerSteering === false
                ? t('machineryDetails.no')
                : t('addMachineryDetails.brandPlaceholder')
          }
          textWidth={moderateScale(60)}
          onPress={() =>
            openSelectModal(
              t('machineryDetails.selectPowerSteeringType'),
              [
                { id: 'Yes', name: t('machineryDetails.yes') },
                { id: 'No', name: t('machineryDetails.no') },
              ],
              'powerSteering',
            )
          }
        />
      </View>
    </View>
  );

  const renderTrolleyFields = () => (
    <View>
      <CommonText style={styles.label}>
        {t('machineryDetails.trolleyTypeLabel')}
      </CommonText>
      <View style={styles.toggleRow}>
        {['Manual', 'Hydraulic'].map(mechType => (
          <TouchableOpacity
            key={mechType}
            style={[
              styles.toggleButton,
              item.mechanismType === mechType && styles.selectedToggle,
            ]}
            onPress={() => onChange('mechanismType', mechType)}
          >
            <CommonText
              style={[
                styles.toggleText,
                item.mechanismType === mechType && styles.selectedToggle,
              ]}
            >
              {mechType === 'Manual'
                ? t('machineryDetails.clutchManual')
                : t('machineryDetails.clutchHydraulic')}
            </CommonText>
            {item.mechanismType === mechType && (
              <TickFilled
                height={moderateScale(21)}
                width={moderateScale(21)}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <CommonInput
        style={styles.input}
        label={t('machineryDetails.sizeLabel')}
        placeholder={t('addMachineryDetails.sizePlaceholder')}
        maxLength={5}
        allowedCharsRegex={MOBILE_REGEX}
        leftIcon={<Cart height={moderateScale(24)} width={moderateScale(24)} />}
        value={item.size ? item.size.toString() : ''}
        onChangeText={text => onChange('size', text)}
      />
    </View>
  );

  const renderSimpleQuantity = () => (
    <View style={styles.itemRightContainer}>
      <TouchableOpacity
        onPress={() => onQuantityChange && onQuantityChange(-1)}
        disabled={item.count === 0}
        style={styles.quantityButton}
        activeOpacity={0.8}
      >
        {item.count === 0 ? (
          <Minus height={moderateScale(28)} width={moderateScale(28)} />
        ) : (
          <MinusWithRed height={moderateScale(28)} width={moderateScale(28)} />
        )}
      </TouchableOpacity>
      <CommonText style={styles.quantityText}>{item.count}</CommonText>
      <TouchableOpacity
        onPress={() => onQuantityChange && onQuantityChange(1)}
        style={styles.quantityButton}
        activeOpacity={0.8}
      >
        <PlusWithGreen height={moderateScale(28)} width={moderateScale(28)} />
      </TouchableOpacity>
    </View>
  );

  // --- Main Render Logic ---

  // Handle Simple Types (Harvester, Raker, Slasher)
  if (['slasher', 'raker', 'harvester'].includes(type)) {
    return (
      <View style={styles.sectionCard}>
        <View style={styles.nonRepeatableContainer}>
          <CommonText style={styles.sectionTitle}>
            {item.name} {item.instanceNumber ? `(${item.instanceNumber})` : ''}
          </CommonText>
          {/* If Add Screen (has onQuantityChange), show controls. If Edit screen, usually just show count or standard controls */}
          {onQuantityChange ? (
            renderSimpleQuantity()
          ) : (
            <CommonText style={styles.quantityText}>
              {t('addMachineryDetails.quantityPrefix')}
              {item.count}
            </CommonText>
          )}
        </View>
      </View>
    );
  }

  // Handle Complex Types
  return (
    <View style={styles.sectionCard}>
      {renderHeader()}

      {!isCollapsed && (
        <View>
          {type === 'tractor' && renderTractorFields()}

          {type === 'balers' && (
            <View style={styles.fieldRow}>
              {renderDateField(
                'modelNumber',
                t('machineryDetails.modelLabel'),
                CalenderBlack,
              )}
            </View>
          )}

          {type === 'trolleys' && renderTrolleyFields()}

          {type === 'tube well pumps' && (
            <CommonInput
              style={styles.input}
              label={t('machineryDetails.capacityLabel')}
              placeholder={t('addMachineryDetails.sizePlaceholder')}
              maxLength={5}
              allowedCharsRegex={MOBILE_REGEX}
              leftIcon={
                <Cart height={moderateScale(24)} width={moderateScale(24)} />
              }
              value={item.capacity ? item.capacity.toString() : ''}
              onChangeText={text => onChange('capacity', text)}
            />
          )}

          {type === 'others' && (
            <CommonInput
              label={t('addMachineryDetails.detailsLabel')}
              placeholder={t('addMachineryDetails.detailsLabel')}
              multiline
              style={styles.otherInput}
              value={item.otherText}
              onChangeText={text => onChange('otherText', text)}
            />
          )}
        </View>
      )}

      {/* Internal Modals */}
      <CommonBottomSelectModal
        isVisible={modalConfig.visible}
        onClose={() => setModalConfig({ ...modalConfig, visible: false })}
        onSelect={handleSelect}
        title={modalConfig.title}
        data={modalConfig.data}
      />
      <DatePicker
        modal
        open={datePickerConfig.visible}
        date={new Date()} // Default to now, or parse existing date if needed
        maximumDate={new Date()}
        mode="date"
        onConfirm={date => {
          setDatePickerConfig({ ...datePickerConfig, visible: false });
          // Format date as needed for the backend or local state
          onChange(datePickerConfig.field, date);
        }}
        onCancel={() =>
          setDatePickerConfig({ ...datePickerConfig, visible: false })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(24),
    marginHorizontal: verticalScale(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commonMargin: { marginBottom: verticalScale(16) },
  sectionTitle: {
    fontWeight: '600',
    fontFamily: fonts.semiBold,
    fontSize: scaledFontSize(18),
    color: colors.Neutrals010,
  },
  fieldRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    rowGap: moderateScale(16),
  },
  fieldCol: {
    width: '48%',
  },
  inputContainer: { marginBottom: 0 },
  input: {
    paddingVertical: verticalScale(18),
    paddingHorizontal: moderateScale(14),
  },
  label: {
    fontWeight: '500',
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(14),
    color: colors.Neutrals100,
    marginBottom: 4,
  },
  dateFieldContainer: { flex: 1 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    marginTop: verticalScale(4),
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: colors.Neutrals700,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(13),
    paddingHorizontal: verticalScale(16),
    width: '48%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedToggle: {
    borderColor: colors.ButtonColor,
    color: colors.ButtonColor,
  },
  toggleText: {
    color: colors.Neutrals010,
    fontWeight: '500',
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(14),
  },
  otherInput: { height: verticalScale(80) },
  itemRightContainer: { flexDirection: 'row', alignItems: 'center' },
  nonRepeatableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityButton: { paddingHorizontal: moderateScale(8) },
  quantityText: {
    fontWeight: '500',
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(14),
    color: colors.Neutrals300,
  },
});

export default MachineryFormCard;
