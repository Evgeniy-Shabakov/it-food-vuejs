<script setup>
import { totalPrice } from '/src/store/client-helper.js'

</script>

<template>
  <div class="order-panel">
    <h3 class="order-panel__title">Оформление заказа</h3>
    <div class="order-panel__form">
      <div>
        <input class="order-panel__adress" type="text" placeholder="Введите адрес">
        <input class="order-panel__phone" type="tel" placeholder="Введите номер телефона">
      </div>

      <button class="order-panel__btn-order">ОФОРМИТЬ ЗА {{ totalPrice }}р.</button>
    </div>
  </div>
</template>
