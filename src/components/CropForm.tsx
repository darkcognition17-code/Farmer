import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import CommonBottomSelectModal from './CommonBottomSelectModal'; // Adjust import paths
import CommonInput from './CommonInput'; // Adjust import paths
import CommonButton from './CommonButton'; // Adjust import paths
import CommonText from './CommonText'; // Adjust import paths
import CommonDropdown from './CommonDropdown';
import { Images } from '../assets/images';
import { colors } from '../themes/colors';
import { DownIcon } from '../assets/icons';
import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../utils/responsive';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { showToastable } from 'react-native-toastable';
import {
  getCropType,
  getCropTypeVariety,
  getCropTypeVarietySeeds,
  submitAddLandStep3,
} from '../redux/slices/authSlice';
import { fonts } from '../themes/fonts';

// interface CropFormProps {
//   landDetails: any;
//   landIdKey: 'id' | 'landId'; // Solves the .id vs .landId mismatch
//   onSuccess: () => void;
//   saveButtonTitle?: string;
//   alwaysShowSaveButton?: boolean; // True for Step 3, False for AddCrop
// }

// const CropForm: React.FC<CropFormProps> = ({
//   landDetails,
//   landIdKey,
//   onSuccess,
//   saveButtonTitle,
//   alwaysShowSaveButton = false,
// }) => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch<AppDispatch>();
//   const token = useSelector((state: RootState) => state.auth.accessToken);

//   const [crops, setCrops] = useState<any[]>([]);
//   const [activeDropdown, setActiveDropdown] = useState<{
//     index: number | null;
//     field: string | null;
//   }>({ index: null, field: null });

//   const [isModalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Options State
//   const [cropTypeOptions, setCropTypeOptions] = useState([]);
//   const [varietyOptions, setVarietyOptions] = useState([]);
//   const [seedOptions, SetSeedOptions] = useState([]);

//   const unitOptions = [
//     { name: 'Acres', key: 'acre' },
//     { name: 'Hectares', key: 'hectare' },
//   ];

//   // --- Handlers ---

//   const handleAddCrop = () => {
//     setCrops(prev => [
//       ...prev,
//       { area: '', unit: 'Acres', type: '', variety: '', seed: '' },
//     ]);
//   };

//   const handleClearCrop = (index: number) => {
//     const updated = crops.filter((_, i) => i !== index);
//     setCrops(updated);
//   };

//   const openDropdown = (index: number, field: string) => {
//     //console.log('index=======', index);
//     //console.log('field=======', field);

//     setActiveDropdown({ index, field });
//     if (field == 'type') getCroptype();
//     else if (field == 'variety') getCropTypeVarietyData();
//     else if (field == 'seed') getCropTypeVarietySeedsData();
//     else setModalVisible(true);
//   };

//   const handleSelect = (item: any) => {
//     if (activeDropdown.index === null || !activeDropdown.field) return;
//     const updated = [...crops];
//     updated[activeDropdown.index][activeDropdown.field] = item.name;
//     updated[activeDropdown.index][activeDropdown.field + 'ID'] = item.id;
//     setCrops(updated);
//     setModalVisible(false);
//   };

//   const getDropdownOptions = () => {
//     switch (activeDropdown.field) {
//       case 'unit':
//         return unitOptions;
//       case 'type':
//         return cropTypeOptions;
//       case 'variety':
//         return varietyOptions;
//       case 'seed':
//         return seedOptions;
//       default:
//         return [];
//     }
//   };

//   // --- API Calls ---

//   const handleApiError = (err: any, timeout: any) => {
//     clearTimeout(timeout);
//     setLoading(false);
//     //console.log('Kisani API Error:', err);
//   };

//   const getCroptype = async (pageNumber = 1) => {
//     if (loading) return;
//     setLoading(true);
//     const timeout = setTimeout(() => {
//       setLoading(false);
//       showToastable({ message: 'Network timeout', status: 'danger' });
//     }, 15000);

