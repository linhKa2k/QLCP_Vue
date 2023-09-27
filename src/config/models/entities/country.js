const Country = {
  name: { required: true },
  code: { required: true },
  description: {},
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
};
export default Country;
