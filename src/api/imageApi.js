import axiosClient from "./axiosClient";

const DEFAULT_URL = "image";

const imageApi = {
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
    create: (params) => axiosClient.post(`${DEFAULT_URL}/create`, params),
};

export default imageApi;
