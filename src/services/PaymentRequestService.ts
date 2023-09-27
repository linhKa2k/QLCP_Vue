import axios from "axios";
const baseUrl = "payment-requests";

export default {
  get(params: DynamicParams) {
    return axios.get(baseUrl, {
      params: params,
    });
  },
  detail(id: Id) {
    return axios.get(baseUrl + `/${id}`);
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
  delete(id: DynamicParams) {
    return axios.delete(`${baseUrl}/${id}`);
  },
  updateStatus(data: DynamicParams) {
    return axios.put(`payment-requests/cancel`, data);
  },
};
