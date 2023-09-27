import axios from "axios";
const baseUrl = "users";
export default {
  // getDemo() {
  //   return axios.get("service-info");
  // },
  get(params: DynamicParams)
  {
    return axios.get(baseUrl, {
      params: params,
    });
  },
  save(data: DynamicParams)
  {
    switch (data.mode) {
      case "edit":
        delete data.mode;
        return axios.put("admin/" + baseUrl + `/${data.id}`, data);
      default:
        delete data.mode;
        return axios.post("admin/" + baseUrl, data);
    }
  },
  getAll(params: DynamicParams)
  {
    return axios.get(baseUrl + `/get-all`, {
      params: params,
    });
  },
  detail(id: Id)
  {
    return axios.get(baseUrl + `/${id}`);
  },
  validateImport(data: DynamicParams)
  {
    return axios.post(baseUrl + `/validate-import`, data);
  },
  import(data: DynamicParams)
  {
    return axios.post(baseUrl + `/import`, data);
  },
  updatedAvatar(data: DynamicParams)
  {
    return axios.post(baseUrl + `/update-avatar`, data);
  },
  updatedUser(data: DynamicParams)
  {
    return axios.post(baseUrl + `/update-user`, data);
  },
  export(data: DynamicParams)
  {
    return axios.post(baseUrl + `/export`, data, {
      responseType: "blob",
    });
  },
};
