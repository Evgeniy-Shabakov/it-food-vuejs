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

  <h2>Ваши рестораны</h2>

  <router-link :to="{ name: 'admin.restaurants.create' }">
    <button class="btn admin-index-btn-add">Добавить новый ресторан</button>
  </router-link>

  <div v-if="cities">
    <div v-for="city in cities">
      <div v-if="city.restaurants.length > 0">

        <h3 class="admin-restaurant-index__city-title">{{ city.title }}</h3>

        <div v-for="restaurant in city.restaurants" class="admin-restaurant-index__restaurant">

          <h5 class="admin-restaurant-index__restaurant_title">{{ restaurant.title }}</h5>


          <span class="color-done" v-if="restaurant.is_active">Активен</span>
          <span class="color-error" v-else>Не активен</span>

          <div class="admin-restaurant-index__restaurant_icons-section">
            <i :class="setColor(restaurant.delivery_available)" class="fa-solid fa-truck-fast"
              title="доставка"></i>
            <i :class="setColor(restaurant.pick_up_at_counter_available)" class="fa-solid fa-bag-shopping"
              title="самовывоз (выдача у прилавка)"></i>
            <i :class="setColor(restaurant.pick_up_at_car_window_available)" class="fa-solid fa-car"
              title="самовывоз (выдача в окне для авто)"></i>
            <i :class="setColor(restaurant.at_restaurant_at_counter_available)" class="fa-solid fa-chalkboard-user"
              title="доступна подача в ресторане (выдача у прилавка)"></i>
            <i :class="setColor(restaurant.at_restaurant_to_table_available)" class="fa-solid fa-solar-panel"
              title="подача в ресторане (к столику)"></i>
            <i :class="setColor(restaurant.at_restaurant_to_parking_available)" class="fa-solid fa-square-parking"
              title="доставка на парковку у ресторана (к машине)"></i>
          </div>

          <button class="btn btn-view" @click.prevent="openRestaurantShow(restaurant)" type="button">Просмотреть
          </button>

          <button class="btn btn-edit" @click.prevent="openRestaurantEdit(restaurant)" type="button">Редактировать
          </button>

          <button class="btn btn-delete" @click.prevent="deleteRestaurantVue(restaurant)" type="button">Удалить
          </button>
        </div>

      </div>


    </div>
  </div>

  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>
