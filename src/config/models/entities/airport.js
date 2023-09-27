const Airport = {
  code: {},
  name: {
    required: true,
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
  description: {},
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },

  one_way_amount: {},
  two_way_amount: {},
  name_of_province_id: {},
  name_of_country_id: {},
  district_id: {},
  ward_id: {},
};
export default Airport;
