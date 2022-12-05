import axiosClient from "./axiosClient";

const DEFAULT_URL = "category";

const categoryApi = {
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
    create: (params) => axiosClient.post(`${DEFAULT_URL}/create`, params),
    update: (id, params) => axiosClient.put(`${DEFAULT_URL}/${id}/update`, params),
    destroy: (id) => axiosClient.delete(`${DEFAULT_URL}/${id}`),
};

export default categoryApi;
