<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

import router from "/src/router.js"
import { authUser, activeOrdersForUser, lastOrderForUser, getLastOrderForUser }
  from '/src/store/axios-helper.js'
import { currentOrder, logoutClient } from '/src/store/client-helper.js'
import { intervalLoadActiveOrders, loadActiveOrdersForUserAndRestartInterval }
  from '/src/store/client/user-panel.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type'
import { repeatOrder } from '/src/store/client/user-panel'

const lastOrderLoadingType = ref(LOADING_TYPE.loading)

onMounted(() => {
  if (authUser.value == null) {
    router.push({ name: 'client.menu.popup.login-panel' })
    return
  }

  loadActiveOrdersForUserAndRestartInterval(authUser.value.id)

  if (lastOrderForUser.value) {
    lastOrderLoadingType.value = LOADING_TYPE.complete
  }
  else {
    getLastOrderForUser(authUser.value.id)
      .then(() => lastOrderLoadingType.value = LOADING_TYPE.complete)
      .catch(() => lastOrderLoadingType.value = LOADING_TYPE.error)
  }
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
  logoutClient()
  router.push({ name: 'client.menu' })
}

function openOrdersHistory() {
  router.push({ name: 'client.menu.popup.orders-history' })
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


      <button @click.prevent="" class="btn--secondary">Адреса доставки</button>
      <button @click.prevent="logoutVue()" class="btn--secondary">Управление профилем</button>
      <button @click.prevent="openOrdersHistory()" class="btn--secondary">История заказов</button>

      <section class="user-panel__order-section">
        <h2 class="user-panel__order-section-h2">Активные заказы</h2>
        <div v-if="activeOrdersForUser.length > 0" class="user-panel__active-orders-list">

          <div v-for="order in activeOrdersForUser" class="active-order">
            <span>
              №{{ order.number }}
            </span>
            <div class="active-order__status">
              <span>{{ order.order_status }}</span>
              <div class="loader">
                <div class="bar"></div>
              </div>
            </div>
            <button @click.prevent="openOrderStatusPanel(order)" class="btn--secondary">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

        </div>
        <p v-else class="user-panel__order-section-text">У вас нет активных заказов</p>
      </section>

      <section class="user-panel__order-section">

        <h2 class="user-panel__order-section-h2">Последний заказ</h2>

        <div v-if="lastOrderLoadingType == LOADING_TYPE.loading" class="spinner-fixed-heigth">
          <div class="spinner"> </div>
        </div>

        <template v-else-if="lastOrderLoadingType == LOADING_TYPE.complete">

          <div v-if="lastOrderForUser" class="order-panel__products-section">

            <template v-for="product in lastOrderForUser.products">

              <img class="order-panel__product-img" :src="product.image_url" alt="">
              <span>{{ product.title }}</span>
              <span class="order-panel__count-price"> {{ product.quantity }} </span>
              <span> шт. </span>

            </template>

          </div>

          <p v-else class="user-panel__order-section-text">У вас еще не было заказов</p>

        </template>

        <div v-else>Ошибка загрузки...</div>

      </section>



    </div>

    <div class="user-panel__btn-section">
      <button @click=repeatOrder(lastOrderForUser) class="btn btn-submit user-panel__btn-repeat-order">
        Повторить последний заказ
      </button>
    </div>

  </div>

  <div v-else class="spinner-centr-display">
    <div class="spinner"></div>
  </div>

</template>
