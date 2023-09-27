import axios from "axios";
const baseUrl = "plan-routes";

export default {
  get(params: DynamicParams) {
    return axios.get(baseUrl, {
      params: params,
    });
  },
  detail(id: Id) {
    return axios.get(baseUrl + `/${id}`);
  },
  delete(id: Id) {
    return axios.delete(baseUrl + `/${id}`);
  },
  save(data: DynamicParams) {
    console.log(data, " check data API");
    switch (data.mode) {
      case "edit":
        delete data.mode;
        return axios.put(baseUrl + `/${data.form.id}`, data.form);
      default:
        delete data.mode;
        return axios.post(baseUrl, data.form);
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
  saveData(data: DynamicParams) {
    delete data.mode;
    return axios.post(baseUrl, data);
  },

  // saveMany(data: DynamicParams, mode: any, id?: any)
  // {
  //   switch (mode) {
  //     case "edit":
  //       // delete data.mode;
  //       return axios.put(baseUrl + `/planId`, data);
  //     default:
  //       // delete data.mode;
  //       return axios.post(baseUrl + `planId/`, data);
  //   }
  // },
  saveMany(data: DynamicParams, mode?: any, id?: any) {
    console.log(data.data, " check data API");

    switch (data.mode) {
      case "edit":
        // delete data.mode;
        return axios.put(baseUrl + `/${data.id}`, data.data);
      default:
        // delete data.mode;
        return axios.post(baseUrl, data.data);
    }
  },

  getUserWithPlanRouteId(planRouteId: Id) {
    return axios.get(baseUrl + `/list-user/${planRouteId}`);
  },
};
