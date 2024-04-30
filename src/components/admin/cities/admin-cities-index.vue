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
  <h2>Города в которых у вас есть рестораны</h2>

  <router-link :to="{ name: 'admin.cities.create' }">
    <button class="btn admin-index-btn-add">Добавить новый город</button>
  </router-link>

  <div v-if="countries">
    <div v-for="country in countries">
      <div v-if="country.cities.length > 0">

        <h3 class="index-list-city__country">{{ country.title }}</h3>

        <div class="index-list-element">
          <span class="index-list-city__header index-list-city__title">Город</span>
          <span class="index-list-city__header index-list-city__min-order-value">Мин. сумма доставки</span>
          <span class="index-list-city__header index-list-city__delivery-price">Цена доставки</span>
          <span class="index-list-city__header index-list-city__order-value-delivery">Бесплатная доставка от:</span>
          <div class="index-list-city__header index-list-city__actions">Действия</div>
        </div>

        <div v-for="city in country.cities" class="index-list-element">
          <span class="index-list-element__name index-list-city__title">{{ city.title }}</span>
          <span class="index-list-city__min-order-value">{{ city.min_order_value_for_delivery }}р.</span>
          <span class="index-list-city__delivery-price">{{ city.delivery_price }}р.</span>
          <span class="index-list-city__order-value-delivery">{{ city.order_value_for_free_delivery }}р.</span>

          <div class="index-list-city__actions">
            <button class="btn btn-view" @click.prevent="openCityShow(city)" type="button">Просмотреть
            </button>
            <button class="btn btn-edit" @click.prevent="openCityEdit(city)" type="button">Редактировать
            </button>
            <button class="btn btn-delete" @click.prevent="deleteCityVue(city)" type="button">Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>

</template>
