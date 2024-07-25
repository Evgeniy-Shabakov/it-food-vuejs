<script setup>
import { watch, onMounted, onUnmounted } from 'vue';
import router from "/src/router.js"
import { authUser, activeOrdersForUser, logout } from '/src/store/axios-helper.js'
import { currentOrder } from '/src/store/client-helper.js'
import { intervalLoadActiveOrders, loadActiveOrdersForUserAndRestartInterval }
  from '/src/store/client/user-panel.js'

onMounted(() => {
  if (authUser.value == null) {
    router.push({ name: 'client.menu.popup.login-panel' })
    return
  }

  loadActiveOrdersForUserAndRestartInterval(authUser.value.id)
})

//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились - START
watch(authUser, () => {
  if (authUser.value == null)
    router.push({ name: 'client.menu.popup.login-panel' })
})
//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились - END

onUnmounted(() => {
  clearInterval(intervalLoadActiveOrders)
})

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
  <div v-if="authUser" class="user-panel">

    <div class="user-panel__main-section">

      <h1 class="user-panel__h1">Данные профиля</h1>

      <section class="user-panel__name-section">
        <span>{{ authUser.name || 'Гость' }} ({{ authUser.phone }})</span>
        <button @click.prevent="" class="btn--secondary"><i class="fa-solid fa-pen"></i></button>
      </section>


      <button @click.prevent="" class="btn--secondary">Управление адресами доставки</button>
      <button @click.prevent="" class="btn--secondary">История заказов</button>
      <button @click.prevent="logoutVue()" class="btn--secondary">Выйти</button>

      <section>
        <h2 class="user-panel__h2">Активные заказы</h2>
        <template v-if="activeOrdersForUser.length > 0">
          <div v-for="order in activeOrdersForUser">
            {{ order.number }}
            {{ order.order_status }}
            {{ order.total_price }}р.
            <button @click.prevent="openOrderStatusPanel(order)">Подробнее</button>
          </div>
        </template>
        <p v-else>У вас нет активных заказов</p>
      </section>

    </div>

    <div class="user-panel__btn-section">
      <button class="btn btn-submit user-panel__btn-repeat-order">Повторить последний заказ</button>
    </div>

  </div>

  <div v-else class="spinner-centr-display">
    <div class="spinner"></div>
  </div>

</template>
