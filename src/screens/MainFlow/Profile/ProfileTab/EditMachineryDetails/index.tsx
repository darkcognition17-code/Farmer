// import {
//   Minus,
//   MinusWithRed,
//   Plus,
//   PlusWithGreen,
// } from '../../../../../assets/icons';
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ImageBackground,
// } from 'react-native';
// import {
//   CommonText,
//   CommonInput,
//   CommonButton,
//   ScreenWrapper,
//   CommonBottomSelectModal,
// } from '../../../../../components';
// import { colors } from '../../../../../themes/colors';
// import {
//   moderateScale,
//   scaledFontSize,
//   verticalScale,
// } from '../../../../../utils/responsive';
// import DatePicker from 'react-native-date-picker';
// import {
//   BackButton,
//   Calender,
//   CalenderBlack,
//   Cart,
//   Clutch,
//   DownIcon,
//   Driver,
//   HPIcon,
//   Machinery,
//   PowerSteering,
//   TickFilled,
// } from '../../../../../assets/icons';
// import CommonDropdown from '../../../../../components/CommonDropdown';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { AppStackParamList } from '../../../../../navigation/appNavigator';
// import { useNavigation } from '@react-navigation/native';
// import { Images } from '../../../../../assets/images';
// import { fonts } from '../../../../../themes/fonts';
// import apiClient from '../../../../../services/apiClient';
// import authService from '../../../../../services/authService'; // Import authService
// import { showToastable } from 'react-native-toastable';
// import { screenNames } from '../../../../../navigation/screenNames';
// import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector
// import { updateMachinery } from '../../../../../redux/slices/machinarySlice'; // Import updateMachinery thunk
// import { useTranslation } from 'react-i18next'; // Import useTranslation
// import { MOBILE_REGEX } from '../../../../../utils/regex';
// import { styles } from './style';

// // Types where UI should repeat for each quantity
// const repeatableTypes = [
//   'tractor',
//   'trolleys',
//   'balers',
//   'tube well pumps',
//   'others',
// ];

// const nonRepeatableTypes = ['slasher', 'raker', 'harvester'];

// type NavigationProp = NativeStackNavigationProp<
//   AppStackParamList,
//   'AddMachineryDetails'
// >;

// const EditMachineryDetails = ({ route }: any) => {
//   const { t } = useTranslation(); // Initialize useTranslation
//   const navigation = useNavigation<NavigationProp>();
//   const dispatch = useDispatch(); // Get dispatch function
//   const { loading } = useSelector((state: any) => state.machineryStock); // Get loading state from machinery slice
//   const accessToken = useSelector((state: RootState) => state.auth.accessToken);

//   const [selectedDates, setSelectedDates] = useState<any>({});
//   const [showDatePicker, setShowDatePicker] = useState<{
//     key?: string;
//     visible: boolean;
//   }>({
//     visible: false,
//   });
//   const [selectedTrolleyType, setSelectedTrolleyType] = useState<any>({});
//   const [machineryData, setMachineryData] = useState<any[]>([]);
//   const [initialMachineryData, setInitialMachineryData] = useState<any>(null); // New state for initial data
//   // const [loading, setLoading] = useState(false); // Remove local loading state
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalData, setModalData] = useState<any[]>([]);
//   const [modalTitle, setModalTitle] = useState('');
//   const [onModalSelect, setOnModalSelect] = useState<(item: any) => void>(
//     () => () => {},
//   );

//   useEffect(() => {
//     if (route?.params?.item) {
//       const item = route.params.item;
//       // The component expects an array, so we wrap the single item in an array.
//       // We also add an 'instanceNumber' as the rendering logic expects it.
//       const initialMachineryItem = { ...item, instanceNumber: 1 };

//       // Pre-fill tractor details if available
//       if (item.name.toLowerCase() === 'tractor') {
//         initialMachineryItem.driveType = item.driveType || '';
//         initialMachineryItem.clutchType = item.clutchType || '';
//         // Correctly map boolean powerSteering to string for display
//         if (item.powerSteering !== null && item.powerSteering !== undefined) {
//           initialMachineryItem.powerSteering = item.powerSteering
//             ? 'Yes'
//             : 'No';
//         } else {
//           initialMachineryItem.powerSteering = '';
//         }
//       }

