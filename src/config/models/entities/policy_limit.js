const PolicyLimit = {
  code: {},
  name: {},
  type: { dataType: "number", defaultValue: 1 },

  position_group_id: {
    relation: "position_group",
    type: "object",
    fieldRelation: "name",
    // required: true,
  },
  service_group_id: {
    relation: "service_group",
    type: "object",
    fieldRelation: "name",
    required: true,
  },
  vehicle_group_id: {
    relation: "vehicle_group",
    type: "object",
    fieldRelation: "name",
    required: true,
  },
  vehicle_id: {
    relation: "vehicle",
    type: "object",
    fieldRelation: "name",
  },
  service_id: {
    relation: "service",
    type: "object",
    fieldRelation: "name",
  },
  amount: {
    dataType: "number",
    defaultValue: 0,
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
  limit_amount: { required: true, type: "number" },
  start_time: { required: true, dataType: "date", type: "object" },
  end_time: { required: true, dataType: "date", type: "object" },
};
export default PolicyLimit;
