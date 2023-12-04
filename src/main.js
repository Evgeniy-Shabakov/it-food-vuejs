import './assets/fontawesome-free-6.4.2-web/css/all.css'
import './assets/main.css'
import './assets/media-device.css'
import './assets/admin.css'

import { createApp } from 'vue'
import App from './App.vue'

import router from "./router"

let server_local = 'http://127.0.0.1:8000/api/v1'
let server_hosting = 'http://81.31.246.56/api/v1'

export const serverApiUrl = server_hosting

createApp(App).use(router).mount('#app')


