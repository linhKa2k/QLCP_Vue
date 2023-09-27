const PositionGroup = {
  name: { required: true },
  code: {},
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
  description: {},
  department_id: {
    relation: "department",
    fieldRelation: "name",
    type: "object",
  },
  positions: {
    dataType: "array",
    dataRelation: ["position"],
  },
  is_cost_prediction: { dataType: "bool", defaultValue: true },
};
export default PositionGroup;
