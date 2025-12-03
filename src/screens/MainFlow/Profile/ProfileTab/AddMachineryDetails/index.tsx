// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ImageBackground,
//   FlatList,
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
//   DownBlack,
//   DownIcon,
//   Driver,
//   HPIcon,
//   Machinery,
//   PlusWithGreen,
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
// import { showToastable } from 'react-native-toastable';
// import { useTranslation } from 'react-i18next'; // Import useTranslation
// import { MOBILE_REGEX } from '../../../../../utils/regex';
// import { screenNames } from '../../../../../navigation/screenNames';
// import { styles } from './style';

// // Types where UI should repeat for each quantity
// const repeatableTypes = [
//   'tractor',
//   'trolleys',
//   'balers',
//   'tube well pumps',
//   'others',
// ];

// type NavigationProp = NativeStackNavigationProp<
//   AppStackParamList,
//   'AddMachineryDetails'
// >;

// const AddMachineryDetails = ({ route }: any) => {
//   const { t } = useTranslation(); // Initialize useTranslation
//   const navigation = useNavigation<NavigationProp>();
//   const [selectedDates, setSelectedDates] = useState<any>({});
//   const [showDatePicker, setShowDatePicker] = useState<{
//     key?: string;
//     visible: boolean;
//   }>({
//     visible: false,
//   });
//   const [selectedTrolleyType, setSelectedTrolleyType] = useState<any>({});
//   const [machineryData, setMachineryData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const machineryList = route?.params?.machineryList || [];
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalData, setModalData] = useState<any[]>([]);
//   const [modalTitle, setModalTitle] = useState('');
//   const [onModalSelect, setOnModalSelect] = useState<(item: any) => void>(
//     () => () => {},
//   );
//   const [collapsedStates, setCollapsedStates] = useState<{
//     [key: string]: boolean;
//   }>({}); // New state for collapsed cards

//   useEffect(() => {
//     if (machineryList) {
//       const initialData = machineryList
//         .filter(item => item.quantity > 0)
//         .flatMap(item => {
//           const name = item.name.toLowerCase();
//           const isRepeatable = repeatableTypes.includes(name);

//           if (isRepeatable) {
//             return Array.from({ length: item.quantity }).map((_, i) => ({
//               machineryTypeId: item.id,
//               name: item.name,
//               instanceNumber: i + 1,
//               count: 1,
//               brand: '',
//               yearOfManufacture: null,
//               horsepower: '',
//               driveType: '',
//               clutchType: '',
//               powerSteering: null,
//               modelNumber: null,
//               mechanismType: '',
//               size: '',
//               capacity: '',
//               otherText: '',
//             }));
//           } else {
//             return [
//               {
//                 machineryTypeId: item.id,
//                 name: item.name,
//                 quantity: item.quantity,
//                 count: item.quantity,
//                 brand: '',
//                 yearOfManufacture: null,
//                 horsepower: '',
//                 driveType: '',
//                 clutchType: '',
//                 powerSteering: null,
//                 modelNumber: null,
//                 mechanismType: '',
//                 size: '',
//                 capacity: '',
//                 otherText: '',
//               },
//             ];
//           }
//         });
//       setMachineryData(initialData);
//       // Initialize all cards as expanded by default
//       const initialCollapsedStates: { [key: string]: boolean } = {};
//       initialData.forEach((item, index) => {
//         initialCollapsedStates[`${item.machineryTypeId}-${index}`] = false;
//       });
//       setCollapsedStates(initialCollapsedStates);
//       //console.log('useEffect: initialCollapsedStates', initialCollapsedStates); // Log initial collapsed states
//     }
//   }, [machineryList]);

//   const handleInputChange = (index: number, field: string, value: any) => {
//     const updatedData = [...machineryData];
//     updatedData[index][field] = value;
//     setMachineryData(updatedData);
//   };

//   const handleQuantityChange = (index: number, change: number) => {
//     const updatedData = [...machineryData];
//     updatedData[index].count = Math.max(0, updatedData[index].count + change);
//     setMachineryData(updatedData);
//   };

//   const toggleCollapse = (key: string) => {
//     setCollapsedStates(prev => {
//       const newState = {
//         ...prev,
//         [key]: !prev[key],
//       };
//       //console.log('toggleCollapse: new collapsedStates', newState); // Log new collapsed states
//       return newState;
//     });
//   };

