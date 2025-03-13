<script setup>
import {
  selectedCity, productsInCart, totalProductPrice, deliveryPrice, totalPrice,
  deliveryAvailableInSelectedCity, pickUpAvailableInSelectedCity, restaurantAvailableInSelectedCity,
  selectedOrderType
} from '/src/store/client-helper.js'
import { ORDER_TYPE } from '/src/store/data-types/order-type';

import CitySelecte from '/src/components/client/modules/city-selecte-component.vue'
import CartItem from '/src/components/client/block/cart-item.vue'

//уникальные id для каждого компонента радиокнопок
const idDeliveryRadioBtn = `option1` + generateRandomNumber()
const idPickUpRadioBtn = `option1` + generateRandomNumber()
const idInRestaurantRadioBtn = `option1` + generateRandomNumber()

function generateRandomNumber() {
  // Генерируем случайное число от 1000 до 9999
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return randomNumber;
}

</script>

<template>

  <div class="client-popup-page-layout__main-section">


    <div v-if="selectedCity"
         class="cart-panel">

      <div class="cart-panel__order-settings-section">

        <div class="cart-panel__city-selecte">
          <city-selecte></city-selecte>
        </div>

        <div class="order-settings">

          <div v-if="deliveryAvailableInSelectedCity"
               class="order-settings__radio-button">
            <input class="order-settings__radio-button__input"
                   type="radio"
                   :id="`${idDeliveryRadioBtn}`"
                   :value=ORDER_TYPE.delivery
                   v-model="selectedOrderType">
            <label class="order-settings__radio-button__label"
                   :for="`${idDeliveryRadioBtn}`">Доставка</label>
          </div>

          <div v-if="pickUpAvailableInSelectedCity"
               class="order-settings__radio-button">
            <input class="order-settings__radio-button__input"
                   type="radio"
                   :id="`${idPickUpRadioBtn}`"
                   :value=ORDER_TYPE.pickUp
                   v-model="selectedOrderType">
            <label class="order-settings__radio-button__label"
                   :for="`${idPickUpRadioBtn}`">Самовывоз</label>
          </div>

          <div v-if="restaurantAvailableInSelectedCity"
               class="order-settings__radio-button">
            <input class="order-settings__radio-button__input"
                   type="radio"
                   :id="`${idInRestaurantRadioBtn}`"
                   :value=ORDER_TYPE.inRestaurant
                   v-model="selectedOrderType">
            <label class="order-settings__radio-button__label"
                   :for="`${idInRestaurantRadioBtn}`">В ресторане</label>
          </div>

        </div>

      </div>

      <div class="cart-panel__products-section">

        <CartItem v-for="product in productsInCart"
                  :productOrUserConfig="product" />

        <div v-if="selectedOrderType == ORDER_TYPE.delivery"
             class="cart-item cart-panel__delivery-section">
          <i class="cart-panel__icon-delivery fa-solid fa-truck"></i>
          <div class="cart-item__title">Доставка</div>
          <div class="cart-item__total">{{ deliveryPrice }}р</div>
        </div>

      </div>

    </div>

    <div v-else
         class="spinner-centr-display">
      <div class="spinner"></div>
    </div>


  </div>

  <div class="client-popup-page-layout__btn-section">
    <div v-if="selectedCity"
         class="cart-panel__total-order-section">

      <div class="cart-panel__block-total">
        <span v-if="selectedOrderType == ORDER_TYPE.delivery"
              class="cart-panel__total">Товары: </span>
        <span v-if="selectedOrderType == ORDER_TYPE.delivery"
              class="cart-panel__total">{{ totalProductPrice
          }}р.</span>
        <span v-if="selectedOrderType == ORDER_TYPE.delivery"
              class="cart-panel__total">Доставка: </span>
        <span v-if="selectedOrderType == ORDER_TYPE.delivery"
              class="cart-panel__total">{{ deliveryPrice }}р.</span>
        <span class="cart-panel__total">Итого: </span>
        <span class="cart-panel__total">{{ totalPrice }}р.</span>
      </div>

      <div v-if="selectedOrderType == ORDER_TYPE.delivery"
           class="cart-panel__preview-order-message">
        <div v-if="totalProductPrice < selectedCity.min_order_value_for_delivery">
          Минимальная сумма товаров для заказа {{ Number(selectedCity.min_order_value_for_delivery) }}р.
        </div>
        <div v-else-if="totalProductPrice < selectedCity.order_value_for_free_delivery">
          Бесплатная доставка от {{ Number(selectedCity.order_value_for_free_delivery) }}р.
        </div>
        <div v-else-if="totalProductPrice >= selectedCity.order_value_for_free_delivery"
             class="cart-panel__text-free-delivery">
          Бесплатная доставка!!!
        </div>
      </div>

      <div>

        <template v-if="totalProductPrice <= 0 ||
          selectedOrderType == ORDER_TYPE.delivery &&
          totalProductPrice <= selectedCity.min_order_value_for_delivery">
          <button class="btn btn-inactive cart-panel__btn-next">Далее</button>
        </template>

        <template v-else>
          <router-link :to="{ name: 'client.menu.popup.order-panel' }">
            <button class="btn btn-submit cart-panel__btn-next">Далее</button>
          </router-link>
        </template>

      </div>

    </div>
  </div>

</template>
