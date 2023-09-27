import axios from "axios";
const baseUrl = "roles";

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
  getPermission() {
    return axios.get("/permissions?pageSize=500&pageIndex=0");
  },
};
