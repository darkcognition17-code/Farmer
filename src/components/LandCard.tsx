import React, { useState } from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { moderateScale } from '../utils/responsive';
import { screenNames } from '../navigation/screenNames';
import { colors } from '../themes/colors';
import CommonText from '../components/CommonText'; // update path based on your structure
import ImagePickerModal from '../components/ImagePikerModal'; // update path if needed
import { scaledFontSize, verticalScale } from '../utils/responsive';
import { fonts } from '../themes/fonts';
import {
  CropLeaf,
  DustbinModal,
  EditModalPencil,
  EditPencilIcon,
  NoCropLeaf,
} from '../assets/icons';

const LandCard = ({ item, navigation, landImage, onEdit }) => {
  //console.log('item==================.  ', item);

  const { t } = useTranslation();
  const [editModal, setEditModal] = useState(false);
  const land = item;

  return (
    <TouchableOpacity
      // onPress={() => navigation.navigate(screenNames.LandDetails, { landDetails: item })}
      activeOpacity={0.9}
      style={styles.container}
    >
      <View key={land.id} style={styles.landCard}>
        {/* Edit / Delete modal */}
        <ImagePickerModal
          visible={editModal}
          cancelable={false}
          title1={'Edit Details'}
          Icon1={
            <EditModalPencil
              width={moderateScale(24)}
              height={moderateScale(24)}
            />
          }
          title2={'Delete'}
          Icon2={
            <DustbinModal
              width={moderateScale(24)}
              height={moderateScale(24)}
            />
          }
          onCameraPress={() => {
            navigation.navigate(screenNames.AddNewLandStep3, { item: land });
            setEditModal(false);
          }}
          onGalleryPress={() => {
            //console.log('gallery');
            setEditModal(false);
          }}
          onClose={() => setEditModal(false)}
        />

        {/* Land Image */}
        <Image source={landImage} style={styles.landThumb} />

        {/* Content */}
        <View style={styles.landContent}>
          <CommonText style={styles.landTitle}>{land?.landName}</CommonText>
          {onEdit && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.editButton}
              onPress={onEdit}
            >
              <EditPencilIcon
                width={moderateScale(14)}
                height={moderateScale(14)}
              />
            </TouchableOpacity>
          )}
          <View style={styles.cropRow}>
            {land?.cropsCount > 0 ? (
              <>
                <View style={styles.leaf}>
                  <CropLeaf />
                </View>
                <CommonText style={styles.cropCount}>
                  {land?.cropsCount} {t('home.cropsAdded')}
                </CommonText>
              </>
            ) : (
              <>
                <View style={styles.leaf}>
                  <NoCropLeaf />
                </View>
                <CommonText style={[styles.cropCount, styles.noCount]}>
                  {t('home.noCropsAdded')}
                </CommonText>
              </>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.landFooter}>
          <CommonText style={styles.ownedLabel}>
            {t(`home.${land?.landType?.toLowerCase()}`)}
          </CommonText>
          <CommonText style={styles.acres}>
            {land?.area}{' '}
            {t(land?.areaUnit == 'hectare' ? 'home.hectare' : 'home.acres')}
          </CommonText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LandCard;

const styles = StyleSheet.create({
  container: { marginTop: moderateScale(-130) },
  landCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(14),
    padding: moderateScale(16),
    marginBottom: verticalScale(30),
    margin: moderateScale(16),
  },
  landThumb: {
    width: moderateScale(64),
    height: moderateScale(64),
    resizeMode: 'cover',
    borderRadius: moderateScale(12),
    position: 'absolute',
    top: moderateScale(16),
    left: moderateScale(10),
  },
  landContent: {
    flex: 1,
    marginLeft: moderateScale(90),
  },
  landTitle: {
    fontSize: scaledFontSize(18),
    fontWeight: '700',
    fontFamily: fonts.bold,
    lineHeight: verticalScale(24),
  },
  cropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(8),
    gap: moderateScale(8),
  },
  leaf: {
    padding: moderateScale(8),
    borderRadius: moderateScale(14),
    backgroundColor: colors.LeafBg,
  },
  cropCount: {
    color: colors.CropCountGreen,
    fontWeight: '700',
  },
  noCount: { color: colors.Secondary },
  landFooter: {
    marginTop: moderateScale(25),
    marginBottom: moderateScale(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: moderateScale(8),
    backgroundColor: colors.LandFooterBg,
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(11),
  },
  ownedLabel: {
    color: colors.OwnedLabelText + 'E5',
    fontWeight: '400',
    fontFamily: fonts.regular,
    lineHeight: verticalScale(18),
    fontSize: scaledFontSize(12),
  },
  acres: {
    fontWeight: '700',
    fontFamily: fonts.bold,
    fontSize: scaledFontSize(15),
  },
  editButton: {
    backgroundColor: colors.Orange,
    borderRadius: moderateScale(12),
    padding: moderateScale(4),
    // height:moderateScale(28),
    // width: moderateScale(28),
    position: 'absolute',
    right: moderateScale(-8),
    top: moderateScale(-8),
  },
});
