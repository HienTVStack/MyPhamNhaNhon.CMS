import axiosClient from "./axiosClient";

const DEFAULT_URL = "category";

const categoryApi = {
    getAll: () => axiosClient.get(`${DEFAULT_URL}/get-all`),
};

export default categoryApi;