//   const isContinueDisabled = () => {
//     if (machineryData.length === 0) {
//       return true;
//     }
//     const quantityOnlyTypes = ['Harvester', 'Raker', 'Slasher'];

//     // Check if all machinery items are from the allowed quantity-only types
//     const isOnlyQuantityTypes = machineryData.every(item =>
//       quantityOnlyTypes.includes(item.name),
//     );

//     if (isOnlyQuantityTypes) {
//       // ✅ Only check for quantity if only Harvester/Raker/Slasher are present
//       const hasQuantity = machineryData.some(item => item.quantity > 0);
//       return !hasQuantity;
//     } else {
//       // ✅ Original logic for all other machinery types
//       const isAnyFieldFilled = machineryData.some(
//         instance =>
//           instance.brand ||
//           instance.horsepower ||
//           instance.driveType ||
//           instance.clutchType ||
//           instance.size ||
//           instance.capacity ||
//           instance.otherText,
//       );

//       const isAnyDateFilled = Object.keys(selectedDates).length > 0;
//       const isAnyTrolleyTypeSelected =
//         Object.keys(selectedTrolleyType).length > 0;

//       return !isAnyFieldFilled && !isAnyDateFilled && !isAnyTrolleyTypeSelected;
//     }
//   };

//   const handleContinue = async () => {
//     setLoading(true);
//     const finalMachineryData = machineryData.map((item, index) => {
//       const apiItem: any = {
//         machineryTypeId: item.machineryTypeId,
//         count: item.count,
//       };

//       if (item.brand) apiItem.brand = item.brand;
//       if (item.horsepower) apiItem.horsepower = item.horsepower;
//       if (item.driveType) apiItem.driveType = item.driveType;
//       if (item.clutchType) apiItem.clutchType = item.clutchType;
//       if (item.powerSteering !== null)
//         apiItem.powerSteering = item.powerSteering;
//       if (item.mechanismType) apiItem.mechanismType = item.mechanismType;
//       if (item.size) apiItem.size = item.size;
//       if (item.capacity) apiItem.capacity = item.capacity;
//       if (item.otherText) apiItem.otherText = item.otherText;

//       // Handle dates
//       const yearKey = `tractorYear${index}`;
//       if (selectedDates[yearKey]) {
//         apiItem.yearOfManufacture = new Date(
//           selectedDates[yearKey],
//         ).getFullYear();
//       }

//       const modelKey = `balersModel${index}`;
//       if (selectedDates[modelKey]) {
//         // Assuming modelNumber should be a string representation of the date
//         // apiItem.modelNumber = new Date(
//         //   selectedDates[modelKey],
//         // ).toLocaleDateString();

//         apiItem.modelNumber = new Date(selectedDates[modelKey])
//           .getFullYear()
//           .toString();
//       }

//       return apiItem;
//     });

//     const payload = {
//       machineryData: finalMachineryData,
//     };
//     //console.log('payload', payload);

//     try {
//       await apiClient.post('/user/api/v1/farmers/machinery', payload);
//       showToastable({
//         message: t('machineryDetails.addSuccess'),
//         status: 'success',
//       });
//       navigation.navigate(screenNames.MachineryDetails);
//     } catch (error: any) {
//       //console.log('Dddddxx.  ', error.response?.data);

//       showToastable({
//         message:
//           error.response?.data?.message || t('machineryDetails.addError'),
//         status: 'danger',
//       });
//     } finally {
//       setLoading(false);
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

//   const renderMachinerySection = ({ item, index }) => {
//     const type = item.name.toLowerCase();
//     const isRepeatable = repeatableTypes.includes(type);
//     const cardKey = `${item.machineryTypeId}-${index}`;
//     const isCollapsed = collapsedStates[cardKey];
//     //console.log(
//     // `renderMachinerySection: cardKey=${cardKey}, isCollapsed=${isCollapsed}`,
//     // ); // Log collapsed state for each card

