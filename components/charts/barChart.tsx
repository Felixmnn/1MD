import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Props for the CustomBarChart Component
 * - `chartData`: Array of numeric values representing the data for the chart.
 * - `lastDate`: Optional date representing the last date in the dataset.
 */
interface CustomBarChartProps {
  chartData: number[];
  lastDate?: Date;
}

/**
 * CustomBarChart Component
 * - Displays a bar chart with clustered data and dynamic labels.
 * - Allows users to select individual bars to view their values.
 */
const CustomBarChart: React.FC<CustomBarChartProps> = ({
  chartData = [],
  lastDate = new Date(),
}) => {
  const { t } = useTranslation();
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const width = useWindowDimensions().width;

  /**
   * Calculate the maximum number of bars that can fit in the chart based on screen width.
   */
  const maxBars = Math.max(1, Math.floor((width * 0.8) / 49));

  /**
   * Find the highest value in the dataset for scaling the chart.
   */
  const highestValue = Math.max(...chartData);

  /**
   * Cluster data into groups if the number of data points exceeds the maximum number of bars.
   * - Groups data into clusters and calculates the average for each cluster.
   */
  const clusterData = (data: number[], maxBars: number) => {
    const step = Math.ceil(data.length / maxBars);
    const clusteredData: number[] = [];
    for (let i = 0; i < data.length; i += step) {
      const cluster = data.slice(i, i + step);
      const avg = cluster.reduce((sum, value) => sum + value, 0) / cluster.length;
      clusteredData.push(Math.round(avg));
    }
    return clusteredData;
  };

  /**
   * Determine the final data to display in the chart.
   * - If the number of data points exceeds `maxBars`, cluster the data.
   */
  const finalData = chartData.length > maxBars ? clusterData(chartData, maxBars) : chartData;

  /**
   * Generate X-axis labels based on the data length and the last date.
   * - Labels vary depending on the time range (e.g., days, weeks, months).
   */
  const getXLabels = (dataLength: number, lastDate: Date, maxBars: number) => {
    const labels: string[] = [];
    const step = Math.ceil(dataLength / maxBars);
    const date = new Date(lastDate);

    for (let i = 0; i < maxBars; i++) {
      let label = '';

      if (dataLength <= 7) {
        // Short weekday names for small datasets
        label = date.toLocaleDateString('de-DE', { weekday: 'short' });
      } else if (dataLength <= 60) {
        // Date range for medium datasets
        const start = new Date(date);
        start.setDate(date.getDate() - step + 1);
        const monthNumber = (date.getMonth() + 1).toString().padStart(2, '0');
        label = `${start.getDate()}-${date.getDate()}.${monthNumber}`;
      } else {
        // Month names for large datasets
        label = date.toLocaleDateString('de-DE', { month: 'short' });
      }

      labels.unshift(label);
      date.setDate(date.getDate() - step);
    }

    return labels;
  };

  /**
   * Generate labels for the X-axis.
   */
  const labels = getXLabels(chartData.length, lastDate, finalData.length);

  /**
   * Generate Y-axis values for the chart.
   * - Divides the range into equal steps for better readability.
   */
  const steps = 5;
  const barChartY: number[] = [];
  for (let i = steps; i >= 0; i--) {
    barChartY.push(Math.round(highestValue * (i / steps)));
  }

  return (
    <View className="flex-col px-2 w-full h-full items-center justify-center">
      {/* Chart Title */}
      <Text className="text-white text-lg mb-2">{t('customBarChart.title')}</Text>

      <View className="flex-row items-center flex-1">
        {/* Y-Axis */}
        <View className="items-end justify-between h-[170px]">
          {barChartY.map((value, idx) => (
            <Text key={idx} className="text-white text-right pr-2 text-xs">
              {value}
            </Text>
          ))}
        </View>

        {/* Bars */}
        <View className="flex-1">
          <View className="flex-row items-end w-full h-[170px]">
            {finalData.map((value, idx) => (
              <TouchableOpacity
                key={idx}
                className="flex-1 relative justify-end mx-0.5"
                style={{
                  height: `${(value / highestValue) * 100}%`,
                  backgroundColor: selectedBarIndex === idx ? '#facc15' : '#1e90ff',
                }}
                onPress={() => setSelectedBarIndex(idx)}
              >
                {/* Selected Bar Value */}
                {selectedBarIndex === idx && (
                  <Text
                    className="absolute left-0 right-0 text-white text-center text-xs"
                    style={{
                      top: -20,
                    }}
                  >
                    {value} Ø
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* X-Axis */}
          <View className="flex-row mt-1 w-full">
            {labels.map((label, idx) => (
              <View className="flex-1 mr-1 flex-row" key={idx}>
                <Text className="w-full text-white text-center text-xs">{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CustomBarChart;