//       setMachineryData([initialMachineryItem]);
//       setInitialMachineryData(initialMachineryItem); // Store initial data

//       // Pre-fill the date picker if the item is a tractor or baler
//       if (item?.name.toLowerCase() === 'tractor' && item?.yearOfManufacture) {
//         setSelectedDates(prev => ({
//           ...prev,
//           [`tractorYear0`]: new Date(item.yearOfManufacture.toString()),
//         }));
//       }
//       if (item?.name.toLowerCase() === 'balers' && item?.modelNumber) {
//         // Only set if modelNumber is a valid date string, otherwise it causes RangeError
//         // const date = new Date(item.modelNumber);
//         const [day, month, year] = item?.modelNumber?.split('/');
//         const date = new Date(`${year}-${month}-${day}`); // YYYY-MM-DD format

//         //console.log('date', date);

//         if (!isNaN(date.getTime())) {
//           // Check if date is valid
//           setSelectedDates(prev => ({
//             ...prev,
//             [`balersModel0`]: date,
//           }));
//         }
//       }
//       // Pre-fill trolley type
//       if (item.name.toLowerCase() === 'trolleys' && item.mechanismType) {
//         setSelectedTrolleyType(prev => ({
//           ...prev,
//           [`${item.machineryTypeId}-0`]: item.mechanismType,
//         }));
//       }
//     }
//   }, [route?.params?.item]);

//   const handleInputChange = (index: number, field: string, value: any) => {
//     const updatedData = [...machineryData];
//     updatedData[index][field] = value;
//     setMachineryData(updatedData);
//   };

//   const handleQuantityChange = (index: number, change: number) => {
//     const updatedData = [...machineryData];
//     const currentCount = updatedData[index].count || 0;
//     updatedData[index].count = Math.max(0, currentCount + change);
//     setMachineryData(updatedData);
//   };

//   const isContinueDisabled = () => {
//     if (machineryData.length === 0 || !initialMachineryData) {
//       return true; // Disable if no data or initial data not loaded
//     }

//     const currentItem = machineryData[0];

//     // Check for changes in basic fields
//     const hasFieldChanged =
//       currentItem.brand !== initialMachineryData.brand ||
//       currentItem.horsepower !== initialMachineryData.horsepower ||
//       currentItem.driveType !== initialMachineryData.driveType ||
//       currentItem.clutchType !== initialMachineryData.clutchType ||
//       currentItem.powerSteering !== initialMachineryData.powerSteering ||
//       currentItem.mechanismType !== initialMachineryData.mechanismType ||
//       currentItem.size !== initialMachineryData.size ||
//       currentItem.capacity !== initialMachineryData.capacity ||
//       currentItem.otherText !== initialMachineryData.otherText ||
//       currentItem.count !== initialMachineryData.count; // Check for quantity change

//     // Check for changes in selectedDates (yearOfManufacture or modelNumber)
//     let hasDateChanged = false;
//     const tractorYearKey = `tractorYear0`;
//     const balersModelKey = `balersModel0`;

//     // Handle yearOfManufacture for tractor
//     const initialYearOfManufacture = initialMachineryData.yearOfManufacture;
//     const currentSelectedYear = selectedDates[tractorYearKey]
//       ? new Date(selectedDates[tractorYearKey]).getFullYear()
//       : undefined;

//     // Compare, handling cases where one or both might be null/undefined
//     if (initialYearOfManufacture !== currentSelectedYear) {
//       hasDateChanged = true;
//     }

//     // Handle modelNumber for balers
//     const initialModelNumber = initialMachineryData.modelNumber; // This is likely null or a string
//     const currentSelectedModelDate = selectedDates[balersModelKey]
//       ? new Date(selectedDates[balersModelKey]).toLocaleDateString()
//       : undefined;

//     // Compare, handling cases where one or both might be null/undefined
//     // Also, ensure initialModelNumber is treated as a string for comparison if it's not null
//     if (initialModelNumber !== currentSelectedModelDate) {
//       hasDateChanged = true;
//     }

