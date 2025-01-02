export function calculateMovingAverage(data: any, period = 7) {
  return data.map((item: any, index: any) => {
    if (index < period - 1) return { ...item, "Moving Average": null };
    const sum = data
      .slice(index - period + 1, index + 1)
      .reduce((acc: any, curr: any) => acc + (curr["Net PNL"] || 0), 0);
    return { ...item, "Moving Average": sum / period };
  });
}

export function formatVolumeData(data: any) {
  let cumulativeVolume = 0;
  return data.map((item: any) => ({
    ...item,
    volume: Number(item.volume || 0),
    cumulativeVolume: (cumulativeVolume += Number(item.volume || 0)),
  }));
}
