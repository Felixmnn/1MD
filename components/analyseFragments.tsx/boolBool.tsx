import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { correlation, countOutliers, mean, median, minMax } from '@/functions/mathFunctions';
import { returnHypothesisColor } from '@/functions/returnColors';

type BoolBoolProps = {
  variableA: boolean[];
  variableB: boolean[];
  labelA?: string;
  labelB?: string;
  idA?: string;
  idB?: string;
  selectedField?: [boolean | null, boolean | null, number | null, number | null];
};

const BoolBool: React.FC<BoolBoolProps> = ({
  variableA,
  variableB,
  idA,
  idB,
  labelA = 'Variable A',
  labelB = 'Variable B',
  selectedField = [null, null, 0, 0],
}) => {
  const { t } = useTranslation();

  // --- Validation ---
  if (variableA.length !== variableB.length) {
    return (
      <View className="p-4">
        <Text>{t('boolBool.errorInvalidData')}</Text>
      </View>
    );
  }

  // --- Counts ---
  const counts = variableA.reduce(
    (acc, a, i) => {
      const b = variableB[i];
      if (a && b) acc.TT++;
      else if (a && !b) acc.TF++;
      else if (!a && b) acc.FT++;
      else acc.FF++;
      return acc;
    },
    { TT: 0, TF: 0, FT: 0, FF: 0 }
  );

  const phi = 
    (counts.TT * counts.FF - counts.TF * counts.FT) /
    Math.sqrt(
      (counts.TT + counts.TF) *
        (counts.FT + counts.FF) *
        (counts.TT + counts.FT) *
        (counts.TF + counts.FF)
    );


  // --- Hypothese ---
  let hypothesisKey = 'boolBool.hypothesisNone';
  if (phi >= 0.6) hypothesisKey = 'boolBool.hypothesisStrongPositive';
  else if (phi >= 0.4) hypothesisKey = 'boolBool.hypothesisModeratePositive';
  else if (phi >= 0.2) hypothesisKey = 'boolBool.hypothesisWeakPositive';
  else if (phi <= -0.6) hypothesisKey = 'boolBool.hypothesisStrongNegative';
  else if (phi <= -0.4) hypothesisKey = 'boolBool.hypothesisModerateNegative';
  else if (phi <= -0.2) hypothesisKey = 'boolBool.hypothesisWeakNegative';

  const hypothesis = t(hypothesisKey, { labelA, labelB });

  // --- Empfehlung ---
let recommendationKey = 'boolBool.recommendationNone';
const pBgivenA = counts.TT / (counts.TT + counts.TF || 1);
const pBgivenNotA = counts.FT / (counts.FT + counts.FF || 1);

// Differenz in Prozent
let diffPercent = Math.round((pBgivenA - pBgivenNotA) * 100);

// Empfehlung mit positiv/negativ korrekt darstellen
let recommendationText = '';
if (diffPercent > 0) {
  recommendationKey = 'boolBool.recommendationIncrease';
} else if (diffPercent < 0) {
  recommendationKey = 'boolBool.recommendationDecrease';
  diffPercent = Math.abs(diffPercent); // Betrag, damit Text klar ist
}

const recommendation = t(recommendationKey, { labelA, labelB, diffPercent });

const [ hypoColor, hypothesisTextColor ] = returnHypothesisColor(phi);

  return (
    <View className="w-full h-full space-y-4">
      {/* Selected Field */}
      <View className="rounded-md p-4 mt-2" style={{ backgroundColor: '#0c1f44ff' }}>
        <Text className="font-bold text-gray-200 text-lg mb-2">{t('boolBool.selectedTitle')}</Text>
        <Text className="text-gray-200">
          {selectedField && selectedField[0] !== null && selectedField[1] !== null
            ? t('boolBool.selectedDescription', {
                labelA,
                labelB,
                fieldA: selectedField[0] ? t('boolBool.true') : t('boolBool.false'),
                fieldB: selectedField[1] ? t('boolBool.true') : t('boolBool.false'),
                percent: selectedField[2],
              })
            : t('boolBool.selectedNone')}
        </Text>
      </View>

      {/* Hypothese */}
      <View className="rounded-md p-4 mt-2" style={{ backgroundColor: '#0c1f44ff' }}>
        <Text className="text-gray-200 font-bold text-lg mb-2">{t('boolBool.hypothesisTitle')}</Text>
        <Text className="text-gray-200">{hypothesis}</Text>
      </View>

      {/* Empfehlung */}
      <View className="rounded-md p-4 mt-2" style={{ backgroundColor: hypoColor }}>
        <Text className="font-bold  text-lg mb-2" style={{color:hypothesisTextColor}}>{t('boolBool.recommendationTitle')}</Text>
        <Text style={{color:hypothesisTextColor}}>{recommendation}</Text>
      </View>
    </View>
  );
};

export default BoolBool;