<script setup>
import { onUnmounted, watch } from 'vue'

import { setBrowserTitleForOrderManager } from '/src/store/vue-use-helper'
import { initialize } from '/src/store/order-manager/order-manager-initialize.js'
import {
  ordersNew, ordersAccepted, ordersCooking, ordersPacking, ordersWaitingCourier, ordersInTransit,
  ordersAwaitingPickup, ordersCompletedOrCansel, loadOrdersTodayAndRestartInterval, intervalLoadOrders
} from '/src/store/order-manager/order-manager-helper.js'
import { fullOrder } from '/src/store/order-manager/order-manager-order-helper.js'
import { authUser, logout } from '/src/store/axios-helper.js'
import { selectedRestaurant } from '/src/store/client-helper.js'
import router from "/src/router.js"

import CitySelecte from '/src/components/client/city-selecte-component.vue'
import RestaurantSelecte from '/src/components/restaurant-selecte.vue'
import TimeComponent from '/src/components/order-manager/parts/order-manager-time.vue'
import MiniOrder from '/src/components/order-manager/parts/order-manager-mini-order.vue'
import FullOrder from '/src/components/order-manager/parts/order-manager-full-order.vue'

setBrowserTitleForOrderManager()

initialize()

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
  <div class="order-manager-main">
        
    <header class="order-manager-main__header">

      <div class="order-manager-main__header__user-name-section">
        <button class="btn btn-submit" @click.prevent="reloadPage()" title="обновить страницу">
          <i class="fa-solid fa-arrow-rotate-right"></i>
        </button>

        <span v-if="authUser">
          {{ authUser.employee.first_name }} {{ authUser.employee.last_name }}
        </span>

        <button class="order-manager-main__header__btn-exit" @click.prevent="logoutInManagerPanel()" title="выйти">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>

      <time-component class="order-manager-main__header__time"></time-component>

      <div class="order-manager-main__header__city-restaurant-section">
        <city-selecte></city-selecte>
        <restaurant-selecte></restaurant-selecte>
      </div>

    </header>

    <main class="order-manager-main__main">

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Новые заказы</h4>
        <div class="order-manager-main__status-column__main">
          <mini-order v-for="order in ordersNew" :key="order.id" :order="order"></mini-order>
        </div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Принятые в работу</h4>
        <div class="order-manager-main__status-column__main">
          <mini-order v-for="order in ordersAccepted" :key="order.id" :order="order"></mini-order>
        </div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Готовятся</h4>
        <div class="order-manager-main__status-column__main">
          <mini-order v-for="order in ordersCooking" :key="order.id" :order="order"></mini-order>
        </div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Собираются</h4>
        <div class="order-manager-main__status-column__main">
          <mini-order v-for="order in ordersPacking" :key="order.id" :order="order"></mini-order>
        </div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Ожидают курьера</h4>
        <div class="order-manager-main__status-column__main">
          <mini-order v-for="order in ordersWaitingCourier" :key="order.id" :order="order"></mini-order>
        </div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">В пути</h4>
        <div class="order-manager-main__status-column__main">
          <mini-order v-for="order in ordersInTransit" :key="order.id" :order="order"></mini-order>
        </div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Готов и ожидает выдачи</h4>
        <div class="order-manager-main__status-column__main">
          <mini-order v-for="order in ordersAwaitingPickup" :key="order.id" :order="order"></mini-order>
        </div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Завершен</h4>
        <div class="order-manager-main__status-column__main">
          <mini-order v-for="order in ordersCompletedOrCansel" :key="order.id" :order="order"></mini-order>
        </div>
      </section>

      <full-order v-if="fullOrder"></full-order>
      <div v-else class="order-manager-main__full-order-description">
        <p>Нет ни одного активного заказа.</p>
        <p>Если появится активный заказ, он отобразится автоматически.</p>
        <p>Кликните на заказ, чтобы отобразить его данные.</p>
      </div>

    </main>

  </div>
</template>
