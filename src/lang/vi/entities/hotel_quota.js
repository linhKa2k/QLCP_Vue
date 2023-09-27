const HotelQuota = {
  name: "Định mức phòng nghỉ",
  attribute: {
    service_group_id: "Nhóm dịch vụ",
    service_id: "Loại dịch vụ",
    country_id: "Quốc gia",
    province_id: "Tỉnh",
    district_id: "Quận/Huyện",
    position_group_id: "Nhóm chức vụ",
    ward_id: "Xã",
    amount: "Định mức",
    amount_month: "Định mức theo tháng",
    single_room_amount: "Định mức phòng đơn phát sinh",

    name_of_country_id: "Tên quốc gia",
    name_of_province_id: "Tên tỉnh",
    name_of_district_id: "Tên huyện",
    name_of_ward_id: "Tên xã",
    single_daily_amount: "Chi phí phòng đơn",
    double_daily_amount: "Chi phí phòng đôi",
    monthly_amount: "Chi phí 1 tháng",

    code: "Mã",
    type: "Hình thức công tác",
    name_of_service_group_id: "Nhóm dịch vụ",
    name_of_service_id: "Loại dịch vụ",
    name_of_position_group_id: "Nhóm chức vụ",
    quota: "Định mức",
    is_active: "Tình trạng",
    description: "Mô tả",
    start_date: "Ngày bắt đầu",
    end_date: "Ngày kết thúc",
  },
  title: {
    general_information: "Thông tin chung",
    additional_information: "Thông tin bổ sung",
  },
  type: {
    1: "Trong nước",
    2: "Nước ngoài",
  },
};
export default HotelQuota;
