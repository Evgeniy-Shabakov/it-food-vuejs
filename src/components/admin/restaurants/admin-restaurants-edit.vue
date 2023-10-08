<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import {
  countries, currentRestaurant, textLoadOrFailForVue,
  getModelAxios, getModelsAxios, updateModelAxios
} from '/src/store/axios-helper.js'

const fieldInputTitle = ref(null)

const inputedTitle = ref('')
const selectedCity = ref()
const inputedStreet = ref()
const inputedHouseNumber = ref()
const inputedCorpsNumber = ref()
const inputedOfficeNumber = ref()
const inputedInfo = ref()
const inputedDeliveryAvailable = ref(false)
const inputedPickupAvailable = ref(false)
const inputedEatingAreaAvailable = ref(false)
const inputedIsActive = ref(false)

const textErrorInputTitle = ref('')
const textErrorSelectCity = ref('')
const textErrorInputStreet = ref('')
const textErrorInputHouseNumber = ref('')
const textErrorInputCorpsNumber = ref('')
const textErrorInputOfficeNumber = ref('')
const textErrorInputInfo = ref('')
const textErrorInputDeliveryAvailable = ref('')
const textErrorInputPickupAvailable = ref('')
const textErrorInputEatingAreaAvailable = ref('')
const textErrorInputIsActive = ref('')

const textDone = ref('')

function initializeRestaurant(){
  inputedTitle.value = currentRestaurant.value.title
  selectedCity.value = currentRestaurant.value.city
  inputedStreet.value = currentRestaurant.value.street
  inputedHouseNumber.value = currentRestaurant.value.house_number
  inputedCorpsNumber.value = currentRestaurant.value.corps_number
  inputedOfficeNumber.value = currentRestaurant.value.office_number
  inputedInfo.value = currentRestaurant.value.info
  inputedDeliveryAvailable.value = Boolean(currentRestaurant.value.delivery_available)
  inputedPickupAvailable.value = Boolean(currentRestaurant.value.pickup_available)
  inputedEatingAreaAvailable.value = Boolean(currentRestaurant.value.eating_area_available)
  inputedIsActive.value = Boolean(currentRestaurant.value.is_active)
}

//проверка если роут загружается из закладки или обновления страницы
if (currentRestaurant.value == null || countries.value == null) {
  getModelAxios('restaurants', useRoute().params.id)
    .then(res => {
      initializeRestaurant()
      fieldInputTitle.value.focus()
    })
  getModelsAxios('countries')
    .then(res => {
      fieldInputTitle.value.focus()
    })
}
else {
  initializeRestaurant()
}

onMounted(() => { fieldInputTitle.value.focus() })

function updateRestaurant(data) {
  textErrorInputTitle.value = ''
  textErrorSelectCity.value = ''
  textErrorInputStreet.value = ''
  textErrorInputHouseNumber.value = ''
  textErrorInputCorpsNumber.value = ''
  textErrorInputOfficeNumber.value = ''
  textErrorInputInfo.value = ''
  textErrorInputDeliveryAvailable.value = ''
  textErrorInputPickupAvailable.value = ''
  textErrorInputEatingAreaAvailable.value = ''
  textErrorInputIsActive.value = ''

  textDone.value = ''

  updateModelAxios('restaurants', data)
    .then(res => {
      textDone.value = res.messageForVue.text
    })
    .catch(err => {
      if (err.response.data.errors.title) {
        textErrorInputTitle.value = err.response.data.errors.title[0]
      }
      if (err.response.data.errors.city_id) {
        textErrorSelectCity.value = err.response.data.errors.city_id[0]
      }
      if (err.response.data.errors.street) {
        textErrorInputStreet.value = err.response.data.errors.street[0]
      }
      if (err.response.data.errors.house_number) {
        textErrorInputHouseNumber.value = err.response.data.errors.house_number[0]
      }
      if (err.response.data.errors.corps_number) {
        textErrorInputCorpsNumber.value = err.response.data.errors.corps_number[0]
      }
      if (err.response.data.errors.office_number) {
        textErrorInputOfficeNumber.value = err.response.data.errors.office_number[0]
      }
      if (err.response.data.errors.info) {
        textErrorInputInfo.value = err.response.data.errors.info[0]
      }
      if (err.response.data.errors.delivery_available) {
        textErrorInputDeliveryAvailable.value = err.response.data.errors.delivery_available[0]
      }
      if (err.response.data.errors.pickup_available) {
        textErrorInputPickupAvailable.value = err.response.data.errors.pickup_available[0]
      }
      if (err.response.data.errors.eating_area_available) {
        textErrorInputEatingAreaAvailable.value = err.response.data.errors.eating_area_available[0]
      }
      if (err.response.data.errors.is_active) {
        textErrorInputIsActive.value = err.response.data.errors.is_active[0]
      }
    })
}
</script>

