<script setup>
import { watch, onMounted, onUnmounted } from 'vue';
import router from "/src/router.js"
import { authUser, activeOrdersForUser, logout, getActiveOrdersForUser }
  from '/src/store/axios-helper.js'
import { currentOrder } from '/src/store/client-helper.js'
import { intervalLoadActiveOrders, loadActiveOrdersForUserAndRestartInterval }
  from '/src/store/client/user-panel.js'

onMounted(() => {
  loadActiveOrdersForUserAndRestartInterval(authUser.value.id)
})

onUnmounted(() => {
  clearInterval(intervalLoadActiveOrders)
})

//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились - START
watch(authUser, () => {
  if (authUser.value == null) {
    router.push({ name: 'client.menu.popup.login-panel' })
    return
  }
})
//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились - END

function openOrderStatusPanel(order) {
  currentOrder.value = order
  router.push({ name: 'client.menu.popup.order-status-panel' })
}

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

    <template v-if="activeOrdersForUser.length > 0">
      <div v-for="order in activeOrdersForUser">
        {{ order.number }}
        {{ order.order_status }}
        {{ order.total_price }}р.
        <button @click.prevent="openOrderStatusPanel(order)">Подробнее</button>
      </div>
    </template>

  </div>
  <div v-else class="spinner-centr-display">
    <div class="spinner"></div>
  </div>
</template>
