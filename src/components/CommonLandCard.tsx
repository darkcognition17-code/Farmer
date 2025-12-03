import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import CommonText from './CommonText';
import { CropLeaf, NoCropLeaf } from '../assets/icons';
import { Images } from '../assets/images';
import { colors } from '../themes/colors';
import { fonts } from '../themes/fonts';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../utils/responsive';

interface LandCardProps {
  title: string;
  cropCount: number;
  acres: number;
  areaUnit: string;
  ownedType: string;
  imageSource: ImageSourcePropType;
  isGeoTagged?: boolean;
  onPress: () => void;
}

const CommonLandCard: React.FC<LandCardProps> = ({
  title,
  cropCount,
  acres,
  areaUnit,
  ownedType,
  imageSource,
  isGeoTagged,
  onPress,
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.landCard}>
        {/* Land Image */}
        <Image source={imageSource} style={styles.landThumb} />

        {/* GeoTag Badge (Specific to Home Screen logic) */}
        {isGeoTagged && <Image source={Images.geoTag} style={styles.geoTag} />}

        <View style={styles.landContent}>
          <CommonText style={styles.landTitle}>{title}</CommonText>

          {/* Crop Count Logic */}
          <View style={styles.cropRow}>
            {cropCount > 0 ? (
              <>
                <View style={styles.leaf}>
                  <CropLeaf />
                </View>
                <CommonText style={styles.cropCount}>
                  {cropCount} {t('home.cropsAdded')}
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

        {/* Footer: Ownership & Area */}
        <View style={styles.landFooter}>
          <CommonText style={styles.ownedLabel}>
            {t(`home.${ownedType.toLowerCase()}`)}
          </CommonText>
          <CommonText style={styles.acres}>
            {acres} {areaUnit}
          </CommonText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CommonLandCard;

const styles = StyleSheet.create({
  landCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(14),
    padding: moderateScale(16),
    marginBottom: verticalScale(30),
    marginLeft: moderateScale(16), // Note: Keep check if margins fit both screens
  },
  landThumb: {
    width: moderateScale(98),
    height: moderateScale(98),
    resizeMode: 'cover',
    borderRadius: moderateScale(16),
    position: 'absolute',
    zIndex: 1,
    top: moderateScale(-15),
    left: moderateScale(-15),
  },
  geoTag: {
    width: moderateScale(82),
    height: moderateScale(30),
    resizeMode: 'cover',
    borderRadius: moderateScale(16),
    position: 'absolute',
    top: moderateScale(-3),
    right: moderateScale(-3),
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
  noCount: {
    color: colors.Secondary,
  },
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
});
