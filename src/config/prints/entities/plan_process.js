import i18n from "@/lang";
const { t } = i18n.global;

const PlanProcess = {
  title: "Kế hoạch công tác",
  fileName: "ke_hoach_cong_tac.pdf",
  content: "/template/planProcess.html",
  fields: [
    {
      dataIndex: "name_of_plan",
    },
    {
      dataIndex: "day_now",
    },
    {
      dataIndex: "month_now",
    },
    {
      dataIndex: "year_now",
    },
    {
      dataIndex: "address_business_list",
      dataType: "list_custom",
      dataCustom: {
        department: "Đơn vị",
        address: "Địa chỉ",
        style: { department: { card: "h3" } },
      },
    },
    // {
    //   dataIndex: "department_process",
    // },
    // {
    //   dataIndex: "address1",
    // },
    // {
    //   dataIndex: "address2",
    // },
    // {
    //   dataIndex: "department_require",
    // },
    {
      dataIndex: "start_time",
      dataType: "date",
    },
    {
      dataIndex: "end_time",
      dataType: "date",
    },
    {
      dataIndex: "description",
    },
    {
      dataIndex: "table",
      dataType: "table",
      columns: [
        {
          dataIndex: "STT",
        },
        {
          dataIndex: "department_user",
        },
        {
          dataIndex: "code",
        },
        {
          dataIndex: "name",
        },
        {
          dataIndex: "start_time",
          dataType: "date",
        },
        {
          dataIndex: "end_time",
          dataType: "date",
        },
        {
          dataIndex: "business_total_day",
        },
      ],
    },
  ],
};
export default PlanProcess;
