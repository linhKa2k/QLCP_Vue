import i18n from "@/lang";
const { t } = i18n.global;

const AirportQuota = [
  {
    width: 200,
    dataIndex: "code",
    isCodeIndex: true,
    fixed: "left",
  },
  {
    width: 250,
    dataIndex: "name_of_airport_id",
  },
  {
    width: 220,
    dataIndex: "name_of_province_id",
  },
  {
    width: 150,
    dataIndex: "amount",
    dataType: "currency",
  },
  {
    width: 200,
    dataIndex: "start_date",
    dataType: "date",
  },
  {
    width: 200,
    dataIndex: "end_date",
    dataType: "date",
  },
  {
    width: 220,
    dataIndex: "is_active",
    dataType: "bool",
    dataSource: [
      {
        value: true,
        text: t("common.active"),
      },
      {
        value: false,
        text: t("common.inactive"),
      },
    ],
  },
];
export default AirportQuota;
