import axios from "axios";
import { config } from "../config";
const token = window.localStorage.getItem(config.LS_USER_TOKEN_KEY);

export const getMyAdverts = () => {
    return axios.post(`${config.API_URL}/api/v1/getMyAdverts`, undefined, {headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const getAdvertCategs = () => {
    return axios.get(`${config.API_URL}/api/v1/getAdvertCategs`, undefined, {headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const getAdvertStates = () => {
    return axios.get(`${config.API_URL}/api/v1/getAdvertStates`, undefined, {headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const getAdvertById = (advertId) => {
    return axios.get(`${config.API_URL}/api/v1/advert/${advertId}`)
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const addAdvert = (advert) => {
    return axios.post(`${config.API_URL}/api/v1/addAdvert`, advert, {headers: {'x-access-token': token }})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const editAdvert = (advert, advertId) => {
    return axios.put(`${config.API_URL}/api/v1/editAdvert/${advertId}`, advert, {headers: {'x-access-token': token }})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}