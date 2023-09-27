const AirportQuota = {
  code: {},
  name: { required: true },
  type: { dataType: "number", defaultValue: 1 },
  province_id: {
    relation: "province",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  airport_id: {
    relation: "airport",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  name_of_province_id: {},
  name_of_airport_id: {},
  amount: { required: true, type: "number" },
  description: {},
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
  start_date: { required: true, dataType: "date", type: "object" },
  end_date: { required: true, dataType: "date", type: "object" },
};
export default AirportQuota;