//     // Check for changes in selectedTrolleyType
//     let hasTrolleyTypeChanged = false;
//     if (currentItem.name.toLowerCase() === 'trolleys') {
//       const trolleyTypeKey = `${currentItem.machineryTypeId}-0`;
//       // Compare, handling cases where one or both might be null/undefined
//       if (
//         (selectedTrolleyType[trolleyTypeKey] || null) !==
//         (initialMachineryData.mechanismType || null)
//       ) {
//         hasTrolleyTypeChanged = true;
//       }
//     }

//     // The button is enabled if any relevant field has changed
//     const isDisabled = !(
//       hasFieldChanged ||
//       hasDateChanged ||
//       hasTrolleyTypeChanged
//     );
//     return isDisabled;
//   };

//   const handleContinue = async () => {
//     const item = machineryData[0]; // Since we are editing one item, it's at index 0

//     const payload: any = {
//       machineryRecordId: item.id, // Assuming 'id' from the route is the machineryRecordId
//       machineryTypeId: item.machineryTypeId,
//       count: item.count,
//     };

//     if (item.brand) payload.brand = item.brand;
//     if (item.horsepower) payload.horsepower = parseInt(item.horsepower, 10);
//     if (item.driveType) payload.driveType = item.driveType;
//     if (item.clutchType) payload.clutchType = item.clutchType;
//     if (item.powerSteering)
//       payload.powerSteering = item.powerSteering === 'Yes';
//     if (item.mechanismType) payload.mechanismType = item.mechanismType;
//     if (item.size) payload.size = parseInt(item.size, 10);
//     if (item.capacity) payload.capacity = item.capacity;
//     if (item.otherText) payload.otherText = item.otherText;

//     const yearKey = `tractorYear0`;
//     if (selectedDates[yearKey]) {
//       payload.yearOfManufacture = new Date(
//         selectedDates[yearKey],
//       ).getFullYear();
//     }

//     const modelKey = `balersModel0`;
//     if (selectedDates[modelKey]) {
//       payload.modelNumber = new Date(
//         selectedDates[modelKey],
//       ).toLocaleDateString();
//     }

//     try {
//       const resultAction = await dispatch(
//         updateMachinery({
//           payload,
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }),
//       );
//       if (updateMachinery.fulfilled.match(resultAction)) {
//         showToastable({
//           message: resultAction?.payload?.message,
//           status: 'success',
//         });
//         navigation.goBack();
//       } else if (updateMachinery.rejected.match(resultAction)) {
//         showToastable({
//           message:
//             (resultAction.payload as string) ||
//             t('machineryDetails.updateError'),
//           status: 'danger',
//         });
//       }
//     } catch (error: any) {
//       showToastable({
//         message: t('machineryDetails.unexpectedError'),
//         status: 'danger',
//       });
//     }
//   };

//   const renderDateField = (
//     key: string,
//     label: string,
//     Pickerlabel = t('machineryDetails.yearPlaceholder'),
//     LeftIcon = Calender,
//   ) => (
//     <View style={styles.dateFieldContainer}>
//       <CommonText style={styles.label}>{label}</CommonText>
//       <CommonDropdown
//         textStyle={{
//           color: selectedDates[key] ? colors.black : colors.Neutrals500,
//         }}
//         label={
//           selectedDates[key]
//             ? label === t('machineryDetails.modelLabel')
//               ? new Date(selectedDates[key]).toLocaleDateString()
//               : new Date(selectedDates[key]).getFullYear().toString()
//             : Pickerlabel
//         }
//         LeftIcon={LeftIcon}
//         onPress={() => setShowDatePicker({ key, visible: true })}
//       />
//       {showDatePicker.visible && showDatePicker.key === key && (
//         <DatePicker
//           modal
//           open={true}
//           maximumDate={new Date()}
//           date={selectedDates[key] ? new Date(selectedDates[key]) : new Date()}
//           mode="date"
//           onConfirm={date => {
//             setShowDatePicker({ visible: false });
//             setSelectedDates((prev: any) => ({ ...prev, [key]: date }));
//           }}
//           onCancel={() => setShowDatePicker({ visible: false })}
//         />
//       )}
//     </View>
//   );

//   const renderMachinerySection = (item: any, index: number) => {
//     const type = item.name.toLowerCase();
//     const isRepeatable = repeatableTypes.includes(type);

