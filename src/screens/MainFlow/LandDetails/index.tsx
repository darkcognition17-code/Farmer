import {
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  AddressGray,
  DistrictGray,
  MandalGray,
  PincodeGray,
  VillageGray,
} from '../../../assets/icons';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { screenNames } from '../../../navigation/screenNames';
import { useDispatch, useSelector } from 'react-redux';
import {
  logout,
  fetchFarmerDetails,
  getLandDetails,
  getFarmerLandCrop,
} from '../../../redux/slices/authSlice';
import { AppStackParamList } from '../../../navigation/appNavigator';
import {
  CommonText,
  GradientBackground,
  ProfileInfoCard,
} from '../../../components';

import { styles } from './style';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../redux/store';
import { IMAGE_BASE_URL } from '../../../utils/helperFunction';
import { moderateScale } from '../../../utils/responsive';
import { Images } from '../../../assets/images';
import { fetchMachinery } from '../../../redux/slices/machinarySlice';
import CropCard, { CropItem } from '../../../components/CropCard';
import { showToastable } from 'react-native-toastable';
import { useEffect, useState } from 'react';
import CommonLandCard from '../../../components/CommonLandCard';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'LandDetails'
>;

const LandDetails = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { params } = useRoute<NavigationProp>();
  const { mobile, from, tempToken } = params;
  const { landDetailsItem } = params;
  const [arrayLandCrops, setArrayLandCrop] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { farmerDetails, accessToken, landDetails } = useSelector(
    (state: RootState) => state.auth,
  );
  //console.log(farmerDetails);
  const isFocused = useIsFocused();
  //console.log('come-------------------------------');

  useEffect(() => {
    fetchLandDetails();
    getLandList();
  }, [isFocused]);

  useEffect(() => {
    //console.log('landDetails---------->', landDetails);
  }, [landDetails]);

  const fetchLandDetails = async () => {
    dispatch(
      getLandDetails({
        payload: { id: landDetailsItem.id },
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
  };

  const getLandList = async () => {
    // setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      showToastable({ message: 'Network timeout', status: 'danger' });
    }, 15000);

    try {
      const response = await dispatch(
        getFarmerLandCrop({
          payload: { page: 1, limit: 100, landId: landDetailsItem.id },
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);
      //console.log('response--------->>>??  ', response);

      if (response?.statusCode === 200) {
        //  const newData = response?.data || []; // adjust key based on your API response
        setArrayLandCrop(response?.data.crops);
      }
    } catch (err: any) {
      clearTimeout(timeout);
      setLoading(false);
      //console.log('Kisani API Error:', err);
    }
  };

  useEffect(() => {
    //console.log('landDetails', landDetails);
  }, [landDetails]);

  const handleCropEdit = (item: any, index: number) => {
    navigation.navigate(screenNames.EditCrop, {
      cropDetails: item,
      landDetails,
    });
  };

  const handleLandEdit = () => {
    navigation.navigate(screenNames.EditLand, {
      landDetails,
    });
  };

  const renderCrops = ({ item, index }) => (
    <CropCard item={item} index={index} onEdit={handleCropEdit} />
  );

  console.log(landDetails);

  return (
    <ScrollView style={styles.container}>
      <GradientBackground
        imageStyle={styles.progressHeader}
        style={styles.headerContainer}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        // backButtonStyles={styles.bell}
      >
        {/* <View style={styles.headerContainer}> */}
        <CommonText style={styles.headerTitle}>{'Land Details'}</CommonText>
        {/* </View> */}
      </GradientBackground>
      <CommonLandCard
        isDetailScreen={true}
        title={landDetails?.landName}
        cropCount={landDetails?.cropsCount}
        acres={landDetails?.area}
        areaUnit={t(
          landDetails?.areaUnit == 'hectare' ? 'home.hectare' : 'home.acres',
        )}
        ownedType={landDetails?.landType}
        imageSource={landDetailsItem?.imageLand}
        onEdit={handleLandEdit}
      />
      <ProfileInfoCard
        title="Address Details"
        onEdit={() => {
          navigation.navigate(screenNames.EditAddressDetails, {
            farmerData: landDetails,
            isFromLandEdit: true,
          });
        }}
      >
        {/* Assuming address details are nested or available directly */}
        <View style={styles.iconAndTitleRow}>
          <AddressGray height={moderateScale(16)} width={moderateScale(16)} />
          <CommonText style={styles.titleText}>Complete Address</CommonText>
        </View>
        <CommonText style={styles.valueText}>
          {landDetails?.completeAddress ?? 'N/A'}
        </CommonText>
        <View style={styles.twoColumnWrapper}>
          <View style={styles.halfWidthColumn}>
            <View style={styles.iconAndTitleRow}>
              <DistrictGray
                height={moderateScale(16)}
                width={moderateScale(16)}
              />
              <CommonText style={styles.titleText}>State</CommonText>
            </View>
            <CommonText numberOfLines={1} style={styles.valueText}>
              {landDetails?.state ?? 'N/A'}
            </CommonText>
          </View>
          <View style={styles.halfWidthColumn}>
            <View style={styles.iconAndTitleRow}>
              <DistrictGray
                height={moderateScale(16)}
                width={moderateScale(16)}
              />
              <CommonText style={styles.titleText}>District</CommonText>
            </View>
            <CommonText style={styles.valueText}>
              {landDetails?.district ?? 'N/A'}
            </CommonText>
          </View>
          <View style={styles.halfWidthColumn}>
            <View style={styles.iconAndTitleRow}>
              <PincodeGray
                height={moderateScale(16)}
                width={moderateScale(16)}
              />
              <CommonText style={styles.titleText}>Pincode</CommonText>
            </View>
            <CommonText style={styles.valueText}>
              {landDetails?.pincode || 'N/A'}
            </CommonText>
          </View>
          <View style={styles.halfWidthColumn}>
            <View style={styles.iconAndTitleRow}>
              <MandalGray
                height={moderateScale(16)}
                width={moderateScale(16)}
              />
              <CommonText
                numberOfLines={1}
                style={styles.titleText}
              >{`Mandal`}</CommonText>

              {/* <CommonText numberOfLines={1} style={styles.titleText}>{`Mandal ${landDetails?.mandalId ? "" : "(Other)"}`}</CommonText> */}
            </View>
            <CommonText style={styles.valueText}>
              {landDetails?.mandal || landDetails?.otherMandalName || 'N/A'}
            </CommonText>
          </View>
          <View style={styles.halfWidthColumn}>
            <View style={styles.iconAndTitleRow}>
              <VillageGray
                height={moderateScale(16)}
                width={moderateScale(16)}
              />
              <CommonText
                numberOfLines={1}
                style={styles.titleText}
              >{`Village`}</CommonText>

              {/* <CommonText numberOfLines={1} style={styles.titleText}>{`Mandal ${landDetails?.mandalId ? "" : "(Other)"}`}</CommonText> */}
            </View>
            <CommonText style={styles.valueText}>
              {landDetails?.village || landDetails?.otherVillageName || 'N/A'}
            </CommonText>
          </View>
        </View>
      </ProfileInfoCard>
      <>
        <ProfileInfoCard
          title="Crop Details"
          onEdit={() => {
            navigation.navigate(screenNames.AddCrop, { landDetails });
          }}
          isAddCrop={true}
        >
          {arrayLandCrops.length > 0 && (
            <FlatList
              data={arrayLandCrops}
              renderItem={renderCrops}
              keyExtractor={(_, index) => index.toString()}
            />
          )}
        </ProfileInfoCard>
      </>
      <View style={styles.bottomGap} />
    </ScrollView>
  );
};
export default LandDetails;
function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}
