import axiosClient from "./axiosClient";

const DEFAULT_URL = "saleOrder";

const saleOrderApi = {
    create: (params) => axiosClient.post(`${DEFAULT_URL}/create`, params),
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
    getById: (id) => axiosClient.get(`${DEFAULT_URL}/${id}`),
    import: (id, data) => axiosClient.put(`${DEFAULT_URL}/import/${id}`, data),
};

export default saleOrderApi;
