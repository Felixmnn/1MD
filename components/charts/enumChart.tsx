import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type EnumBarChartProps = {
  labelsArray: (string | number)[];
  valuesArray: number[];
  title?: string;
  isBoolEnum?: boolean;
  varAName?: string;
  varBName?: string;
  setSelectedField: (field: [string | null, number | null, number | null, number | null]) => void;
};

const EnumBarChart: React.FC<EnumBarChartProps> = ({
  labelsArray = [],
  valuesArray = [],
  title,
  isBoolEnum = false,
  varAName = 'Variable A',
  varBName = 'Variable B',
  setSelectedField
}) => {
  const { t } = useTranslation();
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

  const enumMap: Record<number, string> = {
    0: t('enumBarChart.enum.0'),
    1: t('enumBarChart.enum.1'),
    2: t('enumBarChart.enum.2'),
    3: t('enumBarChart.enum.3'),
    4: t('enumBarChart.enum.4'),
  };

  const boolMap: Record<number, string> = {
    0: t('enumBarChart.bool.no'),
    1: t('enumBarChart.bool.yes'),
  };

  const xLabels = useMemo(() => {
    if (isBoolEnum) {
      return [boolMap[0], boolMap[1]];
    } else if (!isBoolEnum && labelsArray.length > 0) {
      return [0, 1, 2, 3, 4].map((i) => enumMap[i]);
    } else {
      return labelsArray.map(String);
    }
  }, [isBoolEnum, labelsArray, enumMap, boolMap]);

  const data = useMemo(() => {
    const aggregated: Record<number, { sum: number; count: number }> = {};
    labelsArray.forEach((label, idx) => {
      const key = Number(label);
      if (!aggregated[key]) aggregated[key] = { sum: 0, count: 0 };
      aggregated[key].sum += valuesArray[idx] ?? 0;
      aggregated[key].count += 1;
    });
    return xLabels.map((label, idx) => {
      const key = idx;
      const entry = aggregated[key];
      return {
        label,
        value: entry ? entry.sum / entry.count : 0,
        count: entry ? entry.count : 0,
        percentage: entry ? (entry.sum / valuesArray.reduce((a, b) => a + b, 0)) * 100 : 0,
      };
    });
  }, [labelsArray, valuesArray, xLabels, isBoolEnum]);

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-white">{t('enumBarChart.noData')}</Text>
      </View>
    );
  }

  // ✅ Y-Achse und Balkenhöhen synchronisieren
  const highestValue = Math.max(...data.map((d) => d.value));
  const steps = 5;
  const stepSize = Math.ceil(highestValue / steps) || 1;
  const maxY = stepSize * steps; // feste Obergrenze
  const barChartY = Array.from({ length: steps + 1 }, (_, i) =>
    (stepSize * (steps - i)).toFixed(1)
  );

  return (
    <View className="flex-col px-2 w-full items-center justify-center" style={{ height: 240, width: 300 }}>
      <View className="flex-row items-end justify-start flex-1">
        {/* Y-Axis */}
        <View className="items-end justify-between h-[180px]" style={{ paddingBottom: 15, height: 175 }}>
          {barChartY.map((value, index) => (
            <Text key={index} className="text-white text-right pr-2 text-xs">
              {value}
            </Text>
          ))}
        </View>

        {/* Bars */}
        <View className="flex-1">
          <View className="flex-row items-end w-full h-[170px]">
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-1 relative justify-end mx-0.5"
                style={{
                  height: `${(item.value / maxY) * 90}%`, // ✅ Skaliert an maxY
                  minHeight: 2,
                  backgroundColor: selectedBarIndex === index ? '#facc15' : '#1e90ff',
                }}
                onPress={() => {
                 
                  setSelectedBarIndex(index)
                  setSelectedField([
                    item.label !== null ? item.label : null,
                    item.value !== null ? Number(item.value.toFixed(1)) : null,
                    item.count !== null ? Number(Math.floor(item.count)) : null,
                    item.percentage !== null ? Number(item.percentage.toFixed(1)) : null,
                    ])}}
              >
                {selectedBarIndex === index && (
                  <Text className="absolute top-[-20] left-0 right-0 text-white text-center text-xs">
                    {t('enumBarChart.average')} {Math.round(item.value)}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* X-Axis */}
          <View className="flex-row mt-1">
            {data.map((item, index) => (
              <Text key={index} className="flex-1 text-white text-center text-xs" numberOfLines={1}>
                {item.label}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Axis Labels */}
      <Text className="text-white text-center w-full" style={{ marginBottom: -5 }}>
        {t('enumBarChart.axisX')}: {varBName}
      </Text>
      <Text className="text-white text-center mb-1 w-full">
        {t('enumBarChart.axisY')}: {varAName}
      </Text>
    </View>
  );
};

export default EnumBarChart;
