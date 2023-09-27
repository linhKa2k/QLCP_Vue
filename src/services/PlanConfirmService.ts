import axios from "axios";
const baseUrl = "plan-confirms";

export default {
  get(params: DynamicParams) {
    return axios.get(baseUrl, {
      params: params,
    });
  },
  getByPlanRoute(params: DynamicParams) {
    return axios.get(baseUrl + `/list`, {
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

  getStaffConfirm(id: Id) {
    return axios.get(baseUrl + `/plan-route/${id}`);
  },
  delete(id: Id) {
    return axios.delete(baseUrl + `/${id}`);
  },
  updateStatusPlanConfirm(data: DynamicParams) {
    return axios.put(baseUrl + `/update-status`, data);
  },
};