//     if (isRepeatable) {
//       return (
//         <View
//           key={`${item.machineryTypeId}-${index}`}
//           style={styles.sectionCard}
//         >
//           {/* Tractor Fields */}
//           {type === 'tractor' && (
//             <>
//               <TouchableOpacity activeOpacity={0.8}>
//                 <View style={styles.sectionHeader}>
//                   <CommonText style={styles.sectionTitle}>
//                     {item.name} ({item.instanceNumber})
//                   </CommonText>
//                 </View>
//               </TouchableOpacity>
//               <View style={styles.fieldRow}>
//                 <View style={styles.fieldCol}>
//                   <CommonInput
//                     leftIcon={
//                       <Machinery
//                         height={moderateScale(24)}
//                         width={moderateScale(24)}
//                       />
//                     }
//                     label={t('machineryDetails.brandLabel')}
//                     placeholder={t('addMachineryDetails.brandPlaceholder')}
//                     containerStyle={styles.inputContainer}
//                     style={styles.input}
//                     value={item.brand}
//                     onChangeText={text =>
//                       handleInputChange(index, 'brand', text)
//                     }
//                   />
//                 </View>

//                 <View style={styles.fieldCol}>
//                   {renderDateField(
//                     `tractorYear${index}`,
//                     t('machineryDetails.yearLabel'),
//                   )}
//                 </View>
//                 <View style={styles.fieldCol}>
//                   <CommonInput
//                     keyboardType="numeric"
//                     containerStyle={styles.inputContainer}
//                     leftIcon={
//                       <HPIcon
//                         height={moderateScale(24)}
//                         width={moderateScale(24)}
//                       />
//                     }
//                     label={t('machineryDetails.hpLabel')}
//                     placeholder={t('machineryDetails.hpPlaceholder')}
//                     style={styles.input}
//                     maxLength={4}
//                     allowedCharsRegex={MOBILE_REGEX}
//                     value={item.horsepower.toString()}
//                     onChangeText={text =>
//                       handleInputChange(index, 'horsepower', text)
//                     }
//                   />
//                 </View>

//                 <View style={styles.fieldCol}>
//                   <CommonText style={styles.label}>
//                     {t('machineryDetails.driverTypeLabel')}
//                   </CommonText>
//                   <CommonDropdown
//                     LeftIcon={Driver}
//                     RightIcon={DownIcon}
//                     label={
//                       item.driveType ||
//                       t('addMachineryDetails.brandPlaceholder')
//                     }
//                     textWidth={moderateScale(60)}
//                     onPress={() => {
//                       setModalTitle(t('machineryDetails.selectDriveType'));
//                       setModalData([
//                         {
//                           id: '2WD',
//                           name: t('machineryDetails.driveType2WD'),
//                         },
//                         { id: '4WD', name: t('machineryDetails.driveType4WD') },
//                       ]);
//                       setOnModalSelect(() => (selectedItem: any) => {
//                         handleInputChange(
//                           index,
//                           'driveType',
//                           selectedItem.name,
//                         );
//                         setModalVisible(false);
//                       });
//                       setModalVisible(true);
//                     }}
//                   />
//                 </View>

//                 <View style={styles.fieldCol}>
//                   <CommonText style={styles.label}>
//                     {t('machineryDetails.clutchLabel')}
//                   </CommonText>
//                   <CommonDropdown
//                     LeftIcon={Clutch}
//                     RightIcon={DownIcon}
//                     label={
//                       item.clutchType ||
//                       t('addMachineryDetails.brandPlaceholder')
//                     }
//                     textWidth={moderateScale(60)}
//                     onPress={() => {
//                       setModalTitle(t('machineryDetails.selectClutchType'));
//                       setModalData([
//                         {
//                           id: 'hydraulic',
//                           name: t('machineryDetails.clutchHydraulic'),
//                         },
//                         {
//                           id: 'manual',
//                           name: t('machineryDetails.clutchManual'),
//                         },
//                       ]);
//                       setOnModalSelect(() => (selectedItem: any) => {
//                         handleInputChange(
//                           index,
//                           'clutchType',
//                           selectedItem.name,
//                         );
//                         setModalVisible(false);
//                       });
//                       setModalVisible(true);
//                     }}
//                   />
//                 </View>

