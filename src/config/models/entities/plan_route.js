import i18n from "@/lang";
const { t } = i18n.global;

const PlanRoute = {
  id: {},
  name: {},
  code: {},
  from_department_id: {
    relation: "from_department",
    type: "object",
    fieldRelation: "name",
    required: true,
  },
  to_department_id: {
    relation: "to_department",
    type: "object",
    fieldRelation: "name",
    required: true,
  },

  from_country_id: {
    required: true,
    type: "object",
    relation: "from_country",
    fieldRelation: "name",
  },
  to_country_id: {
    required: true,
    type: "object",
    relation: "to_country",
    fieldRelation: "name",
  },
  from_province_id: {
    required: true,
    type: "object",
    relation: "from_province",
    fieldRelation: "name",
  },
  to_province_id: {
    required: true,
    type: "object",
    relation: "to_province",
    fieldRelation: "name",
  },
  from_district_id: {
    type: "object",
    relation: "from_district",
    fieldRelation: "name",
  },
  to_district_id: {
    type: "object",
    relation: "to_district",
    fieldRelation: "name",
  },
  vehicle: {
    required: true,
    relation: "vehicle",
    type: "object",
    fieldRelation: "name",
  },
  area_id: {
    relation: "area",
    type: "object",
    fieldRelation: "name",
  },
  from_address: {},
  to_address: {},
  distance: { required: true, type: "number" },
  is_from_internal: { dataType: "bool", defaultValue: true },
  is_to_internal: { dataType: "bool", defaultValue: true },
  start_time: { required: true, dataType: "date", type: "object" },
  end_time: { required: true, dataType: "date", type: "object" },
  is_over_night: { dataType: "bool", defaultValue: false },
  is_active: { dataType: "bool", defaultValue: true },
  plan_route_user_dto_list: { dataType: "array" },
  plan_id: { relation: "plan", type: "object", fieldRelation: "name" },

  is_moving_route: { dataType: "bool", defaultValue: false },
  is_sea: { dataType: "bool", defaultValue: false },
  is_island: { dataType: "bool", defaultValue: false },

  from_department_name: { required: true },
  to_department_name: { required: true },
  // is_city: { dataType: "bool", defaultValue: false },
  // name_of_country_id: {},
  // name_of_area_id: {},
};
export default PlanRoute;
