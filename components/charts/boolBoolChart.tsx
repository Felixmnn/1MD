import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

/**
 * Props for the BooleanBooleanChart Component
 * - `variableA`: Array of boolean values for variable A.
 * - `variableB`: Array of boolean values for variable B.
 * - `labelA`: Optional label for variable A.
 * - `labelB`: Optional label for variable B.
 * - `setBoolBoolData`: Function to update the selected field data.
 * - `boolBoolData`: Object containing the current state of the chart data.
 */
interface Props {
  variableA: boolean[];
  variableB: boolean[];
  labelA?: string;
  labelB?: string;
  setBoolBoolData?: (data: any) => void;
  boolBoolData?: {
    variableA: boolean[];
    variableB: boolean[];
    selectedField: [boolean | null, boolean | null, number, number];
    constTop3: { row: number; col: number; count: number }[];
  };
}

/**
 * BooleanBooleanChart Component
 * - Displays a 2x2 grid chart to analyze the relationship between two boolean variables.
 * - Allows users to select individual cells to view their values and percentages.
 */
export const BooleanBooleanChart: React.FC<Props> = ({
  variableA,
  variableB,
  labelA,
  labelB,
  setBoolBoolData,
  boolBoolData,
}) => {
  const { t } = useTranslation();

  // Axis labels with fallback to translations if not provided
  const axisLabelA = labelA || t('booleanBooleanChart.variableA');
  const axisLabelB = labelB || t('booleanBooleanChart.variableB');

  /**
   * Validation: Ensure both arrays have the same length.
   * - Displays an error message if the lengths do not match.
   */
  if (variableA.length !== variableB.length) {
    return <Text style={styles.error}>{t('booleanBooleanChart.errorArrays')}</Text>;
  }

  /**
   * Count occurrences of each combination of boolean values.
   * - `true_true`: Both variables are true.
   * - `true_false`: Variable A is true, Variable B is false.
   * - `false_true`: Variable A is false, Variable B is true.
   * - `false_false`: Both variables are false.
   */
  const counts = {
    true_true: 0,
    true_false: 0,
    false_true: 0,
    false_false: 0,
  };

  for (let i = 0; i < variableA.length; i++) {
    const a = variableA[i];
    const b = variableB[i];
    const key = `${a}_${b}` as keyof typeof counts;
    counts[key]++;
  }

  // Total number of entries and the maximum count for scaling
  const total = variableA.length;
  const maxCount = Math.max(...Object.values(counts));

  // Prepare data for the grid cells
  const cells = [
    { key: 'true_true', value: counts.true_true },
    { key: 'true_false', value: counts.true_false },
    { key: 'false_true', value: counts.false_true },
    { key: 'false_false', value: counts.false_false },
  ];

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

  /**
   * Handle cell press to update the selected field data.
   * - Updates the `boolBoolData` with the selected cell's values and percentage.
   */
  const handleCellPress = (cellA: boolean, cellB: boolean, value: number) => {
    if (setBoolBoolData) {
      setBoolBoolData({
        ...boolBoolData,
        selectedField: [cellA, cellB, value, parseFloat(((value / total) * 100).toFixed(1))],
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Chart Row */}
      <View style={styles.chartRow}>
        {/* Y-Axis Labels */}
        <View className="h-[160px]">
          {[t('booleanBooleanChart.yes'), t('booleanBooleanChart.no')].map((label, index) => (
            <View
              key={index}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 80,
                paddingRight: 5,
                paddingTop: 45,
              }}
            >
              <Text className="text-white">x({label})</Text>
            </View>
          ))}
        </View>

        {/* Grid and X-Axis Labels */}
        <View>
          {/* X-Axis Labels */}
          <View className="flex-row">
            {[t('booleanBooleanChart.yes'), t('booleanBooleanChart.no')].map((label, index) => (
              <Text
                key={index}
                style={{
                  width: 80,
                  textAlign: 'center',
                  color: 'white',
                  marginBottom: 5,
                }}
              >
                y({label})
              </Text>
            ))}
          </View>

          {/* Grid Cells */}
          <View style={styles.grid}>
            {cells.map((cell, index) => {
              const x = index % 2;
              const y = Math.floor(index / 2);
              const [cellA, cellB] = cell.key.split('_').map((v) => v === 'true');
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleCellPress(cellA, cellB, cell.value)}
                  style={[
                    styles.cell,
                    {
                      left: x * 80,
                      top: y * 80,
                      backgroundColor: getColor(cell.value),
                      opacity:
                        boolBoolData?.selectedField[0] === cellA &&
                        boolBoolData?.selectedField[1] === cellB
                          ? 1
                          : 0.6,
                      borderColor:
                        boolBoolData?.selectedField[0] === cellA &&
                        boolBoolData?.selectedField[1] === cellB
                          ? '#e70202'
                          : 'black',
                      borderWidth:
                        boolBoolData?.selectedField[0] === cellA &&
                        boolBoolData?.selectedField[1] === cellB
                          ? 2
                          : 1,
                    },
                  ]}
                >
                  <Text style={[styles.cellText, { color: getTextColor(cell.value) }]}>
                    {cell.value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Axis Labels */}
      <View className="w-full items-center justify-center">
        <Text className="text-white text-center" style={{ fontSize: 12 }}>
          {t('booleanBooleanChart.xAxis')}: {axisLabelA}
        </Text>
        <Text className="text-white text-center" style={{ fontSize: 12 }}>
          {t('booleanBooleanChart.yAxis')}: {axisLabelB}
        </Text>
      </View>
    </View>
  );
};

/**
 * Styles for the BooleanBooleanChart Component
 */
const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
  chartRow: { flexDirection: 'row' },
  grid: { width: 160, height: 160, position: 'relative', marginRight: 40 },
  cell: { position: 'absolute', width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  cellText: { fontSize: 14, fontWeight: 'bold' },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
});