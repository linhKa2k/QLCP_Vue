import i18n from "@/lang";
const { t } = i18n.global;

const HotelQuota = [
  {
    dataIndex: "code",
    width: 200,
    isCodeIndex: true,
    fixed: "left",
  },
  {
    width: 250,
    dataIndex: "type",
    dataType: "bool",
    dataSource: [
      {
        value: 1,
        text: t("hotelQuota.type.1"),
      },
      {
        value: 2,
        text: t("hotelQuota.type.2"),
      },
    ],
  },
  {
    width: 250,
    dataIndex: "name_of_position_group_id",
  },
  {
    width: 250,
    dataIndex: "name_of_service_id",
  },
  {
    width: 250,
    dataIndex: "name_of_province_id",
  },
  {
    width: 250,
    dataIndex: "name_of_district_id",
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
    width: 250,
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
export default HotelQuota;
