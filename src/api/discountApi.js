import axiosClient from "./axiosClient";

const DEFAULT_URL = "discount";

const discountApi = {
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
    create: (params) => axiosClient.post(`${DEFAULT_URL}/create`, params),
};

export default discountApi;
