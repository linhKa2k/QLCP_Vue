import i18n from "@/lang";
const { t } = i18n.global;

const planConfirm = {
  id: { type: "number" },
  name: {},
  code: {},
  plan_route_id: {
    relation: "plan_route",
    type: "object",
    fieldRelation: "name",
  },
  plan_id: {
    relation: "plan",
    type: "object",
    fieldRelation: "name",
  },
  plan_confirm_user: {},
  status: {},
  from_province: {},
  to_province: {},
  from_district: {},
  to_district: {},
  vehicle: {},

  // plan: {},
  department_require_id: {
    relation: "department_require",
    type: "object",
    fieldRelation: "name",
  },
  user_require_id: {
    relation: "user_require",
    type: "object",
    fieldRelation: "fullName",
  },
  start_time: { dataType: "date", type: "object" },
  end_time: { dataType: "date", type: "object" },
};

export default planConfirm;
