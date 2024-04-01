import './css'
import './viewport-height-helper'

import { createApp } from 'vue'
import App from './App.vue'

import router from "./router"

let server_local = 'http://127.0.0.1:8000/api/v1'
let server_hosting = 'https://api.food-it.ru/api/v1'

export const serverApiUrl = server_hosting

createApp(App).use(router).mount('#app')


