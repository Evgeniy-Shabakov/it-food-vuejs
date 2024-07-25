import { useTitle } from '@vueuse/core'
import { company, getModelAxios } from '/src/store/axios-helper.js'

const browserTitle = useTitle()

export function setBrowserTitleForClient() {
    if(company.value == null) return
    
    browserTitle.value = company.value.brand_title
}

export function setBrowserTitleForAdminPanel() {
    getModelAxios('companies', 1)
        .then(() => {
            browserTitle.value = company.value.brand_title + ' - Админка' 
        })
}

export function setBrowserTitleForOrderManager() {
    getModelAxios('companies', 1)
        .then(() => {
            browserTitle.value = company.value.brand_title + ' - Заказы' 
        })
}
