import './assets/fontawesome-free-6.4.2-web/css/all.css'
import './assets/main.css'
import './assets/media-device.css'
import './assets/admin.css'

import { createApp } from 'vue'
import App from './App.vue'

import router from "./router"

export const serverApiUrl = 'http://127.0.0.1:8000/api/v1'

createApp(App).use(router).mount('#app')


