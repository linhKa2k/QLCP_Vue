import i18n from "@/lang";
const { t } = i18n.global;

const TransferRequest = {
  name: { required: true },
  code: {},
  created_time:{},
  request_amount:{},
  amount:{
    dataType:'number'
  },
  status:{},
  transfer_request_item: {
    dataType: "array",
   
  },
};

export default TransferRequest;
