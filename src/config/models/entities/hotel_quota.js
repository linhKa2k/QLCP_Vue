import Default from "../../../common/DefaultData";

const HotelQuota = {
  code: {},
  name: {},
  type: { dataType: "number", defaultValue: 1 },

  position_group_id: {
    relation: "position_group",
    type: "object",
    fieldRelation: "name",
    required: true,
  },
  service_group_id: {
    relation: "service_group",
    type: "object",
    fieldRelation: "name",
  },
  service_group: {
    objectRelation: "service_group",
    dataType: "object",
    objectDefault: Default.categoryDefault.phongNghiServiceGroup,
    fieldLabel: "name",
  },
  country: {
    objectRelation: "country",
    dataType: "object",
    objectDefault: Default.categoryDefault.vietNamCountry,
    fieldLabel: "name",
  },
  service_id: {
    relation: "service",
    type: "object",
    fieldRelation: "name",
    required: true,
  },
  description: {},
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
  country_id: {
    relation: "country",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  province_id: {
    relation: "province",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  district_id: {
    relation: "district",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  ward_id: {},
  amount: {
    type: "number",
    required: true,
  },
  amount_month: {
    type: "number",
    required: true,
  },
  single_room_amount: { type: "number", required: true },
  
  single_daily_amount: {},
  double_daily_amount: {},
  monthly_amount: {},
  start_date: { required: true, dataType: "date", type: "object" },
  end_date: { required: true, dataType: "date", type: "object" },
};
export default HotelQuota;
