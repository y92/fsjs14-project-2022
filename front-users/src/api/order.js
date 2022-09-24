import axios from "axios";
import { config } from "../config";
const token = window.localStorage.getItem(config.LS_USER_TOKEN_KEY);

export const checkItemsBeforePayment = (data) => {
    return axios.post(`${config.API_URL}/api/v1/checkItemsBeforePayment`, data, { headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const checkOrderPayment = (data) => {
    return axios.post(`${config.API_URL}/api/v1/checkOrderPayment`, data, { headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const payOrder = (data) => {
    return axios.post(`${config.API_URL}/api/v1/payOrder`, data, { headers: {'x-access-token' : token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}