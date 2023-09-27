const Role = {
  code: {},
  name: {
    required: true,
    max: 255,
  },
  description: {},
  role_has_permission: {
    dataType: "array",
  },
  role: {},
  is_active: {
    dataType: "number",
    defaultValue: 1,
  },
  guard_name: {},
  group: {},
  ins_id: {},
  upd_id: {},
};
export default Role;
