<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios'
import router from "/src/router.js"
import CitySelecte from './city-selecte-component.vue';
import { authUser } from '/src/store/axios-helper.js'
import { selectedCity } from '/src/store/client-helper.js'

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
      let newAddress = res.data.data
      authUser.value.addresses.push(newAddress)
      localStorage.setItem('address-for-delivery', JSON.stringify(newAddress))

      router.push({ name: 'client.menu.popup.order-panel' })
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
  <div v-if="selectedCity" class="address-panel">

    <div>
      <div class="address-panel__title">
        {{ selectedCity.title }}
      </div>
      <div class="address-panel__text-description">
        (добавление адреса)
      </div>

      <!-- добавить возможность изменения города в личном кабинете,
      пока добавить адрес в заказе можно только к текущему городу
      -->

      <!-- <div class="address-panel__input-section">
        <label class="address-panel__label field-required">Город</label>
        <city-selecte></city-selecte>
      </div> -->

      <div class="address-panel__input-section">
        <label class="address-panel__label field-required">Улица/шоссе/проспект</label>
        <input ref="fieldInputStreet" type="text" v-model="inputedStreet"
          class="address-panel__input address-panel__street" @click.prevent="validationErrors.street = ''">
        <div class="invalid-validation-text">{{ validationErrors.street }}</div>
      </div>

      <div class="address-panel__row-group">

        <div class="address-panel__input-section">
          <label class="address-panel__label field-required">Номер дома</label>
          <input type="text" v-model="inputedHouseNumber" class="address-panel__input address-panel__hause-number"
            @click.prevent="validationErrors.house_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.house_number }}</div>
        </div>

        <div class="address-panel__input-section">
          <label class="address-panel__label">Корпус</label>
          <input type="text" v-model="inputedCorpsNumber" class="address-panel__input address-panel__corps-number"
            @click.prevent="validationErrors.corps_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.corps_number }}</div>
        </div>

      </div>

      <div class="address-panel__row-group">

        <div class="address-panel__input-section">
          <label class="address-panel__label">Квартира/офис</label>
          <input type="text" v-model="inputedApartmentNumber"
            class="address-panel__input address-panel__apartment-number"
            @click.prevent="validationErrors.apartment_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.apartment_number }}</div>
        </div>

        <div class="address-panel__input-section">
          <label class="address-panel__label">Подъезд</label>
          <input type="number" v-model="inputedEnterenceNumber"
            class="address-panel__input address-panel__enterence-number"
            @click.prevent="validationErrors.entrance_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.entrance_number }}</div>
        </div>

        <div class="address-panel__input-section">
          <label class="address-panel__label">Этаж</label>
          <input type="number" v-model="inputedFloor" class="address-panel__input address-panel__floor"
            @click.prevent="validationErrors.floor = ''">
          <div class="invalid-validation-text">{{ validationErrors.floor }}</div>
        </div>

      </div>

      <div class="address-panel__input-section">
        <label class="address-panel__label">Код от подъезда</label>
        <input type="text" v-model="inputedEnterenceCode" class="address-panel__input address-panel__enterence-code"
          @click.prevent="validationErrors.entrance_code = ''">
        <div class="invalid-validation-text">{{ validationErrors.entrance_code }}</div>
      </div>

      <div class="address-panel__input-section">
        <label class="address-panel__label">Название для адреса (дом, работа)</label>
        <input type="text" v-model="inputedTitle" class="address-panel__input address-panel__title"
          @click.prevent="validationErrors.title = ''">
        <div class="invalid-validation-text">{{ validationErrors.title }}</div>
      </div>

      <div>
        <label class="address-panel__label">Комментарий к адресу</label>
        <textarea v-model="inputedComment" class="address-panel__input address-panel__comment"
          @click.prevent="validationErrors.comment = ''"></textarea>
        <div class="invalid-validation-text">{{ validationErrors.comment }}</div>
      </div>
    </div>

    <div class="address-panel__btn-section">
      <button class="btn btn-submit address-panel__btn-add" @click.prevent="addAddress()">
        Добавить
      </button>
    </div>


    <div v-if="blockAddAddress" class="spinner-centr-display">
      <div class="spinner"></div>
    </div>

  </div>
  <div v-else class="spinner-centr-display">
    <div class="spinner"></div>
  </div>
</template>
