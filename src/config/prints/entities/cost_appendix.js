import i18n from "@/lang";
const { t } = i18n.global;

const CostAppendix = {
  title: "Phụ lục chi phí công tác",
  fileName: "phu_luc_chi_phi_cong_tac.pdf",
  content: "/template/costAppendix.html",
  fields: [
    {
      dataIndex: "description",
    },
    {
      dataIndex: "created_at",
      dataType: "datetime",
    },
    {
      dataIndex: "total_cost_amount_final",
      dataType: "currency",
    },
    {
      dataIndex: "cost_body",
      dataType: "table",
      parent: true,
      columns: [
        {
          dataIndex: "STT",
          dataType: "number",
        },
        {
          dataIndex: "content",
        },
        {
          dataIndex: "quantity",
        },
        {
          dataIndex: "limit_amount",
        },
        {
          dataIndex: "total_amount",
          dataType: "currency",
        },
      ],
    },
    {
      dataIndex: "invoice_list_body",
      dataType: "table",
      columns: [
        {
          dataIndex: "STT",
          dataType: "number",
        },
        {
          dataIndex: "user_pay",
        },
        {
          dataIndex: "code",
        },
        {
          dataIndex: "symbol",
        },
        {
          dataIndex: "invoice_date",
          dataType: "date",
        },
        {
          dataIndex: "tax_code",
        },
        {
          dataIndex: "provider",
        },
        {
          dataIndex: "total_final_amount",
          dataType: "currency",
        },
      ],
    },
  ],
};
export default CostAppendix;
