import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

/**
 * Props for the EnumEnumChart Component
 * - `variableA`: Array of numeric values for variable A.
 * - `variableB`: Array of numeric values for variable B.
 * - `labelA`: Optional label for variable A.
 * - `labelB`: Optional label for variable B.
 * - `setEnumEnumData`: Function to update the selected field data.
 * - `isBoolEnum`: Indicates if the variables are boolean enums.
 * - `enumEnumData`: Object containing the current state of the chart data.
 */
interface Props {
  variableA: number[];
  variableB: number[];
  labelA?: string;
  labelB?: string;
  nameA?: string;
  nameB?: string;
  setEnumEnumData?: (data: any) => void;
  isBoolEnum?: boolean;
  enumEnumData?: {
    variableA: number[];
    variableB: number[];
    selectedField: [number | null, number | null, number | null, number | null];
    constTop3: { row: number; col: number; count: number }[];
  };
}

/**
 * EnumEnumChart Component
 * - Displays a grid chart to analyze the relationship between two enum variables.
 * - Allows users to select individual cells to view their values and percentages.
 */
export const EnumEnumChart: React.FC<Props> = ({
  variableA,
  variableB,
  labelA = 'Variable A',
  labelB = 'Variable B',
  setEnumEnumData,
  enumEnumData,
  isBoolEnum = false,
  nameA = labelA,
  nameB = labelB,
}) => {
  const { t } = useTranslation();
  /**
   * Validation: Ensure both arrays have the same length.
   * - Displays an error message if the lengths do not match.
   */
  if (variableA.length !== variableB.length) {
    return <Text style={styles.error}>{t('enumEnumChart.errorArraysNotSameLength')}</Text>;
  }

  /**
   * Define smiley icons for different categories.
   * - Each category has a label and a corresponding scale of icons.
   */
  const smileys = [
    { label: 'productivity', scale: ['bed', 'battery-quarter', 'tasks', 'chart-line', 'rocket'] },
    { label: 'workoutIntensity', scale: ['snowflake', 'thermometer-empty', 'thermometer-half', 'thermometer-full', 'fire'] },
    { label: 'sleepQuality', scale: ['tired', 'frown', 'meh', 'smile', 'grin-beam'] },
    { label: 'overallDayRating', scale: ['sad-tear', 'frown', 'meh', 'smile', 'grin-beam'] },
    { label: 'workout', scale: ['times', 'check'] },
    { label: 'avoidedBadHabits', scale: ['times', 'check'] },
    { label: 'socialMediaUsageMorning', scale: ['times', 'check'] },
    { label: 'socialMediaUsageEvening', scale: ['times', 'check'] },
  ];

  /**
   * Initialize a 2D array to count occurrences of each combination of values.
   * - The size of the grid depends on whether the variables are boolean enums.
   */
  const counts: number[][] = Array.from(
    { length: isBoolEnum ? 2 : 5 },
    () => Array(5).fill(0)
  );

  const total = variableA.length;

  /**
   * Populate the counts array with the occurrences of each combination.
   */
  for (let i = 0; i < total ; i++) { 
  const a = variableA[i] -1 ;
  const b = variableB[i] -1  ;
  try {
    counts[b][a]++
  } catch (error) {
  }
}

  /**
   * Calculate the maximum count for scaling the cell colors.
   */
  const maxCount = Math.max(...counts.flat());

  /**
   * Get the background color for a cell based on its count.
   * - Higher counts result in more intense colors.
   */
  const getColor = (count: number) => {
    const intensity = Math.round((count / maxCount) * 255);
    return `rgb(${255 - intensity}, 0, 0)`;
  };

  /**
   * Get the text color for a cell based on its count.
   * - White text for non-zero counts, black text otherwise.
   */
  const getTextColor = (count: number) => (count > 0 ? 'white' : 'black');

  const cellSize = 35;

  /**
   * Flatten the counts array and calculate percentages for each cell.
   */
  const flatCounts = counts.flat().map((count, index) => ({
    count,
    position: index,
    row: Math.floor(index / 5),
    col: index % 5,
    percent: ((count / total) * 100).toFixed(1),
  }));

  /**
   * Get the top 3 cells with the highest counts.
   */
  const top3 = flatCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  
  return (
    <View className="w-full justify-start items-start" style={styles.container}>
      {/* Y-Axis Labels */}
      <View className="w-full flex-row justify-center items-center mb-2">
        <View style={{ marginTop: 35 }}>
          {smileys.find((s) => s.label === labelB)?.scale.map((icon, index) => (
            <View
              key={index}
              style={{
                width: cellSize,
                height: cellSize,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name={icon} size={20} color="#ffffff" />
            </View>
          ))}
        </View>

        {/* Grid and X-Axis Labels */}
        <View className="justify-center items-center" style={{ marginRight: 20 }}>
          {/* X-Axis Labels */}
          <View className="flex-row items-center justify-center">
            {smileys.find((s) => s.label === labelA)?.scale.map((icon, index) => (
              <View
                key={index}
                style={{
                  width: cellSize,
                  height: cellSize,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon name={icon} size={20} color="#ffffff" />
              </View>
            ))}
          </View>

          {/* Grid */}
          <View style={{ flexDirection: 'column' }}>
            {counts.map((row, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: 'row' }}>
                {row.map((value, colIndex) => {
                  const percentage = ((value / total) * 100).toFixed(1);
                  const color = getColor(value);

                  return (
                    <TouchableOpacity
                      key={`${rowIndex}-${colIndex}`}
                      onPress={() => {
                        setEnumEnumData?.({
                          ...enumEnumData,
                          selectedField: [rowIndex, colIndex, percentage, value],
                        });
                      }}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: color,
                        borderWidth:
                          enumEnumData?.selectedField[0] === rowIndex &&
                          enumEnumData?.selectedField[1] === colIndex
                            ? 2
                            : 1,
                        borderColor:
                          enumEnumData?.selectedField[0] === rowIndex &&
                          enumEnumData?.selectedField[1] === colIndex
                            ? 'blue'
                            : 'black',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: getTextColor(value), fontWeight: '600' }}>
                        {value}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Axis Labels */}
      <View className="w-full flex-row items-center justify-center">
        <Text className="text-white text-center" style={{ fontSize: 12 }}>
          {t('enumEnumChart.axisLabels', { nameA, nameB })}
        </Text>
      </View>
    </View>
  );
};

/**
 * Styles for the EnumEnumChart Component
 */
const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 0 },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
});