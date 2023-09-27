const Ward = {
  name: { required: true },
  type: {
    dataType: "number",
    defaultValue: 1,
  },
  code: { },
  location: {},
  province_id: {
    relation: "province",
    relationDeep1:"district",
    required: true,
    type: "object",
    fieldRelation: "name",
    deep:1
  },
  country_id: {
    relation: "country",
    relationDeep1:"district",
    relationDeep2:"province",
    required: true,
    type: "object",
    fieldRelation: "name",
    deep:2
  },
  district_id: {
    relation: "district",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  name_of_district_id: {},
  name_of_province_id: {},
  name_of_country_id: {},
  is_active: { dataType: "bool", defaultValue: true },
};
export default Ward;
