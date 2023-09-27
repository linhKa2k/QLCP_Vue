const User = {
  username: {
    required: true,
    max: 255,
  },
  avatar_id: {},
  fullName: {
    max: 255,
  },
  phone_number: {
    min: 10,
    max: 15,
  },
  email: {
    max: 255,
  },
  password: {
    required: true,
    min: 8,
    trigger: "change",
  },
  confirm_password: { required: true, min: 8, trigger: "change" },
  roles: {
    // required: true,
    relationMultiple: "role",
    fieldRelation: "name",
  },
  activated: {
    dataType: "boolean",
    defaultValue: false,
  },
  entity_id: {},
  entity: {
    defaultValue: "admin",
  },
  description: {},
  del_flag: {},
  ins_date: {},
  roles: {
    relationMultiple: "role",
    type: "object",
    fieldRelation: "name",
  },
  departments: {
    // required: true,
    relationMultiple: "role",
    fieldRelation: "name",
  },
  bank_name: {},
  gender: {},
  bank_account_number: {},
  position: {},
  bank_location: {},
  department: {}
};
export default User;
