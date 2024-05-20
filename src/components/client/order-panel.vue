<script setup>
import router from "/src/router.js"

import { currentAuthenticatedUser } from '/src/store/axios-helper.js'
import { totalPrice } from '/src/store/client-helper.js'
import { loginForOrder } from '/src/store/login-panel-helper.js'


if (currentAuthenticatedUser.value == null) {
  loginForOrder.value = true
  router.push({ name: 'client.menu.popup.login-panel' })
}


</script>

<template>
  <div class="dialog">
    <h3 class="dialog__title">Оформление заказа</h3>
    <div class="dialog__form">
      <div>
        <input class="dialog__adress" type="text" placeholder="Введите адрес">
        <input class="dialog__phone" type="tel" placeholder="Введите номер телефона">
      </div>

      <button class="btn btn-submit">ОФОРМИТЬ ЗА {{ totalPrice }}р.</button>
    </div>
  </div>
</template>
