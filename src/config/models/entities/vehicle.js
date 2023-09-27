const Vehicle = {
  name: { required: true },
  code: {},
  vehicle_group_id: {
    required: true,
    relation: "vehicle_group",
    type: "object",
    fieldRelation: "name",
  },
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
  description: {},
};
export default Vehicle;
