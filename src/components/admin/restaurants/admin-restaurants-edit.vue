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
const inputedPickUpAvailable = ref(false)
const inputedDeliveryAvailable = ref(false)
const inputedPickUpAvailableAtTheRestaurantCounter = ref(false)
const inputedDeliveryAvailableAtTheRestaurantToTheTable = ref(false)
const inputedPickUpAvailableAtTheCarWindow = ref(false)
const inputedDeliveryAvailableInTheParkingToCar = ref(false)
const inputedIsActive = ref(false)

const textErrorInputTitle = ref('')
const textErrorSelectCity = ref('')
const textErrorInputStreet = ref('')
const textErrorInputHouseNumber = ref('')
const textErrorInputCorpsNumber = ref('')
const textErrorInputOfficeNumber = ref('')
const textErrorInputInfo = ref('')
const textErrorInputPickUpAvailable = ref('')
const textErrorInputDeliveryAvailable = ref('')
const textErrorInputPickUpAvailableAtTheRestaurantCounter = ref('')
const textErrorInputDeliveryAvailableAtTheRestaurantToTheTable = ref('')
const textErrorInputPickUpAvailableAtTheCarWindow = ref('')
const textErrorInputDeliveryAvailableInTheParkingToCar = ref('')
const textErrorInputIsActive = ref('')

const textDone = ref('')

function initializeRestaurant() {
  inputedTitle.value = currentRestaurant.value.title
  selectedCity.value = currentRestaurant.value.city
  inputedStreet.value = currentRestaurant.value.street
  inputedHouseNumber.value = currentRestaurant.value.house_number
  inputedCorpsNumber.value = currentRestaurant.value.corps_number
  inputedOfficeNumber.value = currentRestaurant.value.office_number
  inputedInfo.value = currentRestaurant.value.info
  inputedPickUpAvailable.value = Boolean(currentRestaurant.value.pick_up_available)
  inputedDeliveryAvailable.value = Boolean(currentRestaurant.value.delivery_available)
  inputedPickUpAvailableAtTheRestaurantCounter.value = Boolean(currentRestaurant.value.pick_up_available_at_the_restaurant_counter)
  inputedDeliveryAvailableAtTheRestaurantToTheTable.value = Boolean(currentRestaurant.value.delivery_available_at_the_restaurant_to_the_table)
  inputedPickUpAvailableAtTheCarWindow.value = Boolean(currentRestaurant.value.pick_up_available_at_the_car_window)
  inputedDeliveryAvailableInTheParkingToCar.value = Boolean(currentRestaurant.value.delivery_available_in_the_parking_to_car)


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
  textErrorInputPickUpAvailable.value = ''
  textErrorInputDeliveryAvailable.value = ''
  textErrorInputPickUpAvailableAtTheRestaurantCounter.value = ''
  textErrorInputDeliveryAvailableAtTheRestaurantToTheTable.value = ''
  textErrorInputPickUpAvailableAtTheCarWindow.value = ''
  textErrorInputDeliveryAvailableInTheParkingToCar.value = ''
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
      if (err.response.data.errors.pick_up_available) {
        textErrorInputPickUpAvailable.value = err.response.data.errors.pick_up_available[0]
      }
      if (err.response.data.errors.delivery_available) {
        textErrorInputDeliveryAvailable.value = err.response.data.errors.delivery_available[0]
      }
      if (err.response.data.errors.pick_up_available_at_the_restaurant_counter) {
        textErrorInputPickUpAvailableAtTheRestaurantCounter.value = err.response.data.errors.pick_up_available_at_the_restaurant_counter[0]
      }
      if (err.response.data.errors.delivery_available_at_the_restaurant_to_the_table) {
        textErrorInputDeliveryAvailableAtTheRestaurantToTheTable.value = err.response.data.errors.delivery_available_at_the_restaurant_to_the_table[0]
      }
      if (err.response.data.errors.pick_up_available_at_the_car_window) {
        textErrorInputPickUpAvailableAtTheCarWindow.value = err.response.data.errors.pick_up_available_at_the_car_window[0]
      }
      if (err.response.data.errors.delivery_available_in_the_parking_to_car) {
        textErrorInputDeliveryAvailableInTheParkingToCar.value = err.response.data.errors.delivery_available_in_the_parking_to_car[0]
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
    <input type="checkbox" v-model="inputedPickUpAvailable" @click="textErrorInputPickUpAvailable = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputPickUpAvailable }}</div>

    <span class="required">Доступна доставка:</span>
    <input type="checkbox" v-model="inputedDeliveryAvailable"
      @click="textErrorInputDeliveryAvailable = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputDeliveryAvailable }}</div>

    <span class="required">Доступна выдача в ресторане у прилавка:</span>
    <input type="checkbox" v-model="inputedPickUpAvailableAtTheRestaurantCounter"
      @click="textErrorInputPickUpAvailableAtTheRestaurantCounter = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputPickUpAvailableAtTheRestaurantCounter }}</div>

    <span class="required">Доступна подача в ресторане к столу:</span>
    <input type="checkbox" v-model="inputedDeliveryAvailableAtTheRestaurantToTheTable"
      @click="textErrorInputDeliveryAvailableAtTheRestaurantToTheTable = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputDeliveryAvailableAtTheRestaurantToTheTable }}</div>

    <span class="required">Доступна выдача в окне для автомобилей:</span>
    <input type="checkbox" v-model="inputedPickUpAvailableAtTheCarWindow"
      @click="textErrorInputPickUpAvailableAtTheCarWindow = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputPickUpAvailableAtTheCarWindow }}</div>

    <span class="required">Доступна подача на парковку к машине:</span>
    <input type="checkbox" v-model="inputedDeliveryAvailableInTheParkingToCar"
      @click="textErrorInputDeliveryAvailableInTheParkingToCar = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputDeliveryAvailableInTheParkingToCar }}</div>

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
      pick_up_available: inputedPickUpAvailable,
      delivery_available: inputedDeliveryAvailable,
      pick_up_available_at_the_restaurant_counter: inputedPickUpAvailableAtTheRestaurantCounter,
      delivery_available_at_the_restaurant_to_the_table: inputedDeliveryAvailableAtTheRestaurantToTheTable,
      pick_up_available_at_the_car_window: inputedPickUpAvailableAtTheCarWindow,
      delivery_available_in_the_parking_to_car: inputedDeliveryAvailableInTheParkingToCar,
      is_active: inputedIsActive
    })">Редактировать</button>
  </form>
  <div v-show="currentRestaurant == null || countries == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>
