<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import router from "/src/router"
import { countries, textLoadOrFailForVue, getModelsAxios, storeModelAxios } from '/src/store/axios-helper.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'
import { LOADING_TYPE } from '/src/store/loading-type.js'
import { loadCountries, getFirstCityId } from '/src/store/loading-helper.js'

let dataForComponentLoadingType = ref(LOADING_TYPE.loading)

const fieldInputTitle = ref()

const restaurantInputedData = reactive({
  initialize(cityId) {
    this.title = null
    this.city_id = cityId
    this.street = null
    this.house_number = null
    this.corps_number = null
    this.office_number = null
    this.info = null
    this.delivery_available = false
    this.pick_up_at_counter_available = false
    this.pick_up_at_car_window_available = false
    this.at_restaurant_at_counter_available = false
    this.at_restaurant_to_table_available = false
    this.at_restaurant_to_parking_available = false
    this.is_active = false
  }
})

const validationErrors = ref({})

const textDone = ref(null)

onMounted(async () => {
  dataForComponentLoadingType.value = await loadCountries()

  if (dataForComponentLoadingType.value === LOADING_TYPE.error) return

  const firstCityId = getFirstCityId()

  if (firstCityId == null) {
    alert('Сначала добавьте города')
    router.push({ name: 'admin.cities.create' })
    return
  }

  restaurantInputedData.initialize(firstCityId)

  let unwatchForFocus = watch(fieldInputTitle, () => {
    fieldInputTitle.value.focus()
    unwatchForFocus()
  })
})

function storeRestaurant() {
  validationErrors.value = {}
  textDone.value = null

  storeModelAxios('restaurants', restaurantInputedData)
    .then(res => {
      restaurantInputedData.initialize(restaurantInputedData.city_id)
      textDone.value = res.messageForVue.text
    })
    .catch(err => {
      validationErrors.value = err.response.data.errors
      transformValidateErrorsForUI(validationErrors.value)
    })
}
</script>

<template>
  <h2>Добавление ресторана</h2>
  <form v-if="dataForComponentLoadingType === LOADING_TYPE.complete" class="admin-forms">
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

    <span class="required">Доступна подача в ресторане (к столику):</span>
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
  <div v-else-if="dataForComponentLoadingType === LOADING_TYPE.loading" class="admin-view-model-load">
    Загрузка данных...
  </div>
  <div v-else class="admin-view-model-load">
    Ошибка загрузка данных. Попробуйте обновить страницу
  </div>
</template>
