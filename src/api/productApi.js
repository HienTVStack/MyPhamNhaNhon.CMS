import axiosClient from "./axiosClient";

const DEFAULT_URL = "product";

const productApi = {
    create: (params) => axiosClient.get(`${DEFAULT_URL}/create`, params),
};

export default productApi;
