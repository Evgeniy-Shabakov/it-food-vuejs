import { computed, ref } from 'vue';
import { addLogMessage, formErrorLogMessage, formDoneLogMessage } from '/src/store/log-messages.js'
import axios from 'axios'
import { serverApiUrl } from '/src/main.js'

export const countries = ref()
export const currentCountry = ref()

export const cities = ref()
export const currentCity = ref()

export const restaurants = ref()
export const currentRestaurant = ref()

export const textLoadOrFailForVue = ref('Загрузка данных...')

export function getModelsAxios(urlPrefix) {
    return new Promise(function (resolve, reject) {
        axios
            .get(`${serverApiUrl}/${urlPrefix}`)
            .then(res => {
                if (urlPrefix == 'countries') countries.value = res.data.data
                else if (urlPrefix == 'cities') cities.value = res.data.data
                else if (urlPrefix == 'restaurants') restaurants.value = res.data.data
                resolve(res)
            })
            .catch(err => {
                textLoadOrFailForVue.value = 'Ошибка загрузки данных'
                addLogMessage(formErrorLogMessage(err))
                reject(err)
            })
    })
}

export function getModelAxios(urlPrefix, id) {
    return new Promise(function (resolve, reject) {
        axios
            .get(`${serverApiUrl}/${urlPrefix}/${id}`)
            .then(res => {
                if (urlPrefix == 'countries') currentCountry.value = res.data.data
                else if (urlPrefix == 'cities') currentCity.value = res.data.data
                else if (urlPrefix == 'restaurants') currentRestaurant.value = res.data.data
                resolve(res)
            })
            .catch(err => {
                textLoadOrFailForVue.value = 'Ошибка загрузки данных'
                addLogMessage(formErrorLogMessage(err))
                reject(err)
            })
    })
}

export function storeModelAxios(urlPrefix, data) {
    return new Promise(function (resolve, reject) {
        axios
            .post(`${serverApiUrl}/${urlPrefix}/`, data)
            .then(res => {
                res.messageForVue = formDoneLogMessage(urlPrefix, res, data)
                addLogMessage(res.messageForVue)
                resolve(res)
            })
            .catch(err => {
                addLogMessage(formErrorLogMessage(err))
                reject(err)
            })
    })
}

export function updateModelAxios(urlPrefix, data) {
    return new Promise(function (resolve, reject) {
        axios
            .patch(`${serverApiUrl}/${urlPrefix}/${data.id}`, data)
            .then(res => {
                if (urlPrefix == 'countries') currentCountry.value = res.data.data
                else if (urlPrefix == 'cities') currentCity.value = res.data.data
                else if (urlPrefix == 'restaurants') currentRestaurant.value = res.data.data
                res.messageForVue = formDoneLogMessage(urlPrefix, res, data)
                addLogMessage(res.messageForVue)
                resolve(res)
            })
            .catch(err => {
                addLogMessage(formErrorLogMessage(err))
                reject(err)
            })
    })
}

export function deleteModelAxios(urlPrefix, data) {
    return new Promise(function (resolve, reject) {
        axios
            .delete(`${serverApiUrl}/${urlPrefix}/${data.id}`)
            .then(res => {
                if (urlPrefix == 'countries') currentCountry.value = null
                else if (urlPrefix == 'cities') currentCity.value = null
                else if (urlPrefix == 'restaurants') currentRestaurant.value = null
                res.messageForVue = formDoneLogMessage(urlPrefix, res, data)
                addLogMessage(res.messageForVue)
                resolve(res)
            })
            .catch(err => {
                addLogMessage(formErrorLogMessage(err))
                reject(err)
            })
    })
}