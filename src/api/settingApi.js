import axiosClient from "./axiosClient";

const DEFAULT_URL = "setting";

const settingApi = {
  get: () => axiosClient.get(`${DEFAULT_URL}/get`),
  update: (data) => axiosClient.post(`${DEFAULT_URL}/update`, data),
  updateLanguage: (data) => axiosClient.put(`${DEFAULT_URL}/updateLanguage`, data),
};

export default settingApi;
