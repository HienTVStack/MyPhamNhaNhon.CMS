import axiosClient from "./axiosClient";

const DEFAULT_URL = "product";

const productApi = {
    create: (params) => axiosClient.post(`${DEFAULT_URL}/create`, params),
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
    getProductBySlug: (params) =>
        axiosClient.get(`${DEFAULT_URL}/${params}/detail`),
    updateImage: (params) =>
        axiosClient.post(`${DEFAULT_URL}/updateImage`, params),
};

export default productApi;
