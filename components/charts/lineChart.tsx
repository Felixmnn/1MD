import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useGlobalContext } from '../context/GlobalProvider';

/**
 * Props for the CustomLineChart Component
 * - `chartData`: Array of numeric values representing the data for the chart.
 * - `endDate`: Optional date representing the last date in the dataset.
 */
type CustomLineChartProps = {
  chartData: number[];
  endDate?: Date;
};

/**
 * CustomLineChart Component
 * - Displays a line chart with clustered data and dynamic labels.
 * - Supports different time spans (days, weeks, months, years).
 */
const CustomLineChart = ({
  chartData,
  endDate = new Date(),
}: CustomLineChartProps) => {
  const { themeColors, colorTheme } = useGlobalContext();
  const currentDate = new Date();
  const currentWeekdayIndex = currentDate.getDay();
  const months = ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];
  const MAX_LABELS = 5;

  /**
   * Helper function to validate if a value is a valid number.
   */
  const isValidNumber = (v: unknown): v is number => typeof v === 'number' && isFinite(v);

  /**
   * Helper function to check if a value is marked as missing.
   */
  const isMissing = (v: unknown): boolean => v === -1;

  /**
   * Determine the time span category based on the length of the dataset.
   * - Returns one of: 'Days', 'Weeks', 'Months', 'Years'.
   */
  function getTimeSpanCategory() {
    if (chartData.length < 14) return 'Days';
    if (chartData.length < 60) return 'Weeks';
    if (chartData.length < 365) return 'Months';
    return 'Years';
  }

  /**
   * Calculate the mean (average) of an array of numbers.
   * - Filters out invalid or missing values before calculation.
   */
  const calcMean = (data: Array<number | unknown>): number => {
    if (!data || data.length === 0) return 0;
    const vals = data.filter((v) => isValidNumber(v) && !isMissing(v));
    if (vals.length === 0) return 0;
    const sum = vals.reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0);
    return sum / vals.length;
  };

  /**
   * Cluster the data based on the determined time span category.
   * - Groups data into days, weeks, months, or years.
   */
  function clusterDataByTimeSpan() {
    const timeSpan = getTimeSpanCategory();

    if (timeSpan === 'Days') {
      return [...chartData].reverse();
    }

    if (timeSpan === 'Weeks') {
      let clusteredData = [];
      let remainingData = [...chartData];

      const firstWeekSize = currentWeekdayIndex || 7;
      clusteredData.push(Math.floor(calcMean(remainingData.slice(remainingData.length - firstWeekSize))));
      remainingData = remainingData.slice(0, remainingData.length - firstWeekSize);

      for (let i = 0; i < remainingData.length; i += 7) {
        clusteredData.push(Math.floor(calcMean(remainingData.slice(i, i + 7))));
      }

      return clusteredData.reverse();
    }

    if (timeSpan === 'Months') {
      const groupedByMonth: { [key: string]: number[] } = {};
      let date = new Date(endDate);

      for (let i = chartData.length - 1; i >= 0; i--) {
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = [];
        groupedByMonth[monthKey].push(chartData[i]);
        date.setDate(date.getDate() - 1);
      }

      const monthKeys = Object.keys(groupedByMonth).sort();
      return monthKeys.map((k) => Math.floor(calcMean(groupedByMonth[k])));
    }

    if (timeSpan === 'Years') {
      const groupedByYear: { [key: string]: number[] } = {};
      let date = new Date(endDate);

      for (let i = chartData.length - 1; i >= 0; i--) {
        const yearKey = `${date.getFullYear()}`;
        if (!groupedByYear[yearKey]) groupedByYear[yearKey] = [];
        groupedByYear[yearKey].push(chartData[i]);
        date.setDate(date.getDate() - 1);
      }

      const yearKeys = Object.keys(groupedByYear).sort();
      return yearKeys.map((k) => Math.floor(calcMean(groupedByYear[k])));
    }

    return chartData.reverse();
  }

  /**
   * Generate labels for the X-axis based on the clustered data length.
   * - Labels vary depending on the time span category.
   */
  const getLabels = (clusterLen: number): string[] => {
    const timeSpan = getTimeSpanCategory();
    let allLabels: string[] = [];

    if (timeSpan === 'Days') {
      for (let i = chartData.length - 1; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - i);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        allLabels.push(`${dd}.${mm}`);
      }
    } else if (timeSpan === 'Weeks') {
      let date = new Date(endDate);
      date.setDate(date.getDate() - (7 * (clusterLen - 1)) - (currentWeekdayIndex || 7) + 1);

      for (let i = 0; i < clusterLen; i++) {
        const weekStart = new Date(date);
        const weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const startLabel = String(weekStart.getDate()).padStart(2, '0');
        const endLabel = `${String(weekEnd.getDate()).padStart(2, '0')}.${String(weekEnd.getMonth() + 1).padStart(2, '0')}`;

        allLabels.push(`${startLabel}-${endLabel}`);
        date.setDate(date.getDate() + 7);
      }
    } else if (timeSpan === 'Months') {
      const monthKeys: string[] = [];
      let tempDate = new Date(endDate);

      for (let i = 0; i < chartData.length; i++) {
        const key = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1}`;
        if (!monthKeys.includes(key)) monthKeys.push(key);
        tempDate.setDate(tempDate.getDate() - 1);
      }

      monthKeys.sort();
      for (let i = 0; i < clusterLen; i++) {
        const [year, month] = monthKeys[i].split('-').map(Number);
        allLabels.push(`${months[month - 1]} ${year}`);
      }
    } else if (timeSpan === 'Years') {
      const yearsSet = new Set<number>();
      let tempDate = new Date(endDate);

      for (let i = 0; i < chartData.length; i++) {
        yearsSet.add(tempDate.getFullYear());
        tempDate.setDate(tempDate.getDate() - 1);
      }

      const years = Array.from(yearsSet).sort();
      for (let i = 0; i < clusterLen; i++) {
        allLabels.push(`${years[i]}`);
      }
    }

    if (allLabels.length <= MAX_LABELS) {
      return allLabels;
    }

    const finalLabels = new Array(allLabels.length).fill('');
    const step = Math.ceil(allLabels.length / MAX_LABELS);

    finalLabels[0] = allLabels[0];
    for (let i = step; i < allLabels.length - 1; i += step) {
      finalLabels[i] = allLabels[i];
    }
    finalLabels[allLabels.length - 1] = allLabels[allLabels.length - 1];

    return finalLabels;
  };

  const clusteredData = clusterDataByTimeSpan();

  /**
   * Calculate Y-axis scaling values.
   */
  const scaleValues = clusteredData.filter((v) => isValidNumber(v) && !isMissing(v));
  const safeValues = scaleValues.length ? scaleValues : [0];
  const minY = Math.min(...safeValues);
  const maxY = Math.max(...safeValues);
  const padding = Math.max(1, 0.1 * Math.abs(maxY - minY || 1));
  const yAxisMin = Math.floor(minY - padding);
  const yAxisMax = Math.ceil(maxY + padding);
  const decimalPlaces = maxY - minY < 10 ? 1 : 0;
  const segments = maxY - minY <= 5 ? 3 : maxY - minY <= 20 ? 5 : 6;

  /**
   * Transform the chart data for the LineChart component.
   */
  const chartDataTransformed = {
    labels: getLabels(clusteredData.length),
    datasets: [
      {
        data: clusteredData.reverse(),
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View>
      <View
        className="justify-start items-start rounded-lg"
        style={{ borderRadius: 16, backgroundColor: 'transparent' }}
      >
        <View style={{ paddingBottom: 30 }}>
          <LineChart
            data={chartDataTransformed}
            width={Dimensions.get('window').width - 65}
            height={210}
            fromZero={false}
            bezier
            withDots
            withShadow={false}
            withInnerLines
            withOuterLines
            segments={segments}
            verticalLabelRotation={20}
            formatYLabel={(y) => `${parseFloat(y).toFixed(decimalPlaces)}`}
            chartConfig={{
              backgroundGradientFrom: themeColors[colorTheme].button,
              backgroundGradientTo: themeColors[colorTheme].button,
              decimalPlaces: decimalPlaces,
              color: (opacity = 1) => themeColors[colorTheme].inaktivText,
              labelColor: () => '#fff',
              propsForDots: {
                r: '5',
                strokeWidth: '1',
                stroke: '#ffffff',
              },
            }}
            getDotColor={() => `#007AFF`}
            style={{
              paddingRight: 50,
              paddingBottom: 25,
              marginTop: 65,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default CustomLineChart;