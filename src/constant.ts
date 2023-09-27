import i18n from "@/lang";
const { t } = i18n.global;

// type service_group
const ServiceGroupType = [
  { value: 1, label: "Phương tiện" },
  { value: 2, label: "Khoảng cách" },
  { value: 3, label: "Lưu trú" },
  { value: 4, label: "Sinh hoạt phí" },
];
// type active common
const activeStatus = [
  { value: true, label: t("common.active") },
  { value: false, label: t("common.inactive") },
];
// type distance-quota
const distanceQuotaType = [
  { value: 1, label: "Trong tỉnh" },
  { value: 2, label: "Ngoài tỉnh" },
];
// type hotel-quota
const hotelQuotaType = [
  { value: 1, label: "Trong nước" },
  { value: 2, label: "Nước ngoài" },
];
// type airport-quota
const airportQuotaType = [
  { value: 1, label: "Trong nước" },
  { value: 2, label: "Nước ngoài" },
];
// type living-quota
const livingQuotaType = [
  { value: 1, label: "Trong nước" },
  { value: 2, label: "Nước ngoài" },
];
// type moving-quota
const movingQuotaType = [
  { value: 1, label: "Trong nước" },
  { value: 2, label: "Nước ngoài" },
];

const policyLimitType = [
  { value: 1, label: "Nội địa" },
  { value: 2, label: "Nước ngoài" },
];

// type plan
const planType = [
  { value: 1, label: "Nội địa" },
  { value: 2, label: "Nước ngoài" },
];

// type cost-type
const planCostType = [
  { value: 1, label: "Định mức taxi sân bay" },
  { value: 2, label: "Chi phí phòng nghỉ" },
  { value: 3, label: "Chi phí di chuyển" },
  { value: 4, label: "Phụ cấp lưu trú" },
];

// status plan
const planStatus = [
  { value: 1, label: "Khởi tạo" },
  { value: 2, label: "Chờ phê duyệt" },
  { value: 3, label: "Đã phê duyệt" },
  { value: 4, label: "Từ chối phê duyệt" },
  { value: 5, label: "Chờ xác nhận kết quả công tác" },
  { value: 6, label: "Xác nhận kết quả công tác" },
  { value: 7, label: "Chờ phê duyệt kết thúc công tác" },
  { value: 8, label: "Kết thúc công tác" },
  { value: 9, label: "Từ chối kết thúc công tác" },
  { value: 10, label: "Hủy" },
];

// priority type VOffice
const priorityIdType = [
  { value: 1, label: "Bình thường" },
  { value: 2, label: "Khẩn" },
  { value: 3, label: "Hỏa tốc" },
  { value: 4, label: "Thượng khẩn" },
];

const vatType = [
  { value: 1, label: "Không thu phí" },
  { value: 2, label: "0%" },
  { value: 3, label: "5%" },
  { value: 4, label: "8%" },
  { value: 5, label: "10%" },
];

const invoicePaymentType = [
  { value: 1, label: "Hoàn ứng" },
  { value: 2, label: "Phải trả nhà cung cấp" },
];

const serviceGroup = {
  PHONG_NGHI: 4,
};

const summaryRequestType = {
  DE_NGHI_CHI: 1,
  DE_NGHI_TAM_UNG: 2,
};

const summaryStatus = {
  DA_PHE_DUYET: 1,
  TAO_BANG: 2,
  CHO_DUYET_BANG: 3,
  DA_PHE_DUYET_BANG: 4,
  TU_CHOI_BANG: 5,
  KE_TOAN_TU_CHOI: 6,
  HOAN_THANH_CHI: 7,
  CHUYEN_KHOAN_LOI: 8,
  DANG_XU_LY_CHI_TIEN:9,
};

const transferRequestStatus = {
  CHUA_TRINH_KY: 1,
  CHO_PHE_DUYET: 2,
  DA_PHE_DUYET: 3,
  TU_CHOI: 4,
  DA_CAP_NHAT: 5,
};

const documentStatus = [
  { value: 1, label: "Văn thư từ chối" },
  { value: 2, label: "Từ chối" },
  { value: 3, label: "Đã ký" },
  { value: 4, label: "Hủy" },
  { value: 5, label: "Đã ký và ban hành" },
];

const levelCostContants = {
  // cấp độ trong bảng chi phí
  CAP_LO_TRINH: { value: 1, colSpan: 5, totalColSpan: 5, key: "content" },
  CAP_DICH_VU: { value: 2, colSpan: 1, totalColSpan: 5, key: "content" },
  CAP_NGUOI_DUNG: { value: 3, colSpan: 1, totalColSpan: 5, key: "content" },
};

export default {
  ServiceGroupType,
  activeStatus,
  distanceQuotaType,
  hotelQuotaType,
  airportQuotaType,
  livingQuotaType,
  movingQuotaType,
  policyLimitType,
  planCostType,
  planType,
  planStatus,
  priorityIdType,
  vatType,
  invoicePaymentType,
  serviceGroup,
  summaryStatus,
  documentStatus,
  transferRequestStatus,
  summaryRequestType,
  levelCostContants,
};
