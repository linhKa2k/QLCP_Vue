import i18n from "@/lang";
const { t } = i18n.global;

const VofficeSign = {
  title: "De nghi chuyển khoản các khoản bị sai thông tin tài khoản",
  fileName: "de_nghi_chuyen_khoan_cac_khoan_sai_thong_tin_tai_khoan.pdf",
  content: "/template/advanceRequestTransferInfo.html",
  fields: [
    //header
    {
      dataIndex: "created_at",
      dataType: "date",
    },
    {
      dataIndex: "reason",
    },
    {
      dataIndex: "before_code",
    },
    {
      dataIndex: "plan_code",
    },
    {
      dataIndex: "department_require",
    },
    {
      dataIndex: "user_synthetic",
    },
    // table info transfer before
    {
      dataIndex: "name_bank_acount",
    },
    {
      dataIndex: "acount_number",
    },
    {
      dataIndex: "bank",
    },
    {
      dataIndex: "send_content",
    },
    {
      dataIndex: "amount",
      dataType: "currency",
    },
    // after
    {
      dataIndex: "name_bank_acount_diff",
    },
    { dataIndex: "acount_number_diff" },
    {
      dataIndex: "bank_diff",
    },
    {
      dataIndex: "reason_change",
    },
    {
      dataIndex: "file_proof",
    },
    {
      dataIndex: "total_amount",
    },
    {
      dataIndex: "total_amount_letter",
    },
    // table data right
    {
      dataIndex: "staff_code",
    },
    {
      dataIndex: "staff_name",
    },
    {
      dataIndex: "CN_code",
    },
    {
      dataIndex: "give_back_date",
    },
    {
      dataIndex: "account_debt",
    },
    {
      dataIndex: "total_profit",
    },
  ],
};
export default VofficeSign;
