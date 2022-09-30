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

export const getAdvertsByUser = (userId) => {
    return axios.post(`${config.API_URL}/api/v1/getAdvertsByUser/${userId}`)
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const getLastAdverts = () => {
    return axios.post(`${config.API_URL}/api/v1/getLastAdverts`)
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

export const editAdvertMainPict = (pict, advertId) => {
    return axios.put(`${config.API_URL}/api/v1/editAdvertMainPict/${advertId}`, pict, {headers: {'x-access-token': token }})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const getMyFavoriteAdverts = () => {
    return axios.get(`${config.API_URL}/api/v1/getMyFavoriteAdverts`, {headers: { 'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const addAdvertAsFavorite = (advertId) => {
    return axios.post(`${config.API_URL}/api/v1/addAdvertAsFavorite/${advertId}`, undefined, {headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const deleteAdvertFromFavorites = (advertId) => {
    return axios.delete(`${config.API_URL}/api/v1/deleteAdvertFromFavorites/${advertId}`, {headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const deleteAllAdvertsFromFavorites = () => {
    return axios.delete(`${config.API_URL}/api/v1/deleteAllAdvertsFromFavorites`, {headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const getAdvertQuestions = (advertId) => {
    return axios.get(`${config.API_URL}/api/v1/getAdvertQuestions/${advertId}`, undefined, {headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const askQuestion = (advertId, data) => {
    return axios.post(`${config.API_URL}/api/v1/askQuestionAdvert/${advertId}`, data, {headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const answerQuestion = (questionId, data) => {
    return axios.post(`${config.API_URL}/api/v1/answerQuestion/${questionId}`, data, {headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}

export const deleteQuestion = (questionId) => {
    return axios.delete(`${config.API_URL}/api/v1/deleteQuestion/${questionId}`, {headers: {'x-access-token': token}})
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        return err;
    })
}
