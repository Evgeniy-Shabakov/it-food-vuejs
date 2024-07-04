<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import { setBrowserTitleForOrderManager } from '/src/store/vue-use-helper'
import { initializeCity } from '/src/store/client-initialize.js'

import CitySelecte from '/src/components/client/city-selecte-component.vue';

setBrowserTitleForOrderManager()

initializeCity()

const currentTime = ref(new Date().toLocaleTimeString())

// работа со временем - СТАРТ
let intervalTime
onMounted(() => {
  intervalTime = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalTime)
})
// работа со временем - СТОП

const reload = () => {
  location.reload()
}
</script>

<template>
  <div class="order-manager-main">

    <section class="order-manager-main__header">

      <div>
        <button class="btn btn-submit" @click="reload()" title="обновить">
          <i class="fa-solid fa-arrow-rotate-right"></i>
        </button>
      </div>

      <div class="order-manager-main__header__time">
        {{ currentTime }}
      </div>

      <div class="order-manager-main__header__city-selecte">
        <city-selecte></city-selecte>
      </div>

    </section>

    <section class="order-manager-main__main">

      <div class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Новые заказы</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </div>

      <div class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Принятые в работу</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </div>

      <div class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Готовятся</h4>
        <div class="order-manager-main__status-column__main">
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
          <div>Перечень заказов</div>
        </div>
      </div>

      <div class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Собираются</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </div>

      <div class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Ожидают курьера</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </div>
      <div class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">В пути</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </div>

      <div class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Готов и ожидает выдачи</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </div>

      <div class="order-manager-main__status-column">
        <h4 class="order-manager-main__status-column__header">Завершен</h4>
        <div class="order-manager-main__status-column__main">Перечень заказов</div>
      </div>

    </section>

  </div>
</template>
