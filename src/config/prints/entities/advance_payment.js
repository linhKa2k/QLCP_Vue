import i18n from "@/lang";
const { t } = i18n.global;

const AdvancePayment = {
  title: "Đề nghị chi/ Hoàn ứng",
  fileName: "de_nghi_chi_hoan_ung.pdf",
  content: "/template/advancePayment.html",
  fields: [
    {
      dataIndex: "title",
    },
    {
      dataIndex: "code",
    },
    {
      dataIndex: "full_name",
    },
    {
      dataIndex: "department_business",
    },
    {
      dataIndex: "content_business",
    },
    //
    {
      dataIndex: "advance_amount",
      dataType: "currency",
    },
    {
      dataIndex: "cost_used_amount",
      dataType: "currency",
    },
    {
      dataIndex: "diff_amount",
      dataType: "currency",
    },
    {
      dataIndex: "advance_cost_not_used_up",
      dataType: "currency",
    },
    {
      dataIndex: "expenses_over_advance",
      dataType: "currency",
    },
    {
      dataIndex: "total_letter",
    },
    //
    {
      dataIndex: "day_now",
    },
    {
      dataIndex: "month_now",
    },
    {
      dataIndex: "year_now",
    },
  ],
};
export default AdvancePayment;