//     try {
//       const response = await dispatch(
//         getCropType({
//           payload: { page: pageNumber, limit: 20 },
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ).unwrap();

//       clearTimeout(timeout);
//       setLoading(false);
//       if (response?.statusCode === 200) {
//         setCropTypeOptions(response?.data || []);
//         setModalVisible(true);
//       }
//     } catch (err) {
//       handleApiError(err, timeout);
//     }
//   };

//   const getCropTypeVarietyData = async (pageNumber = 1) => {
//     if (loading) return;
//     setLoading(true);
//     const timeout = setTimeout(() => {
//       setLoading(false);
//     }, 15000);

//     try {
//       const response = await dispatch(
//         getCropTypeVariety({
//           payload: {
//             page: pageNumber,
//             limit: 20,
//             cropTypeId: crops[crops.length - 1]?.typeID,
//           },
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ).unwrap();

//       clearTimeout(timeout);
//       setLoading(false);
//       if (response?.statusCode === 200) {
//         setVarietyOptions(response?.data || []);
//         setModalVisible(true);
//       }
//     } catch (err) {
//       handleApiError(err, timeout);
//     }
//   };

//   const getCropTypeVarietySeedsData = async (pageNumber = 1) => {
//     if (loading) return;
//     setLoading(true);
//     const timeout = setTimeout(() => {
//       setLoading(false);
//     }, 15000);

//     try {
//       const response = await dispatch(
//         getCropTypeVarietySeeds({
//           payload: {
//             page: pageNumber,
//             limit: 20,
//             cropTypeId: crops[crops.length - 1]?.typeID,
//             cropVarietyId: crops[crops.length - 1]?.varietyID,
//           },
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ).unwrap();

//       clearTimeout(timeout);
//       setLoading(false);
//       if (response?.statusCode === 200) {
//         SetSeedOptions(response?.data || []);
//         setModalVisible(true);
//       }
//     } catch (err) {
//       handleApiError(err, timeout);
//     }
//   };

//   const submitData = async () => {
//     if (crops.length === 0 && alwaysShowSaveButton) {
//       // Allow skipping if it's the Step 3 flow and no crops added
//       onSuccess();
//       return;
//     }

//     if (loading) return;
//     setLoading(true);
//     const timeout = setTimeout(() => {
//       setLoading(false);
//       showToastable({ message: 'Network timeout', status: 'danger' });
//     }, 15000);

//     const mappedCrops = crops
//       .filter(
//         item =>
//           item.area &&
//           item.typeID &&
//           item.varietyID &&
//           item.seedID &&
//           item.unit,
//       )
//       .map(item => ({
//         totalLandUnderCultivation: parseFloat(item.area),
//         unit: item.unit === 'Acres' ? 'acre' : 'hectare',
//         cropTypeId: item.typeID,
//         cropVarietyId: item.varietyID,
//         seedVarietyId: item.seedID,
//       }));

//     try {
//       const response = await dispatch(
//         submitAddLandStep3({
//           payload: {
//             cropData: mappedCrops,
//             landId: landDetails?.[landIdKey], // Dynamic ID access
//           },
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ).unwrap();

//       clearTimeout(timeout);
//       setLoading(false);

//       if (response?.statusCode === 200 || response?.statusCode === 201) {
//         onSuccess();
//       }
//     } catch (err) {
//       handleApiError(err, timeout);
//     }
//   };

//   // --- Render Helpers ---

//   const isAddAnotherDisabled = () => {
//     if (crops.length === 0) return false;
//     const lastCrop = crops[crops.length - 1];
//     return (
//       !lastCrop.area || !lastCrop.type || !lastCrop.variety || !lastCrop.seed
//     );
//   };

