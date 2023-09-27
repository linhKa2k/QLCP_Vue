const ServiceGroup = {
  name: { required: true },
  code: {},
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
  description: {},
  start_date: { required: true, dataType: "date", type: "object" },
  end_date: { required: true, dataType: "date", type: "object" },
  type: {
    dataType: "number",
    // defaultValue: 1,
  },
  is_default: {
    dataType: "bool",
    defaultValue: false,
  },
};
export default ServiceGroup;
