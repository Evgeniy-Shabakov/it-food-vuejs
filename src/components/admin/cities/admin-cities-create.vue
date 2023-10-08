<script setup>
import { ref, onMounted } from 'vue';
import router from "/src/router"
import {
  countries, textLoadOrFailForVue,
  getModelsAxios, storeModelAxios
} from '/src/store/axios-helper.js'

const fieldInputCity = ref(null)

const inputedCity = ref('')
const selectedCountry = ref()

const textErrorInputCity = ref('')
const textErrorSelectCountry = ref('')
const textDone = ref('')

//проверка если роут загружается из закладки или обновления страницы
if (countries.value == null) {
  getModelsAxios('countries')
    .then(res => {
      chekingCountries()
      fieldInputCity.value.focus()
    })
}
else chekingCountries()

//проверка, если не добавлено ни одной страны
function chekingCountries() {
  if (countries.value.length > 0) {
    selectedCountry.value = countries.value[0]
  }
  else {
    alert('Сначала добавьте страны')
    router.push({ name: 'admin.countries.create' })
  }
}

onMounted(() => { fieldInputCity.value.focus() })

function storeCityVue(data) {
  textErrorInputCity.value = ''
  textErrorSelectCountry.value = ''
  textDone.value = ''

  storeModelAxios('cities', data)
    .then(res => {
      textDone.value = res.messageForVue.text
      inputedCity.value = ''
    })
    .catch(err => {
      if (err.response.data.errors.title) {
        textErrorInputCity.value = err.response.data.errors.title[0]
      }

      if (err.response.data.errors.country_id) {
        textErrorSelectCountry.value = err.response.data.errors.country_id[0]
      }
    })
}
</script>

<template>
  <h2>Добавление города</h2>
  <form v-show="countries" class="admin-forms">
    <label class="required">Страна</label>
    <select v-model="selectedCountry"
      @click.prevent="textErrorSelectCountry = ''; textDone = ''">
      <option v-for="country in countries" :value="country">{{ country.title }}</option>
    </select>
    <div class="invalid-text">{{ textErrorSelectCountry }}</div>

    <label class="required">Город</label>
    <input ref="fieldInputCity" type="text" v-model="inputedCity" placeholder="Введите название города"
      @click.prevent="textErrorInputCity = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputCity }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view"
      @click.prevent="storeCityVue({ title: inputedCity, country_id: selectedCountry.id })">Добавить</button>
  </form>
  <div v-show="countries == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

