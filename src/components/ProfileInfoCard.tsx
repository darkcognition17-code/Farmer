import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { EditPencilIcon } from '../assets/icons';
import CommonText from './CommonText';
import { moderateScale, verticalScale } from '../utils/responsive';
import { colors } from '../themes/colors';
import { fonts } from '../themes/fonts';
import { Images } from '../assets/images';

interface ProfileInfoCardProps {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
  isAddCrop?:boolean
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  title,
  children,
  onEdit,
  isAddCrop,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CommonText style={styles.title}>{title}</CommonText>
        {onEdit && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.editButton}
            onPress={onEdit}
          >
            {isAddCrop ? (
              <Image
                style={styles.landImage}
                source={Images.plusIcon}
              />
            ) : (
              <EditPencilIcon
                width={moderateScale(14)}
                height={moderateScale(14)}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      <View style={isAddCrop ? styles.content2 : styles.content}>
        {children}
      </View>
    </View>
  );
};

export default ProfileInfoCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(20),
    width: '94%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: moderateScale(16),
    color: colors.ProfileInfoTitle,
    fontWeight: '700',
  },
  editButton: {
    backgroundColor: colors.Orange,
    borderRadius: moderateScale(12),
    padding: moderateScale(4),
  },
  content: {
    padding: moderateScale(16),
    backgroundColor: colors.white,
    gap: verticalScale(4),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: colors.Neutrals900,
  },
  content2: {
    borderColor: colors.Neutrals900,
  },
  landImage: {
    width: moderateScale(14), height: moderateScale(14) 
    
  }
});
