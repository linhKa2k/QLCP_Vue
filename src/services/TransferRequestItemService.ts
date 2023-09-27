import axios from "axios";
const baseUrl = "transfer-request-items";

export default {
  validateImport(data: DynamicParams) {
    return axios.post(`transfer-request-items/validate`, data);
  },
  import(data: DynamicParams) {
    return axios.post(`transfer-request-items/import`, data);
  },
  getContentMax(data:DynamicParams){
    return axios.get(`transfer-required-items/content-max`, data);
  },
  exportSample() {
    return axios.get(baseUrl + `/sample`, { responseType: "blob" });
  },
};
