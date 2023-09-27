import axios from "axios";
const baseUrl = "distance-quotas";

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
        return axios.patch(baseUrl + `/${data.id}`, data);
      default:
        delete data.mode;
        return axios.post(baseUrl, data);
    }
  },
  validateImport(data: DynamicParams) {
    return axios.post(baseUrl + `/validate`, data);
  },
  import(data: DynamicParams) {
    return axios.post(baseUrl + `/import`, data);
  },
  export(data: DynamicParams) {
    return axios.get(baseUrl + `/export`, {
      params: data,
      responseType: "blob",
    });
  },
  exportSample() {
    return axios.get(baseUrl + `/sample`, { responseType: "blob" });
  },

  getDistance(params: DynamicParams) {
    return axios.get(baseUrl + `/distance`, { params: params });
  },
};
