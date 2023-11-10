<script setup>
import router from "/src/router.js"
import { useRoute } from 'vue-router'
import {
  currentProduct, textLoadOrFailForVue,
  getModelAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

//проверка если роут загружается из закладки или обновления страницы
if (currentProduct.value == null) {
  getModelAxios('products', useRoute().params.id)
    .then((res) => { })
    .catch((err) => { })
}

function openProductEdit() {
  router.push({ name: 'admin.products.edit', params: { id: currentProduct.id } })
}

function deleteProduct() {
  deleteModelAxios('products', currentProduct.value)
    .then((res) => {
      router.push({ name: 'admin.products.index' })
    })
    .catch((err) => { }) //пустые обработчики, чтобы не было ошибок не пойманных промисов
}

</script>

<template>
  <h2>Данные товара</h2>
  <div v-if="currentProduct" class="admin-view-model">
    <table>
      <tr>
        <td>
          Наименование:
        </td>
        <td>
          <span>{{ currentProduct.title }}</span>
        </td>
      </tr>
      <tr>
        <td>
          Категория:
        </td>
        <td>
          <span>{{ currentProduct.category.title }}</span>
        </td>
      </tr>
      <tr>
        <td>
          Изображение:
        </td>
        <td>
          <img class="" :src="currentProduct.image_url" alt="">
        </td>
      </tr>
      <tr>
        <td>
          Короткое описание:
        </td>
        <td>
          {{ currentProduct.description_short }}
        </td>
      </tr>
      <tr>
        <td>
          Полное описание:
        </td>
        <td>
          {{ currentProduct.description_full }}
        </td>
      </tr>
      <tr>
        <td>
          Цена по умолчанию:
        </td>
        <td>
          <span>{{ currentProduct.price_default }} р.</span>
        </td>
      </tr>
      <tr>
        <td>
          Активен для приема заказов:
        </td>
        <td>
          <span class="color-done" v-if="currentProduct.is_active">Активен</span>
          <span class="color-error" v-else>Не активен</span>
        </td>
      </tr>
    </table>
    <div>
      <button class="btn btn-edit" @click.prevent="openProductEdit" type="button">
        Редактировать
      </button>
      <button class="btn btn-delete" @click.prevent="deleteProduct" type="button">
        Удалить
      </button>
    </div>
  </div>
  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

