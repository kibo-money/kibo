import { colors } from "../../utils/colors";

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
        bottom: [
          {
            title: "Height",
            color: colors.bitcoin,
            datasetPath: `/date-to-last-height`,
          },
        ],
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
            bottom: [
              {
                title: "Target",
                color: colors.white,
                datasetPath: `/date-to-blocks-mined-1d-target`,
                options: {
                  lineStyle: 3,
                },
              },
              {
                title: "1W Avg.",
                color: colors.momentumYellow,
                datasetPath: `/date-to-blocks-mined-1w-sma`,
                defaultVisible: false,
              },
              {
                title: "1M Avg.",
                color: colors.bitcoin,
                datasetPath: `/date-to-blocks-mined-1m-sma`,
              },
              {
                title: "Mined",
                color: colors.darkBitcoin,
                datasetPath: `/date-to-blocks-mined`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerLetterW,
            name: "Weekly Sum",
            title: "Weekly Sum Of Blocks Mined",
            description: "",
            bottom: [
              {
                title: "Target",
                color: colors.white,
                datasetPath: `/date-to-blocks-mined-1w-target`,
                options: {
                  lineStyle: 3,
                },
              },
              {
                title: "Sum Mined",
                color: colors.bitcoin,
                datasetPath: `/date-to-blocks-mined-1w-sum`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerLetterM,
            name: "Monthly Sum",
            title: "Monthly Sum Of Blocks Mined",
            description: "",
            bottom: [
              {
                title: "Target",
                color: colors.white,
                datasetPath: `/date-to-blocks-mined-1m-target`,
                options: {
                  lineStyle: 3,
                },
              },
              {
                title: "Sum Mined",
                color: colors.bitcoin,
                datasetPath: `/date-to-blocks-mined-1m-sum`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerLetterY,
            name: "Yearly Sum",
            title: "Yearly Sum Of Blocks Mined",
            description: "",
            bottom: [
              {
                title: "Target",
                color: colors.white,
                datasetPath: `/date-to-blocks-mined-1y-target`,
                options: {
                  lineStyle: 3,
                },
              },
              {
                title: "Sum Mined",
                color: colors.bitcoin,
                datasetPath: `/date-to-blocks-mined-1y-sum`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerWall,
            name: "Total",
            title: "Total Blocks Mined",
            description: "",
            bottom: [
              {
                title: "Mined",
                color: colors.bitcoin,
                datasetPath: `/date-to-total-blocks-mined`,
              },
            ],
          },
        ],
      },
      {
        scale,
        icon: IconTablerStack3,
        name: "Cumulative Size",
        title: "Cumulative Block Size",
        description: "",
        bottom: [
          {
            title: "Size (MB)",
            color: colors.darkWhite,
            datasetPath: `/date-to-cumulative-block-size`,
          },
        ],
      },
    ],
  } satisfies PartialPresetFolder;
}
