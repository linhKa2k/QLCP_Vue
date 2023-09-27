const Service = {
  name: { required: true },
  code: {},
  service_group_id: {
    relation: "service_group",
    type: "object",
    fieldRelation: "name",
  },
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
  description: {},
  start_date: { dataType: "date", type: "object" },
  end_date: { dataType: "date", type: "object" },
};
export default Service;
