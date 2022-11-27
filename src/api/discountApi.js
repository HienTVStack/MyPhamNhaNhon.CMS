import axiosClient from "./axiosClient";

const DEFAULT_URL = "discount";

const discountApi = {
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
    create: (params) => axiosClient.post(`${DEFAULT_URL}/create`, params),
    updateStatus: (id, status) => axiosClient.put(`${DEFAULT_URL}/${id}/status`, status),
};

export default discountApi;
