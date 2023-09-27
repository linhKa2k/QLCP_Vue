import i18n from "@/lang";
const { t } = i18n.global;
const Plan = [
  {
    width: 150,
    dataIndex: "code",
    isCodeIndex: true,
    fixed: "left",
  },
  {
    width: 300,
    dataIndex: "name",
    ellipsis: true
  },
  {
    width: 250,
    dataIndex: "status",
    dataType: "list",
    dataSource: [
      {
        value: 1,
        text: t("plan.status.1"),
      },
      {
        value: 2,
        text: t("plan.status.2"),
      },
      {
        value: 3,
        text: t("plan.status.3"),
      },
      {
        value: 4,
        text: t("plan.status.4"),
      },
      {
        value: 5,
        text: t("plan.status.5"),
      },
      {
        value: 6,
        text: t("plan.status.6"),
      },
      {
        value: 7,
        text: t("plan.status.7"),
      },
      {
        value: 8,
        text: t("plan.status.8"),
      },
      {
        value: 9,
        text: t("plan.status.9"),
      },
      {
        value: 10,
        text: t("plan.status.10"),
      },
    ],
  },
  {
    width: 180,
    dataIndex: "start_time",
    dataType: "date",
  },
  {
    width: 180,
    dataIndex: "end_time",
    dataType: "date",
  },
  {
    width: 180,
    dataIndex: "is_add",
    dataType: "list",
    dataSource: [
      {
        value: true,
        text: t("Kế hoạch bổ sung"),
      },
      {
        value: false,
        text: t("Kế hoạch gốc"),
      },
    ],
  },
  {
    width: 300,
    dataIndex: "name_of_parent_id",
  },
  {
    width: 200,
    dataIndex: "name_of_purpose_id",
  },
  {
    width: 200,
    dataIndex: "type",
    dataType: "list",
    dataSource: [
      {
        value: 1,
        text: t("plan.type.1"),
      },
      {
        value: 2,
        text: t("plan.type.2"),
      },
    ],
  },
  {
    width: 250,
    dataIndex: "name_of_department_require_id",
  },
  {
    width: 200,
    dataIndex: "name_of_user_require_id",
  },
  {
    width: 250,
    dataIndex: "name_of_department_process_id",
  },
  {
    width: 200,
    dataIndex: "name_of_user_process_id",
  },
  
  
];
export default Plan;
