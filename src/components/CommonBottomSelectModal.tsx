import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { moderateScale, verticalScale } from '../utils/responsive';
import { colors } from '../themes/colors';
import CommonText from './CommonText';
import CommonInput from './CommonInput';
import { SearchGray, SearchTab } from '../assets/icons';

interface CommonBottomSelectModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (item: any) => void;
  title: string;
  data: any[];
  mode?: 'kisaniDidi' | 'document'; // 👈 controls layout
  searchKey?: string;
  subDetails?: string;
  showSearchBar?: boolean;
  onSearch?: (text: string) => void;
  placeHolderSearch?: string;
  searchValue?: string;
  onEndReached?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

const CommonBottomSelectModal: React.FC<CommonBottomSelectModalProps> = ({
  isVisible,
  onClose,
  onSelect,
  title,
  data,
  mode = 'document',
  subDetails,
  showSearchBar = false,
  onSearch,
  placeHolderSearch,
  searchValue,
  onEndReached,
  hasMore,
  isLoadingMore,
}) => {
  // const [search, setSearch] = useState('');

  const handleSearch = (text: string) => {
    if (onSearch) {
      onSearch(text);
    }
  };

  const renderKisaniCard = (item: any) => (
    <TouchableOpacity style={styles.kisaniCard}>
      <View style={styles.container}>
        <View style={styles.row}>
          <CommonText style={styles.kisaniName}>{item.name}</CommonText>
          <CommonText style={styles.kisaniId}>#{item.memberId}</CommonText>
        </View>
        <CommonText style={styles.kisaniPhone}>
          +91 {item.phoneNumber}
        </CommonText>
        <CommonText style={styles.kisaniAddress}>
          {item.mandalName + ' ' + item.districtName}
        </CommonText>
      </View>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => onSelect(item)}
      >
        <CommonText style={styles.selectText}>Select</CommonText>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderDocumentCard = (item: any) => (
    <TouchableOpacity style={styles.documentCard}>
      <CommonText numberOfLines={2} style={styles.documentText}>
        {item.name}
      </CommonText>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => onSelect(item)}
      >
        <CommonText style={styles.selectText}>Select</CommonText>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCard = ({ item }) =>
    mode === 'kisaniDidi' ? renderKisaniCard(item) : renderDocumentCard(item);
  const renderEmpyComponent = () => (
    <CommonText style={styles.noDataText}>No data found</CommonText>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating color={colors.ButtonColor} />
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      propagateSwipe={true}
      style={styles.modalContainer}
      avoidKeyboard={true} // 👈 ADD THIS
      useNativeDriver={true} // 👈 ADD THIS
      hideModalContentWhileAnimating={true} // 👈 ADD THIS
    >
      <View style={styles.modalContent}>
        <View style={styles.handleBar} />
        <CommonText
          style={[styles.title, { top: moderateScale(showSearchBar ? 0 : 20) }]}
        >
          {title}
        </CommonText>

        {showSearchBar ? (
          <CommonInput
            placeholder={placeHolderSearch ?? 'Search'}
            value={searchValue} // 👈 controlled value
            onChangeText={onSearch} // 👈 no local state
            leftIcon={<SearchGray size={16} style={styles.searchIcon} />}
            style={styles.input}
          />
        ) : (
          <CommonText style={styles.subtitleStyle}>{subDetails}</CommonText>
        )}

        <FlatList
          data={data}
          style={styles.listStyle}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          renderItem={renderCard}
          ListEmptyComponent={renderEmpyComponent}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      </View>
    </Modal>
  );
};

export default CommonBottomSelectModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchIcon: { top: moderateScale(-5) },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 12,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    padding: moderateScale(16),
    maxHeight: '80%',
    paddingBottom: 32,
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: colors.LightGray2,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitleStyle: {
    marginBottom: moderateScale(24),
    textAlign: 'center',
    color: colors.gray,
    fontSize: moderateScale(14),
  },
  input: {
    borderWidth: 1,
    borderColor: colors.LightGray2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 18,
    fontSize: moderateScale(14),
    marginBottom: 16,
    color: colors.black,
  },

  listStyle: {
    borderColor: colors.LightBorder,
    borderWidth: 1,
    borderRadius: moderateScale(2),
    paddingTop: moderateScale(15),
  },

  // Kisani Didi Style
  kisaniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.KisaniCardBg2,
    borderRadius: 15,
    padding: 16,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  kisaniId: {
    backgroundColor: colors.Primary600,
    color: colors.black,
    fontSize: moderateScale(9),
    lineHeight: verticalScale(12),
    fontWeight: '600',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  kisaniName: {
    lineHeight: verticalScale(22),
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: colors.black,
  },
  kisaniPhone: {
    color: colors.Neutrals100,
    fontSize: moderateScale(12),
    lineHeight: verticalScale(18),
    fontWeight: '400',
    marginTop: 4,
  },
  kisaniAddress: {
    color: colors.Neutrals100,
    fontSize: moderateScale(12),
    lineHeight: verticalScale(18),
    fontWeight: '400',
  },

  // Document Style
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingVertical: moderateScale(5),
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  documentText: {
    fontSize: moderateScale(14),
    color: colors.DarkGray,
    maxWidth: '80%',
  },

  // Common Select Button
  selectButton: {
    backgroundColor: colors.white,
    borderColor: colors.Secondary,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  selectText: {
    color: colors.Secondary,
    fontWeight: '600',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: moderateScale(20),
    fontSize: moderateScale(16),
    color: colors.black,
  },
});
