import Default from "../../../common/DefaultData";

const MovingQuota = {
  code: { required: true },
  name: { required: true },
  type: { dataType: "number", defaultValue: 1 },
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
    required: true,
    type: "object",
    fieldRelation: "name",
  },

  country: {
    objectRelation: "country",
    dataType: "object",
    objectDefault: Default.categoryDefault.vietNamCountry,
    fieldLabel: "name",
  },
  start_time: { required: true, dataType: "date", type: "object" },
  end_time: { required: true, dataType: "date", type: "object" },
  from_distance: { required: true, type: "number" },
  to_distance: { required: true, type: "number" },
};
export default MovingQuota;
