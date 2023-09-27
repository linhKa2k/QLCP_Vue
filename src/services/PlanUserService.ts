import axios from "axios";
const baseUrl = "plan-users";

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
  delete(id: Id){
    return axios.delete( baseUrl + `/${id}`)
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
  saveMany(data: DynamicParams) {
    delete data.mode;
    return axios.post(baseUrl + `/saves`, data);
  },
  updateMany(data: DynamicParams, planId: number) {
    delete data.mode;
    return axios.put(baseUrl + `/updates` + `/${planId}`, data);
  },

  saves(data: DynamicParams) {
    switch (data.mode) {
      case "edit":
        delete data.mode;
        return axios.put(baseUrl + `/updates` + `/${data.planId}`, data.data);
      default:
        delete data.mode;
        return axios.post(baseUrl + `/saves`, data.data);
    }
  },
};
