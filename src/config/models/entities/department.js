const Department = {
  code: {},
  name: {
    required: true,
  },
  description: {},
  parent_id: {},
  address: {},
  phone: { dataType: "number", max: 10, defaultValue: "" },
  partner_department_id: {},
  is_active: { dataType: "bool", defaultValue: true },
  ward_id: {
    relation: "ward",
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
  province_id: {
    relation: "province",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  country_id: {
    relation: "country",
    required: true,
    type: "object",
    fieldRelation: "name",
    defaultValue: "VN",
  },
  branch_id: {
    relation: "branch",
    type: "object",
    fieldRelation: "name",
  },
};
export default Department;
