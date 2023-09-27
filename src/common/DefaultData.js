import constant from "@/constant";
// dữ liệu mặc định danh mục
const categoryDefault = {
  vietNamCountry: { id: 192, key: 192, value: 192, label: "Vietnam" },
  phongNghiServiceGroup: { label: "Phòng nghỉ", id: 4, key: 4, value: 4 },
  service: {
    PHONG_DON: { label: "Phòng đơn", id: 1, key: 1, value: 1 },
    PHONG_DOI: { label: "Phòng đôi", id: 2, key: 2, value: 2 },
  },
  phuCapLuuChuServiceGroup: {
    label: "Phụ cấp lưu chú",
    id: 2,
    key: 2,
    value: 2,
  },
  mayBayVehicle: { label: "Máy bay", id: 3, key: 3, value: 3 },

};
const isOptionAllDefault = {
  label: "Tất cả",
  key: "all",
  value: "all",
  id: "all",
};

export default {
  isOptionAllDefault,
  categoryDefault,
  OrderCustomer: {
    name: "Đơn hàng",
    attribute: {
      order_no: "Số đơn hàng",
      client_id: "Khác hàng",
    },
  },
  OrderClient: {
    name: "Đơn hàng",
    attribute: {
      order_no: "Số đơn hàng",
      client_id: "Khác hàng",
    },
  },
  Order: { name: "Đơn hàng" },
  Client: {
    name: "Khách hàng",
    attribute: {
      tax_code: "Mã số thuế",
      delegate: "Người đại diện",
      customer_code: "Mã khách hàng",
      full_name: "Họ tên",
      email: "Email",
      username: "Tên đăng nhập",
      password: "Mật khẩu",
      confirm_password: "Xác nhận mật khẩu",
      mobile_no: "Số điện thoại",
    },
  },
  Staff: {
    name: "Nhân viên",
    attribute: {
      type: "Loại",
      user_id: "Người dùng",
      avatar_id: "Hình ảnh",
      customer_code: "Mã khách hàng",
      full_name: "Họ tên",
      identify_no: "CMND/CCCD",
      birth_date: "Ngày sinh",
      email: "Email",
      username: "Tên đăng nhập",
      password: "Mật khẩu",
      mobile_no: "Số điện thoại",
    },
  },
  Goods: {
    name: "Hàng hoá",
    attribute: {
      code: "Mã",
      title: "Tên",
      goods_unit: "Đơn vị",
      volume: "Thể tích",
      weight: "Trọng lượng",
    },
  },
  GoodsUnit: {
    name: "Đơn vị",
    attribute: {
      code: "Mã",
      title: "Tên",
      description: "Mô tả",
    },
  },
  Location: {
    name: "Địa điểm",
    attribute: {
      code: "Mã",
      title: "Tên",
      province: "Tỉnh/Thành phố",
      district: "Quận/Huyện",
      ward: "Phường/Xã",
    },
  },
  LocationGroup: {
    name: "Nhóm địa điểm",
    attribute: {
      code: "Mã",
      title: "Tên",
      description: "Mô tả",
    },
  },
  LocationType: {
    name: "Loại địa điểm",
    attribute: {
      code: "Mã",
      title: "Tên",
      description: "Mô tả",
    },
  },
  Role: {
    name: "Vai trò",
  },
  DefaultData: {
    name: "Dữ liệu mặc định",
    attribute: {
      code: "Mã",
      title: "Tên",
      description: "Mô tả",
    },
  },
};