//                 <View style={styles.fieldCol}>
//                   <CommonText style={styles.label}>
//                     {t('machineryDetails.powerSteeringLabel')}
//                   </CommonText>
//                   <CommonDropdown
//                     LeftIcon={PowerSteering}
//                     RightIcon={DownIcon}
//                     label={
//                       item.powerSteering ||
//                       t('addMachineryDetails.brandPlaceholder')
//                     }
//                     textWidth={moderateScale(60)}
//                     onPress={() => {
//                       setModalTitle(
//                         t('machineryDetails.selectPowerSteeringType'),
//                       );
//                       setModalData([
//                         {
//                           id: 'Yes',
//                           name: t('machineryDetails.yes'),
//                         },
//                         {
//                           id: 'No',
//                           name: t('machineryDetails.no'),
//                         },
//                       ]);
//                       setOnModalSelect(() => (selectedItem: any) => {
//                         handleInputChange(
//                           index,
//                           'powerSteering',
//                           selectedItem.name,
//                         );
//                         setModalVisible(false);
//                       });
//                       setModalVisible(true);
//                     }}
//                   />
//                 </View>
//               </View>
//             </>
//           )}

//           {/* Balers Fields */}
//           {type === 'balers' && (
//             <>
//               <TouchableOpacity activeOpacity={0.8}>
//                 <View style={styles.sectionHeader}>
//                   <CommonText style={styles.sectionTitle}>
//                     {item.name} ({item.instanceNumber})
//                   </CommonText>
//                 </View>
//               </TouchableOpacity>
//               <View style={styles.fieldRow}>
//                 {renderDateField(
//                   `balersModel${index}`,
//                   t('machineryDetails.modelLabel'),
//                   t('profileSetup.dateFormat'),
//                   CalenderBlack,
//                 )}
//               </View>
//             </>
//           )}

//           {/* Trolleys Fields */}
//           {type === 'trolleys' && (
//             <>
//               <TouchableOpacity activeOpacity={0.8}>
//                 <View style={styles.sectionHeader}>
//                   <CommonText style={styles.sectionTitle}>
//                     {item.name} ({item.instanceNumber})
//                   </CommonText>
//                 </View>
//               </TouchableOpacity>
//               <View>
//                 <CommonText style={styles.label}>
//                   {t('machineryDetails.trolleyTypeLabel')}
//                 </CommonText>
//                 <View style={styles.toggleRow}>
//                   <TouchableOpacity
//                     style={[
//                       styles.toggleButton,
//                       selectedTrolleyType[
//                         `${item.machineryTypeId}-${index}`
//                       ] === 'Manual' && styles.selectedToggle,
//                     ]}
//                     onPress={() => {
//                       setSelectedTrolleyType(prev => ({
//                         ...prev,
//                         [`${item.machineryTypeId}-${index}`]: 'Manual',
//                       }));
//                       handleInputChange(index, 'mechanismType', 'Manual');
//                     }}
//                   >
//                     <CommonText
//                       style={[
//                         styles.toggleText,
//                         selectedTrolleyType[
//                           `${item.machineryTypeId}-${index}`
//                         ] === 'Manual' && styles.selectedToggle,
//                       ]}
//                     >
//                       {t('machineryDetails.clutchManual')}
//                     </CommonText>
//                     {selectedTrolleyType[`${item.machineryTypeId}-${index}`] ===
//                       'Manual' && (
//                       <TickFilled
//                         height={moderateScale(21)}
//                         width={moderateScale(21)}
//                       />
//                     )}
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.toggleButton,
//                       selectedTrolleyType[
//                         `${item.machineryTypeId}-${index}`
//                       ] === 'Hydraulic' && styles.selectedToggle,
//                     ]}
//                     onPress={() => {
//                       setSelectedTrolleyType(prev => ({
//                         ...prev,
//                         [`${item.machineryTypeId}-${index}`]: 'Hydraulic',
//                       }));
//                       handleInputChange(index, 'mechanismType', 'Hydraulic');
//                     }}
//                   >
//                     <CommonText
//                       style={[
//                         styles.toggleText,
//                         selectedTrolleyType[
//                           `${item.machineryTypeId}-${index}`
//                         ] === 'Hydraulic' && styles.selectedToggle,
//                       ]}
//                     >
//                       {t('machineryDetails.clutchHydraulic')}
//                     </CommonText>
//                     {selectedTrolleyType[`${item.machineryTypeId}-${index}`] ===
//                       'Hydraulic' && (
//                       <TickFilled
//                         height={moderateScale(21)}
//                         width={moderateScale(21)}
//                       />
//                     )}
//                   </TouchableOpacity>
//                 </View>

