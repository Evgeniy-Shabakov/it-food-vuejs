import { useTitle } from '@vueuse/core'
import { company, getModelAxios } from '/src/store/axios-helper.js'

const browserTitle = useTitle()

export function setBrowserTitleForClient() {
    //т.к. при инициализации данные о компании загружаются не сразу
    //то пробуем изменить title страницы через 200мс
    if(company.value == null) {
        setTimeout(setBrowserTitleForClient, 200)
        return
    }
    
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
