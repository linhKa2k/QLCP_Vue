import i18n from "@/lang";
const { t } = i18n.global;

const Invoice = {
  id: { type: "number" },
  type: { required: true },
  symbol: { required: true },
  code: { required: true },
  tax_code: { required: true },
  provider: { required: true },
  payment_type: { dataType: "number", defaultValue: 1 },
  invoice_date: { required: true, dataType: "date", type: "object" },
  address: {},
};

export default Invoice;
