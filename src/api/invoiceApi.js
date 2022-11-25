import axiosClient from "./axiosClient";

const DEFAULT_URL = "invoice";

const invoiceApi = {
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
    getById: (id) => axiosClient.get(`${DEFAULT_URL}/${id}/detail`),
    updateStatus: (id, status) => axiosClient.put(`${DEFAULT_URL}/${id}/updateStatus`, status),
};

export default invoiceApi;
