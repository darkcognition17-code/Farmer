import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { GradientBackground } from '.';
import { colors } from '../themes/colors';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../utils/responsive';
import CommonText from '../components/CommonText';
import { BackButton, EditPencilIcon } from '../assets/icons'; // your edit icon
import { Images } from '../assets/images';
import { fonts } from '../themes/fonts';
import { IMAGE_BASE_URL } from '../utils/helperFunction';

interface ProfileHeaderProps {
  name: string;
  imageUri?: string;
  onEditPress?: () => void;
  navigation?: any;
  isShowBackButton?: boolean;
  mainTitle?: string;
}

// const ProfileHeader: React.FC<ProfileHeaderProps> = ({
//   name,
//   imageUri,
//   onEditPress,
//   navigation,
//   isShowBackButton,
//   mainTitle,
// }) => {

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  imageUri,
  onEditPress,
  navigation,
  isShowBackButton,
  mainTitle,
}) => {
  return (
    <GradientBackground
      imageStyle={styles.imageBackground}
      style={styles.progressHeader}
    >
      {isShowBackButton && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.bell}
        >
          <BackButton width={moderateScale(10)} height={moderateScale(15)} />
        </TouchableOpacity>
      )}
      <CommonText style={styles.title}>{mainTitle ?? ''}</CommonText>

      <View style={styles.profileCard}>
        <View style={styles.imageContainer}>
          <Image
            source={
              imageUri ? { uri: IMAGE_BASE_URL + imageUri } : Images.placeHolder
            }
            defaultSource={Images.placeHolder} //
            style={styles.profileImage}
          />
          {/* <TouchableOpacity
            activeOpacity={0.8}
            style={styles.editButton}
            onPress={onEditPress}
          >
            <EditPencilIcon
              width={moderateScale(14)}
              height={moderateScale(14)}
            />
          </TouchableOpacity> */}
        </View>
        <CommonText style={styles.userName}>{name}</CommonText>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.Neutrals010,
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: scaledFontSize(18),
    top: moderateScale(Platform.OS == 'android' ? -30 : 0),
  },
  progressHeader: {
    paddingTop: verticalScale(60),
    paddingBottom: moderateScale(20),
    alignItems: 'center',
    borderRadius: moderateScale(24),
    height: verticalScale(200),
  },
  imageBackground: {
    resizeMode: 'cover',
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(24),
    paddingVertical: moderateScale(16),
    width: '92%',
    alignItems: 'center',
    position: 'absolute',
    bottom: -45,
    shadowColor: colors.black + '0F',
    shadowRadius: moderateScale(16),
    elevation: moderateScale(16),
    shadowOffset: {
      height: verticalScale(8),
      width: 0,
    },
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
  },
  editButton: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: colors.Orange,
    borderRadius: moderateScale(12),
    padding: moderateScale(4),
  },
  userName: {
    marginTop: moderateScale(8),
    fontWeight: '600',
    fontSize: moderateScale(18),
    fontFamily: fonts.semiBold,
    color: colors.Neutrals010,
  },
  bell: {
    borderRadius: moderateScale(9),
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    paddingLeft: moderateScale(12),
    paddingRight: moderateScale(14),
    position: 'absolute',
    left: moderateScale(20),
    top: moderateScale(Platform.OS == 'ios' ? 55 : 25),
  },
});

export default ProfileHeader;
