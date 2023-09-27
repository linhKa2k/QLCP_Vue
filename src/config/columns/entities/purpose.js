import i18n from "@/lang";
const { t } = i18n.global;

const Purpose = [
  {
    width: 250,
    dataIndex: "code",
    isCodeIndex: true,
    fixed: "left",
  },
  {
    width: 350,
    dataIndex: "name",
  },
  {
    width: 250,
    dataIndex: "is_cost",
    dataType: "bool",
    dataSource: [
      {
        value: true,
        text: "Có",
      },
      {
        value: false,
        text: "Không",
      },
    ],
  },
  {
    width: 450,
    dataIndex: "purpose_service_group",
    dataType: "multiple-list",
    field: "service_group",
    ellipsis: true,
  },
  {
    width: 200,
    dataIndex: "is_active",
    dataType: "bool",
    dataSource: [
      {
        value: true,
        text: t("common.active"),
      },
      {
        value: false,
        text: t("common.inactive"),
      },
    ],
  },
  // {
  //   width: 200,
  //   dataIndex: "start_time",
  // },

  // {
  //   width: 200,
  //   dataIndex: "end_time",
  // },
];
export default Purpose;
