<script setup>
import { watch } from 'vue';
import router from "/src/router.js"
import { authUser, logout } from '/src/store/axios-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type'

//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились
watch(authUser, () => {
  if (authUser.value == null) {
    router.push({ name: 'client.menu.popup.login-panel' })
  }
})

function logoutVue() {
  logout()
  router.push({ name: 'client.menu' })
}

</script>

<template>
  <div v-if="authUser">
    <p>{{ authUser.name }}</p>
    <p>{{ authUser.phone }}</p>
    <button @click.prevent="logoutVue()" class="">Выйти</button>

    <div class="order-panel__btn-section">
      <button class="btn btn-submit order-panel__btn-order">Повторить последний заказ</button>
    </div>
  </div>
  <div v-else class="spinner-centr-display">
    <div class="spinner"></div>
  </div>
</template>
