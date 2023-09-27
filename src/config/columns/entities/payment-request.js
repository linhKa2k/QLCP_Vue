import i18n from "@/lang";
const { t } = i18n.global;
const PaymentRequest = [
  {
    width: 200,
    dataIndex: "code",
  },
  {
    width: 200,
    dataIndex: "name",
  },
  {
    width: 200,
    dataIndex: "expired_time",
  },
  {
    width: 200,
    dataIndex: "total_amount",
  },
  {
    width: 200,
    dataIndex: "status",
  },
];
export default PaymentRequest;
