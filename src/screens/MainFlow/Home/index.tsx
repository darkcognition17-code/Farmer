import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Linking,
  FlatList,
  ActivityIndicator,
  Alert,
  NativeModules,
  Text,
} from 'react-native';
import {
  CommonButton,
  CommonText,
  GradientBackground,
  ImagePickerModal,
  ProfileCompletionCard,
  ScreenWrapper,
} from '../../../components';
import { colors } from '../../../themes/colors';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../utils/responsive';
import { Images } from '../../../assets/images';
import {
  CropLeaf,
  DustbinModal,
  EditModalPencil,
  EditPencilIcon,
  NoCropLeaf,
  NotificationBell,
  SeeAllIcon,
  Telephone,
  WeatherLocation,
  Whatsapp,
} from '../../../assets/icons';

import { styles } from './style';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation/appNavigator';
import { screenNames } from '../../../navigation/screenNames';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import { weatherIconMap } from '../../../utils/weatherIconMap';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import {
  logout,
  fetchFarmerDetails,
  fetchLandList,
} from '../../../redux/slices/authSlice';
import authService, {
  FarmerDetailsResponse,
} from '../../../services/authService';
import { RootState } from '../../../redux/store';
import { showToastable } from 'react-native-toastable';
import CommonLandCard from '../../../components/CommonLandCard';
// import * as Aes from 'react-native-aes-crypto'; // ✅ correct for TS

// const AES_KEY =
//   '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
// const IV = '1234567890123456'; // Must be 16 bytes for AES-CBC

//simport { fonts } from '../../../themes/fonts';

