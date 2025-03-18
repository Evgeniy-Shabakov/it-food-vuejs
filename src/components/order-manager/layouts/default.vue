<script setup>
import { onUnmounted, watch, computed } from 'vue'

import { categories, getModelsAxios } from '/src/store/axios-helper.js'
import { setBrowserTitleForOrderManager } from '/src/store/vue-use-helper'
import { initialize } from '/src/store/order-manager/order-manager-initialize.js'
import {
   loadOrdersTodayAndRestartInterval, intervalLoadOrders, ordersActive
} from '/src/store/order-manager/order-manager-helper.js'
import { authUser, logout } from '/src/store/axios-helper.js'
import { selectedRestaurant } from '/src/store/client-helper.js'
import router from "/src/router.js"

import CitySelecte from '/src/components/client/modules/city-selecte-component.vue'
import RestaurantSelecte from '/src/components/order-manager/components/restaurant-selecte.vue'
import TimeComponent from '/src/components/order-manager/components/order-manager-time.vue'

setBrowserTitleForOrderManager()

initialize()

getModelsAxios('categories').then(() => {
   //убираем из списка неактивные продукты и пустые категории чтобы не отображались
   categories.value.forEach(category => {
      category.products = category.products.filter(product => product.is_active == true)
   })
   categories.value = categories.value.filter(category => category.products.length > 0)
})

const quantityProductsInStopList = computed(() => {
   if(!categories.value) return

   let total = 0
   categories.value.forEach(category => {
      category.products.forEach(product => {
         if(product.stop_list) {
            total +=1
         }
      })
   })

   return total
})

watch(selectedRestaurant, () => {
   loadOrdersTodayAndRestartInterval(selectedRestaurant.value.id) //первый старт проиходит при назначении ресторана при загрузке страницы
})

onUnmounted(() => {
   clearInterval(intervalLoadOrders)
})

function reloadPage() {
   location.reload()
}

function logoutInManagerPanel() {
   logout().then(() => {
      router.push({ name: 'client.menu' })
   })
}
</script>

<template>
   <div class="order-manager-layout-default">

      <header class="order-manager-layout-default__header">

         <div class="order-manager-layout-default__header__user-name-section">
            <button class="btn btn-submit"
                    @click.prevent="reloadPage()"
                    title="обновить страницу">
               <i class="fa-solid fa-arrow-rotate-right"></i>
            </button>

            <span v-if="authUser">
               {{ authUser.employee.first_name }} {{ authUser.employee.last_name }}
            </span>

            <button class="order-manager-layout-default__header__btn-exit"
                    @click.prevent="logoutInManagerPanel()"
                    title="выйти">
               <i class="fa-solid fa-right-from-bracket"></i>
            </button>

            <router-link :to="{ name: 'order-manager.index' }">
               Заказы ({{ ordersActive }} шт.)
            </router-link>

            <router-link :to="{ name: 'order-manager.stop-list' }">
               Стоп-лист ({{ quantityProductsInStopList }} шт.)
            </router-link>
         </div>

         <time-component class="order-manager-layout-default__header__time"></time-component>

         <div class="order-manager-layout-default__header__city-restaurant-section">
            <city-selecte></city-selecte>
            <restaurant-selecte></restaurant-selecte>
         </div>

      </header>

      <router-view />

   </div>
</template>

<style scoped>
.order-manager-layout-default {
   display: flex;
   flex-direction: column;
   gap: 5px;
   height: 100vh;
}

.order-manager-layout-default__header {
   background-color: rgba(0, 128, 0, 0.5);
   padding: 15px;

   display: grid;
   grid-template-columns: 3fr 1fr 4fr;
   align-items: center;
   gap: 15px;
}

.order-manager-layout-default__header__user-name-section {
   display: flex;
   align-items: center;
   gap: 15px;
   font-size: 16px;
}

.order-manager-layout-default__header__btn-exit {
   font-size: 20px;
}

.order-manager-layout-default__header__time {
   justify-self: center;
}

.order-manager-layout-default__header__city-restaurant-section {
   justify-self: end;
   width: 100%;
   display: flex;
   gap: 15px;
}
</style>
