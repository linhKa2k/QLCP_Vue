import axios from "axios";
const baseUrl = "transfer-requests";

export default {
  get(params: DynamicParams) {
    return axios.get(baseUrl, {
      params: params,
    });
  },
  detail(id: Id) {
    return axios.get(baseUrl + `/${id}`);
  },
  save(data: DynamicParams) {
    switch (data.mode) {
      case "edit":
        delete data.mode;
        return axios.put(baseUrl + `/${data.id}`, data);
      default:
        delete data.mode;
        return axios.post(baseUrl, data);
    }
  },
  validateImport(data: DynamicParams) {
    return axios.post(baseUrl + `/validate-import`, data);
  },
  import(data: DynamicParams) {
    return axios.post(baseUrl + `/import`, data);
  },
  export(data: DynamicParams) {
    return axios.post(baseUrl + `/export`, data, {
      responseType: "blob",
    });
  },
  getAllInfoData(id: Id) {
    return axios.get(baseUrl + `/Info/${id}`);
  },

  exportItem(data: DynamicParams) {
    return axios.get('transfer-request-items' + `/export`, {
      params: data,
      responseType: "blob",
    });
  },

  updateStatus(data:DynamicParams) {
    return axios.put(`transfer-requests/update-status`, data);
  },

  
};
