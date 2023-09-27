import Default from "../../../common/DefaultData";

const LivingQuota = {
  code: {},
  name: {},
  type: { dataType: "number", defaultValue: 1 },

  service_group_id: {
    relation: "service_group",
    type: "object",
    fieldRelation: "name",
    required: true,
  },
  service_group: {
    objectRelation: "service_group",
    dataType: "object",
    objectDefault: Default.categoryDefault.vietNamCountry,
    fieldLabel: "name",
  },
  service_id: {
    relation: "service",
    type: "object",
    fieldRelation: "name",
  },
  amount: {
    type: "number",
    required: true,
  },
  description: {},
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
  country_id: {
    relation: "country",
    type: "object",
    fieldRelation: "name",
  },
  country: {
    objectRelation: "country",
    dataType: "object",
    objectDefault: Default.categoryDefault.vietNamCountry,
    fieldLabel: "name",
    required: true,
    type: "object",
  },
  start_date: { required: true, dataType: "date", type: "object" },
  end_date: { required: true, dataType: "date", type: "object" },
};
export default LivingQuota;
