import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from '../utils/responsive';
import { colors } from '../themes/colors';
import { EditPencilIcon } from '../assets/icons';
import CommonText from './CommonText';

export interface CropItem {
  plantedAreaOwn: string;
  area: string;
  cropType: string;
  cropVariety: string;
  seedVariety: string;
}

interface Props {
  item: CropItem;
  index: number;
  onEdit?: (item: CropItem, index: number) => void;
}

const CropCard: React.FC<Props> = ({ item, index, onEdit }) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <CommonText style={styles.title}>Crop #{index + 1}</CommonText>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.editButton}
          onPress={() => onEdit && onEdit(item, index)}
        >
          <EditPencilIcon
            width={moderateScale(14)}
            height={moderateScale(14)}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <CommonText style={styles.label}>
            Total Area Under Cultivation
          </CommonText>
          <CommonText style={styles.value}>
            {item.plantedAreaOwn ?? item.plantedAreaLeased ?? ''}
          </CommonText>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <CommonText style={styles.label}>Crop Type</CommonText>
          <CommonText style={styles.value}>{item.cropType}</CommonText>
        </View>

        <View style={styles.column}>
          <CommonText style={styles.label}>Crop Variety</CommonText>
          <CommonText style={styles.value}>{item.cropVariety}</CommonText>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <CommonText style={styles.label}>Seed Variety</CommonText>
          <CommonText style={styles.value}>{item.seedVariety}</CommonText>
        </View>
      </View>
    </View>
  );
};

export default CropCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(15),
    backgroundColor: colors.white,
    padding: moderateScale(16),
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },

  title: {
    fontSize: moderateScale(18),
    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(14),
  },

  column: {
    flex: 1,
    marginRight: moderateScale(16),
  },

  label: {
    fontSize: moderateScale(14),
    color: colors.gray,
  },

  value: {
    fontSize: moderateScale(16),
    marginTop: moderateScale(4),
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: colors.Orange,
    borderRadius: moderateScale(12),
    padding: moderateScale(4),
  },
});
