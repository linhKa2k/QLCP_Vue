import i18n from "@/lang";
const { t } = i18n.global;
import constant from "../../../constant";
const SummaryRequest = [
  {
    width: 250,
    dataIndex: "code",
    // isCodeIndex: true,
    fixed: "left",
  },
  {
    width: 250,
    dataIndex: "payment_name",
    dataType:'string'
  },
  {
    width: 250,
    dataIndex: "transfer_request_name",
    dataType:'string'
  },
  {
    width: 200,
    dataIndex: "account_number",
    dataType:'string'
  },
  // {
  //   width: 250,
  //   dataIndex: "name",
  // },
  {
    width: 300,
    dataIndex: "status",
    dataType: "list",
    dataSource: [
      {
        value: constant.summaryStatus.DA_PHE_DUYET,
        text: t("Đã phê duyệt"),
      },
      {
        value: constant.summaryStatus.TAO_BANG,
        text: t("Tạo bảng tổng hợp chuyển khoản"),
      },
      {
        value: constant.summaryStatus.CHO_DUYET_BANG,
        text: t("Chờ duyệt bảng tổng hợp chuyển khoản"),
      },
      {
        value: constant.summaryStatus.DA_PHE_DUYET_BANG,
        text: t("Đã phê duyệt bảng tổng hợp chuyển khoản"),
      },
      {
        value: constant.summaryStatus.TU_CHOI_BANG,
        text: t("Từ chối bảng tổng hợp chuyển khoản"),
      },
      {
        value: constant.summaryStatus.KE_TOAN_TU_CHOI,
        text: t("Kế toán ngân hàng từ chối"),
      },
      {
        value: constant.summaryStatus.HOAN_THANH_CHI,
        text: t("Đã hoàn thành chi"),
      },
      {
        value: constant.summaryStatus.CHUYEN_KHOAN_LOI,
        text: t("Chi thất bại"),
      
      },
      {
        value: constant.summaryStatus.DANG_XU_LY_CHI_TIEN,
        text: t("Đang xử lý chi tiền"),
      },
      
    ],
  },
  {
    width: 200,
    dataIndex: "full_name",
  },
  {
    width: 200,
    dataIndex: "bank_name",
  },
  {
    width: 200,
    dataIndex: "bank_account_number",
  },
  {
    width: 350,
    dataIndex: "content_sms",
  },
  {
    width: 350,
    dataIndex: "content",
  },
  // {
  //   width: 200,
  //   dataIndex: "date_request",
  //   dataType:'date'
  // },
  {
    width: 200,
    dataIndex: "total_amount",
    dataType:'number'
  },
  {
    width: 200,
    dataIndex: "reason",
    dataType:'string'
  },
  {
    width: 200,
    dataIndex: "import_error",
    dataType:'string'
  },
];
export default SummaryRequest;
