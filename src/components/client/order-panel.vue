<script setup>
import { ref, watch, onMounted } from 'vue';
import router from "/src/router.js"

import { currentAuthenticatedUser } from '/src/store/axios-helper.js'
import { totalPrice, selectedCity, selectedOrderType, selectedAddressForDelivery } from '/src/store/client-helper.js'
import { loginForOrder } from '/src/store/login-panel-helper.js'
import { OrderType } from '/src/store/order-type';
import { LoadingType } from '/src/store/loading-type';

const addressesInSelectedCity = ref()

if (currentAuthenticatedUser.value == null) {
  loginForOrder.value = true
  router.push({ name: 'client.menu.popup.login-panel' })
}

onMounted(() => {
  initialize()
})

watch(currentAuthenticatedUser, () => {
  initialize()
})

function initialize() {
  if (currentAuthenticatedUser.value == null) return
  if (currentAuthenticatedUser.value == LoadingType.Loading) return

  addressesInSelectedCity.value = currentAuthenticatedUser.value.addresses
    .filter((address) => address.city.id === selectedCity.value.id)

  setAddressForDelivery()
}

function setAddressForDelivery() {
  if (localStorage.getItem('address-for-delivery')) {
    let savedAddress = JSON.parse(localStorage.getItem('address-for-delivery'))
    if (savedAddress.city.id === selectedCity.value.id)
      selectedAddressForDelivery.value = savedAddress
    else
      setAddressForDeliveryByDefault()

    return
  }

  setAddressForDeliveryByDefault()
}

function setAddressForDeliveryByDefault() {
  currentAuthenticatedUser.value.addresses.forEach((address) => {
    if (selectedCity.value.id === address.city.id) {
      console.log(address);
      selectedAddressForDelivery.value = address
    }
  })
}

</script>

<template>
  <div class="dialog">
    <h3 class="dialog__title">Оформление заказа</h3>
    <div v-if="selectedCity && selectedOrderType && currentAuthenticatedUser
      && currentAuthenticatedUser != LoadingType.Loading" class="dialog__form">
      <div>

        <div>{{ selectedCity.title }} - {{ selectedOrderType }}</div>

        <div v-if="selectedOrderType == OrderType.Delivery">

          <select v-if="currentAuthenticatedUser.addresses.length > 0" v-model="selectedAddressForDelivery">
            <option v-for="address in addressesInSelectedCity" :value="address">
              {{ address.street }}
              {{ address.house_number }}
              <span v-if="address.corps_number">/ {{ address.corps_number }}</span>
              <span v-if="address.apartment_number"> - {{ address.apartment_number }}</span>
            </option>
          </select>
          <router-link :to="{ name: 'client.menu.popup.address-panel' }">
            <button class="btn btn-submit">Добавить адрес доставки</button>
          </router-link>

        </div>

        <div v-else-if="selectedOrderType == OrderType.PickUp">
          Выберите точку самовывоза
        </div>

        <div v-else-if="selectedOrderType == OrderType.InRestaurant">
          Выберите ресторан
        </div>

      </div>

      <button class="btn btn-submit">ОФОРМИТЬ ЗА {{ totalPrice }}р.</button>

    </div>
    <div v-else>Загрузка данных...</div>
  </div>
</template>
