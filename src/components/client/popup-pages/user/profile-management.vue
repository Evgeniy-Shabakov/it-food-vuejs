<script setup>
import router from "/src/router.js"
import { logoutClient } from '/src/store/client-helper.js'
import { authUser } from '/src/store/axios-helper.js'

function logoutVue() {
  logoutClient()
  router.push({ name: 'client.menu' })
}

</script>

<template>

  <div class="client-popup-page-layout__main-section">

    <h1 class="client-popup-page-layout__h1">Управление профилем</h1>


    <div v-if="authUser">

      <button @click.prevent="logoutVue()" class="btn--secondary client-popup-page-layout__btn-w-100">
        Выйти из профиля
      </button>

    </div>

    <div v-else class="spinner-centr-display">
      <div class="spinner"></div>
    </div>


  </div>

  <div class="client-popup-page-layout__btn-section">
    <router-link :to="{ name: 'client.menu.popup.user-panel' }" class="client-popup-page-layout__btn-w-100">
      <button @click="" class="btn btn-submit client-popup-page-layout__btn-w-100">
        Назад
      </button>
    </router-link>
  </div>

</template>
