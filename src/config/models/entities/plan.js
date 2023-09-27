import i18n from "@/lang";
const { t } = i18n.global;
const Plan = {
  id: { type: "number" },
  name: { required: true },
  code: {},
  parent_id: {
    relation: "parent",
    type: "object",
    fieldRelation: "name",
    required: true,
  },
  purpose_id: {
    relation: "purpose",
    type: "object",
    fieldRelation: "name",
    required: true,
  },
  department_require_id: {
    relation: "department_require",
    type: "object",
    fieldRelation: "name",
  },
  department_process_id: {
    relation: "department_process",
    type: "object",
    fieldRelation: "name",
    required: true,
  },
  user_require_id: {
    relation: "user_require",
    type: "object",
    fieldRelation: "fullName",
  },
  user_process_id: {
    relation: "user_process",
    type: "object",
    fieldRelation: "fullName",
    required: true,
  },
  start_time: { required: true, dataType: "date", type: "object" },
  end_time: { required: true, dataType: "date", type: "object" },
  is_add: {
    dataType: "bool",
    defaultValue: false,
  },
  description: { required: true },
  note: { required: true },
  status: {},
  type: { dataType: "number", defaultValue: 1 },
};

export default Plan;
