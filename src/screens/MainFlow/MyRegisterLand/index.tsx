import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
  Linking,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { CommonText, ScreenWrapper } from '../../../components';
import { colors } from '../../../themes/colors';
import {
  moderateScale,
  scale,
  scaledFontSize,
  verticalScale,
} from '../../../utils/responsive';
import { Images } from '../../../assets/images';
import {
  BackArrow,
  BackButton,
  CropLeaf,
  NoCropLeaf,
  NotificationBell,
  PlusIcon,
  Telephone,
  WeatherLocation,
  Whatsapp,
} from '../../../assets/icons';
import { fonts } from '../../../themes/fonts';
import { styles } from './style';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { fetchLandList } from '../../../redux/slices/authSlice';
import { screenNames } from '../../../navigation/screenNames';
import { MainStackParamList } from '../../../navigation/mainNavigator';
import { AppStackParamList } from '../../../navigation/appNavigator';

interface Land {
  id: string;
  title: string;
  cropCount: number;
  acres: number;
  image: any;
  owned: string;
}

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'MyRegisterLand'
>;

const MyRegisterLand = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { accessToken, landList } = useSelector(
    (state: RootState) => state.auth,
  );

  const [lands, setLands] = useState<Land[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const images = [Images.land1, Images.land2, Images.land3];
  const itemsPerPage = 10;

  useEffect(() => {
    if (accessToken) {
      loadLands(true);
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (landList?.data?.lands) {
      const newLands = landList.data.lands.map(land => ({
        id: land.landId,
        title: land.landName,
        cropCount: land.totalCrops,
        acres: land.area,
        image: '', // You might need to map an actual image if available in the API response
        owned: land.landType,
        imageLand: images[Math.floor(Math.random() * images.length)],
      }));
      setLands(prevLands =>
        page === 1 ? newLands : [...prevLands, ...newLands],
      );
      setHasMore(landList.data.pagination.totalPages > page);
      setLoading(false);
    }
  }, [landList]);

  const loadLands = (isInitialLoad = false) => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newPage = isInitialLoad ? 1 : page + 1;
    setPage(newPage);
    dispatch(
      fetchLandList({
        payload: { page: newPage, limit: itemsPerPage },
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    // setLoading(false);
  };

  const handleLoadMore = () => {
    loadLands();
  };

  const ImagePlaceholder =
    'https://www.shutterstock.com/image-vector/wheat-icons-vector-logo-silhouette-600nw-2190758145.jpg';

  const renderLandCard = ({ item: land }: { item: Land }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(screenNames.LandDetails, { landDetailsItem: land });
      }}
    >
      <View key={land.id} style={styles.landCard}>
        <Image source={land.imageLand} style={styles.landThumb} />

        <View style={styles.landContent}>
          <CommonText style={styles.landTitle}>{land.title}</CommonText>
          <View style={styles.cropRow}>
            {land.cropCount > 0 ? (
              <>
                <View style={styles.leaf}>
                  <CropLeaf />
                </View>
                <CommonText style={styles.cropCount}>
                  {land.cropCount} {t('home.cropsAdded')}
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
        <View style={styles.landFooter}>
          <CommonText style={styles.ownedLabel}>
            {t(`home.${land.owned.toLowerCase()}`)}
          </CommonText>
          <CommonText style={styles.acres}>
            {land.acres} {t('home.acres')}
          </CommonText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <ScreenWrapper bgColor={colors.transparent}>
        <ImageBackground
          source={Images.GrBg}
          imageStyle={styles.headerImageStyle}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerContentSub}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
                style={styles.bell}
              >
                <BackButton
                  width={moderateScale(10)}
                  height={moderateScale(15)}
                />
              </TouchableOpacity>
              <CommonText style={styles.name}>
                {t('myRegisterLand.myRegisteredLands')}
              </CommonText>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.container}>
          <FlatList
            data={lands}
            style={styles.landListStyle}
            renderItem={renderLandCard}
            keyExtractor={item => item.id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            // ListFooterComponent={renderFooter}
            scrollEnabled={false}
          />
        </View>
      </ScreenWrapper>
      <TouchableOpacity
        activeOpacity={0.8}
        // onPress={() => navigation.navigate(screenNames.AddNewLandStep1)}
        onPress={() => navigation.navigate(screenNames.AddNewLandStep1)}
        style={styles.addCrop}
      >
        <PlusIcon />
      </TouchableOpacity>
    </>
  );
};

export default MyRegisterLand;