//   return (
//     <View style={styles.formContainer}>
//       {crops.length === 0 ? (
//         <View style={styles.emptyCard}>
//           <Image
//             source={Images.CropIcon}
//             style={styles.cropIcon}
//             resizeMode="contain"
//           />
//           <CommonText style={styles.emptyTitle}>
//             {t('addCrop.wantToAddCrop')}
//           </CommonText>
//           <TouchableOpacity
//             style={styles.addCropButton}
//             onPress={handleAddCrop}
//           >
//             <CommonText style={styles.addCropText}>
//               {t('addCrop.addCropButton')}
//             </CommonText>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           <View style={styles.farmInfoContainer}>
//             <CommonText style={styles.farmName}>
//               {landDetails?.landName}
//             </CommonText>
//             <CommonText style={styles.acresText}>
//               <CommonText style={styles.acresTextValue}>
//                 {`${landDetails?.area} ${landDetails?.areaUnit === 'acre' ? 'Acres' : 'Hectare'} `}
//               </CommonText>
//               {landDetails?.landType ?? ''}
//             </CommonText>
//           </View>

//           <View style={styles.formContent}>
//             <CommonText style={styles.sectionTitle}>
//               {t('addCrop.cropDetails')}
//             </CommonText>

//             {crops.map((crop, index) => (
//               <View key={index} style={styles.cropCard}>
//                 <View style={styles.cropHeader}>
//                   <CommonText style={styles.cropTitle}>
//                     {t('addCrop.crop')} {index + 1}
//                   </CommonText>
//                   <TouchableOpacity onPress={() => handleClearCrop(index)}>
//                     <CommonText style={styles.clearText}>
//                       {t('addCrop.clear')}
//                     </CommonText>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Area Input */}
//                 <CommonText style={styles.inputLabel}>
//                   {t('addCrop.totalArea')}{' '}
//                   <CommonText style={styles.requiredAsterisk}>*</CommonText>
//                 </CommonText>
//                 <View style={styles.cropInputContainer}>
//                   <CommonInput
//                     placeholder={t('addCrop.enterArea')}
//                     style={styles.areaInput}
//                     value={crop.area}
//                     onChangeText={text => {
//                       const updated = [...crops];
//                       updated[index].area = text;
//                       setCrops(updated);
//                     }}
//                     containerStyle={styles.areaInputContainer}
//                     keyboardType="numeric"
//                   />
//                   <TouchableOpacity
//                     activeOpacity={0.8}
//                     style={styles.dropdownContainer}
//                     onPress={() => openDropdown(index, 'unit')}
//                   >
//                     <CommonText style={styles.dropdownText}>
//                       {crop.unit || t('home.acres')}
//                     </CommonText>
//                     <DownIcon
//                       height={moderateScale(16)}
//                       width={moderateScale(16)}
//                     />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Dropdowns */}
//                 <CommonText style={styles.inputLabel}>
//                   {t('addCrop.cropType')}{' '}
//                   <CommonText style={styles.requiredAsterisk}>*</CommonText>
//                 </CommonText>
//                 <CommonDropdown
//                   RightIcon={DownIcon}
//                   label={crop.type || t('addCrop.selectCropZone')}
//                   onPress={() => openDropdown(index, 'type')}
//                 />

//                 <CommonText style={styles.inputLabel}>
//                   {t('addCrop.cropVariety')}{' '}
//                   <CommonText style={styles.requiredAsterisk}>*</CommonText>
//                 </CommonText>
//                 <CommonDropdown
//                   RightIcon={DownIcon}
//                   label={crop.variety || t('addCrop.selectCropVariety')}
//                   onPress={() => openDropdown(index, 'variety')}
//                 />

//                 <CommonText style={styles.inputLabel}>
//                   {t('addCrop.seedVariety')}{' '}
//                   <CommonText style={styles.requiredAsterisk}>*</CommonText>
//                 </CommonText>
//                 <CommonDropdown
//                   RightIcon={DownIcon}
//                   label={crop.seed || t('addCrop.selectSeedVariety')}
//                   onPress={() => openDropdown(index, 'seed')}
//                 />
//               </View>
//             ))}

