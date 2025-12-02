import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Buffer } from 'buffer';
import { getLocationList } from '../redux/slices/authSlice'; // Adjust path
import { AppDispatch } from '../redux/store'; // Adjust path

export const useLocationData = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const resetData = () => {
    setDataList([]);
    setPage(1);
    setHasMore(true);
    setSearchQuery('');
  };

  const fetchLocationData = useCallback(
    async (
      type: 'state' | 'district' | 'city' | 'village',
      parentId: string = '',
      search: string = '',
      pageNumber: number = 1,
      isLoadMore: boolean = false,
    ) => {
      if ((isLoadMore && !hasMore) || (isLoadMore && isLoadingMore)) return;

      if (isLoadMore) setIsLoadingMore(true);
      else setLoading(true);

      const tokenBasic = Buffer.from('mysecret:password', 'utf8').toString(
        'base64',
      );

      try {
        const response = await dispatch(
          getLocationList({
            payload: {
              page: pageNumber,
              limit: 10,
              type: type,
              parentId: parentId,
              name: search,
            },
            headers: { Authorization: `Basic ${tokenBasic}` },
          }),
        ).unwrap();

        if (response?.statusCode === 200) {
          const newData = response?.data || [];

          setDataList(prev => {
            const list = isLoadMore ? [...prev, ...newData] : newData;
            // Add "Other" for Mandal/City and Village
            if (!isLoadMore && (type === 'city' || type === 'village')) {
              // check if 'Other' already exists to avoid dupes if API returns it
              if (!list.find((i: any) => i.name === 'Other')) {
                return [...list, { id: '', name: 'Other', parentId: '', type }];
              }
            }
            return list;
          });

          setPage(response?.nextPage);
          setHasMore(response?.nextPage !== -1);
        }
      } catch (err) {
        console.error('Location API Error:', err);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [dispatch, hasMore, isLoadingMore],
  );

  return {
    dataList,
    loading,
    isLoadingMore,
    hasMore,
    page,
    searchQuery,
    setSearchQuery,
    fetchLocationData,
    resetData,
  };
};
