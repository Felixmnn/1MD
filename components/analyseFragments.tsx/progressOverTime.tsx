import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomDateRangeSlider from '../customRangeSlider';
import { CustomBottomSheetRef } from '../customBottomSheet';

/**
 * Type Definitions
 * - `DropdownOption`: Represents an option in the dropdown menu.
 * - `ProgressOverTimeProps`: Defines the props for the `ProgressOverTime` component.
 */
type DropdownOption = {
  name: string; // Name of the dropdown option
  location: string; // Location or category associated with the option
};

type ProgressOverTimeProps = {
  selctedDropdownOption: DropdownOption; // Currently selected dropdown option
  rawData: any; // Raw data to be analyzed
  bottomSheetRef: React.RefObject<CustomBottomSheetRef | null>; // Reference to the bottom sheet
  filteredData: any; // Filtered data based on the selected date range
  setFilteredData: (data: any) => void; // Function to update the filtered data
};

/**
 * ProgressOverTime Component
 * - Displays progress statistics over time for a selected category.
 * - Allows users to filter data by date range using a slider.
 */
const ProgressOverTime = ({
  selctedDropdownOption,
  rawData,
  bottomSheetRef,
  filteredData,
  setFilteredData,
}: ProgressOverTimeProps) => {
  const { t } = useTranslation();

  /**
   * Interface for individual data items in `rawData` and `filteredData`.
   */
  interface DataItem {
    value: number; // Numeric value of the data item
    [key: string]: any; // Additional properties
  }

  /**
   * Extract numeric values from raw and filtered data.
   */
  const rawDataValues: number[] = (rawData as DataItem[]).map((item: DataItem) => item.value);

  interface FilteredDataItem {
    value: number; // Numeric value of the filtered data item
    [key: string]: any; // Additional properties
  }

  const transformedFilteredData: number[] = (filteredData as FilteredDataItem[]).map(
    (item: FilteredDataItem) => item.value
  );

  /**
   * Translation mapping for category labels.
   */
  const categoryTranslation = {
    physicalHealth: t('categories.physicalHealth'),
    mentalHealth: t('categories.mentalHealth'),
    work: t('categories.work'),
    overallDayRating: t('categories.overallDayRating'),
  };

  

  return (
    <View className="w-full h-full">
      
      {/* Info Box */}
      <TouchableOpacity
        className="bg-white/10 p-4 rounded-xl w-full mt-2"
        style={{ backgroundColor: '#0c1f44ff' }}
        onPress={() => bottomSheetRef.current?.openSheet(0)}
      >
        <Text className="text-white text-base font-semibold">
          {t('progressOverTime.buttonTitle', { name: selctedDropdownOption.name })}
        </Text>
        <Text className="text-white text-base font-semibold">
          {t('progressOverTime.categoryLabel')}
          <Text className="font-normal">
            {selctedDropdownOption.location in categoryTranslation
              ? categoryTranslation[selctedDropdownOption.location as keyof typeof categoryTranslation]
              : selctedDropdownOption.location}
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Statistics Box */}
      <View className="bg-white/10 p-4 rounded-xl w-full mt-2" style={{ backgroundColor: '#0c1f44ff' }}>
        <Text className="text-white text-base font-semibold">
          {t('progressOverTime.averageLabel')}
          <Text className="font-normal">
            {transformedFilteredData.length === 0
              ? t('progressOverTime.noValue')
              : (
                  transformedFilteredData.reduce((a, b) => a + b, 0) / transformedFilteredData.length
                ).toFixed(2)}
          </Text>
        </Text>
        <Text className="text-white text-base font-semibold">
          {t('progressOverTime.minMaxLabel')}
          <Text className="font-normal">
            {transformedFilteredData.length === 0
              ? `${t('progressOverTime.noMin')} - ${t('progressOverTime.noMax')}`
              : `${Math.min(...transformedFilteredData)} - ${Math.max(...transformedFilteredData)}`}
          </Text>
        </Text>
        <Text className="text-white text-base font-semibold">
            {t('progressOverTime.countLabel')}
            <Text className="font-normal">
              {transformedFilteredData.length}
            </Text>
          </Text>
      </View>

      {/* Slider Section */}
      <View className="bg-white/10 p-4 rounded-xl w-full mt-2" style={{ backgroundColor: '#0c1f44ff' }}>
        <Text className="text-white text-lg font-semibold">{t('progressOverTime.changeTimeframe')}</Text>
        <CustomDateRangeSlider
          endDate={
            rawData.length > 0
              ? (() => {
                  try {
                    const latest: Date = (rawData as Array<{ date: string }>).reduce(
                      (max: Date, item: { date: string }) => {
                      const [day, month, year]: number[] = item.date.split('.').map(Number);
                      const dateObj: Date = new Date(year, month - 1, day);
                      return dateObj > max ? dateObj : max;
                      },
                      new Date(0)
                    );
                    return latest;
                  } catch {
                    return new Date(); // failsafe
                  }
                })()
              : new Date() // fallback, falls rawData leer
          }
          entryCount={rawData.length}
          onChange={(start, end, dates) => {
            const sliced = rawData.length > 1 ? rawData.slice(start, end + 1) : rawData;
            setFilteredData(sliced);
          }}
        />

      </View>
    </View>
  );
};

export default ProgressOverTime;