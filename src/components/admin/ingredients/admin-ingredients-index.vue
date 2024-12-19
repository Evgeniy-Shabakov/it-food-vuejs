<script setup>
import router from "/src/router.js"
import {
  ingredients, currentIngredient, textLoadOrFailForVue,
  getModelsAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

getModelsAxios('ingredients')

function openIngredientShow(ingredient) {
  currentIngredient.value = ingredient
  router.push({ name: 'admin.ingredients.show', params: { id: ingredient.id } })
}

function openIngredientEdit(ingredient) {
  currentIngredient.value = ingredient
  router.push({ name: 'admin.ingredients.edit', params: { id: ingredient.id } })
}

function deleteIngredient(ingredient) {
  deleteModelAxios('ingredients', ingredient)  //пустые обработчики, чтобы не было ошибок не пойманных промисов
    .then((res) => { getModelsAxios('ingredients') })
    .catch((err) => { })
}

</script>

<template>
  <h2>Ингредиенты</h2>

  <div>
    Позволяют сделать кастомизируемые товары, с возможностью замены или добавления дополнительных ингредиентов.
    Является необязательным, товар может не содержать
    ингредиентов которые можно заменить или добавить.
  </div>

  <router-link :to="{ name: 'admin.ingredients.create' }">
    <button class="btn admin-index-btn-add">Добавить новый ингредиент</button>
  </router-link>

  <div v-if="ingredients">

    <table class="admin-index-table">
      <tr v-for="ingredient in ingredients">
        <td>
          <img class=""
               :src="ingredient.image_url"
               alt="">
          <h5>{{ ingredient.title }}</h5>
        </td>
        <td>
          <img v-for="ingredient in ingredient.replacements"
               class="ingredients-for-replace__img"
               :src="ingredient.image_url">
        </td>
        <td>
          <span class="color-done"
                v-if="ingredient.is_active">Активен</span>
          <span class="color-error"
                v-else>Не активен</span>
        </td>
        <td>
          {{ ingredient.price_default }} р.
        </td>
        <td>
          <button class="btn btn-view"
                  @click.prevent="openIngredientShow(ingredient)"
                  type="button">Просмотреть
          </button>
        </td>
        <td>
          <button class="btn btn-edit"
                  @click.prevent="openIngredientEdit(ingredient)"
                  type="button">Редактировать
          </button>
        </td>
        <td>
          <button class="btn btn-delete"
                  @click.prevent="deleteIngredient(ingredient)"
                  type="button">Удалить
          </button>
        </td>
      </tr>

    </table>

  </div>

  <div v-else
       class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>

</template>

<style scoped>
.ingredients-for-replace__img {
  width: 30px;
  padding: 0px 3px;
}
</style>
