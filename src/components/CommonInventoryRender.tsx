import { TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import CommonText from './CommonText';
import { IMAGE_BASE_URL } from '../utils/helperFunction';
import { Minus, MinusWithRed, Plus, PlusWithGreen } from '../assets/icons';
import { StyleSheet } from 'react-native';
import { colors } from '../themes/colors';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../utils/responsive';
import { fonts } from '../themes/fonts';
import React from 'react';

interface CommonInventoryRenderParams {
  item: {} | undefined;
  onPressPlus: () => void;
  onPressMinus: () => void;
}

const CommonInventoryRender: React.FC<CommonInventoryRenderParams> = ({
  item,
  onPressPlus,
  onPressMinus,
}) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemLeftContainer}>
      {item?.imageUrl && (
        <View style={styles.itemIconContainer}>
          <SvgUri
            width={moderateScale(24)}
            height={moderateScale(24)}
            uri={IMAGE_BASE_URL + item?.imageUrl}
          />
        </View>
      )}
      <CommonText style={styles.itemName}>{item.name}</CommonText>
    </View>
    <View style={styles.itemRightContainer}>
      <TouchableOpacity
        onPress={onPressMinus}
        disabled={item.quantity === 0}
        style={styles.quantityButton}
        activeOpacity={0.8}
      >
        {item.quantity === 0 ? (
          <Minus height={moderateScale(28)} width={moderateScale(28)} />
        ) : (
          <MinusWithRed height={moderateScale(28)} width={moderateScale(28)} />
        )}
      </TouchableOpacity>
      <CommonText style={styles.quantityText}>{item.quantity}</CommonText>
      <TouchableOpacity
        onPress={onPressPlus}
        style={styles.quantityButton}
        activeOpacity={0.8}
      >
        {item.quantity === 0 ? (
          <Plus height={moderateScale(28)} width={moderateScale(28)} />
        ) : (
          <PlusWithGreen height={moderateScale(28)} width={moderateScale(28)} />
        )}
      </TouchableOpacity>
    </View>
  </View>
);

export default CommonInventoryRender;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    justifyContent: 'space-between',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(14),
    flexDirection: 'row',
  },
  itemLeftContainer: {
    flexDirection: 'row',
    gap: moderateScale(16),
    alignItems: 'center',
  },
  itemIconContainer: {
    backgroundColor: colors.ButtonColor + '1A',
    padding: moderateScale(10),
    borderRadius: moderateScale(60),
  },
  itemName: {
    color: colors.Neutrals100,
    fontFamily: fonts.bold,
    fontSize: scaledFontSize(14),
    fontWeight: '700',
  },
  itemRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(15),
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: colors.QuantityButtonBackgroundColor,
    borderRadius: moderateScale(8),
    height: moderateScale(28),
    width: moderateScale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: colors.Neutrals100,
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(16),
    fontWeight: '500',
  },
  otherInput: { width: moderateScale(250) },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  otherLabel: {
    marginTop: verticalScale(24),
    color: colors.Neutrals300,
    fontFamily: fonts.semiBold,
    fontSize: scaledFontSize(16),
    fontWeight: '600',
  },
  otherDetailsContainer: {
    backgroundColor: colors.white,
    paddingVertical: verticalScale(24),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(20),
    marginTop: verticalScale(12),
  },
  inputLabel: {
    marginTop: verticalScale(24),
    color: colors.Neutrals300,
    fontFamily: fonts.semiBold,
    fontSize: scaledFontSize(16),
    fontWeight: '600',
  },
  ownershipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(12),
    gap: moderateScale(16),
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
    borderColor: colors.ButtonColor,
  },
  genderText: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: scaledFontSize(14),
    fontWeight: '500',
  },
  ownershipTextSelected: {
    color: colors.ButtonColor,
  },
  buttonsContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingVertical: moderateScale(24),
    paddingHorizontal: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(36),
    gap: moderateScale(16),
  },
  otherButtonContainer: {
    flex: 0,
  },
  otherButton: {
    backgroundColor: colors.white,
    borderColor: colors.ButtonColor,
    borderWidth: 1,
    paddingHorizontal: moderateScale(40),
    paddingVertical: moderateScale(17),
  },
  otherButtonText: {
    color: colors.ButtonColor,
  },
  deleteButton: {
    backgroundColor: colors.white,
    borderColor: colors.error,
    borderWidth: 1,
    paddingHorizontal: moderateScale(40),
    paddingVertical: moderateScale(17),
  },
  deleteButtonText: {
    color: colors.error,
  },
  saveButtonContainer: {
    flex: 0,
  },
  saveButton: {
    paddingHorizontal: moderateScale(50),
    paddingVertical: moderateScale(17),
  },
});
