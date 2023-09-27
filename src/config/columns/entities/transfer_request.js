import i18n from "@/lang";
const { t } = i18n.global;
import constant from "../../../constant";
const TransferRequest = [
  {
    width: 200,
    dataIndex: "code",
    isCodeIndex: true,
    fixed: "left",
  },
  {
    width: 200,
    dataIndex: "name",
  },
  {
    width: 200,
    dataIndex: "created_time",
    dataType:'date',
  },
  {
    width: 200,
    dataIndex: "request_amount",
  },
  {
    width: 200,
    dataIndex: "amount",
    dataType:'number'
  },
  {
    width: 300,
    dataIndex: "status",
    dataType:'list',
    dataSource:[
      {
        value: constant.transferRequestStatus.CHUA_TRINH_KY,
        text: "Chưa trình ký",
      },
      {
        value: constant.transferRequestStatus.CHO_PHE_DUYET,
        text: "Chờ phê duyệt",
      },
      {
        value: constant.transferRequestStatus.DA_PHE_DUYET,
        text: "Đã phê duyệt",
      },
      {
        value: constant.transferRequestStatus.TU_CHOI,
        text: "Từ chối phê duyệt",
      },
      {
        value: constant.transferRequestStatus.DA_CAP_NHAT,
        text: "Đã cập nhật trạng thái chuyển khoản",
      },
    ]
  },

  {
    width: 200,
    dataIndex: "ins_date",
    dataType:"datetime"
  },

  {
    width: 200,
    dataIndex: "ins_id",
  },



];
export default TransferRequest;
