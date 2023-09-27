import i18n from "@/lang";
const { t } = i18n.global;

const UNC = {
  title: "ỦY NHIỆM CHI",
  fileName: "uy_nhiem_chi.pdf",
  content: "/template/UNC.html",
  fields: [
    {
      dataIndex: "date",
    },

    {
      dataIndex: "total_amount_text",
    },
    {
      dataIndex: "total_amount",
    },
    {
      dataIndex: "year",
    },
  
  ],
};
export default UNC;
