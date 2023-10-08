<script setup>
import { ref } from 'vue';
import router from "/src/router.js"
import {
  countries, currentCountry, textLoadOrFailForVue,
  getModelsAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

getModelsAxios('countries')

function openCountryShow(country) {
  currentCountry.value = country
  router.push({ name: 'admin.countries.show', params: { id: country.id } })
}

function openCountryEdit(country) {
  currentCountry.value = country
  router.push({ name: 'admin.countries.edit', params: { id: country.id } })
}

function deleteCountry(country) {
  deleteModelAxios('countries', country)  //пустые обработчики, чтобы не было ошибок не пойманных промисов
    .then((res) => { getModelsAxios('countries') })
    .catch((err) => { })
}
</script>

<template>
  <h2>Страны в которых у вас есть рестораны</h2>
  <router-link :to="{ name: 'admin.countries.create' }">
    <button class="btn admin-index-btn-add">Добавить новую страну</button>
  </router-link>
  <div v-if="countries">
    <table class="admin-index-table">
      <tbody>
        <tr v-for="country in countries">
          <td>
            <h5>{{ country.title }}</h5>
          </td>
          <td><button class="btn btn-view" @click.prevent="openCountryShow(country)" type="button">Просмотреть</button>
          </td>
          <td><button class="btn btn-edit" @click.prevent="openCountryEdit(country)" type="button">Редактировать</button>
          </td>
          <td><button class="btn btn-delete" @click.prevent="deleteCountry(country)" type="button">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