//     if (isRepeatable) {
//       return (
//         <View key={cardKey} style={styles.sectionCard}>
//           {/* Tractor Fields */}
//           {type === 'tractor' && (
//             <>
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={() => toggleCollapse(cardKey)}
//               >
//                 <View
//                   style={[
//                     styles.sectionHeader,
//                     !isCollapsed && styles.commonMargin,
//                   ]}
//                 >
//                   <CommonText style={styles.sectionTitle}>
//                     {item.name} ({item.instanceNumber})
//                   </CommonText>
//                   <DownBlack
//                     height={moderateScale(24)}
//                     width={moderateScale(24)}
//                     style={isCollapsed && { transform: [{ rotate: '180deg' }] }}
//                   />
//                 </View>
//               </TouchableOpacity>
//               {!isCollapsed && (
//                 <View>
//                   <View style={styles.fieldRow}>
//                     <View style={styles.fieldCol}>
//                       <CommonInput
//                         leftIcon={
//                           <Machinery
//                             height={moderateScale(24)}
//                             width={moderateScale(24)}
//                           />
//                         }
//                         label={t('machineryDetails.brandLabel')}
//                         placeholder={t('addMachineryDetails.brandPlaceholder')}
//                         containerStyle={styles.inputContainerStyle}
//                         style={styles.inputStyle}
//                         value={item.brand}
//                         onChangeText={text =>
//                           handleInputChange(index, 'brand', text)
//                         }
//                       />
//                     </View>
//                     <View style={styles.fieldCol}>
//                       {renderDateField(
//                         `tractorYear${index}`,
//                         t('machineryDetails.yearLabel'),
//                       )}
//                     </View>
//                     <View style={styles.fieldCol}>
//                       <CommonInput
//                         keyboardType="numeric"
//                         style={styles.inputContainerStyle}
//                         maxLength={2}
//                         allowedCharsRegex={MOBILE_REGEX}
//                         leftIcon={
//                           <HPIcon
//                             height={moderateScale(24)}
//                             width={moderateScale(24)}
//                           />
//                         }
//                         label={t('machineryDetails.hpLabel')}
//                         placeholder={t('machineryDetails.hpPlaceholder')}
//                         style={styles.inputStyle}
//                         value={item.horsepower}
//                         onChangeText={text =>
//                           handleInputChange(index, 'horsepower', text)
//                         }
//                       />
//                     </View>
//                     <View style={styles.fieldCol}>
//                       <CommonText style={styles.label}>
//                         {t('machineryDetails.driverTypeLabel')}
//                       </CommonText>
//                       <CommonDropdown
//                         LeftIcon={Driver}
//                         RightIcon={DownIcon}
//                         label={
//                           item.driveType ||
//                           t('addMachineryDetails.brandPlaceholder')
//                         }
//                         textWidth={moderateScale(60)}
//                         onPress={() => {
//                           setModalTitle(t('machineryDetails.selectDriveType'));
//                           setModalData([
//                             {
//                               id: '2WD',
//                               name: t('machineryDetails.driveType2WD'),
//                             },
//                             {
//                               id: '4WD',
//                               name: t('machineryDetails.driveType4WD'),
//                             },
//                           ]);
//                           setOnModalSelect(() => (selectedItem: any) => {
//                             handleInputChange(
//                               index,
//                               'driveType',
//                               selectedItem.name,
//                             );
//                             setModalVisible(false);
//                           });
//                           setModalVisible(true);
//                         }}
//                       />
//                     </View>
//                     <View style={styles.fieldCol}>
//                       <CommonText style={styles.label}>
//                         {t('machineryDetails.clutchLabel')}
//                       </CommonText>
//                       <CommonDropdown
//                         LeftIcon={Clutch}
//                         RightIcon={DownIcon}
//                         label={
//                           (item.clutchType === 'Hydraulic'
//                             ? t('machineryDetails.clutchHydraulic')
//                             : t('machineryDetails.clutchManual')) ||
//                           t('addMachineryDetails.brandPlaceholder')
//                         }
//                         textWidth={moderateScale(60)}
//                         onPress={() => {
//                           setModalTitle(t('machineryDetails.selectClutchType'));
//                           setModalData([
//                             {
//                               id: 'Hydraulic',
//                               name: t('machineryDetails.clutchHydraulic'),
//                             },
//                             {
//                               id: 'Manual',
//                               name: t('machineryDetails.clutchManual'),
//                             },
//                           ]);
//                           setOnModalSelect(() => (selectedItem: any) => {
//                             handleInputChange(
//                               index,
//                               'clutchType',
//                               selectedItem.id,
//                             );
//                             setModalVisible(false);
//                           });
//                           setModalVisible(true);
//                         }}
//                       />
//                     </View>
//                     <View style={styles.fieldCol}>
//                       <CommonText style={styles.label}>
//                         {t('machineryDetails.powerSteeringLabel')}
//                       </CommonText>
//                       <CommonDropdown
//                         LeftIcon={PowerSteering}
//                         RightIcon={DownIcon}
//                         label={
//                           (item.powerSteering === 'Yes'
//                             ? t('machineryDetails.yes')
//                             : t('machineryDetails.no')) ||
//                           t('addMachineryDetails.brandPlaceholder')
//                         }
//                         textWidth={moderateScale(60)}
//                         onPress={() => {
//                           setModalTitle(
//                             t('machineryDetails.selectPowerSteeringType'),
//                           );
//                           setModalData([
//                             {
//                               id: 'Yes',
//                               name: t('machineryDetails.yes'),
//                             },
//                             {
//                               id: 'No',
//                               name: t('machineryDetails.no'),
//                             },
//                           ]);
//                           setOnModalSelect(() => (selectedItem: any) => {
//                             handleInputChange(
//                               index,
//                               'powerSteering',
//                               selectedItem.id,
//                             );
//                             setModalVisible(false);
//                           });
//                           setModalVisible(true);
//                         }}
//                       />
//                     </View>
//                   </View>
//                 </View>
//               )}
//             </>
//           )}