//                 <CommonInput
//                   style={styles.repreatableInput}
//                   label={t('machineryDetails.sizeLabel')}
//                   placeholder={t('addMachineryDetails.sizePlaceholder')}
//                   maxLength={5}
//                   allowedCharsRegex={MOBILE_REGEX}
//                   leftIcon={
//                     <Cart
//                       height={moderateScale(24)}
//                       width={moderateScale(24)}
//                     />
//                   }
//                   value={item.size}
//                   onChangeText={text => handleInputChange(index, 'size', text)}
//                 />
//               </View>
//             </>
//           )}

//           {/* Tube Well Pumps Fields */}
//           {type === 'tube well pumps' && (
//             <>
//               <TouchableOpacity activeOpacity={0.8}>
//                 <View style={styles.sectionHeader}>
//                   <CommonText style={styles.sectionTitle}>
//                     {item.name} ({item.instanceNumber})
//                   </CommonText>
//                 </View>
//               </TouchableOpacity>
//               <CommonInput
//                 style={styles.repreatableInput}
//                 label={t('machineryDetails.capacityLabel')}
//                 placeholder={t('addMachineryDetails.sizePlaceholder')}
//                 maxLength={5}
//                 allowedCharsRegex={MOBILE_REGEX}
//                 leftIcon={
//                   <Cart height={moderateScale(24)} width={moderateScale(24)} />
//                 }
//                 value={item.capacity}
//                 onChangeText={text =>
//                   handleInputChange(index, 'capacity', text)
//                 }
//               />
//             </>
//           )}

//           {/* Others Fields */}
//           {type === 'others' && (
//             <>
//               <TouchableOpacity activeOpacity={0.8}>
//                 <View style={styles.sectionHeader}>
//                   <CommonText style={styles.sectionTitle}>
//                     {item.name} ({item.instanceNumber})
//                   </CommonText>
//                 </View>
//               </TouchableOpacity>
//               <CommonInput
//                 label={t('addMachineryDetails.detailsLabel')}
//                 placeholder={t('addMachineryDetails.detailsLabel')}
//                 multiline
//                 style={styles.otherInput}
//                 value={item.otherText}
//                 onChangeText={text =>
//                   handleInputChange(index, 'otherText', text)
//                 }
//               />
//             </>
//           )}
//         </View>
//       );
//     } else if (nonRepeatableTypes.includes(type)) {
//       return (
//         <View
//           key={`${item.machineryTypeId}-${index}`}
//           style={styles.sectionCard}
//         >
//           <View style={styles.repeatableContainer}>
//             <CommonText style={styles.sectionTitle}>{item.name}</CommonText>
//             <View style={styles.itemRightContainer}>
//               <TouchableOpacity
//                 onPress={() => handleQuantityChange(index, -1)}
//                 disabled={item.count === 0}
//                 style={styles.quantityButton}
//                 activeOpacity={0.8}
//               >
//                 {item.count === 0 ? (
//                   <Minus height={moderateScale(28)} width={moderateScale(28)} />
//                 ) : (
//                   <MinusWithRed
//                     height={moderateScale(28)}
//                     width={moderateScale(28)}
//                   />
//                 )}
//               </TouchableOpacity>
//               <CommonText style={styles.quantityText}>{item.count}</CommonText>
//               <TouchableOpacity
//                 onPress={() => handleQuantityChange(index, 1)}
//                 style={styles.quantityButton}
//                 activeOpacity={0.8}
//               >
//                 {item.count === 0 ? (
//                   <Plus height={moderateScale(28)} width={moderateScale(28)} />
//                 ) : (
//                   <PlusWithGreen
//                     height={moderateScale(28)}
//                     width={moderateScale(28)}
//                   />
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       );
//     } else {
//       return (
//         <View
//           key={`${item.machineryTypeId}-${index}`}
//           style={styles.sectionCard}
//         >
//           <View style={styles.nonRepeatableContainer}>
//             <CommonText style={styles.sectionTitle}>{item.name}</CommonText>
//             <CommonText style={styles.quantityText}>
//               {t('addMachineryDetails.quantityPrefix')}
//               {item.count}
//             </CommonText>
//           </View>
//         </View>
//       );
//     }
//   };

