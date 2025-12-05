import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Buffer } from 'buffer';
import { getLocationList } from '../redux/slices/authSlice'; // Adjust path
import { AppDispatch } from '../redux/store'; // Adjust path

// Helper for Basic Auth Token (Consider moving this to an API utility)
const getBasicToken = () => {
  return Buffer.from(`${'mysecret'}:${'password'}`, 'utf8').toString('base64');
};

export interface AddressInitialData {
  addressLine?: string;
  completeAddress?: string;
  pincode?: string;
  stateId?: string;
  state?: string;
  districtId?: string;
  district?: string;
  mandalId?: string;
  mandal?: string;
  otherMandalName?: string;
  villageId?: string;
  village?: string;
  otherVillageName?: string;
}

export const useAddressLogic = (
  initialData: AddressInitialData | null = null,
) => {
  const dispatch = useDispatch<AppDispatch>();

  // --- Form State ---
  const [completeAddress, setCompleteAddress] = useState('');
  const [pincode, setPincode] = useState('');

  // Dropdown Selections
  const [selectedStateObj, setSelectedStateObj] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedMandal, setSelectedMandal] = useState<any>(null);
  const [selectedVillage, setSelectedVillage] = useState<any>(null);

  // Manual Text Inputs for "Other"
  const [mandalText, setMandalText] = useState('');
  const [villageText, setVillageText] = useState('');

  // --- Data Lists ---
  const [stateArray, setStateArray] = useState<any[]>([]);
  const [districtArray, setDistrictArray] = useState<any[]>([]);
  const [mandalArray, setMondalArray] = useState<any[]>([]);
  const [villageArray, setVillageArray] = useState<any[]>([]);

  // --- UI State ---
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // --- Initialization ---
  useEffect(() => {
    if (initialData) {
      setCompleteAddress(
        initialData.addressLine || initialData.completeAddress || '',
      );
      setPincode(initialData.pincode || '');

      if (initialData.stateId) {
        setSelectedStateObj({
          id: initialData.stateId,
          name: initialData.state,
        });
      }
      if (initialData.districtId) {
        setSelectedDistrict({
          id: initialData.districtId,
          name: initialData.district,
        });
      }

      setSelectedMandal({
        id: initialData?.mandalId ?? '',
        name: initialData?.mandal ?? 'Other',
      });
      setMandalText(initialData?.otherMandalName || '');

      setSelectedVillage({
        id: initialData?.villageId ?? '',
        name: initialData?.village ?? 'Other',
      });
      setVillageText(initialData?.otherVillageName || '');
    }
  }, [initialData]);

  // --- API Logic ---
  const fetchLocationData = useCallback(
    async (
      type: 'state' | 'district' | 'city' | 'village',
      parentId: string = '',
      searchQuery: string = '',
      pageNumber: number = 1,
      isLoadMore: boolean = false,
    ) => {
      if (!isLoadMore) setLoading(true);
      else setIsLoadingMore(true);

      try {
        const response = await dispatch(
          getLocationList({
            payload: {
              page: pageNumber,
              limit: 10,
              type,
              parentId,
              name: searchQuery,
            },
            headers: { Authorization: `Basic ${getBasicToken()}` },
          }),
        ).unwrap();

        const newData = response?.data || [];

        const updateList = (setter: any) => {
          setter((prev: any[]) => {
            const combined = isLoadMore ? [...prev, ...newData] : newData;
            // Ensure "Other" option exists for Mandal/Village
            if (!isLoadMore && (type === 'city' || type === 'village')) {
              if (!combined.some((i: any) => i.name === 'Other')) {
                return [...combined, { id: 'OTHER_ID', name: 'Other', type }];
              }
            }
            return combined;
          });
        };

        if (type === 'state') updateList(setStateArray);
        else if (type === 'district') updateList(setDistrictArray);
        else if (type === 'city') updateList(setMondalArray);
        else if (type === 'village') updateList(setVillageArray);

        setPage(response?.nextPage);
        setHasMore(response?.nextPage !== -1);
      } catch (error) {
        console.error('Location Fetch Error', error);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [dispatch],
  );

  // --- Wrapper for Dropdown Interactions ---
  const handleDropdownOpen = (
    dropdownType: 'state' | 'district' | 'mandal' | 'village',
    search: string = '',
    isLoadMore: boolean = false,
  ) => {
    // Reset pagination if it's a new search or fresh open
    const pageToFetch = isLoadMore ? page : 1;
    if (!isLoadMore) {
      setPage(1);
      setHasMore(true);
    }

    // Determine Parent ID & API Type
    let apiType: any = dropdownType;
    let parentId = '';

    if (dropdownType === 'state') {
      apiType = 'state';
    } else if (dropdownType === 'district') {
      apiType = 'district';
      parentId = selectedStateObj?.id;
    } else if (dropdownType === 'mandal') {
      apiType = 'city'; // API expects 'city' for Mandal
      parentId = selectedDistrict?.id;
    } else if (dropdownType === 'village') {
      apiType = 'village';
      parentId = selectedMandal?.id;
    }

    // Validation: Don't fetch if parent is missing (unless it's 'state')
    if (dropdownType !== 'state' && !parentId) return;

    fetchLocationData(apiType, parentId, search, pageToFetch, isLoadMore);
  };

  return {
    formState: {
      completeAddress,
      setCompleteAddress,
      pincode,
      setPincode,
      selectedStateObj,
      setSelectedStateObj,
      selectedDistrict,
      setSelectedDistrict,
      selectedMandal,
      setSelectedMandal,
      selectedVillage,
      setSelectedVillage,
      mandalText,
      setMandalText,
      villageText,
      setVillageText,
    },
    data: {
      stateArray,
      districtArray,
      mandalArray,
      villageArray,
    },
    ui: {
      loading,
      isLoadingMore,
      hasMore,
    },
    actions: {
      handleDropdownOpen,
    },
  };
};
