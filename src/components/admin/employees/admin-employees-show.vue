<script setup>
import router from "/src/router.js"
import { useRoute } from 'vue-router'
import {
  currentCategory, textLoadOrFailForVue,
  getModelAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

//проверка если роут загружается из закладки или обновления страницы
if (currentCategory.value == null) {
  getModelAxios('categories', useRoute().params.id)
    .then((res) => { })
    .catch((err) => { })
}

function openCategoryEdit() {
  router.push({ name: 'admin.categories.edit', params: { id: currentCategory.id } })
}

function deleteCategory() {
  deleteModelAxios('categories', currentCategory.value)
    .then((res) => {
      router.push({ name: 'admin.categories.index' })
    })
    .catch((err) => { }) //пустые обработчики, чтобы не было ошибок не пойманных промисов
}

</script>

<template>
  <h2>Данные категории</h2>
  <div v-if="currentCategory" class="admin-view-model">
    <div>
      <label>Наименование: </label>
      <span>{{ currentCategory.title }}</span>
    </div>
    <div>
      <button class="btn btn-edit" @click.prevent="openCategoryEdit" type="button">
        Редактировать
      </button>
      <button class="btn btn-delete" @click.prevent="deleteCategory" type="button">
        Удалить
      </button>
    </div>
  </div>
  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

