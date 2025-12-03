import { useState, useCallback } from 'react';

export const useMachineryForm = (initialData: any[] = []) => {
  const [machineryData, setMachineryData] = useState<any[]>(initialData);
  const [collapsedStates, setCollapsedStates] = useState<{
    [key: string]: boolean;
  }>({});

  const handleInputChange = useCallback(
    (index: number, field: string, value: any) => {
      setMachineryData(prevData => {
        const updatedData = [...prevData];
        updatedData[index] = { ...updatedData[index], [field]: value };
        return updatedData;
      });
    },
    [],
  );

  const handleQuantityChange = useCallback((index: number, change: number) => {
    setMachineryData(prevData => {
      const updatedData = [...prevData];
      const newCount = Math.max(0, (updatedData[index].count || 0) + change);
      updatedData[index] = { ...updatedData[index], count: newCount };
      return updatedData;
    });
  }, []);

  const toggleCollapse = useCallback((key: string) => {
    setCollapsedStates(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return {
    machineryData,
    setMachineryData,
    collapsedStates,
    setCollapsedStates, // Exposed if manual set needed (e.g. init)
    handleInputChange,
    handleQuantityChange,
    toggleCollapse,
  };
};
