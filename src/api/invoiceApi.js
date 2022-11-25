import axiosClient from "./axiosClient";

const DEFAULT_URL = "invoice";

const invoiceApi = {
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
};

export default invoiceApi;
