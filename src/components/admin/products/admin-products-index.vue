<script setup>
import router from "/src/router.js"
import {
  categories, currentProduct, textLoadOrFailForVue,
  getModelsAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

getModelsAxios('categories')
// getModelsAxios('categories').then(() => console.log(categories.value))


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
              <td style="min-width: 300px;">
                <div>
                  <div class="product-image-title">
                    <img :src="product.image_url">
                    <h5>{{ product.title }}</h5>
                  </div>
                  <div v-for="base_ingredient in product.base_ingredients">
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
                </div>
              </td>
              <td>
                <span class="color-done"
                      v-if="product.is_active">Активен</span>
                <span class="color-error"
                      v-else>Не активен</span>
              </td>
              <td>
                {{ product.price_default }} р.
              </td>
              <td>
                <button class="btn btn-view"
                        @click.prevent="openProductShow(product)"
                        type="button">Просмотреть
                </button>
              </td>
              <td>
                <button class="btn btn-edit"
                        @click.prevent="openProductEdit(product)"
                        type="button">Редактировать
                </button>
              </td>
              <td>
                <button class="btn btn-delete"
                        @click.prevent="deleteProduct(product)"
                        type="button">Удалить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-else
       class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

<style scoped>
.product-image-title {
  display: flex;
  align-items: center;
}

.ingredient-img {
  width: 55px;
  padding: 10px 15px 10px 10px;
}

.ingredient-img-mini {
  width: 35px;
  padding: 5px 5px 5px 5px;
}

.ingredient-img-allowers {
  display: flex;
  font-size: 15px;
}
</style>
