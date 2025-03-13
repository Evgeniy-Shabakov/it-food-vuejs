<script setup>
import router from "/src/router.js"
import { currentOrder } from '/src/store/client-helper.js'
import { ORDER_TYPE } from '/src/store/data-types/order-type'

import IngredientsMini from '/src/components/client/block/ingredients-mini.vue'

if (currentOrder.value == null) {
  router.push({ name: 'client.menu' })
}

</script>

<template>

  <div class="client-popup-page-layout__main-section">

    <h1 v-if="currentOrder"
        class="client-popup-page-layout__h1">
      <span>{{ currentOrder.city.title }}</span> 
      <br> 
      <span class="order-status-panel__h1-type-delivery">({{ currentOrder.order_type }})</span>
    </h1>


    <div class="order-status-panel"
         v-if="currentOrder">

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
            <!-- добавить корпус при условии -->
          </span>

          <div v-if="currentOrder.order_type == ORDER_TYPE.inRestaurant">
            Тип подачи:
            <template v-if="currentOrder.table_number">
              Принести к столику № {{ currentOrder.table_number }}
            </template>
            <template v-else>
              Заберу сам
            </template>
          </div>

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

          <div>

            <div class="order-panel__product-img-and-title">
              <img class="order-panel__product-img"
                   :src="product.image_url"
                   alt="">
              <span>{{ product.title }}</span>
            </div>

            <IngredientsMini v-if="product.user_config_id"
                             :baseIngredients="product.user_config_base_ingredients"
                             :additionalIngredients="product.user_config_additional_ingredients" />

          </div>

          <div class="order-panel__count-price">
            {{ product.quantity }} x {{ Number(product.price) }}р
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
