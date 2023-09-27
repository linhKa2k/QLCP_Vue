import moment from "moment";
import i18n from "@/lang";
const { t } = i18n.global;
import axios from "axios";

export const formatDate = (value, format = "DD/MM/YYYY") => {
  return value ? moment(value).format(format) : "";
};
export const formatTime = (value, format = "HH:mm:ss") => {
  return value ? moment(value).format(format) : "--";
};

export const formatCurrency =(value)=>{
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export const getImage = (file_id) => {
  return file_id ? `${axios.defaults.baseURL}/file/${file_id}` : "";
};
export const validateImageFile = (file, $message) => {
  const size = 5;
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    $message.error(t("validator.file_extension", { extension: "jpg,png" }));
  }
  const isLt5M = file.size / 1024 / 1024 < size;
  if (!isLt5M) {
    $message.error(t("validator.max_size", { size }));
  }
  return isJpgOrPng && isLt5M;
};
export const filterByValue = (array, string, fieldSearch) => {
  return array.filter((o) =>
    fieldSearch.some((k) => {
      return o[k].toLowerCase().includes(string.toLowerCase());
    })
  );
};
export const formatNumber = (
  amount,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
};
export default {
  data() {
    return {
      ChuSo: [
        " không ",
        " một ",
        " hai ",
        " ba ",
        " bốn ",
        " năm ",
        " sáu ",
        " bảy ",
        " tám ",
        " chín ",
      ],
      Tien: ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"],
    };
  },
  methods: {
    formatDate(value, format = "DD/MM/YYYY") {
      return value ? moment(value).format(format) : "";
    },

    DocSo3ChuSo(baso) {
      let tram;
      let chuc;
      let donvi;
      let KetQua = "";
      tram = parseInt(baso / 100);
      chuc = parseInt((baso % 100) / 10);
      donvi = baso % 10;
      if (tram == 0 && chuc == 0 && donvi == 0) return "";
      if (tram != 0) {
        KetQua += this.ChuSo[tram] + " trăm ";
        if (chuc == 0 && donvi != 0) KetQua += " linh ";
      }
      if (chuc != 0 && chuc != 1) {
        KetQua += this.ChuSo[chuc] + " mươi ";
        if (chuc == 0 && donvi != 0) KetQua = KetQua + " linh ";
      }
      if (chuc == 1) KetQua += " mười ";
      switch (donvi) {
        case 1:
          if (chuc != 0 && chuc != 1) {
            KetQua += " mốt ";
          } else {
            KetQua += this.ChuSo[donvi];
          }
          break;
        case 5:
          if (chuc == 0) {
            KetQua += this.ChuSo[donvi];
          } else {
            KetQua += " lăm ";
          }
          break;
        default:
          if (donvi != 0) {
            KetQua += this.ChuSo[donvi];
          }
          break;
      }
      return KetQua;
    },

    DocTienBangChu(SoTien) {
      let lan = 0;
      let i = 0;
      let so = 0;
      let KetQua = "";
      let tmp = "";
      let ViTri = new Array();
      if (SoTien < 0) return "Số tiền âm !";
      if (SoTien == 0) return "Không đồng !";
      if (SoTien > 0) {
        so = SoTien;
      } else {
        so = -SoTien;
      }
      if (SoTien > 8999999999999999) {
        return "Số quá lớn!";
      }
      ViTri[5] = Math.floor(so / 1000000000000000);
      if (isNaN(ViTri[5])) ViTri[5] = "0";
      so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
      ViTri[4] = Math.floor(so / 1000000000000);
      if (isNaN(ViTri[4])) ViTri[4] = "0";
      so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
      ViTri[3] = Math.floor(so / 1000000000);
      if (isNaN(ViTri[3])) ViTri[3] = "0";
      so = so - parseFloat(ViTri[3].toString()) * 1000000000;
      ViTri[2] = parseInt(so / 1000000);
      if (isNaN(ViTri[2])) ViTri[2] = "0";
      ViTri[1] = parseInt((so % 1000000) / 1000);
      if (isNaN(ViTri[1])) ViTri[1] = "0";
      ViTri[0] = parseInt(so % 1000);
      if (isNaN(ViTri[0])) ViTri[0] = "0";
      if (ViTri[5] > 0) {
        lan = 5;
      } else if (ViTri[4] > 0) {
        lan = 4;
      } else if (ViTri[3] > 0) {
        lan = 3;
      } else if (ViTri[2] > 0) {
        lan = 2;
      } else if (ViTri[1] > 0) {
        lan = 1;
      } else {
        lan = 0;
      }
      for (i = lan; i >= 0; i--) {
        tmp = this.DocSo3ChuSo(ViTri[i]);
        KetQua += tmp;
        if (ViTri[i] > 0) KetQua += this.Tien[i];
        if (i > 0 && tmp.length > 0) KetQua += ","; //&& (!string.IsNullOrEmpty(tmp))
      }
      if (KetQua.substring(KetQua.length - 1) == ",") {
        KetQua = KetQua.substring(0, KetQua.length - 1);
      }
      KetQua =
        KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2) + "đồng.";
      return KetQua; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
    },
  },
};


const ChuSo = [
  " không ",
  " một ",
  " hai ",
  " ba ",
  " bốn ",
  " năm ",
  " sáu ",
  " bảy ",
  " tám ",
  " chín ",
];
const Tien = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];


