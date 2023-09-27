const planInvoice = {
  name: "Hóa đơn",
  attribute: {
    type: "Mẫu hóa đơn",
    invoice_date: "Ngày hóa đơn",
    symbol: "Ký hiệu",
    code: "Số hóa đơn",
    tax_code: "Mã số thuế",
    provider: "Nhà cung cấp",
    //
    name: "Tên kế hoạch",
    provider: "Tên nhà cung cấp",
    invoice_date: 'Ngày hoá đơn'
  },
  status: {
    1: "Khởi tạo",
    2: "Đang phê duyệt",
    3: "Đã phê duyệt",
    4: "Từ chối",
  },
  type: {
    1: "Nội địa",
    2: "Nước Ngoài",
  },
};
export default planInvoice;
