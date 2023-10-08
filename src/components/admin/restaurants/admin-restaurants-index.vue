<script setup>
import router from "/src/router.js"
import {
  cities, currentRestaurant, textLoadOrFailForVue,
  getModelsAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

getModelsAxios('countries') //для страницы создать и редактировать
getModelsAxios('cities')
  .then(() => {
    cities.value.sort((a, b) => {
      if (a.country.id < b.country.id) return -1;
      if (a.country.id > b.country.id) return 1;
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    })
  })

function openRestaurantShow(restaurant) {
  currentRestaurant.value = restaurant
  router.push({ name: 'admin.restaurants.show', params: { id: restaurant.id } })
}

function openRestaurantEdit(restaurant) {
  currentRestaurant.value = restaurant
  router.push({ name: 'admin.restaurants.edit', params: { id: restaurant.id } })
}

function deleteRestaurantVue(restaurant) {
  deleteModelAxios('restaurants', restaurant)
    .then(() => { getModelsAxios('cities') })
    .catch((err) => { })
}

function setColor(param) {
  if (param) return 'color-done'
  else return 'color-error'
}
</script>

<template>
  <div class="">
    <h2>Ваши рестораны</h2>
    <router-link :to="{ name: 'admin.restaurants.create' }">
      <button class="btn admin-index-btn-add">Добавить новый ресторан</button>
    </router-link>
    <div v-if="cities">
      <div v-for="city in cities">
        <div v-if="city.restaurants.length > 0">
          <table class="admin-index-table">
            <thead>
              <th colspan="6">
                <h3>{{ city.title }}</h3>
              </th>
            </thead>
            <tbody>
              <tr v-for="restaurant in city.restaurants">
                <td>
                  <h5>{{ restaurant.title }}</h5>
                </td>
                <td>
                  <span class="color-done" v-if="restaurant.is_active">Активен</span>
                  <span class="color-error" v-else>Не активен</span>
                </td>
                <td>
                  <i :class="setColor(restaurant.pickup_available)" class="fa-solid fa-bag-shopping"></i>
                  <i :class="setColor(restaurant.delivery_available)" class="fa-solid fa-car-side"></i>
                  <i :class="setColor(restaurant.eating_area_available)" class="fa-solid fa-utensils"></i>
                </td>
                <td>
                  <button class="btn btn-view" @click.prevent="openRestaurantShow(restaurant)" type="button">Просмотреть
                  </button>
                </td>
                <td>
                  <button class="btn btn-edit" @click.prevent="openRestaurantEdit(restaurant)" type="button">Редактировать
                  </button>
                </td>
                <td>
                  <button class="btn btn-delete" @click.prevent="deleteRestaurantVue(restaurant)" type="button">Удалить
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

