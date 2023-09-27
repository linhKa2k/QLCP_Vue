import axios from "axios";
export default {
  upload(file: string) {
    const fmData = new FormData();
    fmData.append("file", file);
    return axios.post("/files/upload", fmData);
  },
  uploadImg(file: any) {
    const fmData = new FormData();
    fmData.append("file", file);
    return axios.post("file", fmData);
  },
  uploadFormData(FormData: string) {
    return axios.post("file", FormData);
  },
  downloadFile(file_id: string) {
    return axios.get(`files/` + file_id + `/download`, {
      responseType: "blob",
    });
  },
};
