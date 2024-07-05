<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { setBrowserTitleForOrderManager } from '/src/store/vue-use-helper'
import { initialize } from '/src/store/order-manager-initialize.js'
import { ordersToday } from '/src/store/axios-helper.js'
import { loadOrdersToday } from '/src/store/loading-helper.js'

import CitySelecte from '/src/components/client/city-selecte-component.vue'
import TimeComponent from '/src/components/order-manager/parts/order-manager-time.vue'
import MiniOrder from '/src/components/order-manager/parts/order-manager-mini-order.vue'

setBrowserTitleForOrderManager()

initialize()

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
          <mini-order v-for="order in ordersToday" :order="order"></mini-order>
        </div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Принятые в работу</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Готовятся</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Собираются</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Ожидают курьера</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">В пути</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Готов и ожидает выдачи</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </section>

      <section class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Завершен</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </section>

    </main>

  </div>
</template>
