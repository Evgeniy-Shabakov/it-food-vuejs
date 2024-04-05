import './css'
import '/src/store/vh-mobile-helper'

import { createApp } from 'vue'
import App from './App.vue'

import router from "./router"

const server_local = 'http://localhost:8000'
const server_hosting = 'https://api.food-it.ru'

const server_api_local = 'http://localhost:8000/api/v1'
const server_api_hosting = 'https://api.food-it.ru/api/v1'

export const serverUrl = server_local
export const serverApiUrl = server_api_local

createApp(App).use(router).mount('#app')




