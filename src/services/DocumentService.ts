import axios from "axios";
const baseUrl = "documents";

export default {
  get(params: DynamicParams) {
    return axios.get(baseUrl, {
      params: params,
    });
  },
  detail(planId: any) {
    return axios.get(baseUrl + `/${planId}`);
  },
};
