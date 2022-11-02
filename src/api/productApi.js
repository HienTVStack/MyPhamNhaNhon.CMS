import axiosClient from "./axiosClient";

const DEFAULT_URL = "product";

const productApi = {
    create: (params) => axiosClient.post(`${DEFAULT_URL}/create`, params),
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
    getProductBySlug: (params) =>
        axiosClient.get(`${DEFAULT_URL}/${params}/detail`),
    update: (params) => axiosClient.put(`${DEFAULT_URL}/update`, params),
    updateImage: (params) =>
        axiosClient.put(`${DEFAULT_URL}/updateImage`, params),
    destroyById: (params) =>
        axiosClient.post(`${DEFAULT_URL}/${params}/destroy`),
};

export default productApi;