//           {/* Balers Fields */}
//           {type === 'balers' && (
//             <>
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={() => toggleCollapse(cardKey)}
//               >
//                 <View
//                   style={[
//                     styles.sectionHeader,
//                     !isCollapsed && styles.commonMargin,
//                   ]}
//                 >
//                   <CommonText style={styles.sectionTitle}>
//                     {item.name} ({item.instanceNumber})
//                   </CommonText>
//                   <DownBlack
//                     height={moderateScale(24)}
//                     width={moderateScale(24)}
//                     style={isCollapsed && { transform: [{ rotate: '180deg' }] }}
//                   />
//                 </View>
//               </TouchableOpacity>
//               {!isCollapsed && (
//                 <View style={styles.fieldRow}>
//                   {renderDateField(
//                     `balersModel${index}`,
//                     t('machineryDetails.modelLabel'),
//                     t('profileSetup.dateFormat'),
//                     CalenderBlack,
//                   )}
//                 </View>
//               )}
//             </>
//           )}

//           {/* Slasher, Raker, Harvester Fields */}
//           {(type === 'slasher' || type === 'raker' || type === 'harvester') && (
//             <>
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={() => toggleCollapse(cardKey)}
//               >
//                 <View style={styles.sectionHeader}>
//                   <CommonText style={styles.sectionTitle}>
//                     {item.name} ({item.instanceNumber})
//                   </CommonText>
//                   <DownBlack
//                     height={moderateScale(24)}
//                     width={moderateScale(24)}
//                     style={isCollapsed && { transform: [{ rotate: '180deg' }] }}
//                   />
//                 </View>
//               </TouchableOpacity>
//               {!isCollapsed && (
//                 <View style={styles.itemRightContainer}>
//                   <TouchableOpacity
//                     onPress={() => handleQuantityChange(index, -1)}
//                     disabled={item.count === 0}
//                     style={styles.quantityButton}
//                     activeOpacity={0.8}
//                   >
//                     {item.count === 0 ? (
//                       <Minus
//                         height={moderateScale(28)}
//                         width={moderateScale(28)}
//                       />
//                     ) : (
//                       <MinusWithRed
//                         height={moderateScale(28)}
//                         width={moderateScale(28)}
//                       />
//                     )}
//                   </TouchableOpacity>
//                   <CommonText style={styles.quantityText}>
//                     {item.count}
//                   </CommonText>
//                   <TouchableOpacity
//                     onPress={() => handleQuantityChange(index, 1)}
//                     style={styles.quantityButton}
//                     activeOpacity={0.8}
//                   >
//                     <PlusWithGreen
//                       height={moderateScale(28)}
//                       width={moderateScale(28)}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </>
//           )}

