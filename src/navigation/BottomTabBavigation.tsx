import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomTabBg,
  AddPostTab,
  ProfileTab,
  ProfileSelectTab,
  HomeTab,
  HomeSelectTab,
  NotificationSelectTab,
  NotificationTab,
  SearchSelectTab,
  SearchTab,
} from '../assets/icons';
import { screenNames } from './screenNames';
import { moderateScale } from '../utils/responsive';
import { Images } from '../assets/images';
import { colors } from '../themes/colors';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { IMAGE_BASE_URL } from '../utils/helperFunction';
import { useTranslation } from 'react-i18next';
import { CommonText } from '../components';

const BottomTabBavigation = ({ state, navigation }) => {
  const inset = useSafeAreaInsets();
  const currentRouteName = state.routes[state.index].name; // active tab
  const { farmerDetails } = useSelector((state: RootState) => state.auth);
  // const profileImage = useSelector(state => state.auth?.farmerDetails) // 🟢 from redux

  const { t } = useTranslation();
  const handlePress = routeName => {
    navigation.navigate(routeName);
  };

  // Tabs (without center AddPost)
  const tabs = [
    {
      name: screenNames.Home,
      label: t('Home'),
      icon: HomeTab,
      selectedIcon: HomeSelectTab,
    },
    {
      name: screenNames.UserDetails,
      label: t('Account'),
      icon: ProfileTab,
      selectedIcon: ProfileSelectTab,
    },
  ];

  //console.log(
  //   'farmerDetails?.data?.profilePhotoUrl',
  //   farmerDetails?.data?.profilePhotoUrl,
  // );

  return (
    <View style={styles.container}>
      {/* Background as SVG */}

      <ImageBackground source={Images.BottomBGNew} style={styles.iBContainer}>
        <View style={styles.tabContainer}>
          {/* Left Tabs: Home + Search */}
          {tabs.slice(0, 1).map((tab, index) => {
            const isFocused = currentRouteName === tab.name;
            const Icon = isFocused ? tab.selectedIcon : tab.icon;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={index}
                onPress={() => handlePress(tab.name)}
                style={styles.tabButton}
              >
                <Icon width={24} height={24} />
                <CommonText
                  style={isFocused ? styles.label : styles.labelSelected}
                >
                  {tab.label}
                </CommonText>
              </TouchableOpacity>
            );
          })}

          {/* Center AddPost */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handlePress(screenNames.AddNewLandStep1)}
            style={styles.centerTabButton}
          >
            <AddPostTab width={moderateScale(87)} height={moderateScale(87)} />
          </TouchableOpacity>

          {/* Right Tabs: Notification + Profile */}
          {tabs.slice(1).map((tab, index) => {
            const isFocused = currentRouteName === tab.name;
            // const Icon = isFocused ? tab.selectedIcon : tab.icon;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={index}
                onPress={() => handlePress(tab.name)}
                style={styles.tabButton}
              >
                <Image
                  source={
                    farmerDetails?.data?.profilePhotoUrl
                      ? {
                          uri:
                            IMAGE_BASE_URL +
                            farmerDetails?.data?.profilePhotoUrl,
                        }
                      : Images.placeHolder // your local placeholder
                  }
                  defaultSource={Images.placeHolder} // iOS: shows placeholder while loading
                  style={[
                    styles.userImage,
                    { borderWidth: moderateScale(isFocused ? 1 : 0) },
                  ]}
                  resizeMode="cover"
                  onError={e => {
                    e.target.src = Images.placeHolder;
                  }}
                />
                <CommonText
                  style={isFocused ? styles.label : styles.labelSelected}
                >
                  {tab.label}
                </CommonText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ ...styles.base, height: inset.bottom }} />
      </ImageBackground>
    </View>
  );
};

export default BottomTabBavigation;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: moderateScale(95),
    top: moderateScale(15),
  },
  userImage: {
    height: moderateScale(28),
    width: moderateScale(28),
    borderRadius: moderateScale(14),
    borderColor: colors.ButtonColor,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  centerTabButton: {
    width: moderateScale(60),
    height: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: moderateScale(15),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    top: moderateScale(-22),
  },
  label: {
    fontSize: moderateScale(12),
    color: colors.Secondary,
    marginTop: 2,
  },
  labelSelected: {
    fontSize: moderateScale(12),
    color: colors.MediumGray,
    marginTop: 2,
  },
  iBContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: moderateScale(Platform.OS == 'android' ? 120 : 156),
    top: moderateScale(10),
  },
  base: {
    width: '100%',
    backgroundColor: colors.white,
  },
});