//             <TouchableOpacity
//               style={[
//                 styles.addAnotherButton,
//                 isAddAnotherDisabled() && styles.disabledButton,
//               ]}
//               onPress={handleAddCrop}
//               disabled={isAddAnotherDisabled()}
//             >
//               <CommonText style={styles.addAnotherText}>
//                 {t('addCrop.addAnotherCrop')}
//               </CommonText>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}

//       {/* Save Button */}
//       {(crops.length > 0 || alwaysShowSaveButton) && (
//         <View style={styles.saveButtonWrapper}>
//           <CommonButton
//             title={
//               saveButtonTitle ||
//               (crops.length > 0
//                 ? t('addCrop.saveFarmAndCropDetails')
//                 : t('profileScreen.saveButton'))
//             }
//             onPress={submitData}
//             style={styles.saveButton}
//           />
//         </View>
//       )}

//       <CommonBottomSelectModal
//         isVisible={isModalVisible}
//         onClose={() => setModalVisible(false)}
//         onSelect={handleSelect}
//         title={t('addCrop.selectOption')}
//         data={getDropdownOptions()}
//         mode="document"
//       />
//     </View>
//   );
// };

// export default CropForm;

interface CropFormProps {
  landDetails: any;
  landIdKey?: 'id' | 'landId'; // Made optional for Edit mode
  onSuccess: () => void;
  saveButtonTitle?: string;
  alwaysShowSaveButton?: boolean;

  // New Props for Edit Mode
  initialCrops?: any[];
  onSubmitOverride?: (crops: any[]) => Promise<void>;
  onDeleteOverride?: (index: number) => void;
  hideAddButton?: boolean;
}

