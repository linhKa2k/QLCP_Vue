export const enum planInfo {
  is_additional = "true",
}

export const enum planIsAdd {
  KE_HOACH_BO_SUNG = 1,
  KE_HOACH_GOC = 0,
}

export const enum planStatus {
  init = 1, // Khởi tạo
  wait_approve = 2, // Chờ phê duyệt
  done_approve = 3, // Đã phê duyệt
  refuse_approve = 4, // Từ chối phê duyệt
  waiting_confirm_result_work = 5, // Chờ phê duyệt xác nhận công tác
  confirm_result_work = 6, // Xác nhận công tác
  waiting_approve_end_work = 7, // Chờ phê duyệt kết thúc công tác
  approve_end_work = 8, // Kết thúc công tác
  refuse_end_work = 9, // Từ chối kết thúc công tác
  destroy = 10, // Hủy
}

export const enum planType {
  TRONG_NUOC = 1,
  NGOAI_NUOC = 2,
}

export const enum signStageType {
  TRINH_KY_DE_NGHI_TM = 1,
  TRINH_KY_KET_THUC_CT = 2,
  TRINH_KY_DNCK = 3,
}

export const enum planUserType { // loại nhân viên tham gia kế hoạch
  staff = 1, // or null
  partner = 2,
}

export const enum planUserGender { // Giới tính nhân viên tham gia kế hoạch
  MAN = "M", 
  GIRL = "G",
  ORTHER= "O"
}

export const enum planConfirmStatus { // planConfirm
  init = 1, // or null
  confirm = 2,
  refuse = 3,
}

export const enum planConfirmUserStatus {
  init = 1, // or null
  confirm = 2,
  refuse = 3,
}

export const enum planRouteIsConfirm {
  init = 1,
  confirm = 2,
}

export const enum statusConfirmWorkRequest {
  confirm = 2,
  refuse = 3,
}

export const enum planSignType {
  firts_stage = 1,
  final_stage = 2,
  transfer_stage = 3,
}

export const enum documentStatus {
  VAN_THU_TU_CHOI = 1, // Văn thư từ chối
  TU_CHOI = 2, // Từ chối
  DA_KY = 3, // đã ký
  HUY = 4, // Hủy
  DA_KY_VA_BAN_HANH = 5, // Đã ký và ban hành
}

export const enum planRequiredStatus {
  CHO_PHE_DUYET = 0,
  DA_PHE_DUYET = 1,
  TAO_BANG = 2,
  CHO_DUYET_BANG = 3,
  DA_PHE_DUYET_BANG = 4,
  TU_CHOI_BANG = 5,
  KE_TOAN_TU_CHOI = 6,
  HOAN_THANH_CHI = 7,
  CHUYEN_KHOAN_LOI = 8,
}

export const enum planRouteUserStatus { //trạng thái checkin
  KHOI_TAO = 0,
  DA_CHECK_IN = 1,
  DA_CHECK_OUT = 2,
}

export const enum invoicePaymentRequestType { //trạng thái checkin
  HOAN_UNG = 1,
  PHAI_TRA_NHA_CUNG_CAP = 2,
}

//*** Các danh mục */
export const enum isActive { // is_active common
  KHONG_KICH_HOAT = 0,
  KICH_HOAT = 1,
}

export const enum hotelQuotaType {
  NOI_DIA = 1,
  NUOC_NGOAI = 2,
}

export const enum QuotaCommonType {
  CONG_TAC_TRONG_NUOC = 1,
  CONG_TAC_NUOC_NGOAI = 2,
}

export const enum pdfSignPosition {
  KE_HOACH_CONG_TAC = 1,
  DE_NGHI_TAM_UNG = 2,
  PHU_LUC_CHI_PHI = 3,
  KE_HOACH_KET_THUC_CONG_TAC = 4,
  PHU_LUC_CHI_PHI_KET_THUC_CONG_TAC = 5,
  UNC = 6,
  DE_NGHI_CHUYEN_TIEN = 7,
  DE_NGHI_CHI_HOAN_UNG = 8,
  DE_NGHI_CHUYEN_KHOAN_KET_THUC_CONG_TAC = 9,
  GIAY_DE_NGHI_CHUYEN_KHOAN_KET_THUC_CONG_TAC = 10,
  DE_NGHI_CHUYEN_KHOAN_DO_SAI_THONG_TIN_TAI_KHOAN = 11,
}

export const enum paymentRequestType {
  DE_NGHI_THU = 1,
  DE_NGHI_CHI = 2,
}

export const enum paymentRequestStatus {
  CHUA_XAC_NHAN = 1,
  DA_XAC_NHAN = 2,
}

export const enum planConfirmUserStatus {
  CHO_XAC_NHAN = 1,
  DA_XAC_NHAN = 2,
}

export const enum invoiceTypeCostItem {
  KHONG_THU_PHI = 1,
  "0%" = 2,
  "5%" = 3,
  "8%" = 4,
  "10%" = 5,
}

// DANH MỤC
export const enum distanceQuotaType {
  NGOAI_TINH = 2,
  TRONG_TINH = 1,
}

export const regexEnum = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g,
  number: /^\d+$/,
};
