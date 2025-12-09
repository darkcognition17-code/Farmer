import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { moderateScale, verticalScale } from '../utils/responsive';
import { colors } from '../themes/colors';
import { EditPencilIcon, DustbinModal, EditModalPencil } from '../assets/icons';
import { SvgUri } from 'react-native-svg';
import { IMAGE_BASE_URL } from '../utils/helperFunction';
import CommonText from './CommonText';
import ImagePickerModal from './ImagePikerModal';
import { useTranslation } from 'react-i18next';
import ColoredSvg from './ColoredSvg';

interface CommonDetailsCardProps {
  item: any;
  onEditPress: (item: any) => void;
  onDeletePress: (item: any) => void;
  imageUrl: string;
  itemName: string;
  renderDetails: (item: any) => React.ReactNode;
  editModalVisible: boolean;
  setEditModalVisible: (visible: boolean) => void;
  setSentItem: (item: any) => void;
  type: 'livestock' | 'machinery'; // Added to differentiate if needed for styles/logic
}

const CommonDetailsCard: React.FC<CommonDetailsCardProps> = ({
  item,
  onEditPress,
  onDeletePress,
  imageUrl,
  itemName,
  renderDetails,
  editModalVisible,
  setEditModalVisible,
  setSentItem,
  type,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => {
          setSentItem(item);
          setEditModalVisible(true);
        }}
        activeOpacity={0.8}
        style={styles.editButton}
      >
        <EditPencilIcon height={moderateScale(16)} width={moderateScale(16)} />
      </TouchableOpacity>
      <ImagePickerModal
        visible={editModalVisible}
        cancelable={false}
        title1={t(`liveStockDetails.editDetails`)}
        Icon1={
          <EditModalPencil
            width={moderateScale(24)}
            height={moderateScale(24)}
          />
        }
        onCameraPress={() => onEditPress(item)}
        title2={t(`liveStockDetails.delete`)}
        Icon2={
          <DustbinModal width={moderateScale(24)} height={moderateScale(24)} />
        }
        onGalleryPress={() => onDeletePress(item)}
        onClose={() => setEditModalVisible(false)}
      />
      <View style={styles.itemHeader}>
        {imageUrl && (
          <View style={styles.itemIconContainer}>
            <ColoredSvg
              uri={IMAGE_BASE_URL + item?.imageUrl}
              color={
                type == 'livestock'
                  ? colors.LiveStockName
                  : colors.CropCountGreen
              }
              size={type == 'livestock' ? moderateScale(21) : moderateScale(24)}
            />
          </View>
        )}
        <CommonText
          style={[
            styles.itemName,
            {
              color:
                type === 'livestock'
                  ? colors.LiveStockName
                  : colors.CropCountGreen,
            },
          ]}
        >
          {itemName}
        </CommonText>
      </View>
      <View style={styles.itemDetailsContainer}>{renderDetails(item)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
    padding: moderateScale(16),
    marginBottom: moderateScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    position: 'absolute',
    top: moderateScale(10),
    right: moderateScale(10),
    zIndex: 0,
    backgroundColor: colors.ButtonColor,
    padding: moderateScale(6),
    borderRadius: moderateScale(25),
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(10),
  },
  itemIconContainer: {
    marginRight: moderateScale(10),
  },
  itemName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  itemDetailsContainer: {
    marginLeft: moderateScale(4), // Align with item name
    maxHeight: verticalScale(100),
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default CommonDetailsCard;
