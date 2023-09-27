const Area = {
  code: { required: true },
  name: { required: true },
  description: {},
  ins_id: {},
  upd_id: {},
  is_active: {
    dataType: "number",
    defaultValue: 1,
  },
  area_id: {
    relation: "area",
    type: "object",
    fieldRelation: "name",
  },
};
export default Area;
