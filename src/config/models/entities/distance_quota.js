import Default from "../../../common/DefaultData";

const DistanceQuota = {
  code: {},
  name: {},
  type: { dataType: "number", defaultValue: 1 },
  country_id: {
    relation: "country",
    required: true,
    type: "object",
    fieldRelation: "name",
  },

  from_country_id: {
    relation: "from_country",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  from_country: {
    objectRelation: "from_country",
    dataType: "object",
    objectDefault: Default.categoryDefault.vietNamCountry,
    fieldLabel: "name",
  },
  to_country_id: {
    relation: "to_country",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  to_country: {
    objectRelation: "to_country",
    dataType: "object",
    objectDefault: Default.categoryDefault.vietNamCountry,
    fieldLabel: "name",
  },
  from_province_id: {
    relation: "from_province",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  to_province_id: {
    relation: "to_province",
    required: true,
    type: "object",
    fieldRelation: "name",
  },
  from_district_id: {
    relation: "from_district",
    // required: true,
    type: "object",
    fieldRelation: "name",
  },
  to_district_id: {
    relation: "to_district",
    // required: true,
    type: "object",
    fieldRelation: "name",
  },
  distance: { type: "number", required: true },
  description: {},
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
  // start_date: { required: true, dataType: "date", type: "object" },
  // end_date: { required: true, dataType: "date", type: "object" },

  from_distance: {},
  to_distance: {},
};
export default DistanceQuota;
