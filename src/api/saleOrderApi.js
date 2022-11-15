import axiosClient from "./axiosClient";

const DEFAULT_URL = "saleOrder";

const saleOrderApi = {
   
    create: (params) => axiosClient.post(`${DEFAULT_URL}/create`, params),
};

export default saleOrderApi;
