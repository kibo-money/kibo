export const resetRightPriceScale = (
  chart: IChartApi,
  options?: FullPriceScaleOptions,
) => {
  const finalOptions = {
    ...options,
    scaleMargins: {
      ...(options?.halved
        ? {
            top: 0.5,
            bottom: 0.05,
          }
        : {
            top: 0.1,
            bottom: 0.1,
          }),
      ...options?.scaleMargins,
    },
  };

  chart.priceScale("right").applyOptions(finalOptions);

  return finalOptions;
};

export const resetLeftPriceScale = (
  chart: IChartApi,
  options?: FullPriceScaleOptions,
) =>
  chart.priceScale("left").applyOptions({
    visible: false,
    ...options,
    scaleMargins: {
      ...(options?.halved
        ? {
            top: 0.475,
            bottom: 0.025,
          }
        : {
            top: 0.25,
            bottom: 0.25,
          }),
      ...options?.scaleMargins,
    },
  });
