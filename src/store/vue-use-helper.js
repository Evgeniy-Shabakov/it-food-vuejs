import { useTitle } from '@vueuse/core'
import { company, getModelAxios } from '/src/store/axios-helper.js'

const title = useTitle()

export function setBrowserTitleForClient() {
    getModelAxios('companies', 1)
        .then(() => {
            title.value = company.value.brand_title 
        })
}

export function setBrowserTitleForAdminPanel() {
    getModelAxios('companies', 1)
        .then(() => {
            title.value = company.value.brand_title + ' - Админка' 
        })
}

export function setBrowserTitleForOrderManager() {
    getModelAxios('companies', 1)
        .then(() => {
            title.value = company.value.brand_title + ' - Заказы' 
        })
}
