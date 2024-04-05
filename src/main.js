import './css'
import '/src/store/vh-mobile-helper'

import { createApp } from 'vue'
import App from './App.vue'

import router from "./router"

createApp(App).use(router).mount('#app')




