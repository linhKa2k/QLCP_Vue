import i18n from "@/lang";
const { t } = i18n.global;

const RequestConfirmation = {
  title: "Đề nghi xác nhận kết thúc công tác",
  fileName: "de_nghi_xac_nhan_ket_thuc_cong_tac.pdf",
  content: "/template/requestConfirmation.html",
  fields: [
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
      dataIndex: "body",
      dataType: "table",
      columns: [
        {
          dataIndex: "STT",
        },
        {
          dataIndex: "department_user_name",
        },
        {
          dataIndex: "code",
        },
        {
          dataIndex: "full_name",
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
    //   dataIndex: "from_department",
    // },
    // {
    //   dataIndex: "from_address",
    // },
    // {
    //   dataIndex: "to_department",
    // },
    // {
    //   dataIndex: "to_address",
    // },
    {
      dataIndex: "content",
    },
    {
      dataIndex: "result",
    },
    {
      dataIndex: "propose",
    },
  ],
};
export default RequestConfirmation;
