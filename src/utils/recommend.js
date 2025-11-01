export function analyzeAndRecommend(arr) {
  const n = arr.length;
  if (n === 0) {
    return {
      recommended: null,
      explanation: "Empty array — nothing to sort.",
      stats: { n: 0, range_val: 0, uniformity_score: null, data_type: "unknown" },
    };
  }

  const isInteger = arr.every((x) => Number.isInteger(x));
  const min_val = Math.min(...arr);
  const max_val = Math.max(...arr);
  const range_val = max_val - min_val;

  if (isInteger) {
    if (range_val <= 10 * n) {
      return {
        recommended: "counting",
        explanation: `Integer data with small range (range  10*n). range=${range_val.toFixed(2)}, n=${n} → Counting Sort`,
        stats: { n, range_val, uniformity_score: null, data_type: "integer" },
      };
    } else {
      return {
        recommended: "radix",
        explanation: `Integer data with large range (range > 10*n). range=${range_val.toFixed(2)}, n=${n} → Radix Sort`,
        stats: { n, range_val, uniformity_score: null, data_type: "integer" },
      };
    }
  } else {
    const k = Math.max(1, Math.floor(Math.sqrt(n)));
    const binWidth = range_val / k || 1; // avoid 0
    const counts = new Array(k).fill(0);
    for (const v of arr) {
      let idx = Math.floor((v - min_val) / binWidth);
      if (idx === k) idx = k - 1; // include max in last bin
      idx = Math.max(0, Math.min(k - 1, idx));
      counts[idx]++;
    }
    const mean = counts.reduce((a, b) => a + b, 0) / k;
    const variance = counts.reduce((acc, c) => acc + Math.pow(c - mean, 2), 0) / k;
    const sigma = Math.sqrt(variance);
    const uniformity_score = mean === 0 ? 0 : sigma / mean;

    if (0 <= min_val && max_val <= 1 && uniformity_score < 0.3) {
      return {
        recommended: "bucket",
        explanation: `Data are uniformly distributed in [0,1), uniformity score = ${uniformity_score.toFixed(2)} → Bucket Sort`,
        stats: { n, range_val, uniformity_score, data_type: "float" },
      };
    } else {
      return {
        recommended: "radix",
        explanation: `Non-integer data or non-uniform in [0,1). uniformity score = ${uniformity_score.toFixed(2)} → Radix Sort`,
        stats: { n, range_val, uniformity_score, data_type: "float" },
      };
    }
  }
}
