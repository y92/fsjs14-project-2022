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

export const payOrderWithAccount = (data) => {
    return axios.post(`${config.API_URL}/api/v1/payOrderWithAccount`, data, { headers: { 'x-access-token': token }})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const getMyClientsOrders = () => {
    return axios.post(`${config.API_URL}/api/v1/getMyClientsOrders`, undefined, {headers: { 'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const getMyPutOrders = () => {
    return axios.post(`${config.API_URL}/api/v1/getMyPutOrders`, undefined, {headers: { 'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const confirmOrder = (data) => {
    return axios.post(`${config.API_URL}/api/v1/confirmOrder`, data, {headers: { 'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const cancelOrder = (data) => {
    return axios.post(`${config.API_URL}/api/v1/cancelOrder`, data, {headers: { 'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const markOrderAsSent = (data) => {
    return axios.post(`${config.API_URL}/api/v1/markOrderAsSent`, data, {headers: { 'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const markOrderAsReceived = (data) => {
    return axios.post(`${config.API_URL}/api/v1/markOrderAsReceived`, data, {headers: { 'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })

}