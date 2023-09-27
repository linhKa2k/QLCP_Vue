export const ruleConfig = (props) => (trigger) => (message) => {
  return {
    ...props,
    trigger,
    message: message,
  };
};

export const required = ruleConfig({ required: true });

export const maxLengthInput = (val: any) => {
  return ruleConfig({ max: val })("blur")(`Giới hạn ${val} kí tự`);
};

export const requiredOnChange = (mes?: any) => {
  // return required("change")("Yêu cầu nhập đẩy đủ thông tin");
  return {
    required: true,
    message: mes || "Vui Lòng nhập ",
    trigger: "blur",
  };
};
