<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

import router from "/src/router.js"
import { previousRoute } from "/src/router.js"
import { authUser } from '/src/store/axios-helper.js'
import { selectedCity, selectedAddressForDelivery } from '/src/store/client-helper.js'

import CitySelecte from '/src/components/client/modules/city-selecte-component.vue'

const fieldInputStreet = ref(null)

const inputedStreet = ref()
const inputedHouseNumber = ref()
const inputedCorpsNumber = ref()
const inputedApartmentNumber = ref()
const inputedEnterenceNumber = ref()
const inputedFloor = ref()
const inputedEnterenceCode = ref()
const inputedTitle = ref('')
const inputedComment = ref()

const validationErrors = ref({
  user_id: '',
  city_id: '',
  street: '',
  house_number: '',
  corps_number: '',
  apartment_number: '',
  entrance_number: '',
  floor: '',
  entrance_code: '',
  title: '',
  comment: '',
})

let unwatchFn = watch(fieldInputStreet, () => {
  fieldInputStreet.value.focus()
  unwatchFn() // отключаем watch после установки фокуса
})

const blockAddAddress = ref(false)

async function addAddress() {
  if (blockAddAddress.value) return

  blockAddAddress.value = true

  let data = {
    user_id: authUser.value.id,
    city_id: selectedCity.value.id,
    street: inputedStreet.value,
    house_number: inputedHouseNumber.value,
    corps_number: inputedCorpsNumber.value,
    apartment_number: inputedApartmentNumber.value,
    entrance_number: inputedEnterenceNumber.value,
    floor: inputedFloor.value,
    entrance_code: inputedEnterenceCode.value,
    title: inputedTitle.value,
    comment: inputedComment.value,
  }

  await axios
    .post(`/users/${data.user_id}/addresses`, data)
    .then(res => {
      selectedAddressForDelivery.value = res.data.data
      authUser.value.addresses.push(selectedAddressForDelivery.value)

      router.back()
    })
    .catch(err => {
      console.log(err);

      let errors = err.response.data.errors

      validationErrors.value = {
        user_id: errors.user_id ? errors.user_id[0] : '',
        city_id: errors.city_id ? errors.city_id[0] : '',
        street: errors.street ? errors.street[0] : '',
        house_number: errors.house_number ? errors.house_number[0] : '',
        corps_number: errors.corps_number ? errors.corps_number[0] : '',
        apartment_number: errors.apartment_number ? errors.apartment_number[0] : '',
        entrance_number: errors.entrance_number ? errors.entrance_number[0] : '',
        floor: errors.floor ? errors.floor[0] : '',
        entrance_code: errors.entrance_code ? errors.entrance_code[0] : '',
        title: errors.title ? errors.title[0] : '',
        comment: errors.comment ? errors.comment[0] : '',
      }

    })

  blockAddAddress.value = false
}

</script>

<template>

  <div class="client-popup-page-layout__main-section">

    <h1 v-if="selectedCity" class="client-popup-page-layout__h1">

      <template v-if="previousRoute.name == 'client.menu.popup.addresses'">
        Добавление адреса
      </template>

      <template v-else>
        <div>{{ selectedCity.title }}</div>
        <div class="address-create__h1-description">
          (добавление адреса)
        </div>
      </template>
      
    </h1>

    <div v-if="selectedCity" class="address-create">

      <!-- изменение города только в личном кабинете,
       при оформлении заказа адрес добавляется только к текущему городу -->

      <div v-if="previousRoute.name == 'client.menu.popup.addresses'" class="address-create__input-section">
        <label class="address-create__label field-required">Город</label>
        <city-selecte></city-selecte>
      </div>

      <div>
        <label class="address-create__label field-required">Улица/шоссе/проспект</label>
        <input ref="fieldInputStreet" type="text" v-model="inputedStreet"
          class="address-create__input address-create__street" @click.prevent="validationErrors.street = ''">
        <div class="invalid-validation-text">{{ validationErrors.street }}</div>
      </div>

      <div class="address-create__row-group">

        <div>
          <label class="address-create__label field-required">Номер дома</label>
          <input type="text" v-model="inputedHouseNumber" class="address-create__input address-create__hause-number"
            @click.prevent="validationErrors.house_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.house_number }}</div>
        </div>

        <div>
          <label class="address-create__label">Корпус</label>
          <input type="text" v-model="inputedCorpsNumber" class="address-create__input address-create__corps-number"
            @click.prevent="validationErrors.corps_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.corps_number }}</div>
        </div>

      </div>

      <div class="address-create__row-group">

        <div>
          <label class="address-create__label">Квартира/офис</label>
          <input type="text" v-model="inputedApartmentNumber"
            class="address-create__input address-create__apartment-number"
            @click.prevent="validationErrors.apartment_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.apartment_number }}</div>
        </div>

        <div>
          <label class="address-create__label">Подъезд</label>
          <input type="number" v-model="inputedEnterenceNumber"
            class="address-create__input address-create__enterence-number"
            @click.prevent="validationErrors.entrance_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.entrance_number }}</div>
        </div>

        <div>
          <label class="address-create__label">Этаж</label>
          <input type="number" v-model="inputedFloor" class="address-create__input address-create__floor"
            @click.prevent="validationErrors.floor = ''">
          <div class="invalid-validation-text">{{ validationErrors.floor }}</div>
        </div>

      </div>

      <div>
        <label class="address-create__label">Код от подъезда</label>
        <input type="text" v-model="inputedEnterenceCode" class="address-create__input address-create__enterence-code"
          @click.prevent="validationErrors.entrance_code = ''">
        <div class="invalid-validation-text">{{ validationErrors.entrance_code }}</div>
      </div>

      <div>
        <label class="address-create__label">Название для адреса (дом, работа)</label>
        <input type="text" v-model="inputedTitle" class="address-create__input address-create__title"
          @click.prevent="validationErrors.title = ''">
        <div class="invalid-validation-text">{{ validationErrors.title }}</div>
      </div>

      <div>
        <label class="address-create__label">Комментарий к адресу</label>
        <textarea v-model="inputedComment" class="address-create__input address-create__comment"
          @click.prevent="validationErrors.comment = ''"></textarea>
        <div class="invalid-validation-text">{{ validationErrors.comment }}</div>
      </div>

      <div v-if="blockAddAddress" class="spinner-centr-display">
        <div class="spinner"></div>
      </div>

    </div>

    <div v-else class="spinner-centr-display">
      <div class="spinner"></div>
    </div>


  </div>

  <div class="client-popup-page-layout__btn-section">
    <button class="btn btn-submit client-popup-page-layout__btn-w-100" @click.prevent="addAddress()">
      Добавить
    </button>
  </div>

</template>
