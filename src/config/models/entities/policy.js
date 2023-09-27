const HotelQuota = {
  code: {},
  name: {},
  description: {},
  is_active: {
    dataType: "bool",
    defaultValue: true,
  },
  publish_time: { required: true, dataType: "date", type: "object" },
  expire_time: { required: true, dataType: "date", type: "object" },
  start_time: { required: true, dataType: "date", type: "object" },
  end_time: { required: true, dataType: "date", type: "object" },
  sort_order: { dataType : "number"},
};
export default HotelQuota;
