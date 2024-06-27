<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import router from "/src/router.js"
import { currentOrder } from '/src/store/client-helper.js'

if(currentOrder.value == null) {
  router.push({ name: 'client.menu' })
}

console.log(currentOrder.value)
</script>

<template>
  <div class="order-status-panel" v-if="currentOrder">

    <div class="order-status-panel__main-section">
      <div class="order-status-panel__text-top">ВАШ ЗАКАЗ ОФОРМЛЕН</div>
      <div class="order-status-panel__text-description">номер заказа</div>
      <div class="order-status-panel__order-number">
        {{currentOrder.number}}
      </div>
      <div class="order-status-panel__text-description">статус заказа</div>
      <div class="order-status-panel__order-status">
        {{currentOrder.order_status}}
      </div>
    </div>

    <div class="order-status-panel__btn-section">
      <button class="btn btn-submit order-status-panel__btn-order"
        @click.prevent="router.push({ name: 'client.menu' })">
        OK
      </button>
    </div>

  </div>
</template>
