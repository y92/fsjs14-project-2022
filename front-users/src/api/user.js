import axios from "axios";
import { config } from "../config";
const token = window.localStorage.getItem(config.LS_USER_TOKEN_KEY);

export const findUserById = (userId) => {
    return axios.get(`${config.API_URL}/api/v1/user/${userId}`)
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const register = (user) => {
    return axios.post(`${config.API_URL}/api/v1/register`, user)
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const login = (user) => {
    return axios.post(`${config.API_URL}/api/v1/login`, user)
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const updateProfile = (data) => {
    return axios.put(`${config.API_URL}/api/v1/updateProfile`, data, {headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}