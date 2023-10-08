<script setup>
import router from "/src/router.js"
import {
  countries, currentCity, textLoadOrFailForVue,
  getModelsAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

getModelsAxios('countries')

function openCityShow(city) {
  currentCity.value = city
  router.push({ name: 'admin.cities.show', params: { id: city.id } })
}

function openCityEdit(city) {
  currentCity.value = city
  router.push({ name: 'admin.cities.edit', params: { id: city.id } })
}

function deleteCityVue(city) {
  deleteModelAxios('cities', city)
    .then(() => { getModelsAxios('countries') })
    .catch((err) => { })
}

</script>

<template>
  <div class="">
    <h2>Города в которых у вас есть рестораны</h2>
    <router-link :to="{ name: 'admin.cities.create' }">
      <button class="btn admin-index-btn-add">Добавить новый город</button>
    </router-link>
    <div v-if="countries">
      <div v-for="country in countries">
        <div v-if="country.cities.length > 0">
          <table class="admin-index-table">
            <thead>
              <th colspan="4">
                <h3>{{ country.title }}</h3>
              </th>
            </thead>
            <tbody>
              <tr v-for="city in country.cities">
                <td>
                  <h5>{{ city.title }}</h5>
                </td>
                <td>
                  <button class="btn btn-view" @click.prevent="openCityShow(city)" type="button">Просмотреть
                  </button>
                </td>
                <td>
                  <button class="btn btn-edit" @click.prevent="openCityEdit(city)" type="button">Редактировать
                  </button>
                </td>
                <td>
                  <button class="btn btn-delete" @click.prevent="deleteCityVue(city)" type="button">Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else class="admin-view-model-load">
      {{ textLoadOrFailForVue }}
    </div>
  </div>
</template>

