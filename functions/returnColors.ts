

function getLuminance(hex: string): number {
    const rgb = hex
      .replace('#', '')
      .match(/.{2}/g)!
      .map((x) => parseInt(x, 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }

  function getTextColor(backgroundHex: string): string {
    const luminance = getLuminance(backgroundHex);
    return luminance > 0.5 ? '#111827' : '#f9fafb';
  }

export function returnHypothesisColor(r: number): [string, string ] {
    let hypoColor = '#6b7280'; // neutral gray-500
    if (r >= 0.2 && r < 0.4) {
    hypoColor = '#86efac';
    } else if (r >= 0.4 && r < 0.6) {
    hypoColor = '#22c55e';
    } else if (r >= 0.6) {
    hypoColor = '#15803d';
    } else if (r <= -0.2 && r > -0.4) {
    hypoColor = '#fed7d7';
    } else if (r <= -0.4 && r > -0.6) {
    hypoColor = '#f87171';
    } else if (r <= -0.6) {
    hypoColor = '#b91c1c';
    }

    const hypothesisTextColor = getTextColor(hypoColor);

    return [ hypoColor, hypothesisTextColor];
}