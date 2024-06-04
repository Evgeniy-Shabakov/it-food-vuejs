<script setup>
import { ref, onMounted } from 'vue';
import router from "/src/router"
import { countries, textLoadOrFailForVue, getModelsAxios, storeModelAxios } from '/src/store/axios-helper.js'

const fieldInputTitle = ref(null)

const restaurantInputedData = ref({})

function initializeRestaurantInputedData() {
  let cityId = restaurantInputedData.value.city_id
  restaurantInputedData.value = {
    city_id: cityId,
    delivery_available: false,
    pick_up_at_counter_available: false,
    pick_up_at_car_window_available: false,
    at_restaurant_at_counter_available: false,
    at_restaurant_to_table_available: false,
    at_restaurant_to_parking_available: false,
    is_active: false,
  }
}

const validationErrors = ref({})

const textDone = ref('')

//проверка если роут загружается из закладки или обновления страницы
if (countries.value == null) {
  getModelsAxios('countries')
    .then(res => {
      chekingCities()
      fieldInputTitle.value.focus()
    })
}
else chekingCities()

function chekingCities() {
  for (let i = 0; i < countries.value.length; i++) {
    if (countries.value[i].cities.length) {
      restaurantInputedData.value.city_id = countries.value[i].cities[0].id
      return
    }
  }
  alert('Сначала добавьте города')
  router.push({ name: 'admin.cities.create' })
}

onMounted(() => { 
  initializeRestaurantInputedData()
  fieldInputTitle.value.focus() 
})

function storeRestaurant() {
  validationErrors.value = {}
  textDone.value = ''

  storeModelAxios('restaurants', restaurantInputedData.value)
    .then(res => {
      initializeRestaurantInputedData()

      textDone.value = res.messageForVue.text
    })
    .catch(err => {
      console.log(err);

      let errors = err.response.data.errors

      validationErrors.value = {
        title: errors.title ? errors.title[0] : '',
        city_id: errors.city_id ? errors.city_id[0] : '',
        street: errors.street ? errors.street[0] : '',
        house_number: errors.house_number ? errors.house_number[0] : '',
        corps_number: errors.corps_number ? errors.corps_number[0] : '',
        office_number: errors.office_number ? errors.office_number[0] : '',
        info: errors.info ? errors.info[0] : '',
        delivery_available: errors.delivery_available ? errors.delivery_available[0] : '',
        pick_up_at_counter_available: errors.pick_up_at_counter_available ? errors.pick_up_at_counter_available[0] : '',
        pick_up_at_car_window_available: errors.pick_up_at_car_window_available ? errors.pick_up_at_car_window_available[0] : '',
        at_restaurant_at_counter_available: errors.at_restaurant_at_counter_available ? errors.at_restaurant_at_counter_available[0] : '',
        at_restaurant_to_table_available: errors.at_restaurant_to_table_available ? errors.at_restaurant_to_table_available[0] : '',
        at_restaurant_to_parking_available: errors.at_restaurant_to_parking_available ? errors.at_restaurant_to_parking_available[0] : '',
        is_active: errors.is_active ? errors.is_active[0] : '',
      }
    })
}
</script>

<template>
  <h2>Добавление ресторана</h2>
  <form v-show="countries" class="admin-forms">
    <label class="required">Наименование</label>
    <input ref="fieldInputTitle" type="text" v-model="restaurantInputedData.title"
      placeholder="Введите название ресторана" @click.prevent="validationErrors.title = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.title }}</div>

    <form class="admin-form-adress">
      <label class="required">Город</label>
      <select v-model="restaurantInputedData.city_id" @click.prevent="validationErrors.city_id = ''; textDone = ''">
        <optgroup v-for="country in countries" :label="country.title">
          <option v-for="city in country.cities" :value="city.id">{{ city.title }}</option>
        </optgroup>
      </select>
      <div class="invalid-text">{{ validationErrors.city_id }}</div>

      <label class="required">Улица</label>
      <input type="text" v-model="restaurantInputedData.street" placeholder="Введите название улицы"
        @click.prevent="validationErrors.street = ''; textDone = ''">
      <div class="invalid-text">{{ validationErrors.street }}</div>

      <label class="required">Дом</label>
      <input type="number" min="1" step="1" v-model="restaurantInputedData.house_number"
        @click.prevent="validationErrors.house_number = ''; textDone = ''">

      <label>Корпус</label>
      <input type="number" min="1" step="1" v-model="restaurantInputedData.corps_number"
        @click.prevent="validationErrors.corps_number = ''; textDone = ''">

      <div class="invalid-text">{{ validationErrors.house_number }}</div>
      <div class="invalid-text">{{ validationErrors.corps_number }}</div>

      <label>№</label>
      <input type="number" min="1" step="1" v-model="restaurantInputedData.office_number"
        @click.prevent="validationErrors.office_number = ''; textDone = ''">
      <div class="invalid-text">{{ validationErrors.office_number }}</div>
    </form>

    <label>Дополнительная информация</label>
    <textarea v-model="restaurantInputedData.info" placeholder="Введите дополнительную информацию"
      @click.prevent="validationErrors.info = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ validationErrors.info }}</div>

    <span class="required">Доступна доставка:</span>
    <input type="checkbox" v-model="restaurantInputedData.delivery_available"
      @click="validationErrors.delivery_available = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.delivery_available }}</div>

    <span class="required">Доступен самовывоз (выдача у прилавка):</span>
    <input type="checkbox" v-model="restaurantInputedData.pick_up_at_counter_available"
      @click="validationErrors.pick_up_at_counter_available = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.pick_up_at_counter_available }}</div>

    <span class="required">Доступен самовывоз (выдача в окне для авто):</span>
    <input type="checkbox" v-model="restaurantInputedData.pick_up_at_car_window_available"
      @click="validationErrors.pick_up_at_car_window_available = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.pick_up_at_car_window_available }}</div>

    <span class="required">Доступна подача в ресторане (выдача у прилавка):</span>
    <input type="checkbox" v-model="restaurantInputedData.at_restaurant_at_counter_available"
      @click="validationErrors.at_restaurant_at_counter_available = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.at_restaurant_at_counter_available }}</div>

    <span class="required">Доступна подача в ресторане (к столику)</span>
    <input type="checkbox" v-model="restaurantInputedData.at_restaurant_to_table_available"
      @click="validationErrors.at_restaurant_to_table_available = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.at_restaurant_to_table_available }}</div>

    <span class="required">Доступна доставка на парковку у ресторана (к машине):</span>
    <input type="checkbox" v-model="restaurantInputedData.at_restaurant_to_parking_available"
      @click="validationErrors.at_restaurant_to_parking_available = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.at_restaurant_to_parking_available }}</div>

    <span class="required">Активировать прием заказов в этом ресторане</span>
    <input type="checkbox" v-model="restaurantInputedData.is_active"
      @click="validationErrors.is_active = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.is_active }}</div>

    <div class="done-text">{{ textDone }}</div>

    <button class="btn btn-view" @click.prevent="storeRestaurant()">
      Добавить
    </button>

  </form>
  <div v-show="countries == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>
