import i18n from "@/lang";
const { t } = i18n.global;

const SummaryRequest = {
  name: { required: true },
  code: {},
  full_name: {},
  content_sms: {},
  content: {},
  created_time: {},
  bank_name:{},
  bank_account_number:{},
  amount: {},
  status:{
    dataType: "number", defaultValue: 1
  },
  description: {},
  transfer_request_name:{},
  account_number:{},
};

export default SummaryRequest;
