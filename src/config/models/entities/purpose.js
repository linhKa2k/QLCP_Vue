const Purpose = {
  code: {},
  name: { required: true },
  description: {},
  end_time: { required: true, dataType: "date", type: "object" },
  start_time: { required: true, dataType: "date", type: "object" },
  ins_id: {},
  upd_id: {},
  is_active: {
    dataType: "number",
    defaultValue: 1,
  },
  // service_group_id: {
  //   relation: "service_group",
  //   type: "object",
  //   fieldRelation: "name",
  // },
  is_cost: {
    dataType: "bool",
    defaultValue: true,
  },
  purpose_service_group: { dataType: "array", dataRelation: ["service_group"] },
};
export default Purpose;
