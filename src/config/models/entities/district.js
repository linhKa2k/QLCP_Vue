const District = {
  name: { required: true },
  type: {
    dataType: "number",
    defaultValue: 2,
  },
  code: {
    required: true
  },
  province_id: {
    relation: "province",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  country_id: {
    relation: "country",
    relationDeep1: "province",
    required: true,
    type: "object",
    fieldRelation: "name",
    deep: 1,
  },
  location: {},
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
};
export default District;