interface Land {
  imageLand: ImageSourcePropType | undefined;
  id: string;
  title: string;
  cropCount: number;
  acres: number;
  image: any; // Assuming Images.LandThumb or similar
  owned: string;
}

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'Home'>;

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  // const phoneNumber = '+919157778005'; // Replace with the actual phone number
  const [weather, setWeather] = useState<any>(null);
  const [weatherIcon, setWeatherIcon] = useState<any>(
    Images.WeatherPlaceholder,
  );

  const [city, setCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [editModal, setEditModal] = useState(false);
  // const [farmerDetails, setFarmerDetails] =
  //   useState<FarmerDetailsResponse | null>(null);
  const [landList, setArrayLandList] = useState<any>([]);
  const [farmerDetails, setFarmerDetails] = useState<any>([]);
  const isFocused = useIsFocused();

  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (accessToken) {
      getFarmerDetails();
      getLandList();
    }
  }, [accessToken, isFocused]);

  const getFarmerDetails = async () => {
    // if (loading) return;
    // setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      showToastable({ message: 'Network timeout', status: 'danger' });
    }, 15000);

    try {
      const response = await dispatch(
        fetchFarmerDetails({
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);
      //console.log('response----------Farmer.', response);
      if (response?.statusCode === 200) {
        setFarmerDetails(response.data);
      }
    } catch (err) {
      clearTimeout(timeout);
      setLoading(false);
      //console.log('Kisani API Error:', err);
    }
  };

  const getLandList = async () => {
    // setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      showToastable({ message: 'Network timeout', status: 'danger' });
    }, 15000);

    try {
      const response = await dispatch(
        fetchLandList({
          payload: { page: 1, limit: 5 },
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);

      //console.log('response----------Land. ', response);

      if (response?.statusCode === 200) {
        const newData = response?.data || []; // adjust key based on your API response

        let data =
          newData.lands?.map(land => ({
            id: land.landId,
            title: land.landName,
            cropCount: land.totalCrops,
            acres: land.area,
            image: '', // You might need to map an actual image if available in the API response
            owned: land.landType,
            others: land,
            areaUnit: t(
              land.areaUnit == 'hectare' ? 'home.hectare' : 'home.acres',
            ),
            imageLand: images[Math.floor(Math.random() * images.length)],
          })) ?? [];

        setArrayLandList(data);
      }
    } catch (err: any) {
      clearTimeout(timeout);
      setLoading(false);
      //console.log('Kisani API Error:', err);
    }
  };

  //   useEffect(() => {

  // let encry = encryptData("vipul")
  // //console.log("encry.  ",encry);
  // let decry = decryptData(encry)
  // //console.log("decry.  ",decry);
  // (async () => {
  //   const cipher = await encryptData('Hello world');
  //   //console.log("cipher.  ",cipher);

  //   if (cipher)
  //      const cipherD =  await decryptData(cipher);
  //   //console.log("decry.  ",cipherD);

  // })();
  // Encrypt

  // }, []);

  // async function encryptData(plainText: string) {
  //   try {
  //     const cipher = await Aes.encrypt(plainText, AES_KEY, IV, 'aes-256-cbc');
  //     //console.log('Encrypted:', cipher);
  //     return cipher;
  //   } catch (err) {
  //     console.error('Encryption error:', err);
  //   }
  // }

  // async function decryptData(cipherText: string) {
  //   try {
  //     const decrypted = await Aes.decrypt(
  //       cipherText,
  //       AES_KEY,
  //       IV,
  //       'aes-256-cbc',
  //     );
  //     //console.log('Decrypted:', decrypted);
  //     return decrypted;
  //   } catch (err) {
  //     console.error('Decryption error:', err);
  //   }
  // }

  // const API_KEY = Config.ACCUWEATER_API_KEY;

  // const getLocation = async () => {
  //   if (Platform.OS === 'android') {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Location Permission',
  //         message: 'This app needs access to your location.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       Geolocation.getCurrentPosition(
  //         position => {
  //           //console.log(position);
  //           setCity('Your City'); // Placeholder for actual city name
  //           setLoading(false);
  //         },
  //         error => {
  //           //console.log(error.code, error.message);
  //           setLoading(false);
  //         },
  //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
  //       );
  //     }
  //   } else {
  //     Geolocation.requestAuthorization('whenInUse').then(result => {
  //       if (result === 'granted') {
  //         Geolocation.getCurrentPosition(
  //           position => {
  //             //console.log(position);
  //             setCity('Your City'); // Placeholder for actual city name
  //             setLoading(false);
  //           },
  //           error => {
  //             //console.log(error.code, error.message);
  //             setLoading(false);
  //           },
  //           { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
  //         );
  //       }
  //     });
  //   }
  // };

  // useEffect(() => {
  //   getLocation();
  // }, []);

  const images = [Images.land1, Images.land2, Images.land3];

  const openWhatsApp = () => {
    if (!farmerDetails?.kisaniDidi?.phoneNumber) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }

    const cleanedNumber = farmerDetails?.kisaniDidi?.phoneNumber.replace(
      /[^\d]/g,
      '',
    );
    const encodedMessage = encodeURIComponent('');

    // Primary app scheme (works on both Android + iOS)
    const appUrl = `whatsapp://send?phone=${cleanedNumber}&text=${''}`;

    // Fallback web URL
    const webUrl = `https://wa.me/91${cleanedNumber}?text=${''}`;

    Linking.canOpenURL(appUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(appUrl);
        } else {
          return Linking.openURL(webUrl);
        }
      })
      .catch(err => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Error', 'Unable to open WhatsApp');
      });
  };

  const openDialpad = async () => {
    try {
      if (!farmerDetails?.data?.kisaniDidi?.phoneNumber) {
        Alert.alert('Error', 'Phone number not available');
        return;
      }
      const phoneUrl = `tel:${farmerDetails?.kisaniDidi?.phoneNumber}`;
      const supported = await Linking.openURL(phoneUrl);
      if (!supported) {
        Alert.alert('Error', 'Phone call not supported on this device');
        return;
      }

      await Linking.openURL(phoneUrl);
    } catch (error) {
      console.error('Error opening dialpad:', error);
      Alert.alert('Error', 'Unable to open dialpad');
    }
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return t('home.goodMorning');
    } else if (currentHour >= 12 && currentHour < 17) {
      return t('home.goodAfternoon');
    } else {
      return t('home.goodEvening');
    }
  };

  const renderLandCard = ({ item: land }: { item: Land }) => (
    <CommonLandCard
      title={land.title}
      cropCount={land.cropCount}
      acres={land.acres}
      areaUnit={land.areaUnit}
      ownedType={land.owned}
      imageSource={land.imageLand}
      // Only HomeScreen used isGeoTagged in the provided code
      isGeoTagged={land?.others?.isGeoTagged}
      onPress={() => {
        navigation.navigate(screenNames.LandDetails, { landDetailsItem: land });
      }}
    />
  );
  const renderEmptyComponent = () => (
    <View style={styles.emptyListContainer}>
      <Image source={Images.landIcon} style={styles.landIconStyle} />
      <CommonText style={styles.emptyListText}>
        {t('home.noLandsRegisteredTitle')}
      </CommonText>
      <CommonText style={styles.emptyListSubText}>
        {t('home.noLandsRegisteredSubtitle')}
      </CommonText>
    </View>
  );

  const farmerName = farmerDetails?.name || t('home.dearFarmer');
  const kisaniDidiName =
    farmerDetails?.kisaniDidi?.name || t('home.notAssigned');
  const kisaniDidiPhoneNumber = farmerDetails?.phoneNumber;

  const profileCompletionPercentage =
    farmerDetails?.profileCompletionPercentage || 0;

  return (
    <ScreenWrapper
      bgColor={colors.transparent}
      style={styles.screenWrapperContent}
    >
      {/* Header gradient with greeting */}
      <View>
        <GradientBackground
          imageStyle={[
            styles.headerImageStyle,
            profileCompletionPercentage > 0 &&
              profileCompletionPercentage < 100 &&
              styles.headerHeight,
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerContentSub}>
              <View>
                <CommonText style={styles.greeting}>
                  {getGreeting()},{' '}
                  <CommonText style={styles.name}>{farmerName}</CommonText>
                </CommonText>
                <CommonText style={styles.dateText}>
                  {(() => {
                    const d = new Date();
                    const weekday = d.toLocaleDateString('en-US', {
                      weekday: 'long',
                    });
                    const day = d.getDate();
                    const month = d.toLocaleDateString('en-US', {
                      month: 'short',
                    });
                    const year = d.getFullYear();

                    return `${weekday}, ${day} ${month} ${year}`;
                  })()}
                </CommonText>
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.bell}>
                <NotificationBell
                  height={moderateScale(22)}
                  width={moderateScale(22)}
                />
              </TouchableOpacity>
            </View>
            {profileCompletionPercentage > 0 &&
              profileCompletionPercentage < 100 && (
                <ProfileCompletionCard
                  progress={profileCompletionPercentage}
                  onPress={
                    () => {}
                    //console.log('Navigate to Profile Completion screen')
                  }
                />
              )}
            <CommonText style={styles.dateText2}>
              {t('home.todayWeather')}
            </CommonText>
          </View>
        </GradientBackground>
      </View>

      <View style={styles.container}>
        {/* Weather Card */}
        <View style={styles.weatherCard}>
          <Image source={Images.AccuweatherLogo} style={styles.accuweather} />
          {loading ? (
            <ActivityIndicator
              color={colors.ButtonColor}
              style={styles.loader}
            />
          ) : (
            <>
              {/* <View style={styles.weather}>
                <View>
                  <View style={styles.location}>
                    <WeatherLocation />
                    <CommonText style={styles.locationText}>
                      {city || t('home.loadingLocation')}
                    </CommonText>
                  </View>
                  <View>
                    <CommonText
                      style={[
                        styles.tempText,
                        {
                          color: getTemperatureColor(36),
                        },
                      ]}
                    >
                      {weather?.temperature ? `${weather.temperature}°` : '36°'}
                    </CommonText>
                    <CommonText style={styles.conditionText}>
                      {weather?.condition || t('home.noData')}
                    </CommonText>
                  </View>
                </View>

                <Image
                  source={getWeatherIconByName(weather?.condition)}
                  style={styles.weatherImage}
                />
              </View> */}
              <View style={styles.emptyListContainer}>
                <Image
                  source={Images.noWeatherData}
                  style={styles.noWeatherImage}
                />
                <CommonText style={styles.emptyListText}>
                  {t('home.noWeather')}
                </CommonText>
                <CommonText style={styles.emptyListSubText}>
                  {t('home.noWeatherDetail')}
                </CommonText>
              </View>
              {/* <View style={styles.weatherTipContainer}>
                <CommonText style={styles.weatherTip}>
                  {t('home.pesticideTip')}
                </CommonText>
              </View> */}
            </>
          )}
        </View>

        {/* Kisani Didi Card */}
        <View style={styles.kisaniCard}>
          <View style={styles.elipse} />
          <View style={styles.kisaniLeft}>
            <Image source={Images.KisaniAvatar} style={styles.kisaniAvatar} />
            <View style={styles.kisaniLeftContent}>
              <CommonText style={styles.kisaniLabel}>
                {t('home.kisaniDidi')}
              </CommonText>
              <CommonText style={styles.kisaniName}>
                {kisaniDidiName}
              </CommonText>
            </View>
          </View>
          <View style={styles.kisaniActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={openWhatsApp}
              disabled={!kisaniDidiPhoneNumber}
            >
              <Whatsapp />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={openDialpad}
              disabled={!kisaniDidiPhoneNumber}
            >
              <Telephone />
            </TouchableOpacity>
          </View>
        </View>

        {/* Registered Lands Header */}
        <View style={styles.sectionHeader}>
          <CommonText style={styles.sectionTitle}>
            {t('myRegisterLand.myRegisteredLands')}
          </CommonText>
          {landList?.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate(screenNames.MyRegisterLand);
              }}
            >
              <View style={styles.seeAllContainer}>
                <CommonText style={styles.seeAll}>
                  {t('home.seeAll')}
                </CommonText>
                <SeeAllIcon />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Land Cards */}
        <FlatList
          data={landList.slice(0, 2)}
          style={styles.landListStyle}
          renderItem={renderLandCard}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ListEmptyComponent={renderEmptyComponent}
        />

        <View style={styles.bottomGap} />
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;
