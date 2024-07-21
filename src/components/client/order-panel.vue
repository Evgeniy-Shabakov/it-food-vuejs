<script setup>
import { reactive, ref, watch } from 'vue';
import axios from 'axios'

import router from "/src/router.js"
import { authUser, activeOrdersForUser } from '/src/store/axios-helper.js'
import {
  selectedCity, productsInCart, totalProductPrice, deliveryPrice, totalPrice, currentOrder,
  selectedOrderType, selectedAddressForDelivery, totalCountInCart, removeAllProductsFromCart
} from '/src/store/client-helper.js'
import { loginForOrder } from '/src/store/login-panel-helper.js'
import { ORDER_TYPE } from '/src/store/data-types/order-type'
import { PAYMENT_TYPE } from '/src/store/data-types/payment-type'
import { setAddressForDelivery } from '/src/store/order-panel-helper.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'

const orderData = reactive({})

const productsInOrder = ref([])

const addressesInSelectedCity = ref([])

const validationErrors = ref({})
const otherErrors = ref()

const blockSendOrder = ref(false)

if (authUser.value == null) {
  loginForOrder.value = true
  router.push({ name: 'client.menu.popup.login-panel' })
}
else {
  productsInOrder.value = productsInCart.value
    .filter(product => product.countInCart > 0)

  addressesInSelectedCity.value = authUser.value.addresses
    .filter(address => address.city.id === selectedCity.value.id)

  setAddressForDelivery()

  orderData.user_id = authUser.value.id
  orderData.city_id = selectedCity.value.id
  orderData.restaurant_id = null
  orderData.user_address_id = selectedAddressForDelivery.value ? selectedAddressForDelivery.value.id : null
  orderData.order_type = selectedOrderType.value
  orderData.table_number = null
  orderData.car_number = null
  orderData.pack_takeaway = true
  orderData.total_products_price = totalProductPrice.value
  orderData.delivery_price = deliveryPrice.value
  orderData.total_price = totalPrice.value
  orderData.payment_type = PAYMENT_TYPE.cardOffline
  orderData.banknote_for_change = null
  orderData.is_payment = false
  orderData.comment = null
  orderData.products_in_order = productsInOrder.value
}

watch(selectedAddressForDelivery, () => { //v-model это selectedAddressForDelivery, чтобы сохранить изменения
  orderData.user_address_id = selectedAddressForDelivery.value.id
})

const sendOrder = async () => {
  if (blockSendOrder.value) return
  blockSendOrder.value = true

  validationErrors.value = {}
  otherErrors.value = null

  try {
    const res = await axios.post(`/orders`, orderData)
    currentOrder.value = res.data.data

    removeAllProductsFromCart()
    router.push({ name: 'client.menu.popup.order-status-panel' })
  } catch (error) {
    console.log(error);

    if (error.response.status === 422) {
      validationErrors.value = error.response.data.errors
      transformValidateErrorsForUI(validationErrors.value)
    } else {
      otherErrors.value = 'что то пошло не так, попробуйте еще раз';
    }
  }

  blockSendOrder.value = false
}

</script>

<template>

  <div class="order-panel">
    <div class="order-panel__main-section">

      <div class="order-panel__city-order-type">
        {{ selectedCity.title }} - {{ selectedOrderType }}
      </div>
      <div class="order-panel__text-description">(оформление заказа)</div>
      <div class="invalid-text order-panel__other-errors-text">{{ otherErrors }}</div>

      <template v-if="selectedOrderType == ORDER_TYPE.delivery">

        <div v-if="addressesInSelectedCity.length > 0" class="order-panel__selecte-address-section">
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
          <div class="invalid-text order-panel__invalid-text">{{ validationErrors.user_address_id }}</div>
        </div>

        <div v-else class="order-panel__btn-add-address-full">
          <router-link :to="{ name: 'client.menu.popup.address-panel' }">
            <button class="btn btn-submit">
              Добавить адрес доставки
            </button>
          </router-link>
          <div class="invalid-text order-panel__invalid-text">{{ validationErrors.user_address_id }}</div>
        </div>

        <div class="order-panel__payment-type-section">
          <label class="order-panel__label">Способ оплаты</label>
          <select v-model="orderData.payment_type" class="order-panel__payment-type">
            <option :value="PAYMENT_TYPE.cardOffline"> {{ PAYMENT_TYPE.cardOffline }}</option>
            <option :value="PAYMENT_TYPE.cash"> {{ PAYMENT_TYPE.cash }}</option>
          </select>
          <div class="invalid-text order-panel__invalid-text">{{ validationErrors.payment_type }}</div>
        </div>

        <label class="order-panel__label">Товары ({{ totalCountInCart }}шт.)</label>

        <div class="order-panel__products-section">

          <template v-for="product in productsInOrder">

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

        </div>
        <div class="invalid-text order-panel__invalid-text">{{ validationErrors.products_in_order }}</div>

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
        <textarea v-model="orderData.comment" class="order-panel__comment"></textarea>
        <div class="invalid-text order-panel__invalid-text">{{ validationErrors.comment }}</div>
      </div>

    </div>

    <div class="order-panel__btn-section">
      <button v-if="blockSendOrder == false" class="btn btn-submit order-panel__btn-order" @click.prevent="sendOrder()">
        Оформить за {{ totalPrice }}р.
      </button>
      <button v-else class="btn btn-submit order-panel__btn-order">
        Отправляем заказ в ресторан...
      </button>
    </div>
  </div>

  <div v-if="blockSendOrder" class="spinner-centr-display">
    <div class="spinner"></div>
  </div>

</template>