<template>
  <h2>Редактирование ресторана</h2>
  <form v-show="currentRestaurant && countries" class="admin-forms">
    <label class="required">Наименование</label>
    <input ref="fieldInputTitle" type="text" v-model="inputedTitle" placeholder="Введите название ресторана"
      @click.prevent="textErrorInputTitle = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputTitle }}</div>

    <form class="admin-form-adress">
      <label class="required">Город</label>
      <select v-model="selectedCity" @click.prevent="textErrorSelectCity = ''; textDone = ''">
        <optgroup v-for="country in countries" :label="country.title">
          <option v-for="city in country.cities" :value="city">{{ city.title }}</option>
        </optgroup>
      </select>
      <div class="invalid-text">{{ textErrorSelectCity }}</div>

      <label class="required">Улица</label>
      <input type="text" v-model="inputedStreet" placeholder="Введите название улицы"
        @click.prevent="textErrorInputStreet = ''; textDone = ''">
      <div class="invalid-text">{{ textErrorInputStreet }}</div>

      <label class="required">Дом</label>
      <input type="number" min="1" step="1" v-model="inputedHouseNumber"
        @click.prevent="textErrorInputHouseNumber = ''; textDone = ''">

      <label>Корпус</label>
      <input type="number" min="1" step="1" v-model="inputedCorpsNumber"
        @click.prevent="textErrorInputCorpsNumber = ''; textDone = ''">

      <div class="invalid-text">{{ textErrorInputHouseNumber }}</div>
      <div class="invalid-text">{{ textErrorInputCorpsNumber }}</div>

      <label>№</label>
      <input type="number" min="1" step="1" v-model="inputedOfficeNumber"
        @click.prevent="textErrorInputOfficeNumber = ''; textDone = ''">
      <div class="invalid-text">{{ textErrorInputOfficeNumber }}</div>
    </form>

    <label>Дополнительная информация</label>
    <textarea v-model="inputedInfo" placeholder="Введите дополнительную информацию"
      @click.prevent="textErrorInputInfo = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ textErrorInputInfo }}</div>

    <span class="required">Доступен самовывоз:</span>
    <input type="checkbox" v-model="inputedPickupAvailable" @click="textErrorInputPickupAvailable = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputPickupAvailable }}</div>
    
    <span class="required">Доступна доставка:</span>
    <input type="checkbox" v-model="inputedDeliveryAvailable"
      @click="textErrorInputDeliveryAvailable = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputDeliveryAvailable }}</div>

    <span class="required">Доступна подача в ресторане:</span>
    <input type="checkbox" v-model="inputedEatingAreaAvailable"
      @click="textErrorInputEatingAreaAvailable = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputEatingAreaAvailable }}</div>

    <span class="required">Активировать прием заказов:</span>
    <input type="checkbox" v-model="inputedIsActive" @click="textErrorInputIsActive = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputIsActive }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view" @click.prevent="updateRestaurant({
      id: currentRestaurant.id,
      title: inputedTitle,
      city_id: selectedCity.id,
      street: inputedStreet,
      house_number: inputedHouseNumber,
      corps_number: inputedCorpsNumber,
      office_number: inputedOfficeNumber,
      info: inputedInfo,
      delivery_available: inputedDeliveryAvailable,
      pickup_available: inputedPickupAvailable,
      eating_area_available: inputedEatingAreaAvailable,
      is_active: inputedIsActive
    })">Редактировать</button>
  </form>
  <div v-show="currentRestaurant == null || countries == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

