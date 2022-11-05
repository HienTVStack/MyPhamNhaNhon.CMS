import axiosClient from "./axiosClient";

const DEFAULT_URL = "product";

const productApi = {
    create: (params) => axiosClient.post(`${DEFAULT_URL}/create`, params),
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
    getTrash: () => axiosClient.get(`${DEFAULT_URL}/trash`),
    getProductBySlug: (params) => axiosClient.get(`${DEFAULT_URL}/${params}/detail`),
    update: (params) => axiosClient.put(`${DEFAULT_URL}/update`, params),
    updateImage: (params) => axiosClient.put(`${DEFAULT_URL}/updateImage`, params),
    destroyById: (params) => axiosClient.post(`${DEFAULT_URL}/${params}/destroy`),
    forceDelete: (params) => axiosClient.delete(`${DEFAULT_URL}/delete/${params}`),
    destroyMultiple: (params) => axiosClient.post(`${DEFAULT_URL}/deleted/multiple`, params),
    restoredById: (params) => axiosClient.post(`${DEFAULT_URL}/${params}/restored`),
};

export default productApi;
