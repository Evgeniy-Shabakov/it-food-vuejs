<script setup>
import router from "/src/router.js"
import { useRoute } from 'vue-router'
import {
  currentCountry, textLoadOrFailForVue,
  getModelAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

//проверка если роут загружается из закладки или обновления страницы
if (currentCountry.value == null) {
  getModelAxios('countries', useRoute().params.id)
    .then((res) => { })
    .catch((err) => { })
}

function openCountryEdit() {
  router.push({ name: 'admin.countries.edit', params: { id: currentCountry.id } })
}

function deleteCountry() {
  deleteModelAxios('countries', currentCountry.value)
    .then((res) => {
      router.push({ name: 'admin.countries.index' })
    })
    .catch((err) => { }) //пустые обработчики, чтобы не было ошибок не пойманных промисов
}

</script>

<template>
  <h2>Данные страны</h2>
  <div v-if="currentCountry" class="admin-view-model">
    <div>
      <label>Наименование: </label>
      <span>{{ currentCountry.title }}</span>
    </div>
    <div>
      <button class="btn btn-edit" @click.prevent="openCountryEdit" type="button">
        Редактировать
      </button>
      <button class="btn btn-delete" @click.prevent="deleteCountry" type="button">
        Удалить
      </button>
    </div>
  </div>
  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

