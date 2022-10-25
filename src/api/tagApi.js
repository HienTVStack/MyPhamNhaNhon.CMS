import axiosClient from "./axiosClient";

const DEFAULT_URL = "tag";

const categoryApi = {
    getAll: () => axiosClient.get(`${DEFAULT_URL}/get-all`),
    create: (params) => axiosClient.post(`${DEFAULT_URL}/create`, params),
};

export default categoryApi;
