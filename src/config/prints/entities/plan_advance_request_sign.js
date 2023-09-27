import i18n from "@/lang";
const { t } = i18n.global;

const AdvanceRequest = {
  title: "Đề nghị tạm ứng",
  fileName: "de_nghi_tam_ung.pdf",
  content: "/template/planAdvanceRequestSign.html",
  fields: [
    {
      dataIndex: "user_request",
    },
    {
      dataIndex: "user_department",
    },
    {
      dataIndex: "user_department_upper",
    },
    {
      dataIndex: "plan_code",
    },
    {
      dataIndex: "total_pay",
      dataType: "currency",
    },
    {
      dataIndex: "total_letter",
    },
    {
      dataIndex: "date_now",
      dataType: "date",
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
      dataIndex: "table",
      dataType: "table",
      columns: [
        {
          dataIndex: "STT",
        },
        {
          dataIndex: "user_department",
        },
        {
          dataIndex: "description",
        },
        {
          dataIndex: "name",
        },
        {
          dataIndex: "account_number",
        },
        {
          dataIndex: "bank",
        },
        {
          dataIndex: "amount",
          dataType: "currency",
        },
        {
          dataIndex: "sap_debt",
        },
        {
          dataIndex: "BP_code",
        },
        {
          dataIndex: "cost_center",
        },
        {
          dataIndex: "prof_center",
        },
      ],
    },
  ],
};
export default AdvanceRequest;
