import i18n from "@/lang";
const { t } = i18n.global;

const VofficeSignTransferRequest = {
  title: "Giấy đề nghị chuyển tiền",
  fileName: "de_nghi_chuyen_tien.pdf",
  content: "/template/vofficeSignTransferRequest.html",
  fields: [
    {
      dataIndex: "date",
    },
    {
      dataIndex: "user",
    },
    {
      dataIndex: "table",
      dataType: "table",
      columns: [
        { dataIndex: "key" },
        { dataIndex: "department_required" },
        { dataIndex: "description" },
        { dataIndex: "full_name"},
        { dataIndex: "bank_account_number" },
        { dataIndex: "bank_name" },
        { dataIndex: "amount", dataType: "currency" },
      ],
    },
    // {
    //   dataIndex: "created_at",
    //   dataType: "datetime",
    // },
    // {
    //   dataIndex: "name",
    //   dataType: "table",
    //   columns: [],
    // },
  ],
};
export default VofficeSignTransferRequest;
