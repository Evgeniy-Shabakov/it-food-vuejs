<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import {
  countries, currentCity, textLoadOrFailForVue,
  getModelsAxios, getModelAxios, updateModelAxios
} from '/src/store/axios-helper.js'

const fieldInputCity = ref(null)

const inputedCity = ref('')
const selectedCountry = ref()
const inputedMinOrderValueForDelivery = ref()
const inputedDeliveryPrice = ref()
const inputedOrderValueForFreeDelivery = ref()

let textErrorInputCity = ref('')
let textErrorSelectCountry = ref('')
const textErrorInputMinOrderValueForDelivery = ref('')
const textErrorInputDeliveryPrice = ref('')
const textErrorInputOrderValueForFreeDelivery = ref('')
let textDone = ref('')

let oldCityTitle = ''

//проверка если роут загружается из закладки или обновления страницы
if (currentCity.value == null || countries.value == null) {
  getModelAxios('cities', useRoute().params.id)
    .then(res => {
      inputedCity.value = currentCity.value.title
      inputedMinOrderValueForDelivery.value = currentCity.value.min_order_value_for_delivery
      inputedDeliveryPrice.value = currentCity.value.delivery_price
      inputedOrderValueForFreeDelivery.value = currentCity.value.order_value_for_free_delivery

      oldCityTitle = currentCity.value.title
      fieldInputCity.value.focus()
    })
  getModelsAxios('countries')
    .then(res => {
      countries.value.forEach(element => {
        if (element.id == currentCity.value.country.id) {
          selectedCountry.value = element
        }
      })

      fieldInputCity.value.focus()
    })
}
else {
  inputedCity.value = currentCity.value.title
  inputedMinOrderValueForDelivery.value = currentCity.value.min_order_value_for_delivery
  inputedDeliveryPrice.value = currentCity.value.delivery_price
  inputedOrderValueForFreeDelivery.value = currentCity.value.order_value_for_free_delivery

  oldCityTitle = currentCity.value.title

  countries.value.forEach(element => {
    if (element.id == currentCity.value.country.id) {
      selectedCountry.value = element
    }
  })
}

onMounted(() => { fieldInputCity.value.focus() })

function updateCityVue(data) {
  textErrorInputCity.value = ''
  textErrorSelectCountry.value = ''
  textErrorInputMinOrderValueForDelivery.value = ''
  textErrorInputDeliveryPrice.value = ''
  textErrorInputOrderValueForFreeDelivery.value = ''

  textDone.value = ''

  data.oldTitle = oldCityTitle
  data.countryTitle = selectedCountry.value.title
  updateModelAxios('cities', data)
    .then(res => {
      textDone.value = res.messageForVue.text
      oldCityTitle = data.title
    })
    .catch(err => {
      if (err.response.data.errors.title) {
        textErrorInputCity.value = err.response.data.errors.title[0]
      }
      if (err.response.data.errors.country_id) {
        textErrorSelectCountry.value = err.response.data.errors.country_id[0]
      }
      if (err.response.data.errors.min_order_value_for_delivery) {
        textErrorInputMinOrderValueForDelivery.value = err.response.data.errors.min_order_value_for_delivery[0]
      }

      if (err.response.data.errors.delivery_price) {
        textErrorInputDeliveryPrice.value = err.response.data.errors.delivery_price[0]
      }

      if (err.response.data.errors.order_value_for_free_delivery) {
        textErrorInputOrderValueForFreeDelivery.value = err.response.data.errors.order_value_for_free_delivery[0]
      }
    })
}
</script>

<template>
  <h2>Редактирование страны</h2>
  <form v-show="countries && currentCity" class="admin-forms">
    <label class="required">Страна</label>
    <select v-model="selectedCountry" @click.prevent="textErrorSelectCountry = ''; textDone = ''">
      <option v-for="country in countries" :value="country">{{ country.title }}</option>
    </select>
    <div class="invalid-text">{{ textErrorSelectCountry }}</div>

    <label class="required">Город</label>
    <input ref="fieldInputCity" v-model="inputedCity" type="text" placeholder="Введите название страны"
      @click.prevent="textErrorInputCity = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputCity }}</div>

    <label>Минимальная сумма заказа для доставки (укажите 0, если доставка осуществляется при любой сумме
      заказа)</label>
    <input type="number" min="1" step="any" v-model="inputedMinOrderValueForDelivery"
      @click.prevent="textErrorInputMinOrderValueForDelivery = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputMinOrderValueForDelivery }}</div>

    <label>Цена за доставку (укажите 0, если у вас бесплатная доставка)</label>
    <input type="number" min="0" step="any" v-model="inputedDeliveryPrice"
      @click.prevent="textErrorInputDeliveryPrice = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputDeliveryPrice }}</div>

    <label>Сумма заказа для бесплатной доставки</label>
    <input type="number" min="1" step="any" v-model="inputedOrderValueForFreeDelivery"
      @click.prevent="textErrorInputOrderValueForFreeDelivery = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputOrderValueForFreeDelivery }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view" @click.prevent="updateCityVue({
      id: currentCity.id,
      title: inputedCity,
      country_id: selectedCountry.id,
      min_order_value_for_delivery: inputedMinOrderValueForDelivery,
      delivery_price: inputedDeliveryPrice,
      order_value_for_free_delivery: inputedOrderValueForFreeDelivery
    })">Редактировать</button>
  </form>
  <div v-show="countries == null || currentCity == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>