const CropForm: React.FC<CropFormProps> = ({
  landDetails,
  landIdKey,
  onSuccess,
  saveButtonTitle,
  alwaysShowSaveButton = false,
  initialCrops = [],
  onSubmitOverride,
  onDeleteOverride,
  hideAddButton = false,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // Initialize with initialCrops if provided
  const [crops, setCrops] = useState<any[]>(initialCrops);

  const [activeDropdown, setActiveDropdown] = useState<{
    index: number | null;
    field: string | null;
  }>({ index: null, field: null });

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cropTypeOptions, setCropTypeOptions] = useState([]);
  const [varietyOptions, setVarietyOptions] = useState([]);
  const [seedOptions, SetSeedOptions] = useState([]);

  const unitOptions = [
    { name: 'Acres', key: 'acre' },
    { name: 'Hectares', key: 'hectare' },
  ];

  // Sync state if initialCrops changes (e.g. async load)
  useEffect(() => {
    if (initialCrops.length > 0) {
      setCrops(initialCrops);
    }
  }, [initialCrops]);

  // --- Handlers ---

  const handleAddCrop = () => {
    setCrops(prev => [
      ...prev,
      { area: '', unit: 'Acres', type: '', variety: '', seed: '' },
    ]);
  };

  const handleClearCrop = (index: number) => {
    if (onDeleteOverride) {
      // If in Edit mode, delegate to parent (API Call)
      onDeleteOverride(index);
    } else {
      // Default behavior: remove from state
      const updated = crops.filter((_, i) => i !== index);
      setCrops(updated);
    }
  };

  const openDropdown = (index: number, field: string) => {
    setActiveDropdown({ index, field });
    if (field === 'type') getCroptype();
    else if (field === 'variety') getCropTypeVarietyData();
    else if (field === 'seed') getCropTypeVarietySeedsData();
    else setModalVisible(true);
  };

  const handleSelect = (item: any) => {
    if (activeDropdown.index === null || !activeDropdown.field) return;

    const updated = [...crops];
    const field = activeDropdown.field;

    updated[activeDropdown.index][field] = item.name;
    updated[activeDropdown.index][field + 'ID'] = item.id;

    // Reset dependents
    if (field === 'type') {
      updated[activeDropdown.index].variety = '';
      updated[activeDropdown.index].varietyID = '';
      updated[activeDropdown.index].seed = '';
      updated[activeDropdown.index].seedID = '';
    } else if (field === 'variety') {
      updated[activeDropdown.index].seed = '';
      updated[activeDropdown.index].seedID = '';
    }

    setCrops(updated);
    setModalVisible(false);
  };

  const getDropdownOptions = () => {
    switch (activeDropdown.field) {
      case 'unit':
        return unitOptions;
      case 'type':
        return cropTypeOptions;
      case 'variety':
        return varietyOptions;
      case 'seed':
        return seedOptions;
      default:
        return [];
    }
  };

  // --- API Calls ---

  const handleApiError = (err: any, timeout: any) => {
    clearTimeout(timeout);
    setLoading(false);
    //console.log('Kisani API Error:', err);
  };

  const getCroptype = async (pageNumber = 1) => {
    if (loading) return;
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
      showToastable({ message: 'Network timeout', status: 'danger' });
    }, 15000);

    try {
      const response = await dispatch(
        getCropType({
          payload: { page: pageNumber, limit: 20 },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);
      if (response?.statusCode === 200) {
        setCropTypeOptions(response?.data || []);
        setModalVisible(true);
      }
    } catch (err) {
      handleApiError(err, timeout);
    }
  };

  const getCropTypeVarietyData = async (pageNumber = 1) => {
    if (loading) return;
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 15000);

    try {
      const response = await dispatch(
        getCropTypeVariety({
          payload: {
            page: pageNumber,
            limit: 20,
            cropTypeId: crops[crops.length - 1]?.typeID,
          },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);
      if (response?.statusCode === 200) {
        setVarietyOptions(response?.data || []);
        setModalVisible(true);
      }
    } catch (err) {
      handleApiError(err, timeout);
    }
  };

  const getCropTypeVarietySeedsData = async (pageNumber = 1) => {
    if (loading) return;
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 15000);

    try {
      const response = await dispatch(
        getCropTypeVarietySeeds({
          payload: {
            page: pageNumber,
            limit: 20,
            cropTypeId: crops[crops.length - 1]?.typeID,
            cropVarietyId: crops[crops.length - 1]?.varietyID,
          },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);
      if (response?.statusCode === 200) {
        SetSeedOptions(response?.data || []);
        setModalVisible(true);
      }
    } catch (err) {
      handleApiError(err, timeout);
    }
  };

  const handleSubmit = async () => {
    if (onSubmitOverride) {
      // Use custom submit logic (For Edit)
      await onSubmitOverride(crops);
      return;
    }

    // Default "Add" Logic
    if (crops.length === 0 && alwaysShowSaveButton) {
      onSuccess();
      return;
    }

    if (loading) return;
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
      showToastable({ message: 'Network timeout', status: 'danger' });
    }, 15000);

    const mappedCrops = crops
      .filter(
        item =>
          item.area &&
          item.typeID &&
          item.varietyID &&
          item.seedID &&
          item.unit,
      )
      .map(item => ({
        totalLandUnderCultivation: parseFloat(item.area),
        unit: item.unit === 'Acres' ? 'acre' : 'hectare',
        cropTypeId: item.typeID,
        cropVarietyId: item.varietyID,
        seedVarietyId: item.seedID,
      }));

    try {
      const response = await dispatch(
        submitAddLandStep3({
          payload: {
            cropData: mappedCrops,
            landId: landDetails?.[landIdKey || 'landId'],
          },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ).unwrap();

      clearTimeout(timeout);
      setLoading(false);

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        onSuccess();
      }
    } catch (err) {
      handleApiError(err, timeout);
    }
  };

  const isAddAnotherDisabled = () => {
    if (crops.length === 0) return false;
    const lastCrop = crops[crops.length - 1];
    return (
      !lastCrop.area || !lastCrop.type || !lastCrop.variety || !lastCrop.seed
    );
  };

  return (
    <View style={styles.formContainer}>
      {crops.length === 0 ? (
        <View style={styles.emptyCard}>
          <Image
            source={Images.CropIcon}
            style={styles.cropIcon}
            resizeMode="contain"
          />
          <CommonText style={styles.emptyTitle}>
            {t('addCrop.wantToAddCrop')}
          </CommonText>
          <TouchableOpacity
            style={styles.addCropButton}
            onPress={handleAddCrop}
          >
            <CommonText style={styles.addCropText}>
              {t('addCrop.addCropButton')}
            </CommonText>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.farmInfoContainer}>
            <CommonText style={styles.farmName}>
              {landDetails?.landName}
            </CommonText>
            <CommonText style={styles.acresText}>
              <CommonText style={styles.acresTextValue}>
                {`${landDetails?.area} ${landDetails?.areaUnit === 'acre' ? 'Acres' : 'Hectare'} `}
              </CommonText>
              {landDetails?.landType ?? ''}
            </CommonText>
          </View>

          <View style={styles.formContent}>
            <CommonText style={styles.sectionTitle}>
              {t('addCrop.cropDetails')}
            </CommonText>

            {crops.map((crop, index) => (
              <View key={index} style={styles.cropCard}>
                <View style={styles.cropHeader}>
                  <CommonText style={styles.cropTitle}>
                    {t('addCrop.crop')} {index + 1}
                  </CommonText>
                  <TouchableOpacity onPress={() => handleClearCrop(index)}>
                    <CommonText style={styles.clearText}>
                      {t('addCrop.clear')}
                    </CommonText>
                  </TouchableOpacity>
                </View>

                {/* Form Inputs (Area, Type, Variety, Seed) */}
                <CommonText style={styles.inputLabel}>
                  {t('addCrop.totalArea')}{' '}
                  <CommonText style={styles.requiredAsterisk}>*</CommonText>
                </CommonText>
                <View style={styles.cropInputContainer}>
                  <CommonInput
                    placeholder={t('addCrop.enterArea')}
                    style={styles.areaInput}
                    value={crop.area}
                    onChangeText={text => {
                      const updated = [...crops];
                      updated[index].area = text;
                      setCrops(updated);
                    }}
                    containerStyle={styles.areaInputContainer}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.dropdownContainer}
                    onPress={() => openDropdown(index, 'unit')}
                  >
                    <CommonText style={styles.dropdownText}>
                      {crop.unit || t('home.acres')}
                    </CommonText>
                    <DownIcon
                      height={moderateScale(16)}
                      width={moderateScale(16)}
                    />
                  </TouchableOpacity>
                </View>

                <CommonText style={styles.inputLabel}>
                  {t('addCrop.cropType')}{' '}
                  <CommonText style={styles.requiredAsterisk}>*</CommonText>
                </CommonText>
                <CommonDropdown
                  RightIcon={DownIcon}
                  label={crop.type || t('addCrop.selectCropZone')}
                  onPress={() => openDropdown(index, 'type')}
                />

                <CommonText style={styles.inputLabel}>
                  {t('addCrop.cropVariety')}{' '}
                  <CommonText style={styles.requiredAsterisk}>*</CommonText>
                </CommonText>
                <CommonDropdown
                  RightIcon={DownIcon}
                  label={crop.variety || t('addCrop.selectCropVariety')}
                  onPress={() => openDropdown(index, 'variety')}
                />

                <CommonText style={styles.inputLabel}>
                  {t('addCrop.seedVariety')}{' '}
                  <CommonText style={styles.requiredAsterisk}>*</CommonText>
                </CommonText>
                <CommonDropdown
                  RightIcon={DownIcon}
                  label={crop.seed || t('addCrop.selectSeedVariety')}
                  onPress={() => openDropdown(index, 'seed')}
                />
              </View>
            ))}

            {!hideAddButton && (
              <TouchableOpacity
                style={[
                  styles.addAnotherButton,
                  isAddAnotherDisabled() && styles.disabledButton,
                ]}
                onPress={handleAddCrop}
                disabled={isAddAnotherDisabled()}
              >
                <CommonText style={styles.addAnotherText}>
                  {t('addCrop.addAnotherCrop')}
                </CommonText>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {(crops.length > 0 || alwaysShowSaveButton) && (
        <View style={styles.saveButtonWrapper}>
          <CommonButton
            title={
              saveButtonTitle ||
              (crops.length > 0
                ? t('addCrop.saveFarmAndCropDetails')
                : t('profileScreen.saveButton'))
            }
            onPress={handleSubmit}
            style={styles.saveButton}
          />
        </View>
      )}

      <CommonBottomSelectModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelect}
        title={t('addCrop.selectOption')}
        data={getDropdownOptions()}
        mode="document"
      />
    </View>
  );
};

export default CropForm;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(40),
    marginTop: moderateScale(100),
    maxHeight: Dimensions.get('window').height / 2,

    // flex: 1,
    margin: moderateScale(16),
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cropIcon: {
    width: moderateScale(64),
    height: moderateScale(64),
    marginBottom: moderateScale(10),
  },
  emptyTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.black,
    marginBottom: moderateScale(12),
  },
  addCropButton: {
    borderWidth: 1,
    borderColor: colors.ButtonColor,
    backgroundColor: colors.ButtonColor + '10',
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(24),
  },
  addCropText: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  farmInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },

  farmName: {
    fontSize: moderateScale(16),
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.Neutrals100,
  },
  acresText: {
    fontSize: moderateScale(12),
    color: colors.OwnedLabelText,
    fontWeight: '400',
    fontFamily: fonts.regular,
  },
  acresTextValue: {
    color: colors.Neutrals100,
    fontWeight: '700',
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  formContent: {
    backgroundColor: colors.white,
    padding: moderateScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: colors.Neutrals010,
    fontFamily: fonts.semiBold,
    marginBottom: moderateScale(20),
    marginTop: moderateScale(12),
  },
  cropCard: {
    backgroundColor: colors.CardContainer,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(5),
  },
  cropTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    fontFamily: fonts.semiBold,
    color: colors.Neutrals300,
  },
  clearText: {
    color: colors.ButtonColor,
    fontWeight: '500',
    fontSize: moderateScale(16),
    fontFamily: fonts.medium,
    textDecorationLine: 'underline',
  },
  inputLabel: {
    marginTop: moderateScale(16),
    marginBottom: moderateScale(6),
    fontSize: moderateScale(14),
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.Neutrals100,
  },
  requiredAsterisk: {
    color: colors.error,
    fontSize: 16,
  },
  cropInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaInputContainer: {
    flex: 1,
    marginRight: moderateScale(8),
    marginBottom: 0,
  },
  areaInput: {
    paddingVertical: verticalScale(17),
    marginBottom: 0,
    borderColor: colors.Neutrals700,
    borderWidth: 1,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.Neutrals700,
    paddingHorizontal: 15,
    paddingVertical: 17,
    backgroundColor: colors.white,
    gap: 10,
  },
  dropdownText: {
    fontSize: scaledFontSize(14),
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.Neutrals500,
  },
  addAnotherButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.ButtonColor,
    backgroundColor: colors.ButtonColor + '10',
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(24),
    marginTop: moderateScale(10),
  },
  addAnotherText: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonWrapper: {
    padding: moderateScale(16),
    borderTopWidth: 0.5,
    borderColor: colors.LightGray,
    backgroundColor: colors.white,
  },
  saveButton: {
    backgroundColor: colors.ButtonColor,
    paddingVertical: verticalScale(17),
  },
});
