import axiosClient from "./axiosClient";

const DEFAULT_URL = "employee";

const employeeApi = {
    getAll: () => axiosClient.get(`${DEFAULT_URL}/getAll`),
    register: (params) => axiosClient.post(`${DEFAULT_URL}/register`, params),
    login: (params) => axiosClient.post(`${DEFAULT_URL}/login`, params),
    verifyToken: () => axiosClient.post(`${DEFAULT_URL}/verify-token`),
};

export default employeeApi;
