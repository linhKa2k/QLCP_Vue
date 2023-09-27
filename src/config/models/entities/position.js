const Position = {
    name: { required: true },
    code: { required: true },
    position_group_id: {
      required: true,
      relation: "position_group",
      type: "object",
      fieldRelation: "name",
    },
    is_active: {
      dataType: "bool",
      defaultValue: true,
    },
    description: {},
  };
  export default Position;
  