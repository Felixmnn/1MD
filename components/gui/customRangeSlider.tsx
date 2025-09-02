import React, { useEffect, useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

/**
 * Props for the CustomDateRangeSlider Component
 * - `endDate`: Optional end date for the range slider.
 * - `entryCount`: Total number of entries to represent on the slider.
 * - `onChange`: Callback function triggered when the slider values change.
 */
type Props = {
  endDate?: Date;
  entryCount: number;
  onChange?: (startIndex: number, endIndex: number, dateRange: Date[]) => void;
};

/**
 * CustomDateRangeSlider Component
 * - A range slider for selecting a date range.
 * - Dynamically generates dates based on the `entryCount` and `endDate`.
 */
const CustomDateRangeSlider: React.FC<Props> = ({
  endDate = new Date(),
  entryCount,
  onChange = () => {},
}) => {
  // State to track the selected range
  const [range, setRange] = React.useState<[number, number]>([
    0,
    Math.max(entryCount - 1, 0),
  ]);

  // Get the screen width for dynamic slider length
  const width = useWindowDimensions().width;

  /**
   * Generate an array of dates based on the `entryCount` and `endDate`.
   * - If `endDate` is invalid, defaults to the current date.
   */
  const allDates = useMemo(() => {
    if (!endDate || !(endDate instanceof Date) || isNaN(endDate.getTime())) {
      endDate = new Date();
    }
    return Array.from({ length: entryCount }, (_, i) => {
      const date = new Date(endDate);
      date.setDate(date.getDate() - (entryCount - 1 - i));
      return date;
    });
  }, [entryCount, endDate]);

  /**
   * Format a date into a `DD.MM.YYYY` string.
   * - Used for displaying dates on the slider.
   */
  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${date.getFullYear()}`;
  };

  /**
   * Safely format a date, falling back to the current date if invalid.
   */
  const safeFormatDate = (date?: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return formatDate(new Date());
    }
    return formatDate(date);
  };

  /**
   * Handle the slider value change event.
   * - Updates the selected range and triggers the `onChange` callback.
   */
  const handleValuesChangeFinish = (values: number[]) => {
    const [start, end] = values;
    setRange([start, end]);
    const dateRange = allDates.slice(start, end + 1);
    onChange(start, end, dateRange);
  };

  /**
   * Render a message if there are no entries to display.
   */
  if (entryCount < 1) {
    return (
      <View className="px-4">
        <Text className="text-sm text-white">Keine Daten vorhanden</Text>
      </View>
    );
  }

  return (
    <View className="px-4">
      {/* MultiSlider Component */}
      <MultiSlider
        values={[range[0], range[1]]} // Current range values
        min={0} // Minimum value
        max={entryCount - 1} // Maximum value
        step={1} // Step size
        onValuesChangeFinish={handleValuesChangeFinish} // Callback on value change
        sliderLength={width - 100} // Dynamic slider length
        selectedStyle={{ backgroundColor: '#2563eb' }} // Style for the selected range
        unselectedStyle={{ backgroundColor: '#e5e7eb' }} // Style for the unselected range
        trackStyle={{ height: 6, borderRadius: 3 }} // Style for the slider track
        markerStyle={{
          backgroundColor: '#2563eb',
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: 'white',
        }} // Style for the slider markers
      />

      {/* Display the selected date range */}
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm text-white">
          {safeFormatDate(allDates[range[0]])}
        </Text>
        <Text className="text-sm text-white">
          {safeFormatDate(allDates[range[1]])}
        </Text>
      </View>
    </View>
  );
};

export default CustomDateRangeSlider;