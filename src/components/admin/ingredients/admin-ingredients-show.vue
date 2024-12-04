<script setup>
import router from "/src/router.js"
import { useRoute } from 'vue-router'
import {
  currentIngredient, textLoadOrFailForVue,
  getModelAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

//проверка если роут загружается из закладки или обновления страницы
if (currentIngredient.value == null) {
  getModelAxios('ingredients', useRoute().params.id)
    .then((res) => {  console.log(currentIngredient.value)
    })
    .catch((err) => { })
}

function openIngredientEdit() {
  router.push({ name: 'admin.ingredients.edit', params: { id: currentIngredient.id } })
}

function deleteIngredient() {
  deleteModelAxios('ingredients', currentIngredient.value)
    .then((res) => {
      router.push({ name: 'admin.ingredients.index' })
    })
    .catch((err) => { }) //пустые обработчики, чтобы не было ошибок не пойманных промисов
}

</script>

<template>
  <h2>Данные ингредиента</h2>
  <div v-if="currentIngredient"
       class="admin-view-model">
    <table>
      <tr>
        <td>
          Наименование:
        </td>
        <td>
          <span>{{ currentIngredient.title }}</span>
        </td>
      </tr>
      <tr>
        <td>
          Изображение:
        </td>
        <td>
          <img class=""
               :src="currentIngredient.image_url"
               alt="">
        </td>
      </tr>
      <tr>
        <td>
          Описание:
        </td>
        <td>
          {{ currentIngredient.description }}
        </td>
      </tr>
      <tr>
        <td>
          Цена по умолчанию:
        </td>
        <td>
          <span>{{ currentIngredient.price_default }} р.</span>
        </td>
      </tr>
      <tr>
        <td>
          Активен для кастомизации товаров:
        </td>
        <td>
          <span class="color-done"
                v-if="currentIngredient.is_active">Активен</span>
          <span class="color-error"
                v-else>Не активен</span>
        </td>
      </tr>
    </table>
    <div>
      <button class="btn btn-edit"
              @click.prevent="openIngredientEdit"
              type="button">
        Редактировать
      </button>
      <button class="btn btn-delete"
              @click.prevent="deleteIngredient"
              type="button">
        Удалить
      </button>
    </div>
  </div>
  <div v-else
       class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>
