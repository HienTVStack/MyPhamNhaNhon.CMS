import axiosClient from "./axiosClient";

const DEFAULT_URL = "supplier";

const categoryApi = {
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
    create: (params) => axiosClient.post(`${DEFAULT_URL}/create`, params),
};

export default categoryApi;
