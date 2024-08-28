<script setup>
import router from "/src/router.js"
import { currentOrder } from '/src/store/client-helper.js'
import { ORDER_TYPE } from '/src/store/data-types/order-type'

if (currentOrder.value == null) {
  router.push({ name: 'client.menu' })
}

</script>

<template>

  <div class="client-popup-page-layout__main-section">

    <h1 v-if="currentOrder" class="client-popup-page-layout__h1">
      {{ currentOrder.city.title }} - {{ currentOrder.order_type }}
    </h1>


    <div class="order-status-panel" v-if="currentOrder">

      <div class="order-status-panel__text-top">
        Ваш заказ оформлен! <br>
        Статус заказа можно отследить <br>
        в личном кабинете.
      </div>

      <div class="order-status-panel__text-description">номер заказа</div>
      <div class="order-status-panel__order-number">
        {{ currentOrder.number }}
      </div>

      <div class="order-status-panel__text-description">статус заказа</div>
      <div class="order-status-panel__order-status">
        {{ currentOrder.order_status }}
      </div>

      <div class="order-status-panel__text-description">данные заказа</div>
      <div class="order-status-panel__order-data">

        <div v-if="currentOrder.order_type == ORDER_TYPE.delivery">
          <span>Адрес: </span>
          <span v-if="currentOrder.user_address.title">
            {{ currentOrder.user_address.title }} -
          </span>
          {{ currentOrder.user_address.street }}
          {{ currentOrder.user_address.house_number }}
          <span v-if="currentOrder.user_address.corps_number">
            / {{ currentOrder.user_address.corps_number }}
          </span>
          <span v-if="currentOrder.user_address.apartment_number">
            - {{
              currentOrder.user_address.apartment_number }}
          </span>
        </div>

        <div v-else>
          <span>
            Ресторан: {{ currentOrder.restaurant.title }}
            ({{ currentOrder.restaurant.street }}
            -
            {{ currentOrder.restaurant.house_number }})
          </span>
        </div>

        <div>
          <span> Стоимость: </span>
          <span>{{ currentOrder.total_price }}р.</span>
        </div>

        <div>
          <span v-if="currentOrder.is_payment"> Заказа оплачен. </span>
          <span v-else> Заказ не оплачен. </span>
        </div>

        <div v-if="currentOrder.comment">
          <span>Ваш комментарий к заказу: </span>
          <span>{{ currentOrder.comment }}</span>
        </div>

      </div>

      <div class="order-status-panel__products-section">

        <template v-for="product in currentOrder.products">

          <img class="order-panel__product-img" :src="product.image_url" alt="">
          <div>{{ product.title }}</div>
          <div class="order-panel__count-price">
            <span>{{ product.quantity }}</span>
            <span> x {{ Number(product.price) }}р</span>
          </div>
          <div class="order-panel__product-total">
            {{ Number(product.quantity) * Number(product.price) }}р
          </div>

        </template>

      </div>



    </div>


  </div>

  <div class="client-popup-page-layout__btn-section">
    <button class="btn btn-submit order-status-panel__btn-order"
      @click.prevent="router.push({ name: 'client.menu.popup.user-panel' })">
      OK
    </button>
  </div>

</template>
