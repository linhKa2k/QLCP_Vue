import i18n from "@/lang";
const { t } = i18n.global;

const planAppendix = {
  title: "Phụ lục chi phí công tác",
  content: "/template/planAppendix.html",
  fileName: "phu_luc_chi_phi_cong_tac.pdf",
  fields: [
    {
      dataIndex: "total_amount_final",
      dataType: "currency",
    },
    {
      dataIndex: "table",
      dataType: "table",
      parent: true,
      columns: [
        {
          dataIndex: "STT",
        },
        {
          dataIndex: "content",
        },
        {
          dataIndex: "quantity",
          dataType: "number",
        },
        {
          dataIndex: "limit_amount",
          dataType: "currency",
        },
        {
          dataIndex: "total_amount",
          dataType: "currency",
        },
      ],
    },
  ],
};

export default planAppendix;