//   return (
//     <ScreenWrapper bgColor={colors.transparent} scrollable>
//       <ImageBackground
//         source={Images.GrBg}
//         style={styles.progressHeader}
//         resizeMode="cover"
//       >
//         <View style={styles.headerContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             activeOpacity={0.8}
//             style={styles.bell}
//           >
//             <BackButton width={moderateScale(10)} height={moderateScale(15)} />
//           </TouchableOpacity>
//           <CommonText style={styles.headerTitle}>
//             {t('machineryDetails.headerTitle')}
//           </CommonText>
//         </View>
//       </ImageBackground>
//       <View style={styles.listContainer}>
//         {machineryData.map((item, index) =>
//           renderMachinerySection(item, index),
//         )}
//       </View>
//       <View style={styles.buttonsContainer}>
//         <View style={styles.saveButtonContainer}>
//           <CommonButton
//             style={styles.saveButton}
//             title={t('profileScreen.saveButton')}
//             onPress={handleContinue}
//             disabled={isContinueDisabled() || loading}
//             loading={loading} // Use Redux loading state
//           />
//         </View>
//       </View>
//       <CommonBottomSelectModal
//         isVisible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         onSelect={onModalSelect}
//         title={modalTitle}
//         data={modalData}
//       />
//     </ScreenWrapper>
//   );
// };

// export default EditMachineryDetails;
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ImageBackground } from 'react-native';
import {
  CommonText,
  CommonButton,
  ScreenWrapper,
} from '../../../../../components';
import MachineryFormCard from '../../../../../components/MachineryFormCard'; // Import
import { useMachineryForm } from '../../../../../hooks/useMachineryForm'; // Import
import { colors } from '../../../../../themes/colors';
import { moderateScale } from '../../../../../utils/responsive';
import { BackButton } from '../../../../../assets/icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../../../../../assets/images';
import { showToastable } from 'react-native-toastable';
import { useDispatch, useSelector } from 'react-redux';
import { updateMachinery } from '../../../../../redux/slices/machinarySlice';
import { useTranslation } from 'react-i18next';
import { styles } from './style';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddMachineryDetails'
>;

