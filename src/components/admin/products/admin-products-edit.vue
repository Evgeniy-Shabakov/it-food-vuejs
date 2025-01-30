<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router'
import {
  currentProduct, categories, ingredients, textLoadOrFailForVue, updateModelAxios
} from '/src/store/axios-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { loadCategories, loadCurrentProduct, loadIngredients } from '/src/store/loading-helper.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'

let dataForComponentLoadingType = ref(LOADING_TYPE.loading)

const addingBaseIngredientsDialog = ref()
const replacementsIngredientDialog = ref()

const addingAdditionalIngredientsDialog = ref()

const productInputedData = reactive({
  initialize(product) {
    this.title = product.title
    this.category_id = product.category.id
    this.image_file = null
    this.description_short = product.description_short
    this.description_full = product.description_full
    this.price_default = product.price_default
    this.base_ingredients = product.base_ingredients.map(item => {
      return {
        ingredient: item,
        can_delete: item.can_delete,
        can_replace: item.can_replace,
        replacements_ids: item.replacements.map(obj => { return obj.id })
      }
    })
    this.additional_ingredients = product.additional_ingredients.map(item => {
      return {
        ingredient: item,
        max_quantity: item.max_quantity,
      }
    })
    this.is_active = Boolean(product.is_active)
  }
})

const baseIngredientInputedData = reactive({
  initialize() {
    this.ingredient = 0
    this.can_delete = false
    this.can_replace = false
    this.replacements_ids = []
  }
})

watch(() => baseIngredientInputedData.ingredient, (newValue, oldValue) => {
  if (newValue)
    baseIngredientInputedData.replacements_ids = [...newValue.replacements].map(obj => obj.id)
})

const additionalIngredientInputedData = reactive({
  initialize() {
    this.ingredient = 0
    this.max_quantity = 1
  }
})

baseIngredientInputedData.initialize()
additionalIngredientInputedData.initialize()

function addBaseIngredient() {
  if (!baseIngredientInputedData.ingredient) return

  productInputedData.base_ingredients.push({
    ingredient: baseIngredientInputedData.ingredient,
    can_delete: baseIngredientInputedData.can_delete,
    can_replace: baseIngredientInputedData.can_replace,
    replacements_ids: baseIngredientInputedData.replacements_ids
  }
  )

  baseIngredientInputedData.initialize()
  addingBaseIngredientsDialog.value.close()
}

function deleteBaseIngredient(id) {
  const index = productInputedData.base_ingredients.findIndex(obj => obj.ingredient.id === id)
  if (index !== -1) { // Проверяем, найден ли объект
    productInputedData.base_ingredients.splice(index, 1); // Удаляем объект из массива
  }
}

function addAdditionalIngredient() {
  if (!additionalIngredientInputedData.ingredient) return

  productInputedData.additional_ingredients.push({
    ingredient: additionalIngredientInputedData.ingredient,
    max_quantity: additionalIngredientInputedData.max_quantity,
  }
  )

  additionalIngredientInputedData.initialize()
  addingAdditionalIngredientsDialog.value.close()
}

function deleteAdditionalIngredient(id) {
  const index = productInputedData.additional_ingredients.findIndex(obj => obj.ingredient.id === id)
  if (index !== -1) { // Проверяем, найден ли объект
    productInputedData.additional_ingredients.splice(index, 1); // Удаляем объект из массива
  }
}

const imageUrl = computed(() => {
  if (productInputedData.image_file) return URL.createObjectURL(productInputedData.image_file)
  else return currentProduct.value.image_url
})

const validationErrors = ref({})

let textDone = ref(null)

const currentProductId = useRoute().params.id

onMounted(async () => {
  dataForComponentLoadingType.value = await loadCategories()
  dataForComponentLoadingType.value = await loadIngredients()
  dataForComponentLoadingType.value = await loadCurrentProduct(currentProductId)

  if (dataForComponentLoadingType.value === LOADING_TYPE.error) return

  productInputedData.initialize(currentProduct.value)
})

function updateProduct() {
  validationErrors.value = {}
  textDone.value = null

  const formData = new FormData();

  productInputedData.id = currentProduct.value.id

  formData.append("id", productInputedData.id);
  formData.append("title", productInputedData.title);
  formData.append("category_id", productInputedData.category_id);
  if (productInputedData.image_file) formData.append("image_file", productInputedData.image_file); //без условия не видит валидацию required в Ларавел
  formData.append("description_short", productInputedData.description_short);
  formData.append("description_full", productInputedData.description_full);
  if (productInputedData.price_default) formData.append("price_default", productInputedData.price_default); //без условия не видит валидацию required в Ларавел

  productInputedData.base_ingredients.forEach((base_ingredient, index) => {
    formData.append(`base_ingredients[${index}][ingredient_id]`, base_ingredient.ingredient.id)
    formData.append(`base_ingredients[${index}][can_delete]`, base_ingredient.can_delete ? 1 : 0)
    formData.append(`base_ingredients[${index}][can_replace]`, base_ingredient.can_replace ? 1 : 0)
    base_ingredient.replacements_ids.forEach((id, idIndex) => {
      formData.append(`base_ingredients[${index}][replacements_ids][${idIndex}]`, id)
    })
  })

  productInputedData.additional_ingredients.forEach((additional_ingredient, index) => {
    formData.append(`additional_ingredients[${index}][ingredient_id]`, additional_ingredient.ingredient.id)
    formData.append(`additional_ingredients[${index}][max_quantity]`, additional_ingredient.max_quantity)
  })

  formData.append("is_active", productInputedData.is_active ? 1 : 0)

  updateModelAxios('products', formData)
    .then(res => {
      textDone.value = res.messageForVue.text
    })
    .catch(err => {
      validationErrors.value = err.response.data.errors
      transformValidateErrorsForUI(validationErrors.value)
    })
}

