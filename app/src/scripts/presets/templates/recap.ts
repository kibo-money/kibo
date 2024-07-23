export function createRecapPresets({
  scale,
  unit,
  title,
  keyAverage,
  color,
  keySum,
  keyMax,
  key90p,
  key75p,
  keyMedian,
  key25p,
  key10p,
  keyMin,
}: {
  scale: ResourceScale;
  title: string;
  color: Color;
  unit: Unit;
  keySum?: AnyDatasetPath;
  keyAverage?: AnyDatasetPath;
  keyMax?: AnyDatasetPath;
  key90p?: AnyDatasetPath;
  key75p?: AnyDatasetPath;
  keyMedian?: AnyDatasetPath;
  key25p?: AnyDatasetPath;
  key10p?: AnyDatasetPath;
  keyMin?: AnyDatasetPath;
}): PartialPreset[] {
  return [
    ...(keySum
      ? ([
          {
            scale,
            icon: IconTablerSum,
            name: "Daily Sum",
            title: `${title} Daily Sum`,
            description: "",
            unit,
            bottom: [
              {
                title: "Sum",
                color,
                datasetPath: keySum,
              },
            ],
          },
        ] as PartialPreset[])
      : []),
    ...(keyAverage
      ? [
          {
            scale,
            icon: IconTablerMathAvg,
            name: "Daily Average",
            title: `${title} Daily Average`,
            description: "",
            unit,
            bottom: [
              {
                title: "Average",
                color,
                datasetPath: keyAverage,
              },
            ],
          },
        ]
      : []),
    ...(keyMax || key90p || key75p || keyMedian || key25p || key10p || keyMin
      ? ([
          {
            scale,
            icon: IconTablerPercentage,
            name: "Daily Percentiles",
            title: `${title} Daily Percentiles`,
            description: "",
            unit,
            bottom: [
              ...(keyMax
                ? [
                    {
                      title: "Max",
                      color,
                      datasetPath: keyMax,
                    },
                  ]
                : []),
              ...(key90p
                ? [
                    {
                      title: "90%",
                      color,
                      datasetPath: key90p,
                    },
                  ]
                : []),
              ...(key75p
                ? [
                    {
                      title: "75%",
                      color,
                      datasetPath: key75p,
                    },
                  ]
                : []),
              ...(keyMedian
                ? [
                    {
                      title: "Median",
                      color,
                      datasetPath: keyMedian,
                    },
                  ]
                : []),
              ...(key25p
                ? [
                    {
                      title: "25%",
                      color,
                      datasetPath: key25p,
                    },
                  ]
                : []),
              ...(key10p
                ? [
                    {
                      title: "10%",
                      color,
                      datasetPath: key10p,
                    },
                  ]
                : []),
              ...(keyMin
                ? [
                    {
                      title: "Min",
                      color,
                      datasetPath: keyMin,
                    },
                  ]
                : []),
            ],
          },
        ] as PartialPreset[])
      : []),
    ...(keyMax
      ? ([
          {
            scale,
            icon: IconTablerArrowBarToUp,
            name: "Daily Max",
            title: `${title} Daily Max`,
            description: "",
            unit,
            bottom: [
              {
                title: "Max",
                color,
                datasetPath: keyMax,
              },
            ],
          },
        ] as PartialPreset[])
      : []),
    ...(key90p
      ? ([
          {
            scale,
            icon: IconTablerPercentage90,
            name: "Daily 90th Percentile",
            title: `${title} Daily 90th Percentile`,
            description: "",
            unit,
            bottom: [
              {
                title: "90%",
                color,
                datasetPath: key90p,
              },
            ],
          },
        ] as PartialPreset[])
      : []),
    ...(key75p
      ? ([
          {
            scale,
            icon: IconTablerPercentage75,
            name: "Daily 75th Percentile",
            title: `${title} Size 75th Percentile`,
            description: "",
            unit,
            bottom: [
              {
                title: "75%",
                color,
                datasetPath: key75p,
              },
            ],
          },
        ] as PartialPreset[])
      : []),
    ...(keyMedian
      ? ([
          {
            scale,
            icon: IconTablerPercentage50,
            name: "Daily Median",
            title: `${title} Daily Median`,
            description: "",
            unit,
            bottom: [
              {
                title: "Median",
                color,
                datasetPath: keyMedian,
              },
            ],
          },
        ] as PartialPreset[])
      : []),
    ...(key25p
      ? ([
          {
            scale,
            icon: IconTablerPercentage25,
            name: "Daily 25th Percentile",
            title: `${title} Daily 25th Percentile`,
            description: "",
            unit,
            bottom: [
              {
                title: "25%",
                color,
                datasetPath: key25p,
              },
            ],
          },
        ] as PartialPreset[])
      : []),
    ...(key10p
      ? ([
          {
            scale,
            icon: IconTablerPercentage10,
            name: "Daily 10th Percentile",
            title: `${title} Daily 10th Percentile`,
            description: "",
            unit,
            bottom: [
              {
                title: "10%",
                color,
                datasetPath: key10p,
              },
            ],
          },
        ] as PartialPreset[])
      : []),
    ...(keyMin
      ? ([
          {
            scale,
            icon: IconTablerArrowBarToDown,
            name: "Daily Min",
            title: `${title} Daily Min`,
            description: "",
            unit,
            bottom: [
              {
                title: "Min",
                color,
                datasetPath: keyMin,
              },
            ],
          },
        ] as PartialPreset[])
      : []),
  ];
}
