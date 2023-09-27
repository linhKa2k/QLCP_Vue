
import axios from "axios";
axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? `${process.env.VUE_APP_API_LOCAL}/api/`
    : `${process.env.VUE_APP_API_DOMAIN}/api/`;
// axios.defaults.baseURL = `${process.env.VUE_APP_API_DOMAIN}/api/`;
