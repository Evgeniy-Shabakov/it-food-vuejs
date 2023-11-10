<script setup>
import router from "/src/router.js"
import {
  categories, currentProduct, textLoadOrFailForVue,
  getModelsAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

getModelsAxios('categories')

function openProductShow(product) {
  currentProduct.value = product
  router.push({ name: 'admin.products.show', params: { id: product.id } })
}

function openProductEdit(product) {
  currentProduct.value = product
  router.push({ name: 'admin.products.edit', params: { id: product.id } })
}

function deleteProduct(product) {
  deleteModelAxios('products', product)  //пустые обработчики, чтобы не было ошибок не пойманных промисов
    .then((res) => { getModelsAxios('categories') })
    .catch((err) => { })
}

</script>

<template>
  <h2>Товары</h2>
  <router-link :to="{ name: 'admin.products.create' }">
    <button class="btn admin-index-btn-add">Добавить новый товар</button>
  </router-link>
  <div v-if="categories">
    <div v-for="category in categories">
      <div v-if="category.products.length > 0">
        <table class="admin-index-table">
          <thead>
            <th colspan="6">
              <h3>{{ category.title }}</h3>
            </th>
          </thead>
          <tbody>
            <tr v-for="product in category.products">
              <td>
                <img class="" :src="product.image_url" alt="">
                <h5>{{ product.title }}</h5>
              </td>
              <td>
                <span class="color-done" v-if="product.is_active">Активен</span>
                <span class="color-error" v-else>Не активен</span>
              </td>
              <td>
                {{ product.price_default }} р.
              </td>
              <td>
                <button class="btn btn-view" @click.prevent="openProductShow(product)" type="button">Просмотреть
                </button>
              </td>
              <td>
                <button class="btn btn-edit" @click.prevent="openProductEdit(product)" type="button">Редактировать
                </button>
              </td>
              <td>
                <button class="btn btn-delete" @click.prevent="deleteProduct(product)" type="button">Удалить
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
</template>

