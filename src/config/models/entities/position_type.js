const PositionType = {
  name: { required: true },
  code: { required: true },
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
  description: {},
  start_date: { required: true, dataType: "date", type: "object" },
  end_date: { required: true, dataType: "date", type: "object" },
};
export default PositionType;
