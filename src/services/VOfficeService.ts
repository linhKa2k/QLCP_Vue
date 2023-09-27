import axios from "axios";
const baseUrl = "voffice";

export default {
  get(params: DynamicParams) {
    return axios.get(baseUrl, {
      params: params,
    });
  },
  getSignner(params: DynamicParams) {
    return axios.get(baseUrl + `/users`, {
      params: params,
    });
  },
  getSignnerRole(params: DynamicParams) {
    return axios.get(baseUrl + `/users-role`, {
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
  approve(data: DynamicParams) {
    return axios.put(baseUrl + `/approve/${data.id}`, data);
  },
  validateImport(data: DynamicParams) {
    return axios.post(baseUrl + `/validate-import`, data);
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
  login(data: DynamicParams) {
    return axios.post(baseUrl + `/login`, data);
  },
  uploadFile(data: any) {
    // const fmData = new FormData();
    // fmData.append("files", file);
    return axios.post(
      `/files/upload-voffice?position=${data.position}`,
      data.data
    );
  },
  getDomains(params: DynamicParams) {
    return axios.get(baseUrl + `/domains`, { params: params });
  },
  getDocTypes(params: DynamicParams) {
    return axios.get(baseUrl + `/docTypes`, { params: params });
  },
  sendAndSign(data: DynamicParams) {
    return axios.post(baseUrl + `/send`, data);
  },

  getSapAccounting() {
    return axios.get(baseUrl + `/org/post-office`);
  },
};
