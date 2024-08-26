<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'

import router from "/src/router.js"
import { authUser } from '/src/store/axios-helper.js'
import { selectedCity } from '/src/store/client-helper.js'
import { addressForEditing } from '/src/store/client/popup-pages/address-index.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'

if (addressForEditing.value == null) { //выходим при обновлении
  router.push({ name: 'client.menu.popup.addresses' })
}

const addressInputedData = reactive({
  street: addressForEditing.value.street,
  house_number: addressForEditing.value.house_number,
  corps_number: addressForEditing.value.corps_number,
  apartment_number: addressForEditing.value.apartment_number,
  entrance_number: addressForEditing.value.entrance_number,
  floor: addressForEditing.value.floor,
  entrance_code: addressForEditing.value.entrance_code,
  title: addressForEditing.value.title,
  comment: addressForEditing.value.comment
})

const validationErrors = ref({})

const blockAddAddress = ref(false)

async function editAddress() {
  if (blockAddAddress.value) return

  blockAddAddress.value = true

  let data = {
    user_id: authUser.value.id,
    city_id: selectedCity.value.id,
    street: addressInputedData.street,
    house_number: addressInputedData.house_number,
    corps_number: addressInputedData.corps_number,
    apartment_number: addressInputedData.apartment_number,
    entrance_number: addressInputedData.entrance_number,
    floor: addressInputedData.floor,
    entrance_code: addressInputedData.entrance_code,
    title: addressInputedData.title,
    comment: addressInputedData.comment,
  }

  await axios
    .patch(`/users/${authUser.value.id}/addresses/${addressForEditing.value.id}`, data)
    .then(res => {
      authUser.value = res.data.data

      router.back()
    })
    .catch(err => {
      console.log(err);

      validationErrors.value = err.response.data.errors
      transformValidateErrorsForUI(validationErrors.value)
    })

  blockAddAddress.value = false
}

</script>

<template>

  <div class="client-popup-page-layout__main-section">

    <h1 v-if="selectedCity" class="client-popup-page-layout__h1">

      <div>{{ addressForEditing.city.title }}</div>
      <div class="address-create__h1-description">
        (редактирование адреса)
      </div>

    </h1>

    <div v-if="selectedCity" class="address-create">

      <div>
        <label class="address-create__label field-required">Улица/шоссе/проспект</label>
        <input type="text" v-model="addressInputedData.street" class="address-create__input address-create__street"
          @click.prevent="validationErrors.street = ''">
        <div class="invalid-validation-text">{{ validationErrors.street }}</div>
      </div>

      <div class="address-create__row-group">

        <div>
          <label class="address-create__label field-required">Номер дома</label>
          <input type="text" v-model="addressInputedData.house_number"
            class="address-create__input address-create__hause-number"
            @click.prevent="validationErrors.house_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.house_number }}</div>
        </div>

        <div>
          <label class="address-create__label">Корпус</label>
          <input type="text" v-model="addressInputedData.corps_number"
            class="address-create__input address-create__corps-number"
            @click.prevent="validationErrors.corps_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.corps_number }}</div>
        </div>

      </div>

      <div class="address-create__row-group">

        <div>
          <label class="address-create__label">Квартира/офис</label>
          <input type="text" v-model="addressInputedData.apartment_number"
            class="address-create__input address-create__apartment-number"
            @click.prevent="validationErrors.apartment_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.apartment_number }}</div>
        </div>

        <div>
          <label class="address-create__label">Подъезд</label>
          <input type="number" v-model="addressInputedData.entrance_number"
            class="address-create__input address-create__enterence-number"
            @click.prevent="validationErrors.entrance_number = ''">
          <div class="invalid-validation-text">{{ validationErrors.entrance_number }}</div>
        </div>

        <div>
          <label class="address-create__label">Этаж</label>
          <input type="number" v-model="addressInputedData.floor" class="address-create__input address-create__floor"
            @click.prevent="validationErrors.floor = ''">
          <div class="invalid-validation-text">{{ validationErrors.floor }}</div>
        </div>

      </div>

      <div>
        <label class="address-create__label">Код от подъезда</label>
        <input type="text" v-model="addressInputedData.entrance_code"
          class="address-create__input address-create__enterence-code"
          @click.prevent="validationErrors.entrance_code = ''">
        <div class="invalid-validation-text">{{ validationErrors.entrance_code }}</div>
      </div>

      <div>
        <label class="address-create__label">Название для адреса (дом, работа)</label>
        <input type="text" v-model="addressInputedData.title" class="address-create__input address-create__title"
          @click.prevent="validationErrors.title = ''">
        <div class="invalid-validation-text">{{ validationErrors.title }}</div>
      </div>

      <div>
        <label class="address-create__label">Комментарий к адресу</label>
        <textarea v-model="addressInputedData.comment" class="address-create__input address-create__comment"
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
    <button class="btn btn-submit client-popup-page-layout__btn-w-100" @click.prevent="editAddress()">
      Сохранить
    </button>
  </div>

</template>
