/**
 * Helper Functions
 * - `mean`: Calculates the mean (average) of an array of numbers.
 * - `median`: Calculates the median of an array of numbers.
 * - `minMax`: Returns the minimum and maximum values of an array.
 * - `stdDev`: Calculates the standard deviation of an array.
 * - `correlation`: Calculates the correlation coefficient between two arrays.
 * - `linearRegression`: Calculates the slope and intercept of the linear regression line.
 * - `countOutliers`: Counts the number of outliers in an array based on standard deviation.
 */
export const mean = (arr: number[]) =>
  arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

export const median = (arr: number[]) => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const minMax = (arr: number[]) => {
  if (arr.length === 0) return [0, 0];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  return [min, max];
};

export const stdDev = (arr: number[]) => {
  const m = mean(arr);
  return Math.sqrt(
    arr.reduce((acc, val) => acc + Math.pow(val - m, 2), 0) / arr.length
  );
};

export const correlation = (x: number[], y: number[]) => {
  if (x.length !== y.length || x.length === 0) return 0;
  const meanX = mean(x);
  const meanY = mean(y);
  const numerator = x.reduce(
    (acc, val, i) => acc + (val - meanX) * (y[i] - meanY),
    0
  );
  const denominator = Math.sqrt(
    x.reduce((acc, val) => acc + Math.pow(val - meanX, 2), 0) *
      y.reduce((acc, val) => acc + Math.pow(val - meanY, 2), 0)
  );
  return denominator ? numerator / denominator : 0;
};

export const linearRegression = (x: number[], y: number[]) => {
  const meanX = mean(x);
  const meanY = mean(y);
  const m =
    x.reduce((acc, val, i) => acc + (val - meanX) * (y[i] - meanY), 0) /
    x.reduce((acc, val) => acc + Math.pow(val - meanX, 2), 0);
  const b = meanY - m * meanX;
  return { slope: m, intercept: b };
};

export const countOutliers = (arr: number[]) => {
  const m = mean(arr);
  const sd = stdDev(arr);
  return arr.filter((val) => Math.abs(val - m) > 2 * sd).length;
};



