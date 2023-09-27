import i18n from "@/lang";
const { t } = i18n.global;

const Province = {
  name: { required: true },
  code: {},
  country_id: {
    relation: "country",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  area_id: {
    relation: "area",
    type: "object",
    fieldRelation: "name",
  },
  name_of_country_id: {},
  name_of_area_id: {},
  is_city: { dataType: "bool", defaultValue: false },
  is_active: { dataType: "bool", defaultValue: true },
  type: { dataType: "number", defaultValue: 1 },
};
export default Province;
