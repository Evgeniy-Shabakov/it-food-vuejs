<script setup>
import { totalPrice } from '/src/store/client-helper.js'

</script>

<template>
  <div class="dialog">
    <h3 class="dialog__title">Оформление заказа</h3>
    <div class="dialog__form">
      <div>
        <input class="dialog__adress" type="text" placeholder="Введите адрес">
        <input class="dialog__phone" type="tel" placeholder="Введите номер телефона">
      </div>

      <button class="client-btn-submit">ОФОРМИТЬ ЗА {{ totalPrice }}р.</button>
    </div>
  </div>
</template>
