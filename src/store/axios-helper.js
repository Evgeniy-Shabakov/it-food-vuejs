import { ref } from 'vue';
import { addLogMessage, formErrorLogMessage, formDoneLogMessage } from '/src/store/log-messages.js'
import axios from 'axios'
import { serverApiUrl } from '/src/config.js'

axios.defaults.baseURL = serverApiUrl
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const company = ref()

export const countries = ref()
export const currentCountry = ref()

export const cities = ref()
export const currentCity = ref()

export const restaurants = ref()
export const currentRestaurant = ref()

export const categories = ref()
export const currentCategory = ref()

export const products = ref()
export const currentProduct = ref()

export const textLoadOrFailForVue = ref('Загрузка данных...')

export function getModelsAxios(urlPrefix) {
    return new Promise(function (resolve, reject) {
        axios
            .get(`/${urlPrefix}`)
            .then(res => {
                if (urlPrefix == 'countries') countries.value = res.data.data
                else if (urlPrefix == 'cities') cities.value = res.data.data
                else if (urlPrefix == 'restaurants') restaurants.value = res.data.data
                else if (urlPrefix == 'categories') categories.value = res.data.data
                else if (urlPrefix == 'products') products.value = res.data.data
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
            .get(`/${urlPrefix}/${id}`)
            .then(res => {
                if (urlPrefix == 'countries') currentCountry.value = res.data.data
                else if (urlPrefix == 'cities') currentCity.value = res.data.data
                else if (urlPrefix == 'restaurants') currentRestaurant.value = res.data.data
                else if (urlPrefix == 'categories') currentCategory.value = res.data.data
                else if (urlPrefix == 'products') currentProduct.value = res.data.data
                else if (urlPrefix == 'companies') company.value = res.data.data
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
            .post(`/${urlPrefix}`, data)
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
    if (urlPrefix == 'companies' || urlPrefix == 'products') {
        data.append("_method", "PATCH");
        return new Promise(function (resolve, reject) {
            axios
                .post(`/${urlPrefix}/${data.get('id')}`, data)
                .then(res => {
                    if (urlPrefix == 'companies') company.value = res.data.data
                    if (urlPrefix == 'products') currentProduct.value = res.data.data
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

    return new Promise(function (resolve, reject) {
        axios
            .patch(`/${urlPrefix}/${data.id}`, data)
            .then(res => {
                if (urlPrefix == 'countries') currentCountry.value = res.data.data
                else if (urlPrefix == 'cities') currentCity.value = res.data.data
                else if (urlPrefix == 'restaurants') currentRestaurant.value = res.data.data
                else if (urlPrefix == 'categories') currentCategory.value = res.data.data
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
            .delete(`/${urlPrefix}/${data.id}`)
            .then(res => {
                if (urlPrefix == 'countries') currentCountry.value = null
                else if (urlPrefix == 'cities') currentCity.value = null
                else if (urlPrefix == 'restaurants') currentRestaurant.value = null
                else if (urlPrefix == 'categories') currentCategory.value = null
                else if (urlPrefix == 'products') currentProduct.value = null
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