const EditMachineryDetails = ({ route }: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.machineryStock);
  const accessToken = useSelector((state: any) => state.auth.accessToken);

  const [initialDataState, setInitialDataState] = useState<any>(null);

  // Use the Custom Hook
  const {
    machineryData,
    setMachineryData,
    handleInputChange,
    handleQuantityChange,
  } = useMachineryForm([]);

  // Initialization Logic
  useEffect(() => {
    if (route?.params?.item) {
      const item = route.params.item;
      // Format existing data to match component expectations
      const formattedItem = {
        ...item,
        instanceNumber: 1, // Edit usually implies singular focus
        // Ensure booleans are consistent for the UI
        powerSteering:
          item.powerSteering === true
            ? 'Yes'
            : item.powerSteering === false
              ? 'No'
              : item.powerSteering,
        // Ensure dates are parsed if they exist
        yearOfManufacture: item.yearOfManufacture
          ? new Date(item.yearOfManufacture.toString())
          : null,
      };

      // Handle Baler model date specifically if needed
      if (item.name.toLowerCase() === 'balers' && item.modelNumber) {
        // Assuming modelNumber comes as 'DD/MM/YYYY' or similar string
        const [day, month, year] = item.modelNumber.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        if (!isNaN(date.getTime())) {
          formattedItem.modelNumber = date;
        }
      }

      setMachineryData([formattedItem]);
      setInitialDataState(formattedItem);
    }
  }, [route?.params?.item, setMachineryData]);

  const isContinueDisabled = () => {
    if (machineryData.length === 0 || !initialDataState) return true;
    const currentItem = machineryData[0];

    // Compare basic fields
    const hasChanged =
      currentItem.brand !== initialDataState.brand ||
      currentItem.horsepower !== initialDataState.horsepower ||
      currentItem.driveType !== initialDataState.driveType ||
      currentItem.clutchType !== initialDataState.clutchType ||
      currentItem.mechanismType !== initialDataState.mechanismType ||
      currentItem.size !== initialDataState.size ||
      currentItem.capacity !== initialDataState.capacity ||
      currentItem.otherText !== initialDataState.otherText ||
      currentItem.count !== initialDataState.count;

    // Compare Dates (simplified)
    const initYear = initialDataState.yearOfManufacture
      ? new Date(initialDataState.yearOfManufacture).getFullYear()
      : null;
    const currYear = currentItem.yearOfManufacture
      ? new Date(currentItem.yearOfManufacture).getFullYear()
      : null;

    const hasDateChanged = initYear !== currYear;

    // Compare Power Steering (Boolean vs String logic)
    const initPS =
      initialDataState.powerSteering === true ||
      initialDataState.powerSteering === 'Yes';
    const currPS = currentItem.powerSteering === 'Yes';
    const hasPSChanged = initPS !== currPS;

    return !(hasChanged || hasDateChanged || hasPSChanged);
  };

  const handleContinue = async () => {
    const item = machineryData[0];

    const payload: any = {
      machineryRecordId: item.id, // ID from the original item object
      machineryTypeId: item.machineryTypeId,
      count: item.count,
    };

    if (item.brand) payload.brand = item.brand;
    if (item.horsepower) payload.horsepower = parseInt(item.horsepower, 10);
    if (item.driveType) payload.driveType = item.driveType;
    if (item.clutchType) payload.clutchType = item.clutchType;
    if (item.powerSteering)
      payload.powerSteering = item.powerSteering === 'Yes';
    if (item.mechanismType) payload.mechanismType = item.mechanismType;
    if (item.size) payload.size = parseInt(item.size, 10);
    if (item.capacity) payload.capacity = item.capacity;
    if (item.otherText) payload.otherText = item.otherText;

    if (item.yearOfManufacture) {
      payload.yearOfManufacture = new Date(
        item.yearOfManufacture,
      ).getFullYear();
    }
    if (item.modelNumber) {
      payload.modelNumber = new Date(item.modelNumber).toLocaleDateString();
    }

    try {
      const resultAction = await dispatch(
        updateMachinery({
          payload,
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      if (updateMachinery.fulfilled.match(resultAction)) {
        showToastable({
          message: resultAction?.payload?.message,
          status: 'success',
        });
        navigation.goBack();
      } else {
        showToastable({
          message:
            (resultAction.payload as string) ||
            t('machineryDetails.updateError'),
          status: 'danger',
        });
      }
    } catch (error: any) {
      showToastable({
        message: t('machineryDetails.unexpectedError'),
        status: 'danger',
      });
    }
  };

  return (
    <ScreenWrapper bgColor={colors.transparent} scrollable>
      <ImageBackground
        source={Images.GrBg}
        style={styles.progressHeader}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.bell}
          >
            <BackButton width={moderateScale(10)} height={moderateScale(15)} />
          </TouchableOpacity>
          <CommonText style={styles.headerTitle}>
            {t('machineryDetails.headerTitle')}
          </CommonText>
        </View>
      </ImageBackground>

      <View style={styles.listContainer}>
        {machineryData.map((item, index) => (
          <MachineryFormCard
            key={`${item.machineryTypeId}-${index}`}
            item={item}
            index={index}
            isCollapsible={false} // Edit screen usually stays open
            onChange={(field, value) => handleInputChange(index, field, value)}
            onQuantityChange={change => handleQuantityChange(index, change)}
          />
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.saveButtonContainer}>
          <CommonButton
            style={styles.saveButton}
            title={t('profileScreen.saveButton')}
            onPress={handleContinue}
            disabled={isContinueDisabled() || loading}
            // loading={loading}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default EditMachineryDetails;