function imageFileChange(e) {
  productInputedData.image_file = e.target.files[0];
}

function changeImageBtnPressed() {
  document.getElementById('imageInput').click()
}
</script>

<template>
  <h2>Редактирование товара</h2>

  <form v-show="currentProduct && categories && ingredients"
        class="admin-forms">

    <label class="required">Наименование</label>
    <input ref="fieldInputTitle"
           type="text"
           v-model="productInputedData.title"
           placeholder="Введите название товара"
           @click.prevent="validationErrors.title = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.title }}</div>

    <label class="required">Категория</label>
    <select v-model="productInputedData.category_id"
            @click.prevent="validationErrors.category_id = ''; textDone = ''">
      <option v-for="category in categories"
              :value="category.id">{{ category.title }}</option>
    </select>
    <div class="invalid-text">{{ validationErrors.category_id }}</div>

    <label class="required">Изображение</label>
    <div class="admin-forms__div-img-btn">
      <img class="admin-forms__div-img-btn__product"
           :src="imageUrl"
           alt="">
      <input type="file"
             @click="validationErrors.image_file = ''; textDone = ''"
             @change="imageFileChange"
             style="display:none;"
             id="imageInput"
             accept="image/*">
      <button id="admin-forms__div-img-btn__btn"
              class="btn btn-view"
              @click.prevent="changeImageBtnPressed">Изменить</button>
    </div>
    <div class="invalid-text">{{ validationErrors.image_file }}</div>

    <label>Короткое описание</label>
    <textarea v-model="productInputedData.description_short"
              placeholder="Введите короткое описание товара до 150 символов"
              @click.prevent="validationErrors.description_short = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ validationErrors.description_short }}</div>

    <label>Полное описание</label>
    <textarea v-model="productInputedData.description_full"
              placeholder="Введите полное описание товара до 1000 символов"
              @click.prevent="validationErrors.description_full = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ validationErrors.description_full }}</div>

    <label class="required">Цена по умолчанию</label>
    <input type="number"
           min="1"
           step="any"
           v-model="productInputedData.price_default"
           @click.prevent="validationErrors.price_default = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.price_default }}</div>


    <label>Базовые игредиенты
      <br>Игредиенты, которые уже по умолчанию есть в товаре. Базовый ингредиент можно заменить
      или удалить, стоимость продукта при изменении может только увеличится.
    </label>
    <div class="base-ingredients">
      <template v-for="item in productInputedData.base_ingredients">
        <div>
          <img class="dialog__img"
               :src="item.ingredient.image_url">
          <div v-if="item.can_delete">можно удалять</div>
          <div v-else>нельзя удалять</div>
          <div v-if="item.can_replace">можно заменять</div>
          <div v-else>нельзя заменять</div>
          <template v-if="item.can_replace">
            <template v-for="ingredient in ingredients">
              <img class="size-30px"
                   v-if="item.replacements_ids && item.replacements_ids.includes(ingredient.id)"
                   :src="ingredient.image_url">
            </template>
          </template>
          <div>
            <button @click.prevent="deleteBaseIngredient(item.ingredient.id)">Удалить</button>
          </div>
        </div>
      </template>
    </div>
    <button class="btn btn-view ingredients-editor-btn"
            @click.prevent="addingBaseIngredientsDialog.showModal()">Добавить
      базовый ингредиент</button>
    <div class="invalid-text">{{ validationErrors.base_ingredients }}</div>

    <label>Дополнительные игредиенты
      <br>Ингредиенты которые можно добавлять к товару. Стоимость товара увеличится в
      зависимости от стоимости ингредиента.
      <br>Один и тот же ингредиент может быть как базовым так и доболнительным.
    </label>
    <div class="base-ingredients">
      <template v-for="item in productInputedData.additional_ingredients">
        <div>
          <img class="dialog__img"
               :src="item.ingredient.image_url">
          <div>{{ item.max_quantity }}</div>

          <div>
            <button @click.prevent="deleteAdditionalIngredient(item.ingredient.id)">Удалить</button>
          </div>
        </div>
      </template>
    </div>
    <button class="btn btn-view ingredients-editor-btn"
            @click.prevent="addingAdditionalIngredientsDialog.showModal()">
      Добавление дополнительного ингредиента
    </button>
    <div class="invalid-text">{{ validationErrors.additional_ingredients }}</div>


    <span class="required">Показывать товар на сайте:</span>
    <input type="checkbox"
           v-model="productInputedData.is_active"
           @click="validationErrors.is_active = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.is_active }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view"
            @click.prevent="updateProduct()">Редактировать</button>
  </form>

  <div v-show="currentProduct == null || categories == null"
       class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>

  <dialog ref="addingBaseIngredientsDialog"
          class="dialog">

    <p class="dialog__title">Добавление базового ингредиента</p>

    <img class="dialog__img adding-base-ingredient-dialog__main-img"
         :src="baseIngredientInputedData.ingredient.image_url || '/src/assets/images/image_empty.png'">

    <form class="adding-base-ingredient-dialog__form">

      <div>
        <label class="required label">Выберите ингредиент</label>
        <select v-model="baseIngredientInputedData.ingredient">
          <option v-for="ingredient in ingredients"
                  :value="ingredient">{{ ingredient.title }}</option>
        </select>
      </div>

      <div class="label-chekbox">
        <label class="required label">Можно удалить</label>
        <input type="checkbox"
               class="dialog__chekbox"
               v-model="baseIngredientInputedData.can_delete">
      </div>

      <div class="label-chekbox">
        <label class="required label">Можно заменить</label>
        <input type="checkbox"
               class="dialog__chekbox"
               v-model="baseIngredientInputedData.can_replace">
      </div>

      <div class="adding-base-ingredient-dialog__replacements">
        <label class="required label">Замены</label>
        <template v-for="ingredient in ingredients">
          <img class="adding-base-ingredient-dialog__replacements-img"
               v-if="baseIngredientInputedData.replacements_ids.includes(ingredient.id)"
               :src="ingredient.image_url">
        </template>
        <button @click.prevent="replacementsIngredientDialog.showModal()">Редактировать</button>
      </div>

      <div class="dialog__btn-wrapper">
        <button class="btn btn-view"
                @click.prevent="addBaseIngredient()">Добавить ингредиент</button>
      </div>

    </form>

    <button class="dialog__btn-close"
            @click.prevent="addingBaseIngredientsDialog.close()">x</button>

  </dialog>

  <dialog ref="replacementsIngredientDialog"
          class="dialog">

    <p class="dialog__title">Выбирите ингредиенты для замены</p>

    <table class="admin-index-table">

      <tr v-for="ingredient in ingredients">
        <td>
          <img :src="ingredient.image_url">
          <h5>{{ ingredient.title }}</h5>
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
          <input type="checkbox"
                 v-model="baseIngredientInputedData.replacements_ids"
                 :value="ingredient.id"
                 class="dialog__chekbox">
        </td>
      </tr>

    </table>

    <div class="dialog__btn-wrapper">
      <button class="btn btn-view"
              @click.prevent="replacementsIngredientDialog.close()">Сохранить</button>
    </div>

    <button ref="closeAddingIngredientDialog"
            class="dialog__btn-close"
            @click.prevent="replacementsIngredientDialog.close()">x</button>

  </dialog>

  <dialog ref="addingAdditionalIngredientsDialog"
          class="dialog">

    <p class="dialog__title">Добавление дополнительного ингредиента</p>

    <img class="dialog__img adding-base-ingredient-dialog__main-img"
         :src="additionalIngredientInputedData.ingredient.image_url || '/src/assets/images/image_empty.png'">

    <form class="adding-base-ingredient-dialog__form">

      <div>
        <label class="required label">Выберите ингредиент</label>
        <select v-model="additionalIngredientInputedData.ingredient">
          <option v-for="ingredient in ingredients"
                  :value="ingredient">{{ ingredient.title }}</option>
        </select>
      </div>

      <div class="label-chekbox">
        <label class="required label">Максимальное количество</label>
        <input type="number"
               v-model="additionalIngredientInputedData.max_quantity">
      </div>

      <div class="dialog__btn-wrapper">
        <button class="btn btn-view"
                @click.prevent="addAdditionalIngredient()">Добавить ингредиент</button>
      </div>

    </form>

    <button class="dialog__btn-close"
            @click.prevent="addingAdditionalIngredientsDialog.close()">x</button>

  </dialog>

</template>

<style scoped>
.ingredients-editor-btn {
  margin-top: 0;
}

.adding-base-ingredient-dialog__form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.adding-base-ingredient-dialog__main-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 15px;
}

.adding-base-ingredient-dialog__replacements {
  display: flex;
  align-items: center;
}

.adding-base-ingredient-dialog__replacements-img {
  width: 50px;
  margin-right: 15px;
}

.label {
  display: inline-block;
  width: 250px;

}

.label-chekbox {
  display: flex;
  align-items: center;
}

.size-50px {
  width: 50px;
  height: 50px;
}

.size-40px {
  width: 40px;
  height: 40px;
}

.size-30px {
  width: 30px;
  height: 30px;
}

.base-ingredients {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}
</style>
