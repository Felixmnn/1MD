import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { correlation, countOutliers, linearRegression, mean, median, minMax } from '@/functions/mathFunctions';
import { returnHypothesisColor } from '@/functions/returnColors';

type EnumEnumProps = {
  variableA?: number[];
  variableB?: number[];
  labelA?: string;
  labelB?: string;
  idA?: string;
  idB?: string;
  selectedField?: [number | null, number | null, number | null, number | null];
  isEnumBool?: boolean;
};

export default function EnumEnum({
  variableA = [],
  variableB = [],
  labelA,
  labelB,
  idA,
  idB,
  selectedField,
  isEnumBool = false,
}: EnumEnumProps) {
  const { t } = useTranslation();


if (variableA.length !== variableB.length || variableA.length === 0) {
  return (
    <View className="w-full h-full mt-2 rounded-lg items-center justify-center" style={{ backgroundColor: '#0c1f44ff' }}>
      <Text style={{ color: '#facc15' }}>{t('enumEnum.errorInvalidData')}</Text>
    </View>
  );
}

  const r = correlation(variableA, variableB);
  const [ hypoColor,hypothesisTextColor] = returnHypothesisColor(r);
  
  function effectStrength(r: number): string {
      const absR = Math.abs(r);
      if (absR >= 0.8) return t('enumEnum.effectVeryStrong');
      if (absR >= 0.6) return t('enumEnum.effectStrong');
      if (absR >= 0.4) return t('enumEnum.effectModerate');
      if (absR >= 0.2) return t('enumEnum.effectWeak');
      return t('enumEnum.effectNone');
    }

  // ----------------- ENUM vs ENUM -----------------
  function getEnumEnumStatements(
    variableA: number[],
    variableB: number[],
    labelA: string,
    labelB: string
  ): string[] {
    if (variableA.length !== variableB.length || variableA.length < 3) {
      return [t('enumEnum.notEnoughData')];
    }

    const r =correlation(variableA, variableB);
    const { slope } = linearRegression(variableA, variableB);
    const outliersA = countOutliers(variableA);
    const outliersB = countOutliers(variableB);

  const statements: string[] = [];

  if (r < 0.2 && r > -0.2) {
    statements.push(t('enumEnum.noRelationShip', { labelA, labelB }));
    statements.push(t("enumEnum.addMoreData"));
  } else 
    {
    const effect = slope >= 0 ? t('enumEnum.positive') : t('enumEnum.negative');
    const inDe = t('enumEnum.increase');
    const dirB = slope >= 0 ? t('enumEnum.increase') : t('enumEnum.decrease');

    // 1) Allgemeine Beziehungs-Aussage (skalenfrei, ok)
    statements.push(t('enumEnum.relationship', { labelA, labelB, strength: effectStrength(r), effect }));
    const absR = Math.abs(r);

    // 2) Feinabstufung nach |r| inkl. richtiger B-Richtung und ohne Kausalität
    if (absR < 0.4) {
      statements[0] += t('enumEnum.mayBeWeakCorrelation', { labelA, labelB, inDe, dirB });
      statements.push(t("enumEnum.mayBeWeakCorrelationRecommendation", { labelA, labelB, inDe, dirB }));
    } else if (absR < 0.6) {
      statements[0] += t('enumEnum.moderateCorrelation', { labelA, labelB, inDe, dirB });
      statements.push(t('enumEnum.moderateCorrelationRecommendation', { labelA, labelB, inDe, dirB }));
    } else if (absR < 0.8) {
      statements[0] += t('enumEnum.strongCorrelation', { labelA, labelB, inDe, dirB });
      statements.push(t('enumEnum.strongCorrelationRecommendation', { labelA, labelB, inDe, dirB }));
    } else {
      statements[0] += t('enumEnum.veryStrongCorrelation', { labelA, labelB, inDe, dirB });
      statements.push(t('enumEnum.veryStrongCorrelationRecommendation', { labelA, labelB, inDe, dirB }));
    }

    if (outliersA > 0 || outliersB > 0) {
      statements[1] += ' ' + t('enumEnum.outliersWarning');
    }
  }
    return statements;
  }

  // ----------------- ENUM vs BOOL -----------------
  function getEnumBoolStatements(
    enumVar: number[],
    boolVar: number[],
    labelEnum: string,
    labelBool: string
  ): string[] {
    if (enumVar.length !== boolVar.length || enumVar.length < 3) {
      return [t('enumEnum.notEnoughData')];
    }
    const normBool = boolVar.map((b) => (b === 2 ? 1 : b));

    const r = correlation(enumVar, normBool);
    const { slope } = linearRegression(enumVar, normBool);
    const outliersEnum = countOutliers(enumVar);

    const statements: string[] = [];

    if (Math.abs(r) < 0.2) {
      statements.push(t('enumEnum.noRelationShipBool', { labelEnum, labelBool }));
      statements.push(t("enumEnum.addMoreData"));
    } else {
      // Richtung bestimmen
      const effect = slope >= 0 ? t('enumEnum.positive') : t('enumEnum.negative');
      const inDe = t('enumEnum.increase'); // wir sprechen nur von "increase Enum"
      const dirProb = slope >= 0 ? t('enumEnum.increase') : t('enumEnum.decrease'); // Effekt auf Wahrscheinlichkeit

      // Basis-Statement
      statements.push(
        t('enumEnum.relationshipBool', {
          labelEnum,
          labelBool,
          strength: effectStrength(r),
          effect,
        })
      );

      const absR = Math.abs(r);

      // Staffeln nach Stärke
      if (absR < 0.4) {
        statements[0] += t('enumEnum.mayBeWeakCorrelationBool', { labelEnum, labelBool, inDe, dirProb });
        statements.push(t('enumEnum.mayBeWeakCorrelationRecommendationBool', { labelEnum, labelBool }));
      } else if (absR < 0.6) {
        statements[0] += t('enumEnum.moderateCorrelationBool', { labelEnum, labelBool, inDe, dirProb });
        statements.push(t('enumEnum.moderateCorrelationRecommendationBool', { labelEnum, labelBool, inDe, dirProb }));
      } else if (absR < 0.8) {
        statements[0] += t('enumEnum.strongCorrelationBool', { labelEnum, labelBool, inDe, dirProb });
        statements.push(t('enumEnum.strongCorrelationRecommendationBool', { labelEnum, labelBool, inDe, dirProb }));
      } else {
        statements[0] += t('enumEnum.veryStrongCorrelationBool', { labelEnum, labelBool, inDe, dirProb });
        statements.push(t('enumEnum.veryStrongCorrelationRecommendationBool', { labelEnum, labelBool, inDe, dirProb }));
      }

      // Outlier Hinweis
      if (outliersEnum > 0) {
        statements[1] += ' ' + t('enumEnum.outliersWarning');
      }
    }

    return statements;
  }

  const eS = getEnumEnumStatements(variableA, variableB, labelA || '', labelB || '');
  const eBS = getEnumBoolStatements(variableA, variableB, labelA || '', labelB || '');

    const enumLabels = {
      variableA: t('enumEnum.enumLabels.variableA', { returnObjects: true }) as string[],
      variableB: t('enumEnum.enumLabels.variableB', { returnObjects: true }) as string[],
    };

  /**
   * getEnumLabel Function
   * - Retrieves the label for a given variable and index.
   * - Validates if the label exists in `enumLabels` and if the index is valid.
   *
   * @param {Record<string, string[]>} labels - The object containing enum labels.
   * @param {string | undefined} label - The key for the variable in `enumLabels`.
   * @param {number | null | undefined} idx - The index of the label to retrieve.
   * @returns {string} - The label for the given index, or an empty string if invalid.
   */
  const getEnumLabel = (
    labels: Record<string, string[]>,
    label: string | undefined,
    idx: number | null | undefined
  ) => {
    if (!label || idx === null || idx === undefined) return '';
    const labelArray = labels[label]; // Get the array of labels for the given variable
    return labelArray && labelArray[idx] ? labelArray[idx] : ''; // Return the label at the given index
  };

  // Corrected selectedText logic
  const selectedText = selectedField && selectedField[0] !== null && selectedField[1] !== null ? t('enumEnum.selectedDescription', {
        labelA: labelA,
        valueA: isEnumBool
          ? selectedField[0]
            ? t('enumEnum.true')
            : t('enumEnum.false')
          : getEnumLabel(enumLabels, 'variableA', selectedField[0]), // Use 'variableA' as the key
        labelB: labelB,
        valueB: isEnumBool
          ? selectedField[1]
            ? t('enumEnum.true')
            : t('enumEnum.false')
          : getEnumLabel(enumLabels, 'variableB', selectedField[1]), // Use 'variableB' as the key
        count: selectedField[3] === null ? undefined : selectedField[3],
        percent: selectedField[2] === null ? undefined : selectedField[2],}): t('enumEnum.selectedNone');

  return (
    <View className="w-full h-full space-y-4">
      {/* Selected Field Section */}
      <View className="rounded-md p-4 mt-2" style={{ backgroundColor: '#0c1f44ff' }}>
        <Text className="font-bold text-gray-200 text-lg mb-2">✅ {t('enumEnum.selectedTitle')}</Text>
        <Text className="text-gray-200">{selectedText}</Text>
      </View>

      {/* Statistics Section */}
      <View className="rounded-md p-4 mt-2" style={{ backgroundColor: '#0c1f44ff' }}>
        <Text className="font-bold text-gray-200 text-lg mb-2">{t('enumEnum.hypothesisTitle')}</Text>
        <Text className="text-gray-200">{isEnumBool ? eBS[0] : eS[0]}</Text>
      </View>

      {/* Hypothesis Section */}
      <View className="rounded-md p-4 mt-2" style={{ backgroundColor: hypoColor }}>
        <Text style={{ color: hypothesisTextColor }} className="font-bold text-lg mb-2">
          {t('enumEnum.recommendationTitle')}
        </Text>
        <Text style={{ color: hypothesisTextColor }}>{isEnumBool ? eBS[1]  : eS[1]}</Text>
      </View>
    </View>
  );
}
