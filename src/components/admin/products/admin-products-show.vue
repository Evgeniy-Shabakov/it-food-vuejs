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
          Базовые ингредиенты:
        </td>
        <td>
          <div v-for="base_ingredient in currentProduct.base_ingredients">
                    <div class="ingredient-img-allowers">
                      <img class="ingredient-img"
                           :src="base_ingredient.image_url">
                      <div>
                        <div v-if="base_ingredient.can_delete">можно удалять</div>
                        <div v-else>нельзя удалять</div>
                        <div v-if="base_ingredient.can_replace">можно заменять</div>
                        <div v-else>нельзя заменять</div>
                      </div>
                    </div>
                    <template v-for="base_ingredient_replacement in base_ingredient.replacements">
                      <img class="ingredient-img-mini"
                           :src="base_ingredient_replacement.image_url">
                    </template>
                  </div>
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

<style scoped>

.ingredient-img {
  width: 55px;
  height: 55px;
  padding: 10px 15px 10px 10px;
}

.ingredient-img-mini {
  width: 35px;
  height: 35px;
  padding: 5px 5px 5px 5px;
}

.ingredient-img-allowers {
  display: flex;
  font-size: 15px;
}
</style>

