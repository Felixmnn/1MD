import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import { useTranslation } from "react-i18next";

const { width: screenWidth } = Dimensions.get("window");

type ScatterPlotProps = {
  xData: number[];
  yData: number[];
  xLabel?: string;
  yLabel?: string;
  size?: number;
  color?: string;
};

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  xData,
  yData,
  xLabel,
  yLabel,
  size = 200,
  color = "blue",
}) => {
  const { t } = useTranslation();

  const plotWidth = screenWidth * 0.8;
  const plotHeight = size;

  // Separate padding for X and Y
  const padX = 40; // left/right padding
  const padY = 25; // top/bottom padding

  const xLabelText = xLabel ?? t("scatterPlot.xLabelDefault");
  const yLabelText = yLabel ?? t("scatterPlot.yLabelDefault");

  if (xData.length !== yData.length || xData.length === 0) return null;

  const minX = Math.min(...xData),
    maxX = Math.max(...xData);
  const minY = Math.min(...yData),
    maxY = Math.max(...yData);

  const scaleX = (x: number) =>
    padX + ((x - minX) / (maxX - minX)) * (plotWidth - 2 * padX);
  const scaleY = (y: number) =>
    plotHeight - padY - ((y - minY) / (maxY - minY)) * (plotHeight - 2 * padY);

  // Linear regression
  const n = xData.length;
  const meanX = xData.reduce((sum, x) => sum + x, 0) / n;
  const meanY = yData.reduce((sum, y) => sum + y, 0) / n;
  const numerator = xData.reduce(
    (sum, x, i) => sum + (x - meanX) * (yData[i] - meanY),
    0
  );
  const denominator = xData.reduce((sum, x) => sum + (x - meanX) ** 2, 0);
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  const trendLineStart = scaleY(slope * minX + intercept);
  const trendLineEnd = scaleY(slope * maxX + intercept);

  const xAxisValues = [minX, (minX + maxX) / 2, maxX];
  const yAxisValues = [minY, (minY + maxY) / 2, maxY];

  return (
    <View style={styles.container}>
      {xData.length > 1 ? (
        <Svg width={plotWidth} height={plotHeight}>
          {/* Axes */}
          <Line
            x1={padX}
            y1={plotHeight - padY}
            x2={plotWidth - padX}
            y2={plotHeight - padY}
            stroke="white"
          />
          <Line
            x1={padX}
            y1={padY}
            x2={padX}
            y2={plotHeight - padY}
            stroke="white"
          />

          {/* Axis Labels */}
          <SvgText
            x={plotWidth - padX + 10}
            y={plotHeight - padY + 5}
            fontSize="14"
            fill="white"
            textAnchor="start"
          >
            X
          </SvgText>
          <SvgText
            x={padX}
            y={padY - 10}
            fontSize="14"
            fill="white"
            textAnchor="middle"
          >
            Y
          </SvgText>

          {/* Axis Values */}
          {xAxisValues.map((value, index) => (
            <SvgText
              key={`x-axis-value-${index}`}
              x={scaleX(value)}
              y={plotHeight - padY + 15}
              textAnchor="middle"
              fontSize="12"
              fill="white"
            >
              {value}
            </SvgText>
          ))}
          {yAxisValues.map((value, index) => (
            <SvgText
              key={`y-axis-value-${index}`}
              x={padX - 5}
              y={scaleY(value)}
              textAnchor="end"
              fontSize="12"
              fill="white"
            >
              {value}
            </SvgText>
          ))}

          {/* Data Points */}
          {xData.map((x, i) => (
            <Circle
              key={i}
              cx={scaleX(x)}
              cy={scaleY(yData[i])}
              r={3}
              fill={color}
            />
          ))}

          {/* Trendline */}
          <Line
            x1={scaleX(minX)}
            y1={trendLineStart}
            x2={scaleX(maxX)}
            y2={trendLineEnd}
            stroke="red"
            strokeWidth={2}
            strokeDasharray="5,5"
          />
        </Svg>
      ) : (
        <Text style={{ color: "white", textAlign: "center" }}>
          {t("scatterPlot.minDataError")}
        </Text>
      )}
{/* Labels */}
      <Text style={{ width: "100%", textAlign: "center", marginTop: -5, color: "white" }}>
        X: {xLabelText} | Y: {yLabelText}
      </Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    width: "100%",
  },
});

export default ScatterPlot;
