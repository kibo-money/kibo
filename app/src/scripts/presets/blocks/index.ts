import { colors } from "../../utils/colors";
import { applyMultipleSeries, SeriesType } from "../templates/multiple";

export function createPresets() {
  const scale: ResourceScale = "date";

  return {
    name: "Blocks",
    tree: [
      {
        scale,
        icon: IconTablerWall,
        name: "Height",
        title: "Block Height",
        description: "",
        applyPreset(params) {
          return applyMultipleSeries({
            ...params,
            priceScaleOptions: {
              halved: true,
            },
            list: [
              {
                title: "Height",
                color: colors.bitcoin,
                dataset: params.datasets.date.last_height,
              },
            ],
          });
        },
      },
      {
        scale,
        name: "Mined",
        tree: [
          {
            scale,
            icon: IconTablerCube,
            name: "Daily Sum",
            title: "Daily Sum Of Blocks Mined",
            description: "",
            applyPreset(params) {
              return applyMultipleSeries({
                ...params,
                priceScaleOptions: {
                  halved: true,
                },
                list: [
                  {
                    title: "Target",
                    color: colors.white,
                    dataset: params.datasets.date.blocks_mined_1d_target,
                    options: {
                      lineStyle: 3,
                      // lineStyle: LineStyle.LargeDashed,
                    },
                  },
                  {
                    title: "1W Avg.",
                    color: colors.momentumYellow,
                    dataset: params.datasets.date.blocks_mined_1w_sma,
                    defaultVisible: false,
                  },
                  {
                    title: "1M Avg.",
                    color: colors.bitcoin,
                    dataset: params.datasets.date.blocks_mined_1m_sma,
                  },
                  {
                    title: "Mined",
                    color: colors.darkBitcoin,
                    dataset: params.datasets.date.blocks_mined,
                  },
                ],
              });
            },
          },
          {
            scale,
            icon: IconTablerLetterW,
            name: "Weekly Sum",
            title: "Weekly Sum Of Blocks Mined",
            description: "",
            applyPreset(params) {
              return applyMultipleSeries({
                ...params,
                priceScaleOptions: {
                  halved: true,
                },
                list: [
                  {
                    title: "Target",
                    color: colors.white,
                    dataset: params.datasets.date.blocks_mined_1w_target,
                    options: {
                      lineStyle: 3,
                      // lineStyle: LineStyle.LargeDashed,
                    },
                  },
                  {
                    title: "Sum Mined",
                    color: colors.bitcoin,
                    dataset: params.datasets.date.blocks_mined_1w_sum,
                  },
                ],
              });
            },
          },
          {
            scale,
            icon: IconTablerLetterM,
            name: "Monthly Sum",
            title: "Monthly Sum Of Blocks Mined",
            description: "",
            applyPreset(params) {
              return applyMultipleSeries({
                ...params,
                priceScaleOptions: {
                  halved: true,
                },
                list: [
                  {
                    title: "Target",
                    color: colors.white,
                    dataset: params.datasets.date.blocks_mined_1m_target,
                    options: {
                      // lineStyle: LineStyle.LargeDashed,
                      lineStyle: 3,
                    },
                  },
                  {
                    title: "Sum Mined",
                    color: colors.bitcoin,
                    dataset: params.datasets.date.blocks_mined_1m_sum,
                  },
                ],
              });
            },
          },
          {
            scale,
            icon: IconTablerLetterY,
            name: "Yearly Sum",
            title: "Yearly Sum Of Blocks Mined",
            description: "",
            applyPreset(params) {
              return applyMultipleSeries({
                ...params,
                priceScaleOptions: {
                  halved: true,
                },
                list: [
                  {
                    title: "Target",
                    color: colors.white,
                    dataset: params.datasets.date.blocks_mined_1y_target,
                    options: {
                      lineStyle: 3,
                      // lineStyle: LineStyle.LargeDashed,
                    },
                  },
                  {
                    title: "Sum Mined",
                    color: colors.bitcoin,
                    dataset: params.datasets.date.blocks_mined_1y_sum,
                  },
                ],
              });
            },
          },
          {
            scale,
            icon: IconTablerWall,
            name: "Total",
            title: "Total Blocks Mined",
            description: "",
            applyPreset(params) {
              return applyMultipleSeries({
                ...params,
                priceScaleOptions: {
                  halved: true,
                },
                list: [
                  {
                    title: "Mined",
                    color: colors.bitcoin,
                    seriesType: SeriesType.Area,
                    dataset: params.datasets.date.total_blocks_mined,
                  },
                ],
              });
            },
          },
        ],
      },
      {
        scale,
        icon: IconTablerStack3,
        name: "Cumulative Size",
        title: "Cumulative Block Size",
        description: "",
        applyPreset(params) {
          return applyMultipleSeries({
            ...params,
            priceScaleOptions: {
              halved: true,
            },
            list: [
              {
                title: "Size (MB)",
                color: colors.darkWhite,
                seriesType: SeriesType.Area,
                dataset: params.datasets.date.cumulative_block_size,
              },
            ],
          });
        },
      },
    ],
  } satisfies PartialPresetFolder;
}