//           {/* Trolleys Fields */}
//           {type === 'trolleys' && (
//             <>
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={() => toggleCollapse(cardKey)}
//               >
//                 <View
//                   style={[
//                     styles.sectionHeader,
//                     !isCollapsed && styles.commonMargin,
//                   ]}
//                 >
//                   <CommonText style={styles.sectionTitle}>
//                     {item.name} ({item.instanceNumber})
//                   </CommonText>
//                   <DownBlack
//                     height={moderateScale(24)}
//                     width={moderateScale(24)}
//                     style={isCollapsed && { transform: [{ rotate: '180deg' }] }}
//                   />
//                 </View>
//               </TouchableOpacity>
//               {!isCollapsed && (
//                 <View>
//                   <CommonText style={styles.label}>
//                     {t('machineryDetails.trolleyTypeLabel')}
//                   </CommonText>
//                   <View style={styles.toggleRow}>
//                     <TouchableOpacity
//                       style={[
//                         styles.toggleButton,
//                         selectedTrolleyType[
//                           `${item.machineryTypeId}-${index}`
//                         ] === 'Manual' && styles.selectedToggle,
//                       ]}
//                       onPress={() => {
//                         setSelectedTrolleyType(prev => ({
//                           ...prev,
//                           [`${item.machineryTypeId}-${index}`]: 'Manual',
//                         }));
//                         handleInputChange(index, 'mechanismType', 'Manual');
//                       }}
//                     >
//                       <CommonText
//                         style={[
//                           styles.toggleText,
//                           selectedTrolleyType[
//                             `${item.machineryTypeId}-${index}`
//                           ] === 'Manual' && styles.selectedToggle,
//                         ]}
//                       >
//                         {t('machineryDetails.clutchManual')}
//                       </CommonText>
//                       {selectedTrolleyType[
//                         `${item.machineryTypeId}-${index}`
//                       ] === 'Manual' && (
//                         <TickFilled
//                           height={moderateScale(21)}
//                           width={moderateScale(21)}
//                         />
//                       )}
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={[
//                         styles.toggleButton,
//                         selectedTrolleyType[
//                           `${item.machineryTypeId}-${index}`
//                         ] === 'Hydraulic' && styles.selectedToggle,
//                       ]}
//                       onPress={() => {
//                         setSelectedTrolleyType(prev => ({
//                           ...prev,
//                           [`${item.machineryTypeId}-${index}`]: 'Hydraulic',
//                         }));
//                         handleInputChange(index, 'mechanismType', 'Hydraulic');
//                       }}
//                     >
//                       <CommonText
//                         style={[
//                           styles.toggleText,
//                           selectedTrolleyType[
//                             `${item.machineryTypeId}-${index}`
//                           ] === 'Hydraulic' && styles.selectedToggle,
//                         ]}
//                       >
//                         {t('machineryDetails.clutchHydraulic')}
//                       </CommonText>
//                       {selectedTrolleyType[
//                         `${item.machineryTypeId}-${index}`
//                       ] === 'Hydraulic' && (
//                         <TickFilled
//                           height={moderateScale(21)}
//                           width={moderateScale(21)}
//                         />
//                       )}
//                     </TouchableOpacity>
//                   </View>

//                   <CommonInput
//                     style={styles.inputStyle}
//                     maxLength={5}
//                     allowedCharsRegex={MOBILE_REGEX}
//                     keyboardType="phone-pad"
//                     label={t('machineryDetails.sizeLabel')}
//                     placeholder={t('addMachineryDetails.sizePlaceholder')}
//                     leftIcon={
//                       <Cart
//                         height={moderateScale(24)}
//                         width={moderateScale(24)}
//                       />
//                     }
//                     value={item.size}
//                     onChangeText={text =>
//                       handleInputChange(index, 'size', text)
//                     }
//                   />
//                 </View>
//               )}
//             </>
//           )}

//           {/* Tube Well Pumps Fields */}
//           {type === 'tube well pumps' && (
//             <>
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={() => toggleCollapse(cardKey)}
//               >
//                 <View
//                   style={[
//                     styles.sectionHeader,
//                     !isCollapsed && styles.commonMargin,
//                   ]}
//                 >
//                   <CommonText style={styles.sectionTitle}>
//                     {item.name} ({item.instanceNumber})
//                   </CommonText>
//                   <DownBlack
//                     height={moderateScale(24)}
//                     width={moderateScale(24)}
//                     style={isCollapsed && { transform: [{ rotate: '180deg' }] }}
//                   />
//                 </View>
//               </TouchableOpacity>
//               {!isCollapsed && (
//                 <CommonInput
//                   style={styles.inputStyle}
//                   label={t('machineryDetails.capacityLabel')}
//                   maxLength={5}
//                   allowedCharsRegex={MOBILE_REGEX}
//                   keyboardType="phone-pad"
//                   placeholder={t('addMachineryDetails.sizePlaceholder')}
//                   leftIcon={
//                     <Cart
//                       height={moderateScale(24)}
//                       width={moderateScale(24)}
//                     />
//                   }
//                   value={item.capacity}
//                   onChangeText={text =>
//                     handleInputChange(index, 'capacity', text)
//                   }
//                 />
//               )}
//             </>
//           )}

//           {/* Others Fields */}
//           {type === 'others' && (
//             <>
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={() => toggleCollapse(cardKey)}
//               >
//                 <View
//                   style={[
//                     styles.sectionHeader,
//                     !isCollapsed && styles.commonMargin,
//                   ]}
//                 >
//                   <CommonText style={styles.sectionTitle}>
//                     {item.name} ({item.instanceNumber})
//                   </CommonText>
//                   <DownBlack
//                     height={moderateScale(24)}
//                     width={moderateScale(24)}
//                     style={isCollapsed && { transform: [{ rotate: '180deg' }] }}
//                   />
//                 </View>
//               </TouchableOpacity>
//               {!isCollapsed && (
//                 <CommonInput
//                   label={t('addMachineryDetails.detailsLabel')}
//                   placeholder={t('addMachineryDetails.detailsLabel')}
//                   multiline
//                   style={styles.otherInput}
//                   value={item.otherText}
//                   onChangeText={text =>
//                     handleInputChange(index, 'otherText', text)
//                   }
//                 />
//               )}
//             </>
//           )}
//         </View>
//       );
//     } else {
//       return (
//         <View key={cardKey} style={styles.sectionCard}>
//           <View style={styles.nonRepeatableContainer}>
//             <CommonText style={styles.sectionTitle}>{item.name}</CommonText>
//             <CommonText style={styles.quantityText}>
//               {t('addMachineryDetails.quantityPrefix')}
//               {item.quantity}
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
//       <FlatList
//         data={machineryData}
//         contentContainerStyle={styles.listContainer}
//         scrollEnabled={false}
//         keyExtractor={key => key.id}
//         renderItem={renderMachinerySection}
//       />
//       <View style={styles.buttonsContainer}>
//         <View style={styles.saveButtonContainer}>
//           <CommonButton
//             style={styles.saveButton}
//             title={t('continue')}
//             onPress={handleContinue}
//             disabled={isContinueDisabled() || loading}
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

// export default AddMachineryDetails;

import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native';
import {
  CommonText,
  CommonButton,
  ScreenWrapper,
  CommonBottomSelectModal,
} from '../../../../../components';
import MachineryFormCard from '../../../../../components/MachineryFormCard'; // Import the new component
import { useMachineryForm } from '../../../../../hooks/useMachineryForm'; // Import the new hook
import { colors } from '../../../../../themes/colors';
import { moderateScale } from '../../../../../utils/responsive';
import { BackButton } from '../../../../../assets/icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../../../navigation/appNavigator';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../../../../../assets/images';
import apiClient from '../../../../../services/apiClient';
import { showToastable } from 'react-native-toastable';
import { useTranslation } from 'react-i18next';
import { screenNames } from '../../../../../navigation/screenNames';
import { styles } from './style'; // You will need to clean up the style file to remove unused classes

const repeatableTypes = [
  'tractor',
  'trolleys',
  'balers',
  'tube well pumps',
  'others',
];

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddMachineryDetails'
>;

const AddMachineryDetails = ({ route }: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);

  // Use the Custom Hook
  const {
    machineryData,
    setMachineryData,
    collapsedStates,
    setCollapsedStates,
    handleInputChange,
    handleQuantityChange,
    toggleCollapse,
  } = useMachineryForm([]);

  // Initialization Logic
  useEffect(() => {
    const machineryList = route?.params?.machineryList || [];
    if (machineryList) {
      const initialData = machineryList
        .filter((item: any) => item.quantity > 0)
        .flatMap((item: any) => {
          const name = item.name.toLowerCase();
          const isRepeatable = repeatableTypes.includes(name);

          // Standardize structure for the hook/card
          const baseItem = {
            machineryTypeId: item.id,
            name: item.name,
            brand: '',
            yearOfManufacture: null,
            horsepower: '',
            driveType: '',
            clutchType: '',
            powerSteering: null,
            modelNumber: null,
            mechanismType: '',
            size: '',
            capacity: '',
            otherText: '',
          };

          if (isRepeatable) {
            return Array.from({ length: item.quantity }).map((_, i) => ({
              ...baseItem,
              instanceNumber: i + 1,
              count: 1,
            }));
          } else {
            return [
              {
                ...baseItem,
                quantity: item.quantity,
                count: item.quantity,
              },
            ];
          }
        });

      setMachineryData(initialData);

      // Initialize Collapsed States
      const initialCollapsedStates: { [key: string]: boolean } = {};
      initialData.forEach((item: any, index: number) => {
        initialCollapsedStates[`${item.machineryTypeId}-${index}`] = false;
      });
      setCollapsedStates(initialCollapsedStates);
    }
  }, [route?.params?.machineryList, setMachineryData, setCollapsedStates]);

  const isContinueDisabled = () => {
    if (machineryData.length === 0) return true;

    const quantityOnlyTypes = ['Harvester', 'Raker', 'Slasher'];
    const isOnlyQuantityTypes = machineryData.every(item =>
      quantityOnlyTypes.includes(item.name),
    );

    if (isOnlyQuantityTypes) {
      return !machineryData.some(item => item.count > 0);
    }

    const isAnyFieldFilled = machineryData.some(
      instance =>
        instance.brand ||
        instance.horsepower ||
        instance.driveType ||
        instance.clutchType ||
        instance.size ||
        instance.capacity ||
        instance.otherText ||
        instance.yearOfManufacture ||
        instance.modelNumber ||
        instance.mechanismType,
    );

    return !isAnyFieldFilled;
  };

  const handleContinue = async () => {
    setLoading(true);
    // Transform Hook Data to API Payload
    const finalMachineryData = machineryData.map(item => {
      const apiItem: any = {
        machineryTypeId: item.machineryTypeId,
        count: item.count,
      };

      if (item.brand) apiItem.brand = item.brand;
      if (item.horsepower) apiItem.horsepower = item.horsepower;
      if (item.driveType) apiItem.driveType = item.driveType;
      if (item.clutchType) apiItem.clutchType = item.clutchType;
      if (item.powerSteering !== null && item.powerSteering !== '')
        apiItem.powerSteering =
          item.powerSteering === 'Yes' || item.powerSteering === true;
      if (item.mechanismType) apiItem.mechanismType = item.mechanismType;
      if (item.size) apiItem.size = item.size;
      if (item.capacity) apiItem.capacity = item.capacity;
      if (item.otherText) apiItem.otherText = item.otherText;

      // Handle Dates (The Card component returns Date objects usually)
      if (item.yearOfManufacture) {
        apiItem.yearOfManufacture = new Date(
          item.yearOfManufacture,
        ).getFullYear();
      }
      if (item.modelNumber) {
        // Assuming API expects string year or full date string
        apiItem.modelNumber = new Date(item.modelNumber)
          .getFullYear()
          .toString();
      }

      return apiItem;
    });

    const payload = { machineryData: finalMachineryData };

    try {
      await apiClient.post('/user/api/v1/farmers/machinery', payload);
      showToastable({
        message: t('machineryDetails.addSuccess'),
        status: 'success',
      });
      navigation.navigate(screenNames.MachineryDetails);
    } catch (error: any) {
      showToastable({
        message:
          error.response?.data?.message || t('machineryDetails.addError'),
        status: 'danger',
      });
    } finally {
      setLoading(false);
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

      <FlatList
        data={machineryData}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
        keyExtractor={(item, index) => `${item.machineryTypeId}-${index}`}
        renderItem={({ item, index }) => (
          <MachineryFormCard
            item={item}
            index={index}
            isCollapsible={true}
            isCollapsed={collapsedStates[`${item.machineryTypeId}-${index}`]}
            onToggleCollapse={() =>
              toggleCollapse(`${item.machineryTypeId}-${index}`)
            }
            onChange={(field, value) => handleInputChange(index, field, value)}
            // onQuantityChange={change => handleQuantityChange(index, change)}
          />
        )}
      />

      <View style={styles.buttonsContainer}>
        <View style={styles.saveButtonContainer}>
          <CommonButton
            style={styles.saveButton}
            title={t('continue')}
            onPress={handleContinue}
            disabled={isContinueDisabled() || loading}
            // loading={loading}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddMachineryDetails;
