<script setup>
import { watch } from 'vue';
import router from "/src/router.js"
import { currentAuthenticatedUser, logout } from '/src/store/axios-helper.js'
import { LoadingType } from '/src/store/loading-type';

//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились
watch(currentAuthenticatedUser, () => {
  if (currentAuthenticatedUser.value == null) {
    router.push({ name: 'client.menu.popup.login-panel' })
  }
})

function logoutVue() {
  logout()
  router.push({ name: 'client.menu' })
}

</script>

<template>
  <div v-if="currentAuthenticatedUser && currentAuthenticatedUser != LoadingType.Loading">
    <p>{{ currentAuthenticatedUser.name }}</p>
    <p>{{ currentAuthenticatedUser.phone }}</p>
    <button @click.prevent="logoutVue()" class="">Выйти</button>
  </div>
  <div v-else>Загрузка данных</div>
</template>
