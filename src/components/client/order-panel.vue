<script setup>
import { onMounted, ref } from 'vue';
import router from "/src/router.js"
import { authUser } from '/src/store/axios-helper.js'
import {
  selectedCity, productsInCart, totalProductPrice, deliveryPrice, totalPrice,
  selectedOrderType, selectedAddressForDelivery, totalCountInCart
} from '/src/store/client-helper.js'
import { loginForOrder } from '/src/store/login-panel-helper.js'
import { ORDER_TYPE } from '/src/store/data-types/order-type'
import { setAddressForDelivery } from '/src/store/order-panel-helper.js'

const addressesInSelectedCity = ref([])

onMounted(() => {
  if (authUser.value == null) {
    loginForOrder.value = true
    router.push({ name: 'client.menu.popup.login-panel' })
    return
  }

  addressesInSelectedCity.value = authUser.value.addresses
    .filter((address) => address.city.id === selectedCity.value.id)

  setAddressForDelivery()
})


</script>

<template>
  <div>

    <div class="order-panel__city-order-type">
      {{ selectedCity.title }} - {{ selectedOrderType }}
    </div>
    <div class="order-panel__text-description">(оформление заказа)</div>

    <template v-if="selectedOrderType == ORDER_TYPE.delivery">

      <div v-if="addressesInSelectedCity.length > 0">
        <label class="order-panel__label">Выбирите адрес или добавьте новый</label>
        <div class="order-panel__selecte-address-btn-add-section">

          <select v-model="selectedAddressForDelivery" class="order-panel__selecte-address">
            <option v-for="address in addressesInSelectedCity" :value="address">

              <span v-if="address.title">{{ address.title }} -</span>
              {{ address.street }}
              {{ address.house_number }}
              <span v-if="address.corps_number">/ {{ address.corps_number }}</span>
              <span v-if="address.apartment_number"> - {{ address.apartment_number }}</span>

            </option>
          </select>

          <router-link :to="{ name: 'client.menu.popup.address-panel' }">
            <i class="order-panel__btn-add-address-mini btn btn-submit fa-solid fa-plus"></i>
          </router-link>

        </div>
      </div>

      <div v-else class="order-panel__btn-add-address-full">
        <router-link :to="{ name: 'client.menu.popup.address-panel' }">
          <button class="btn btn-submit">
            Добавить адрес доставки
          </button>
        </router-link>
      </div>

      <div>
        <label class="order-panel__label">Способ оплаты</label>
        <select class="order-panel__payment-type">
          <option value="value1" selected>Картой при получении</option>
          <option value="value2">Наличными</option>
        </select>
      </div>

      <label class="order-panel__label">Товары ({{ totalCountInCart }}шт.)</label>

      <div class="order-panel__products-section">

        <template v-for="product in productsInCart">
          <template v-if="product.countInCart > 0">

            <img class="order-panel__product-img" :src="product.image_url" alt="">
            <div>{{ product.title }}</div>
            <div class="order-panel__count-price">
              <span>{{ product.countInCart }}</span>
              <span> x {{ Number(product.price_default) }}р</span>
            </div>
            <div class="order-panel__product-total">
              {{ Number(product.countInCart) * Number(product.price_default) }}р
            </div>

          </template>
        </template>

      </div>

    </template>


    <div v-else-if="selectedOrderType == ORDER_TYPE.pickUp">
      Выберите точку самовывоза
    </div>

    <div v-else-if="selectedOrderType == ORDER_TYPE.inRestaurant">
      Выберите ресторан
    </div>

    <div class="order-panel__block-total">
      <span v-if="selectedOrderType == ORDER_TYPE.delivery">Товары: </span>
      <span v-if="selectedOrderType == ORDER_TYPE.delivery" class="order-panel__block-total_item-right">
        {{ totalProductPrice }}р.
      </span>
      <span v-if="selectedOrderType == ORDER_TYPE.delivery">Доставка: </span>
      <span v-if="selectedOrderType == ORDER_TYPE.delivery" class="order-panel__block-total_item-right">
        {{ deliveryPrice }}р.
      </span>
      <span>Итого: </span>
      <span class="order-panel__block-total_item-right">{{ totalPrice }}р.</span>
    </div>

    <div>
      <label class="order-panel__label">Комментарий к заказу</label>
      <textarea class="order-panel__comment"></textarea>
    </div>

  </div>

  <div class="order-panel__btn-section">
    <button class="btn btn-submit order-panel__btn-order">Подтвердить</button>
  </div>

</template>
