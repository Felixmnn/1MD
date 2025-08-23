import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { correlation, countOutliers, linearRegression, mean, median, minMax } from '@/functions/mathFunctions';
import { returnHypothesisColor } from '@/functions/returnColors';


type NumberNumberProps = {
  variableA?: number[];
  variableB?: number[];
  labelA?: string;
  labelB?: string;
  idA?: string;
  idB?: string;
};

export default function NumberNumber({
  variableA = [],
  variableB = [],
  labelA = 'Variable A',
  labelB = 'Variable B',
  idA,
  idB,
}: NumberNumberProps) {
  const { t } = useTranslation();
  
    // --- Statistik ---
    const r =  correlation(variableA, variableB);
    const { slope } = linearRegression(variableA, variableB);
    const outliersA = countOutliers(variableA);
    const outliersB = countOutliers(variableB);
  function effectStrength(r: number): string {
      const absR = Math.abs(r);
      if (absR >= 0.8) return t('enumEnum.effectVeryStrong');
      if (absR >= 0.6) return t('enumEnum.effectStrong');
      if (absR >= 0.4) return t('enumEnum.effectModerate');
      if (absR >= 0.2) return t('enumEnum.effectWeak');
      return t('enumEnum.effectNone');
    }

  function generateNumberNumberStatements(r:number, slope:number, labelA:string, labelB:string, outliersA = 0, outliersB = 0) {
  const statements = [];
  const dirB = slope >= 0 ? t('enumEnum.increase') : t('enumEnum.decrease');

  if (r < 0.2 && r > -0.2) {
    // keine Beziehung
    statements.push(t('enumEnum.noRelationShip', { labelA, labelB }));
    statements.push(t("enumEnum.addMoreData"));
  } else {
    let effect = "";
    let inDe = "";

    if (slope > 0) {
      effect = t('enumEnum.positive');
      inDe = t('enumEnum.increase');
    } else if (slope < 0) {
      effect = t('enumEnum.negative');
      inDe = t('enumEnum.decrease');
    }

    // Hypothese
    statements.push(
      t('enumEnum.relationship', {
        labelA,
        labelB,
        strength: effectStrength(r),
        effect,
      })
    );

    const absR = Math.abs(r);
    
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
      statements[1] += " " + t("enumEnum.outliersWarning");
    }
  }

  return statements;
  }

    const recommendation: string[] = [];
  const statements = generateNumberNumberStatements(r, slope, labelA, labelB, outliersA, outliersB);
  
  
    // --- Hypothese (beschreibend) ---
    if (r > 0.6) {
      recommendation.push(t('boolNumber.hypothesisStrongPositive', { labelA, labelB }));
    } else if (r > 0.4) {
      recommendation.push(t('boolNumber.hypothesisModeratePositive', { labelA, labelB }));
    } else if (r > 0.2) {
      recommendation.push(t('boolNumber.hypothesisWeakPositive', { labelA, labelB }));
    } else if (r < -0.6) {
      recommendation.push(t('boolNumber.hypothesisStrongNegative', { labelA, labelB }));
    } else if (r < -0.4) {
      recommendation.push(t('boolNumber.hypothesisModerateNegative', { labelA, labelB }));
    } else if (r < -0.2) {
      recommendation.push(t('boolNumber.hypothesisWeakNegative', { labelA, labelB }));
    } else {
      recommendation.push(t('boolNumber.hypothesisNone', { labelA, labelB }));
    }
  
    if (Math.abs(r) < 0.2) {
      recommendation.push(
        t('boolNumber.noClearCorrelation', { labelA, labelB })
      );
    } else if (slope > 0) {
      recommendation[0] += t('boolNumber.trendPositive', { labelA, labelB });
      recommendation.push(
        t('boolNumber.recommendationIncreas', { labelA, labelB })
      );
    } else if (slope < 0) {
      recommendation[0] += t('boolNumber.trendNegative', { labelA, labelB });
      recommendation.push(
        t('boolNumber.recommendationDecrease', { labelA, labelB })
      );
    }
  
    if (outliersA > 0 || outliersB > 0) {
      recommendation[1] += t('boolNumber.caution');
    }
  
    const [ hypoColor, hypothesisTextColor ] = returnHypothesisColor(r);
  

  return (
    <View className="w-full h-full space-y-4">
      {/* 2. Hypothese */}
      <View className="rounded-md p-4 mt-2" style={{ backgroundColor: '#0c1f44ff' }}>
        <Text className="font-bold text-gray-200 text-lg mb-2">{t('boolNumber.hypothesisTitle')}</Text>
        <Text className="text-gray-200">{statements[0]}</Text>
      </View>

      {/* 3. Empfehlung */}
      <View className="rounded-md p-4 mt-2" style={{ backgroundColor: hypoColor }}>
        <Text className="font-bold text-lg mb-2" style={{ color: hypothesisTextColor }}>{t('boolNumber.recommendationTitle')}</Text>
        <Text style={{ color: hypothesisTextColor }}>{statements[1]}</Text>
      </View>
    </View>
  );
}
