<script setup>
import router from "/src/router.js"
import {
  categories, currentCategory, textLoadOrFailForVue,
  getModelsAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

getModelsAxios('categories')

function openCategoryShow(category) {
  currentCategory.value = category
  router.push({ name: 'admin.categories.show', params: { id: category.id } })
}

function openCategoryEdit(category) {
  currentCategory.value = category
  router.push({ name: 'admin.categories.edit', params: { id: category.id } })
}

function deleteCategory(category) {
  deleteModelAxios('categories', category)  //пустые обработчики, чтобы не было ошибок не пойманных промисов
    .then((res) => { getModelsAxios('categories') })
    .catch((err) => { })
}
</script>

<template>
  <h2>Категории</h2>
  <router-link :to="{ name: 'admin.categories.create' }">
    <button class="btn admin-index-btn-add">Добавить новую категорию</button>
  </router-link>
  <div v-if="categories">
    <table class="admin-index-table">
      <tbody>
        <tr v-for="category in categories">
          <td>
            <h5>{{ category.title }}</h5>
          </td>
          <td><button class="btn btn-view" @click.prevent="openCategoryShow(category)" type="button">Просмотреть</button>
          </td>
          <td><button class="btn btn-edit" @click.prevent="openCategoryEdit(category)" type="button">Редактировать</button>
          </td>
          <td><button class="btn btn-delete" @click.prevent="deleteCategory(category)" type="button">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

