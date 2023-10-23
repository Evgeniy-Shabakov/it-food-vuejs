import { useTitle, useFavicon } from '@vueuse/core'
import { company, getModelAxios } from '/src/store/axios-helper.js'

const title = useTitle()
const icon = useFavicon()

export function setBrowserTitleAndIconForClient() {
    getModelAxios('companies', 1)
        .then(() => {
            icon.value = company.value.favicon_url 
            title.value = company.value.brand_title 
        })
}

export function setBrowserTitleAndIconForAdminPanel() {
    getModelAxios('companies', 1)
        .then(() => {
            icon.value = company.value.favicon_url 
            title.value = company.value.brand_title + ' - Админка' 
        })
}
