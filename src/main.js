import './assets/fontawesome-free-6.4.2-web/css/all.css'
import './assets/main.css'
import './assets/media-device.css'
import './assets/admin.css'

import { createApp } from 'vue'
import App from './App.vue'

import router from "./router"

let server_local = 'http://127.0.0.1:8000/api/v1'
let server_hosting = 'https://u2315899.isp.regruhosting.ru/api/v1'

export const serverApiUrl = server_local

createApp(App).use(router).mount('#app')


