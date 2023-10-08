import './assets/main.css'
import './assets/fontawesome-free-6.4.2-web/css/all.css'

import { createApp } from 'vue'
import App from './App.vue'

import router from "./router"

createApp(App).use(router).mount('#app')

export const serverApiUrl = 'http://127.0.0.1:8000/api/v1'
