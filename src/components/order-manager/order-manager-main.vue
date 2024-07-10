<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, computed } from 'vue'

import { setBrowserTitleForOrderManager } from '/src/store/vue-use-helper'
import { initialize } from '/src/store/order-manager/order-manager-initialize.js'
import { ordersToday } from '/src/store/axios-helper.js'
import { loadOrdersToday } from '/src/store/loading-helper.js'
import { ORDER_STATUS } from '/src/store/data-types/order-status'
import { currentOrder } from '/src/store/order-manager/order-manager-full-order-helper.js'

import CitySelecte from '/src/components/client/city-selecte-component.vue'
import TimeComponent from '/src/components/order-manager/parts/order-manager-time.vue'
import MiniOrder from '/src/components/order-manager/parts/order-manager-mini-order.vue'
import FullOrder from '/src/components/order-manager/parts/order-manager-full-order.vue'

setBrowserTitleForOrderManager()

initialize()

const ordersNew = computed(() => {
  if (ordersToday.value)
    return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.CREATED)
})

const ordersAccepted = computed(() => {
  if (ordersToday.value)
    return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.ACCEPTED)
})

const ordersCooking = computed(() => {
  if (ordersToday.value)
    return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.COOKING)
})

const ordersPacking = computed(() => {
  if (ordersToday.value)
    return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.PACKING)
})

const ordersWaitingCourier = computed(() => {
  if (ordersToday.value)
    return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.WAITING_COURIER)
})

const ordersInTransit = computed(() => {
  if (ordersToday.value)
    return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.IN_TRANSIT)
})

const ordersAwaitingPickup = computed(() => {
  if (ordersToday.value)
    return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.AWAITING_PICKUP)
})

const ordersCompleted = computed(() => {
  if (ordersToday.value)
    return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.COMPLETED)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
})



//загрузка ordersToday через запрос в бэк - START
let intervalLoadOrders

onMounted(() => {
  intervalLoadOrders = setInterval(() => {
    loadOrdersToday()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(intervalLoadOrders)
})
//загрузка ordersToday через запрос в бэк - END

const reloadPage = () => {
  location.reload()
}
</script>

<template>
  <div class="order-manager-main">

    <header class="order-manager-main__header">

      <div>
        <button class="btn btn-submit" @click="reloadPage()" title="обновить">
          <i class="fa-solid fa-arrow-rotate-right"></i>
        </button>
      </div>

      <time-component class="order-manager-main__header__time"></time-component>

      <city-selecte class="order-manager-main__header__city-selecte"></city-selecte>

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
          <mini-order v-for="order in ordersCompleted" :key="order.id" :order="order"></mini-order>
        </div>
      </section>

      <full-order v-if="currentOrder"></full-order>

    </main>

  </div>
</template>
