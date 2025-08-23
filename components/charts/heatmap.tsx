import { View, Text, useWindowDimensions } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Props for the Heatmap Component
 * - `data`: Array of numeric values representing the heatmap data (e.g., binary or numeric).
 * - `binary`: Indicates if the data is binary (1/0).
 * - `endDate`: The last date in the dataset.
 */
interface HeatmapProps {
  data?: number[];
  binary?: boolean;
  endDate?: Date;
}

/**
 * Heatmap Component
 * - Displays a heatmap grid for weekly data.
 * - Highlights the current day and provides a legend for the "Today" indicator.
 */
const Heatmap: React.FC<HeatmapProps> = ({
  data = [1, 0, 1, 0, 1, 0, 1],
  binary = true,
  endDate = new Date(),
}) => {
  const { t } = useTranslation();
  const weekDaysRaw = t('heatmap.weekDays', { returnObjects: true });
  const weekDays: string[] = Array.isArray(weekDaysRaw) ? weekDaysRaw : [];
  const width = useWindowDimensions().width;

  /**
   * Calculate the maximum number of weeks that can fit in the heatmap based on screen width.
   */
  const maxWeeks = Math.max(1, Math.floor((width * 0.8) / 25));

  /**
   * Determine the weekday index of the last date in the dataset.
   */
  const endWeekday = endDate.getDay();

  /**
   * Type Definitions
   * - `WeekGridValue`: Represents a single cell in the heatmap (numeric value or null).
   * - `WeekGrid`: Represents a single week in the heatmap (array of `WeekGridValue`).
   */
  type WeekGridValue = number | null;
  type WeekGrid = WeekGridValue[];

  /**
   * Build the heatmap grid based on the input data.
   * - Groups the data into weeks, starting from the last date.
   * - Each week contains 7 days, with null values for missing days.
   * 
   * @param values - Array of numeric values representing the data.
   * @param lastWeekday - The weekday index of the last date in the dataset.
   * @param maxWeeks - The maximum number of weeks to display.
   * @returns A 2D array representing the heatmap grid.
   */
  function buildWeekGrid(
    values: number[],
    lastWeekday: number,
    maxWeeks: number
  ): WeekGrid[] {
    const weeks: WeekGrid[] = [];
    let week: WeekGrid = new Array(7).fill(null);
    let cursor: number = lastWeekday;

    for (let i = values.length - 1; i >= 0; i--) {
      week[cursor] = values[i];

      if (cursor === 0) {
        weeks.unshift(week);
        if (weeks.length >= maxWeeks) break;
        week = new Array(7).fill(null);
        cursor = 6;
      } else {
        cursor--;
      }
    }

    if (weeks.length < maxWeeks && week.some((v) => v !== null)) {
      weeks.unshift(week);
    }

    return weeks;
  }

  /**
   * Generate the heatmap grid based on the input data.
   * - Trims the grid to fit within the maximum number of weeks.
   */
  let weeks = buildWeekGrid(data, endWeekday, maxWeeks);
  if (weeks.length > maxWeeks) {
    weeks = weeks.slice(weeks.length - maxWeeks);
  }

  /**
   * Determine the index of today's data in the dataset.
   */
  const todayIndex = data.length - 1;

  return (
    <View className="w-full items-center justify-center">
      {/* Weekday Labels */}
      <View className="flex-row">
        <View>
          {weekDays.map((day, idx) => (
            <Text key={idx} className="text-white text-center h-6">
              {day}
            </Text>
          ))}
        </View>

        {/* Weekly Columns */}
        <View className="flex-row">
          {weeks.map((week, wIdx) => (
            <View key={wIdx}>
              {week.map((value, dIdx) => {
                const isToday =
                  wIdx === weeks.length - 1 &&
                  dIdx === endWeekday &&
                  value !== null;

                return (
                  <View
                    key={dIdx}
                    className={`w-4 h-4 m-1 rounded-md
                      ${isToday ? 'border-[1px] border-blue-500' : ''}
                      ${value === 1 ? 'bg-green-900' : value === 0 ? 'bg-red-900' : 'bg-gray-900'}`}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Legend for "Today" */}
      <View className="w-full flex-row justify-center items-center mt-2">
        <Text className="text-white text-center h-6">{t('heatmap.today')}</Text>
        <View
          className={`w-4 h-4 m-1 border-[1px] border-blue-500 rounded-md ${
            binary
              ? data.length
                ? data[data.length - 1] === 1
                  ? 'bg-green-900'
                  : 'bg-red-900'
                : 'bg-gray-900'
              : 'bg-gray-900'
          }`}
        />
      </View>
    </View>
  );
};

export default Heatmap;