const DocSo3ChuSo = (baso) => {
  let tram;
  let chuc;
  let donvi;
  let KetQua = "";
  tram = parseInt(baso / 100);
  chuc = parseInt((baso % 100) / 10);
  donvi = baso % 10;
  if (tram == 0 && chuc == 0 && donvi == 0) return "";
  if (tram != 0) {
    KetQua += ChuSo[tram] + " trăm ";
    if (chuc == 0 && donvi != 0) KetQua += " linh ";
  }
  if (chuc != 0 && chuc != 1) {
    KetQua += ChuSo[chuc] + " mươi ";
    if (chuc == 0 && donvi != 0) KetQua = KetQua + " linh ";
  }
  if (chuc == 1) KetQua += " mười ";
  switch (donvi) {
    case 1:
      if (chuc != 0 && chuc != 1) {
        KetQua += " mốt ";
      } else {
        KetQua += ChuSo[donvi];
      }
      break;
    case 5:
      if (chuc == 0) {
        KetQua += ChuSo[donvi];
      } else {
        KetQua += " lăm ";
      }
      break;
    default:
      if (donvi != 0) {
        KetQua += ChuSo[donvi];
      }
      break;
  }
  return KetQua;
};


export const DocTienBangChu = (SoTien) =>{
  let lan = 0;
  let i = 0;
  let so = 0;
  let KetQua = "";
  let tmp = "";
  let ViTri = new Array();
  if (SoTien < 0) return "Số tiền âm !";
  if (SoTien == 0) return "Không đồng !";
  if (SoTien > 0) {
    so = SoTien;
  } else {
    so = -SoTien;
  }
  if (SoTien > 8999999999999999) {
    return "Số quá lớn!";
  }
  ViTri[5] = Math.floor(so / 1000000000000000);
  if (isNaN(ViTri[5])) ViTri[5] = "0";
  so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
  ViTri[4] = Math.floor(so / 1000000000000);
  if (isNaN(ViTri[4])) ViTri[4] = "0";
  so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
  ViTri[3] = Math.floor(so / 1000000000);
  if (isNaN(ViTri[3])) ViTri[3] = "0";
  so = so - parseFloat(ViTri[3].toString()) * 1000000000;
  ViTri[2] = parseInt(so / 1000000);
  if (isNaN(ViTri[2])) ViTri[2] = "0";
  ViTri[1] = parseInt((so % 1000000) / 1000);
  if (isNaN(ViTri[1])) ViTri[1] = "0";
  ViTri[0] = parseInt(so % 1000);
  if (isNaN(ViTri[0])) ViTri[0] = "0";
  if (ViTri[5] > 0) {
    lan = 5;
  } else if (ViTri[4] > 0) {
    lan = 4;
  } else if (ViTri[3] > 0) {
    lan = 3;
  } else if (ViTri[2] > 0) {
    lan = 2;
  } else if (ViTri[1] > 0) {
    lan = 1;
  } else {
    lan = 0;
  }
  for (i = lan; i >= 0; i--) {
    tmp = DocSo3ChuSo(ViTri[i]);
    KetQua += tmp;
    if (ViTri[i] > 0) KetQua += Tien[i];
    if (i > 0 && tmp.length > 0) KetQua += ","; //&& (!string.IsNullOrEmpty(tmp))
  }
  if (KetQua.substring(KetQua.length - 1) == ",") {
    KetQua = KetQua.substring(0, KetQua.length - 1);
  }
  KetQua =
    KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2) + " đồng.";
  return KetQua; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
}

export const formatTypeProvince = (value) => {
  let province = "";
  switch (value) {
    case 1:
      province = "Tỉnh";
      break;
    case 2:
      province = "Thành phố";
      break;
  }
  return province;
};
export const formatTypeDistrict = (value) => {
  let district = "";
  switch (value) {
    case 1:
      district = "Quận";
      break;
    case 2:
      district = "Huyện";
      break;
    case 3:
      district = "Thành phố";
      break;
  }
  return district;
};
export const formatTypeWard = (value) => {
  let province = "";
  switch (value) {
    case 1:
      province = "Xã";
      break;
    case 2:
      province = "Phường";
      break;
    case 3:
      province = "Thị trấn";
      break;
  }
  return province;
};
export const formatIsActive = (value) => {
  let transit = "";
  switch (value) {
    case false:
      transit = "Ngừng hoạt động";
      break;
    case true:
      transit = "Hoạt động";
      break;
    default:
      transit = "Ngừng hoạt động";
      break;
  }
  return transit;
};

export const formatGender = (value) => {
  let transit = "";
  switch (value) {
    case "M":
      transit = "Nam";
      break;
    case "G":
      transit = "Nữ";
      break;
    case "O":
      transit = "Chưa rõ";
      break;
    default:
      transit = "-";
      break;
  }
  return transit;
};

export const formatStatus = (value) => {
  let transit = "";
  switch (value) {
    case "1":
      transit = "Chờ duyệt";
      break;
    case "2":
      transit = "Đã xác nhận";
      break;
    case "3":
      transit = "Từ chối";
      break;
    default:
      transit = "--";
      break;
  }
  return transit;
};

export const formatStatuss = (value) => {
  let transit = "";
  switch (value) {
    case 1:
      transit = "Chờ duyệt";
      break;
    case 2:
      transit = "Đã xác nhận";
      break;
    case 3:
      transit = "Từ chối";
      break;
    default:
      transit = "--";
      break;
  }
  return transit;
};
