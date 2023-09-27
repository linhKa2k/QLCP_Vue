import i18n from "@/lang";
const { t } = i18n.global;

const Position = [
  {
    dataIndex: "code",
    width: 200,
    isCodeIndex: true,
    fixed: "left",
  },
  {
    dataIndex: "name",
    width: 300,
  },
  {
    dataIndex: "is_cost_prediction",
    width: 300,
    dataType: "list",
    dataSource: [
      {
        value: true,
        text: t("positionGroup.is_cost_prediction.yes"),
      },
      {
        value: false,
        text: t("positionGroup.is_cost_prediction.no"),
      },
    ],
  },
  {
    width: 300,
    dataIndex: "name_of_department_id",
  },
  {
    width: 300,
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
];
export default Position;
