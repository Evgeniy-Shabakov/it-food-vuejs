import { ref } from 'vue';
import axios from 'axios'

import { addLogMessage, formErrorLogMessage, formDoneLogMessage } from '/src/store/log-messages.js'
import { serverApiUrl, serverUrl } from '/src/config.js'
import { inputedPhone } from '/src/store/login-panel-helper.js'
import { currentTimezone } from '/src/store/timezone-helper.js'


axios.defaults.baseURL = serverApiUrl
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const authUser = ref()

export const company = ref()

export const roles = ref()

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

export const employees = ref()
export const currentEmployee = ref()

export const ordersToday = ref()

export const activeOrdersForUser = ref([])

export const textLoadOrFailForVue = ref('Загрузка данных...')

export function sendVerifyCode(data) {
    return new Promise(async function (resolve, reject) {
        await axios
            .get(`${serverUrl}/sanctum/csrf-cookie`)
            .catch(err => {
                console.log(err);
                reject(err)
            })

        await axios
            .post(`${serverUrl}/send-verify-code`, data)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                console.log(err);
                reject(err)
            })
    })
}

export function login(data) {
    return new Promise(function (resolve, reject) {
        axios
            .post(`${serverUrl}/login`, data)
            .then(res => {
                authUser.value = res.data
                resolve(res)
            })
            .catch(err => {
                console.log(err);
                reject(err)
            })
    })

}

export async function logout() {
    try {
        const res = await axios.delete(`${serverUrl}/logout`)
        inputedPhone.value = ''
        authUser.value = null

        return res
    }
    catch(error) {
        console.log(error)
        throw error
    }
}

export function getAuthUser() {
    return new Promise(function (resolve, reject) {
        axios
            .get(`/get-auth-user`)
            .then(res => {
                authUser.value = res.data.data
                resolve(res)
            })
            .catch(err => {

                reject(err)
            })
    })
}

export async function getOrdersToday(restaurantId) {
    try {
        const res = await axios.get(`/orders/today/${restaurantId}`, {
            params: {
                timezone: currentTimezone.value
            }
        })
        
        ordersToday.value = res.data.data
        return res
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getActiveOrdersForUser(userID) {
    try {
        const res = await axios.get(`/users/${userID}/active-orders`)

        activeOrdersForUser.value = res.data.data
        return res
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getModelsAxios(urlPrefix) {
    try {
        const res = await axios.get(`/${urlPrefix}`)

        if (urlPrefix == 'countries') countries.value = res.data.data
        else if (urlPrefix == 'cities') cities.value = res.data.data
        else if (urlPrefix == 'restaurants') restaurants.value = res.data.data
        else if (urlPrefix == 'categories') categories.value = res.data.data
        else if (urlPrefix == 'products') products.value = res.data.data
        else if (urlPrefix == 'employees') employees.value = res.data.data
        else if (urlPrefix == 'roles') roles.value = res.data.data

        return res
    } catch (error) {
        textLoadOrFailForVue.value = 'Ошибка загрузки данных'
        addLogMessage(formErrorLogMessage(error))
        throw error
    }
}

export async function getModelAxios(urlPrefix, id) {
    try {
        const res = await axios.get(`/${urlPrefix}/${id}`)

        if (urlPrefix == 'countries') currentCountry.value = res.data.data
        else if (urlPrefix == 'cities') currentCity.value = res.data.data
        else if (urlPrefix == 'restaurants') currentRestaurant.value = res.data.data
        else if (urlPrefix == 'categories') currentCategory.value = res.data.data
        else if (urlPrefix == 'products') currentProduct.value = res.data.data
        else if (urlPrefix == 'companies') company.value = res.data.data
        else if (urlPrefix == 'employees') currentEmployee.value = res.data.data

        return res
    } catch (error) {
        textLoadOrFailForVue.value = 'Ошибка загрузки данных'
        addLogMessage(formErrorLogMessage(error))
        throw error
    }
}

export async function storeModelAxios(urlPrefix, data) {
    try {
        const res = await axios.post(`/${urlPrefix}`, data)

        res.messageForVue = formDoneLogMessage(urlPrefix, res, data)
        addLogMessage(res.messageForVue)

        return res
    } catch (error) {
        addLogMessage(formErrorLogMessage(error))
        throw error
    }
}

export async function updateModelAxios(urlPrefix, data) {
    //если нужно передавать файлы метод post
    if (urlPrefix == 'companies' || urlPrefix == 'products') {
        data.append("_method", "PATCH");

        try {
            const res = await axios.post(`/${urlPrefix}/${data.get('id')}`, data)

            if (urlPrefix == 'companies') company.value = res.data.data
            if (urlPrefix == 'products') currentProduct.value = res.data.data
            res.messageForVue = formDoneLogMessage(urlPrefix, res, data)
            addLogMessage(res.messageForVue)

            return res
        } catch (error) {
            addLogMessage(formErrorLogMessage(error))
            throw error
        }
    }

    //если передавать файлы не нужно метод patch
    try {
        const res = await axios.patch(`/${urlPrefix}/${data.id}`, data)

        if (urlPrefix == 'countries') currentCountry.value = res.data.data
        else if (urlPrefix == 'cities') currentCity.value = res.data.data
        else if (urlPrefix == 'restaurants') currentRestaurant.value = res.data.data
        else if (urlPrefix == 'categories') currentCategory.value = res.data.data
        else if (urlPrefix == 'employees') currentEmployee.value = res.data.data
        res.messageForVue = formDoneLogMessage(urlPrefix, res, data)
        addLogMessage(res.messageForVue)

        return res
    } catch (error) {
        addLogMessage(formErrorLogMessage(error))
        throw error
    }
}

export async function deleteModelAxios(urlPrefix, data) {
    try {
        const res = await axios.delete(`/${urlPrefix}/${data.id}`)

        if (urlPrefix == 'countries') currentCountry.value = null
        else if (urlPrefix == 'cities') currentCity.value = null
        else if (urlPrefix == 'restaurants') currentRestaurant.value = null
        else if (urlPrefix == 'categories') currentCategory.value = null
        else if (urlPrefix == 'products') currentProduct.value = null
        else if (urlPrefix == 'employees') currentEmployee.value = null
        res.messageForVue = formDoneLogMessage(urlPrefix, res, data)
        addLogMessage(res.messageForVue)

        return res
    } catch (error) {
        addLogMessage(formErrorLogMessage(error))
        throw error
    }
}