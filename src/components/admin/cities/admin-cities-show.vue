<script setup>
import router from "/src/router.js"
import { useRoute } from 'vue-router'
import {
  currentCity, textLoadOrFailForVue,
  getModelAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

//проверка если роут загружается из закладки или обновления страницы
if (currentCity.value == null) {
  getModelAxios('cities', useRoute().params.id)
    .then((res) => { })
    .catch((err) => { })
}

function openCityEdit() {
  router.push({ name: 'admin.cities.edit', params: { id: currentCity.id } })
}

function deleteCity() {
  deleteModelAxios('cities', currentCity.value)
    .then((res) => { router.push({ name: 'admin.cities.index' }) })
    .catch((err) => { })
}

</script>

<template>
  <h2>Данные города</h2>
  <div v-if="currentCity" class="admin-view-model">
    <div>
      <label>Страна: </label>
      <span>{{ currentCity.country.title }}</span>
    </div>
    <div>
      <label>Наименование города: </label>
      <span>{{ currentCity.title }}</span>
    </div>
    <div>
      <label>Минимальная сумма заказа для доставки: </label>
      <span>{{ currentCity.min_order_value_for_delivery }}р.</span>
    </div>
    <div>
      <label>Цена за доставку: </label>
      <span>{{ currentCity.delivery_price }}р.</span>
    </div>
    <div>
      <label>Сумма заказа для бесплатной доставки: </label>
      <span>{{ currentCity.order_value_for_free_delivery }}р.</span>
    </div>
    <div>
      <button class="btn btn-edit" @click.prevent="openCityEdit" type="button">
        Редактировать
      </button>
      <button class="btn btn-delete" @click.prevent="deleteCity" type="button">
        Удалить
      </button>
    </div>
  </div>
  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

